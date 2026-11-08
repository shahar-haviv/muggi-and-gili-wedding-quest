import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import {
  DIETARY_OPTIONS,
  PARTY_SIZE_OPTIONS,
  RSVP_FORM_VERSION,
} from '../../data/dietaryOptions.ts';
import { GuestRsvpStore } from '../../services/GuestRsvpStore.ts';
import type {
  AttendanceStatus,
  DietaryOptionId,
  RsvpResponse,
  RsvpSaveResult,
} from '../../types/wedding.ts';

interface GuestDietaryFormProps {
  readonly store?: GuestRsvpStore;
  readonly onSaved: (response: RsvpResponse, result: RsvpSaveResult) => void;
  readonly onError: () => void;
}

type StatusTone = 'neutral' | 'success' | 'error';

function formatRestoreDate(isoTimestamp: string): string {
  const savedAt = new Date(isoTimestamp);
  if (Number.isNaN(savedAt.getTime())) return 'JUST NOW';
  return savedAt
    .toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    .toUpperCase();
}

/**
 * Single-responsibility RSVP form component with conditional dietary fields,
 * native validation, and localStorage/endpoint persistence.
 */
export function GuestDietaryForm({ store, onSaved, onError }: GuestDietaryFormProps) {
  const rsvpStore = useMemo(() => store ?? new GuestRsvpStore(), [store]);
  const formRef = useRef<HTMLFormElement | null>(null);

  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [attendance, setAttendance] = useState<AttendanceStatus | ''>('');
  const [partySize, setPartySize] = useState(1);
  const [guestNames, setGuestNames] = useState('');
  const [dietaryPreferences, setDietaryPreferences] = useState<DietaryOptionId[]>([]);
  const [allergyNotes, setAllergyNotes] = useState('');
  const [accessibilityNotes, setAccessibilityNotes] = useState('');
  const [songRequest, setSongRequest] = useState('');
  const [declineMessage, setDeclineMessage] = useState('');

  const [restoreNoteText, setRestoreNoteText] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusTone, setStatusTone] = useState<StatusTone>('neutral');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const stored = rsvpStore.load();
    if (!stored || stored.version !== RSVP_FORM_VERSION) return;

    setGuestName(stored.guestName ?? '');
    setGuestEmail(stored.guestEmail ?? '');
    setAttendance(stored.attendance ?? '');
    setPartySize(Math.max(1, Number(stored.partySize) || 1));
    setGuestNames(stored.guestNames ?? '');
    setDietaryPreferences([...(stored.dietaryPreferences ?? [])]);
    setAllergyNotes(stored.allergyNotes ?? '');
    setAccessibilityNotes(stored.accessibilityNotes ?? '');
    setSongRequest(stored.songRequest ?? '');
    setDeclineMessage(stored.declineMessage ?? '');
    setRestoreNoteText(
      `PREVIOUS SAVE · ${formatRestoreDate(stored.submittedAt)} · YOU CAN UPDATE THIS ANY TIME.`,
    );
  }, [rsvpStore]);

  const clearErrorOnInput = () => {
    if (statusTone === 'error') {
      setStatusMessage('');
      setStatusTone('neutral');
    }
  };

  const toggleDietaryPreference = (optionId: DietaryOptionId, checked: boolean) => {
    clearErrorOnInput();
    setDietaryPreferences((prev) =>
      checked
        ? prev.includes(optionId)
          ? prev
          : [...prev, optionId]
        : prev.filter((item) => item !== optionId),
    );
  };

  const isAttending = attendance === 'attending';
  const isDeclined = attendance === 'declined';
  const hasAllergies = isAttending && dietaryPreferences.includes('allergies');

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    if (isSubmitting || !formRef.current) return;

    if (!formRef.current.checkValidity()) {
      formRef.current.reportValidity();
      setStatusMessage('CHECK THE HIGHLIGHTED FIELDS AND TRY AGAIN.');
      setStatusTone('error');
      onError();
      return;
    }

    const response: RsvpResponse = {
      version: RSVP_FORM_VERSION,
      attendance: isAttending ? 'attending' : 'declined',
      guestName: guestName.trim(),
      guestEmail: guestEmail.trim(),
      partySize: isAttending ? Number(partySize) || 1 : 0,
      guestNames: isAttending ? guestNames.trim() : '',
      dietaryPreferences: isAttending ? dietaryPreferences : [],
      allergyNotes: hasAllergies ? allergyNotes.trim() : '',
      accessibilityNotes: isAttending ? accessibilityNotes.trim() : '',
      songRequest: isAttending ? songRequest.trim() : '',
      declineMessage: isAttending ? '' : declineMessage.trim(),
      submittedAt: new Date().toISOString(),
    };

    setIsSubmitting(true);
    setStatusMessage('SAVING YOUR ANSWER...');
    setStatusTone('neutral');

    try {
      const result = await rsvpStore.save(response);

      if (!result.savedLocally && !result.syncedRemotely) {
        setStatusMessage('YOUR ANSWER COULD NOT BE SAVED. PLEASE TRY AGAIN OR EMAIL US.');
        setStatusTone('error');
        onError();
        return;
      }

      setRestoreNoteText(
        `PREVIOUS SAVE · ${formatRestoreDate(response.submittedAt)} · YOU CAN UPDATE THIS ANY TIME.`,
      );
      setStatusMessage(
        result.syncedRemotely
          ? 'SAVED AND SYNCED TO THE GUEST LIST.'
          : 'SAVED ON THIS DEVICE. YOUR ANSWER IS SAFE.',
      );
      setStatusTone('success');
      onSaved(response, result);
    } catch (error) {
      console.error('The RSVP could not be saved.', error);
      setStatusMessage('SOMETHING WENT WRONG. PLEASE TRY AGAIN.');
      setStatusTone('error');
      onError();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rsvp-form-mount" id="guest-dietary-form-root">
      <form
        ref={formRef}
        className={`guest-dietary-form pixel-frame${isSubmitting ? ' is-saving' : ''}`}
        id="guest-dietary-form"
        noValidate
        onSubmit={handleSubmit}
        onInput={clearErrorOnInput}
      >
        <header className="guest-dietary-form__header">
          <p className="guest-dietary-form__eyebrow">PLAYER REGISTRATION</p>
          <h3 className="guest-dietary-form__title">WILL YOU JOIN US?</h3>
          <p className="guest-dietary-form__intro">
            One form, zero paper cuts. Tell us who is coming, what you can eat, and which song
            will get you on the dance floor.
          </p>
          <p
            className="guest-dietary-form__restore-note"
            data-restore-note=""
            hidden={!restoreNoteText}
          >
            {restoreNoteText ?? ''}
          </p>
        </header>

        <fieldset className="form-section">
          <legend>01 · PLAYER DETAILS</legend>
          <div className="guest-dietary-form__row">
            <label className="form-field">
              <span className="form-field__label">YOUR NAME</span>
              <input
                name="guestName"
                type="text"
                required
                minLength={2}
                maxLength={80}
                autoComplete="name"
                placeholder="Player name"
                value={guestName}
                onInput={(e) => setGuestName((e.target as HTMLInputElement).value)}
              />
            </label>

            <label className="form-field">
              <span className="form-field__label">EMAIL</span>
              <input
                name="guestEmail"
                type="email"
                required
                maxLength={120}
                autoComplete="email"
                placeholder="you@example.com"
                value={guestEmail}
                onInput={(e) => setGuestEmail((e.target as HTMLInputElement).value)}
              />
            </label>
          </div>
        </fieldset>

        <fieldset className="form-section">
          <legend>02 · ATTENDANCE</legend>
          <div className="attendance-options">
            <label className="attendance-option">
              <input
                className="attendance-option__input"
                type="radio"
                name="attendance"
                value="attending"
                required
                checked={attendance === 'attending'}
                onChange={() => setAttendance('attending')}
              />
              <span className="attendance-option__body">
                <span className="attendance-option__marker" aria-hidden="true" />
                <span className="attendance-option__content">
                  <span className="attendance-option__title">YES, SAVE MY SPOT</span>
                  <span className="attendance-option__copy">
                    Count me in for the chuppah, the feast, and the dance floor.
                  </span>
                </span>
              </span>
            </label>

            <label className="attendance-option">
              <input
                className="attendance-option__input"
                type="radio"
                name="attendance"
                value="declined"
                required
                checked={attendance === 'declined'}
                onChange={() => setAttendance('declined')}
              />
              <span className="attendance-option__body">
                <span className="attendance-option__marker" aria-hidden="true" />
                <span className="attendance-option__content">
                  <span className="attendance-option__title">SADLY, I CAN'T MAKE IT</span>
                  <span className="attendance-option__copy">
                    I will be there in spirit and expect a very good photo.
                  </span>
                </span>
              </span>
            </label>
          </div>
        </fieldset>

        <div
          className="guest-dietary-form__attending-fields"
          data-attending-fields=""
          hidden={!isAttending}
        >
          <fieldset className="form-section" disabled={!isAttending}>
            <legend>03 · YOUR PARTY</legend>
            <div className="guest-dietary-form__row">
              <label className="form-field">
                <span className="form-field__label">NUMBER OF GUESTS</span>
                <select
                  name="partySize"
                  value={String(partySize)}
                  disabled={!isAttending}
                  onChange={(e) =>
                    setPartySize(Number((e.target as HTMLSelectElement).value) || 1)
                  }
                >
                  {PARTY_SIZE_OPTIONS.map((size) => (
                    <option key={size} value={String(size)}>
                      {size} {size === 1 ? 'GUEST' : 'GUESTS'}
                    </option>
                  ))}
                </select>
              </label>

              <label className="form-field">
                <span className="form-field__label">
                  GUEST NAMES <small>(OPTIONAL)</small>
                </span>
                <textarea
                  name="guestNames"
                  maxLength={240}
                  rows={2}
                  disabled={!isAttending}
                  placeholder="Names of everyone in your party"
                  value={guestNames}
                  onInput={(e) => setGuestNames((e.target as HTMLTextAreaElement).value)}
                />
              </label>
            </div>
          </fieldset>

          <fieldset className="form-section" disabled={!isAttending}>
            <legend>04 · DIETARY LOADOUT</legend>
            <p className="form-section__hint">
              Select everything that applies. Leave blank if no restrictions.
            </p>
            <div className="dietary-options">
              {DIETARY_OPTIONS.map((option) => {
                const isChecked = dietaryPreferences.includes(option.id);
                return (
                  <label className="dietary-option" key={option.id}>
                    <input
                      className="dietary-option__input"
                      type="checkbox"
                      name="dietaryPreferences"
                      value={option.id}
                      disabled={!isAttending}
                      checked={isChecked}
                      onChange={(e) =>
                        toggleDietaryPreference(
                          option.id,
                          (e.target as HTMLInputElement).checked,
                        )
                      }
                    />
                    <span className="dietary-option__box" aria-hidden="true" />
                    <span className="dietary-option__text">
                      <span className="dietary-option__label">{option.label}</span>
                      <span className="dietary-option__description">{option.description}</span>
                    </span>
                  </label>
                );
              })}
            </div>

            <label className="form-field" data-allergy-field="" hidden={!hasAllergies}>
              <span className="form-field__label">ALLERGY DETAILS</span>
              <textarea
                name="allergyNotes"
                maxLength={500}
                rows={3}
                disabled={!hasAllergies}
                required={hasAllergies}
                aria-required={hasAllergies ? 'true' : 'false'}
                placeholder="Tell us exactly what to avoid, and how serious it is."
                value={allergyNotes}
                onInput={(e) => setAllergyNotes((e.target as HTMLTextAreaElement).value)}
              />
            </label>

            <label className="form-field">
              <span className="form-field__label">
                ACCESSIBILITY / OTHER NOTES <small>(OPTIONAL)</small>
              </span>
              <textarea
                name="accessibilityNotes"
                maxLength={500}
                rows={3}
                disabled={!isAttending}
                placeholder="Anything the venue or the couple should know?"
                value={accessibilityNotes}
                onInput={(e) =>
                  setAccessibilityNotes((e.target as HTMLTextAreaElement).value)
                }
              />
            </label>
          </fieldset>

          <fieldset className="form-section" disabled={!isAttending}>
            <legend>05 · DANCE FLOOR INPUT</legend>
            <label className="form-field">
              <span className="form-field__label">
                SONG REQUEST <small>(OPTIONAL)</small>
              </span>
              <input
                name="songRequest"
                type="text"
                maxLength={120}
                disabled={!isAttending}
                placeholder="Artist — Title"
                value={songRequest}
                onInput={(e) => setSongRequest((e.target as HTMLInputElement).value)}
              />
            </label>
          </fieldset>
        </div>

        <div
          className="guest-dietary-form__declined-fields"
          data-declined-fields=""
          hidden={!isDeclined}
        >
          <fieldset className="form-section" disabled={!isDeclined}>
            <legend>03 · SEND A NOTE</legend>
            <label className="form-field">
              <span className="form-field__label">
                MESSAGE <small>(OPTIONAL)</small>
              </span>
              <textarea
                name="declineMessage"
                maxLength={400}
                rows={3}
                disabled={!isDeclined}
                placeholder="A note for the couple"
                value={declineMessage}
                onInput={(e) => setDeclineMessage((e.target as HTMLTextAreaElement).value)}
              />
            </label>
          </fieldset>
        </div>

        <div className="guest-dietary-form__actions">
          <p className="guest-dietary-form__save-note">
            SAVED ON THIS DEVICE. UPDATE YOUR ANSWER ANY TIME.
          </p>
          <button
            className="pixel-button pixel-button--primary"
            type="submit"
            data-submit-button=""
            disabled={isSubmitting}
          >
            {isSubmitting ? 'SAVING...' : 'SAVE MY ANSWER'}
          </button>
        </div>

        <p
          className="guest-dietary-form__status"
          data-form-status=""
          data-tone={statusTone}
          role="status"
          aria-live="polite"
        >
          {statusMessage}
        </p>
      </form>
    </div>
  );
}
