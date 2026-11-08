import { RSVP_STORAGE_KEY } from '../data/dietaryOptions.ts';
import type { RsvpResponse, RsvpSaveResult } from '../types/wedding.ts';

export interface GuestRsvpStoreOptions {
  readonly storageKey?: string;
  readonly endpoint?: string;
}

/**
 * Single-responsibility persistence service for RSVP responses.
 * Saves to localStorage first and optionally mirrors to a JSON endpoint.
 */
export class GuestRsvpStore {
  private readonly storageKey: string;
  private readonly endpoint: string;

  constructor({
    storageKey = RSVP_STORAGE_KEY,
    endpoint = import.meta.env.VITE_RSVP_ENDPOINT || '',
  }: GuestRsvpStoreOptions = {}) {
    this.storageKey = storageKey;
    this.endpoint = endpoint.trim();
  }

  load(): RsvpResponse | null {
    try {
      const storedResponse = window.localStorage.getItem(this.storageKey);
      if (!storedResponse) return null;

      const parsedResponse: unknown = JSON.parse(storedResponse);
      return parsedResponse && typeof parsedResponse === 'object'
        ? (parsedResponse as RsvpResponse)
        : null;
    } catch {
      return null;
    }
  }

  async save(response: RsvpResponse): Promise<RsvpSaveResult> {
    let savedLocally = false;
    let syncedRemotely = false;
    let remoteError: string | null = null;

    try {
      window.localStorage.setItem(this.storageKey, JSON.stringify(response));
      savedLocally = true;
    } catch {
      // Private browsing or full storage quota: still try the endpoint.
    }

    if (this.endpoint) {
      let requestTimeoutId: number | null = null;

      try {
        const requestController = new AbortController();
        requestTimeoutId = window.setTimeout(() => requestController.abort(), 8000);

        const serverResponse = await fetch(this.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(response),
          signal: requestController.signal,
        });

        if (!serverResponse.ok) {
          throw new Error(`RSVP endpoint returned ${serverResponse.status}`);
        }

        syncedRemotely = true;
      } catch (error) {
        remoteError = error instanceof Error ? error.message : String(error);
      } finally {
        if (requestTimeoutId !== null) {
          window.clearTimeout(requestTimeoutId);
        }
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
