import { useEffect, useRef } from 'preact/hooks';
import { DIETARY_OPTIONS } from '../../data/dietaryOptions.ts';
import { createGoogleCalendarUrl } from '../../services/CalendarLinkBuilder.ts';
import type { RsvpResponse, RsvpSaveResult, WeddingDetails } from '../../types/wedding.ts';

interface RsvpConfirmationDialogProps {
  readonly details: WeddingDetails;
  readonly response: RsvpResponse | null;
  readonly saveResult: RsvpSaveResult | null;
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

/**
 * Single-responsibility modal dialog displaying the saved RSVP summary and
 * Google Calendar CTA.
 */
export function RsvpConfirmationDialog({
  details,
  response,
  saveResult,
  isOpen,
  onClose,
}: RsvpConfirmationDialogProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        if (typeof dialog.showModal === 'function') {
          dialog.showModal();
        } else {
          dialog.setAttribute('open', '');
        }
      }
      document.body.classList.add('is-dialog-open');
    } else {
      if (dialog.open) {
        dialog.close();
      }
      document.body.classList.remove('is-dialog-open');
    }

    return () => {
      document.body.classList.remove('is-dialog-open');
    };
  }, [isOpen]);

  const handleBackdropClick = (event: MouseEvent) => {
    if (event.target === dialogRef.current) {
      onClose();
    }
  };

  const isAttending = response?.attendance === 'attending';
  const dietaryLabels =
    response?.dietaryPreferences
      .map((id) => DIETARY_OPTIONS.find((opt) => opt.id === id)?.label)
      .filter((label): label is string => Boolean(label)) ?? [];

  const calendarUrl = createGoogleCalendarUrl(details);
  const syncLabel = saveResult?.syncedRemotely
    ? 'SYNCED TO THE GUEST LIST'
    : saveResult?.endpointConfigured
      ? 'SAVED HERE · CLOUD SYNC FAILED'
      : 'SAVED ON THIS DEVICE';

  const summaryRows: readonly (readonly [string, string])[] = response
    ? isAttending
      ? [
          ['PLAYER', response.guestName],
          [
            'PARTY',
            `${response.partySize} ${response.partySize === 1 ? 'GUEST' : 'GUESTS'}`,
          ],
          ['DIETARY', dietaryLabels.join(', ') || 'NO RESTRICTIONS'],
          ...(response.songRequest
            ? ([['SONG REQUEST', response.songRequest]] as const)
            : []),
        ]
      : [
          ['PLAYER', response.guestName],
          ['EMAIL', response.guestEmail],
          ...(response.declineMessage
            ? ([['MESSAGE', response.declineMessage]] as const)
            : []),
        ]
    : [];

  return (
    <dialog
      ref={dialogRef}
      className="pixel-dialog"
      id="rsvp-confirmation-dialog"
      aria-labelledby="rsvp-confirmation-title"
      onClose={onClose}
      onClick={handleBackdropClick}
    >
      <div className="pixel-dialog__content" id="rsvp-confirmation-content">
        {response && (
          <>
            <p className="pixel-dialog__eyebrow">
              {isAttending ? 'SAVE COMPLETE' : 'MESSAGE RECEIVED'}
            </p>
            <h3 className="pixel-dialog__title" id="rsvp-confirmation-title">
              {isAttending ? "YOU'RE ON THE GUEST LIST" : "WE'LL MISS YOU"}
            </h3>
            <p className="pixel-dialog__copy">
              {isAttending
                ? `Thanks, ${response.guestName}. Your spot is saved. We cannot wait to celebrate with you.`
                : `Thanks for letting us know, ${response.guestName}. You will be missed, and we will save you a piece of cake in spirit.`}
            </p>
            <dl className="pixel-dialog__summary">
              {summaryRows.map(([label, value]) => (
                <div className="pixel-dialog__summary-row" key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            <p className="pixel-dialog__sync">{syncLabel}</p>
            <div className="pixel-dialog__actions">
              {isAttending && (
                <a
                  className="pixel-button pixel-button--primary"
                  href={calendarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ADD TO CALENDAR
                </a>
              )}
              <button
                className="pixel-button pixel-button--ghost"
                type="button"
                data-dialog-close=""
                onClick={onClose}
              >
                {isAttending ? 'BACK TO THE PARTY' : 'CLOSE'}
              </button>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}
