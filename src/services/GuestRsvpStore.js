import { RSVP_STORAGE_KEY } from '../data/dietaryOptions.js';

/**
 * Persists the RSVP locally first, then mirrors it to an optional endpoint
 * configured with VITE_RSVP_ENDPOINT. The local copy is the source of truth
 * for edits on this device, so a network hiccup never loses an answer.
 */
export class GuestRsvpStore {
  constructor({
    storageKey = RSVP_STORAGE_KEY,
    endpoint = import.meta.env.VITE_RSVP_ENDPOINT || '',
  } = {}) {
    this.storageKey = storageKey;
    this.endpoint = endpoint.trim();
  }

  load() {
    try {
      const storedResponse = window.localStorage.getItem(this.storageKey);
      if (!storedResponse) return null;

      const parsedResponse = JSON.parse(storedResponse);
      return parsedResponse && typeof parsedResponse === 'object' ? parsedResponse : null;
    } catch {
      return null;
    }
  }

  async save(response) {
    let savedLocally = false;
    let syncedRemotely = false;
    let remoteError = null;

    try {
      window.localStorage.setItem(this.storageKey, JSON.stringify(response));
      savedLocally = true;
    } catch {
      // Private browsing or a full storage quota: still try the endpoint.
    }

    if (this.endpoint) {
      try {
        const requestController = new AbortController();
        const requestTimeout = window.setTimeout(() => requestController.abort(), 8000);

        const serverResponse = await fetch(this.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(response),
          signal: requestController.signal,
        });

        window.clearTimeout(requestTimeout);

        if (!serverResponse.ok) {
          throw new Error(`RSVP endpoint returned ${serverResponse.status}`);
        }

        syncedRemotely = true;
      } catch (error) {
        remoteError = error instanceof Error ? error.message : String(error);
      }
    }

    return {
      savedLocally,
      syncedRemotely,
      endpointConfigured: Boolean(this.endpoint),
      remoteError,
    };
  }
}
