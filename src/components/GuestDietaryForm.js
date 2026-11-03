import { createGoogleCalendarUrl, WEDDING_DETAILS } from '../data/weddingDetails.js';
import {
  DIETARY_OPTIONS,
  PARTY_SIZE_OPTIONS,
  RSVP_FORM_VERSION,
} from '../data/dietaryOptions.js';
import { GuestRsvpStore } from '../services/GuestRsvpStore.js';

/**
 * The final boss: a progressively enhanced RSVP form that validates attendance,
 * reveals dietary questions only when relevant, and saves locally (and to an
 * optional endpoint) without trapping the guest in a page reload.
 */
export class GuestDietaryForm {
  constructor({
    root,
    details = WEDDING_DETAILS,
    store = new GuestRsvpStore(),
    confirmationDialog = null,
    confirmationContent = null,
    onSaved = () => {},
    onError = () => {},
  }) {
    this.root = root;
    this.details = details;
    this.store = store;
    this.confirmationDialog = confirmationDialog;
    this.confirmationContent = confirmationContent;
    this.onSaved = onSaved;
    this.onError = onError;

    this.isAttending = false;
    this.isDeclined = false;
    this.isSubmitting = false;

    if (!this.root) return;

    this.render();
    this.bindEvents();
    this.restoreSavedResponse();
  }

  render() {
    const partySizeMarkup = PARTY_SIZE_OPTIONS.map(
      (size) => `<option value="${size}">${size} ${size === 1 ? 'GUEST' : 'GUESTS'}</option>`,
    ).join('');

    const dietaryMarkup = DIETARY_OPTIONS.map(
      (option) => `
        <label class="dietary-option">
          <input
            class="dietary-option__input"
            type="checkbox"
            name="dietaryPreferences"
            value="${option.id}"
          />
          <span class="dietary-option__box" aria-hidden="true"></span>
          <span class="dietary-option__text">
            <span class="dietary-option__label">${option.label}</span>
            <span class="dietary-option__description">${option.description}</span>
          </span>
        </label>
      `,
    ).join('');

    this.root.innerHTML = `
      <form class="guest-dietary-form pixel-frame" id="guest-dietary-form" novalidate>
        <header class="guest-dietary-form__header">
          <p class="guest-dietary-form__eyebrow">PLAYER REGISTRATION</p>
          <h3 class="guest-dietary-form__title">WILL YOU JOIN US?</h3>
          <p class="guest-dietary-form__intro">
            One form, zero paper cuts. Tell us who is coming, what you can eat, and
            which song will get you on the dance floor.
          </p>
          <p class="guest-dietary-form__restore-note" data-restore-note hidden></p>
        </header>

        <fieldset class="form-section">
          <legend>01 · PLAYER DETAILS</legend>
          <div class="guest-dietary-form__row">
            <label class="form-field">
              <span class="form-field__label">YOUR NAME</span>
              <input
                name="guestName"
                type="text"
                required
                minlength="2"
                maxlength="80"
                autocomplete="name"
                placeholder="Player name"
              />
            </label>

            <label class="form-field">
              <span class="form-field__label">EMAIL</span>
              <input
                name="guestEmail"
                type="email"
                required
                maxlength="120"
                autocomplete="email"
                placeholder="you@example.com"
              />
            </label>
          </div>
        </fieldset>

        <fieldset class="form-section">
          <legend>02 · ATTENDANCE</legend>
          <div class="attendance-options">
            <label class="attendance-option">
              <input
                class="attendance-option__input"
                type="radio"
                name="attendance"
                value="attending"
                required
              />
              <span class="attendance-option__body">
                <span class="attendance-option__marker" aria-hidden="true"></span>
                <span class="attendance-option__content">
                  <span class="attendance-option__title">YES, SAVE MY SPOT</span>
                  <span class="attendance-option__copy">Count me in for the chuppah, the feast, and the dance floor.</span>
                </span>
              </span>
            </label>

            <label class="attendance-option">
              <input
                class="attendance-option__input"
                type="radio"
                name="attendance"
                value="declined"
                required
              />
              <span class="attendance-option__body">
                <span class="attendance-option__marker" aria-hidden="true"></span>
                <span class="attendance-option__content">
                  <span class="attendance-option__title">SADLY, I CAN'T MAKE IT</span>
                  <span class="attendance-option__copy">I will be there in spirit and expect a very good photo.</span>
                </span>
              </span>
            </label>
          </div>
        </fieldset>

        <div class="guest-dietary-form__attending-fields" data-attending-fields hidden>
          <fieldset class="form-section">
            <legend>03 · YOUR PARTY</legend>
            <div class="guest-dietary-form__row">
              <label class="form-field">
                <span class="form-field__label">NUMBER OF GUESTS</span>
                <select name="partySize">${partySizeMarkup}</select>
              </label>

              <label class="form-field">
                <span class="form-field__label">GUEST NAMES <small>(OPTIONAL)</small></span>
                <textarea
                  name="guestNames"
                  maxlength="240"
                  rows="2"
                  placeholder="Names of everyone in your party"
                ></textarea>
              </label>
            </div>
          </fieldset>

          <fieldset class="form-section">
            <legend>04 · DIETARY LOADOUT</legend>
            <p class="form-section__hint">Select everything that applies. Leave blank if no restrictions.</p>
            <div class="dietary-options">${dietaryMarkup}</div>

            <label class="form-field" data-allergy-field hidden>
              <span class="form-field__label">ALLERGY DETAILS</span>
              <textarea
                name="allergyNotes"
                maxlength="500"
                rows="3"
                placeholder="Tell us exactly what to avoid, and how serious it is."
              ></textarea>
            </label>

            <label class="form-field">
              <span class="form-field__label">ACCESSIBILITY / OTHER NOTES <small>(OPTIONAL)</small></span>
              <textarea
                name="accessibilityNotes"
                maxlength="500"
                rows="3"
                placeholder="Anything the venue or the couple should know?"
              ></textarea>
            </label>
          </fieldset>

          <fieldset class="form-section">
            <legend>05 · DANCE FLOOR INPUT</legend>
            <label class="form-field">
              <span class="form-field__label">SONG REQUEST <small>(OPTIONAL)</small></span>
              <input
                name="songRequest"
                type="text"
                maxlength="120"
                placeholder="Artist — Title"
              />
            </label>
          </fieldset>
        </div>

        <div class="guest-dietary-form__declined-fields" data-declined-fields hidden>
          <fieldset class="form-section">
            <legend>03 · SEND A NOTE</legend>
            <label class="form-field">
              <span class="form-field__label">MESSAGE <small>(OPTIONAL)</small></span>
              <textarea
                name="declineMessage"
                maxlength="400"
                rows="3"
                placeholder="A note for the couple"
              ></textarea>
            </label>
          </fieldset>
        </div>

        <div class="guest-dietary-form__actions">
          <p class="guest-dietary-form__save-note">
            SAVED ON THIS DEVICE. UPDATE YOUR ANSWER ANY TIME.
          </p>
          <button class="pixel-button pixel-button--primary" type="submit" data-submit-button>
            SAVE MY ANSWER
          </button>
        </div>

        <p class="guest-dietary-form__status" data-form-status role="status" aria-live="polite"></p>
      </form>
    `;

    this.form = this.root.querySelector('#guest-dietary-form');
    this.attendingFields = this.root.querySelector('[data-attending-fields]');
    this.declinedFields = this.root.querySelector('[data-declined-fields]');
    this.allergyField = this.root.querySelector('[data-allergy-field]');
    this.allergyCheckbox = this.root.querySelector('input[name="dietaryPreferences"][value="allergies"]');
    this.allergyNotesInput = this.root.querySelector('textarea[name="allergyNotes"]');
    this.submitButton = this.root.querySelector('[data-submit-button]');
    this.statusElement = this.root.querySelector('[data-form-status]');
    this.restoreNote = this.root.querySelector('[data-restore-note]');

    this.applyAttendanceState('');
  }

  bindEvents() {
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);

    this.form.addEventListener('submit', this.handleSubmit);
    this.form.addEventListener('change', this.handleFormChange);
    this.form.addEventListener('input', this.handleInput);

    if (this.confirmationDialog) {
      this.confirmationDialog.addEventListener('close', this.handleDialogClose);
      this.confirmationDialog.addEventListener('click', (event) => {
        if (event.target === this.confirmationDialog) {
          this.confirmationDialog.close();
        }
      });
    }
  }

  handleInput() {
    if (this.statusElement?.dataset.tone === 'error') {
      this.showStatus('', 'neutral');
    }
  }

  handleFormChange(event) {
    const { name, value, checked } = event.target;

    if (name === 'attendance') {
      this.applyAttendanceState(value);
    }

    if (name === 'dietaryPreferences' && value === 'allergies') {
      this.applyAllergyState(checked);
    }
  }

  applyAttendanceState(attendance) {
    this.isAttending = attendance === 'attending';
    this.isDeclined = attendance === 'declined';

    this.attendingFields.hidden = !this.isAttending;
    this.declinedFields.hidden = !this.isDeclined;
    this.setFieldGroupDisabled(this.attendingFields, !this.isAttending);
    this.setFieldGroupDisabled(this.declinedFields, !this.isDeclined);

    if (this.isAttending) {
      this.applyAllergyState(Boolean(this.allergyCheckbox?.checked));
    } else {
      this.applyAllergyState(false);
    }
  }

  setFieldGroupDisabled(group, isDisabled) {
    group.querySelectorAll('input, select, textarea').forEach((field) => {
      field.disabled = isDisabled;
    });
  }

  applyAllergyState(hasAllergies) {
    const shouldShow = this.isAttending && hasAllergies;

    this.allergyField.hidden = !shouldShow;
    this.allergyNotesInput.disabled = !shouldShow;
    this.allergyNotesInput.required = shouldShow;
    this.allergyNotesInput.setAttribute('aria-required', String(shouldShow));
  }

  async handleSubmit(event) {
    event.preventDefault();

    if (this.isSubmitting) return;

    if (!this.form.checkValidity()) {
      this.form.reportValidity();
      this.showStatus('CHECK THE HIGHLIGHTED FIELDS AND TRY AGAIN.', 'error');
      this.onError();
      return;
    }

    const response = this.buildResponse();
    this.setSubmitting(true);
    this.showStatus('SAVING YOUR ANSWER...', 'neutral');

    try {
      const result = await this.store.save(response);

      if (!result.savedLocally && !result.syncedRemotely) {
        this.showStatus(
          'YOUR ANSWER COULD NOT BE SAVED. PLEASE TRY AGAIN OR EMAIL US.',
          'error',
        );
        this.onError();
        return;
      }

      this.updateRestoreNote(response);
      this.showStatus(
        result.syncedRemotely
          ? 'SAVED AND SYNCED TO THE GUEST LIST.'
          : 'SAVED ON THIS DEVICE. YOUR ANSWER IS SAFE.',
        'success',
      );
      this.openConfirmation(response, result);
      this.onSaved(response, result);
    } catch (error) {
      console.error('The RSVP could not be saved.', error);
      this.showStatus('SOMETHING WENT WRONG. PLEASE TRY AGAIN.', 'error');
      this.onError();
    } finally {
      this.setSubmitting(false);
    }
  }

  buildResponse() {
    const readValue = (name) => {
      const field = this.form.querySelector(`[name="${name}"]`);
      return field ? field.value.trim() : '';
    };

    const selectedDietaryPreferences = [
      ...this.form.querySelectorAll('input[name="dietaryPreferences"]:checked'),
    ].map((checkbox) => checkbox.value);

    const response = {
      version: RSVP_FORM_VERSION,
      attendance: this.isAttending ? 'attending' : 'declined',
      guestName: readValue('guestName'),
      guestEmail: readValue('guestEmail'),
      partySize: this.isAttending ? Number(readValue('partySize')) || 1 : 0,
      guestNames: this.isAttending ? readValue('guestNames') : '',
      dietaryPreferences: this.isAttending ? selectedDietaryPreferences : [],
      allergyNotes:
        this.isAttending && selectedDietaryPreferences.includes('allergies')
          ? readValue('allergyNotes')
          : '',
      accessibilityNotes: this.isAttending ? readValue('accessibilityNotes') : '',
      songRequest: this.isAttending ? readValue('songRequest') : '',
      declineMessage: this.isAttending ? '' : readValue('declineMessage'),
      submittedAt: new Date().toISOString(),
    };

    return response;
  }

  setSubmitting(isSubmitting) {
    this.isSubmitting = isSubmitting;
    this.submitButton.disabled = isSubmitting;
    this.submitButton.textContent = isSubmitting ? 'SAVING...' : 'SAVE MY ANSWER';
    this.form.classList.toggle('is-saving', isSubmitting);
  }

  showStatus(message, tone) {
    this.statusElement.textContent = message;
    this.statusElement.dataset.tone = tone;
  }

  restoreSavedResponse() {
    const storedResponse = this.store.load();
    if (!storedResponse || storedResponse.version !== RSVP_FORM_VERSION) return;

    this.form.querySelector('[name="guestName"]').value = storedResponse.guestName ?? '';
    this.form.querySelector('[name="guestEmail"]').value = storedResponse.guestEmail ?? '';
    this.form.querySelector('[name="guestNames"]').value = storedResponse.guestNames ?? '';
    this.form.querySelector('[name="partySize"]').value = String(
      Math.max(1, Number(storedResponse.partySize) || 1),
    );
    this.form.querySelector('[name="allergyNotes"]').value = storedResponse.allergyNotes ?? '';
    this.form.querySelector('[name="accessibilityNotes"]').value =
      storedResponse.accessibilityNotes ?? '';
    this.form.querySelector('[name="songRequest"]').value = storedResponse.songRequest ?? '';
    this.form.querySelector('[name="declineMessage"]').value = storedResponse.declineMessage ?? '';

    const attendanceInput = this.form.querySelector(
      `input[name="attendance"][value="${storedResponse.attendance}"]`,
    );
    if (attendanceInput) attendanceInput.checked = true;

    const storedDietaryPreferences = new Set(storedResponse.dietaryPreferences ?? []);
    this.form.querySelectorAll('input[name="dietaryPreferences"]').forEach((checkbox) => {
      checkbox.checked = storedDietaryPreferences.has(checkbox.value);
    });

    this.applyAttendanceState(storedResponse.attendance ?? '');
    this.updateRestoreNote(storedResponse);
  }

  updateRestoreNote(response) {
    if (!this.restoreNote) return;

    const savedAt = new Date(response.submittedAt);
    const formattedDate = Number.isNaN(savedAt.getTime())
      ? 'JUST NOW'
      : savedAt
          .toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })
          .toUpperCase();

    this.restoreNote.hidden = false;
    this.restoreNote.textContent = `PREVIOUS SAVE · ${formattedDate} · YOU CAN UPDATE THIS ANY TIME.`;
  }

  openConfirmation(response, result) {
    if (!this.confirmationDialog || !this.confirmationContent) return;

    this.confirmationContent.innerHTML = this.buildConfirmationMarkup(response, result);

    if (typeof this.confirmationDialog.showModal === 'function') {
      this.confirmationDialog.showModal();
    } else {
      this.confirmationDialog.setAttribute('open', '');
    }

    document.body.classList.add('is-dialog-open');

    this.confirmationContent
      .querySelector('[data-dialog-close]')
      ?.addEventListener('click', () => this.confirmationDialog.close(), { once: true });
  }

  handleDialogClose() {
    document.body.classList.remove('is-dialog-open');
  }

  buildConfirmationMarkup(response, result) {
    const isAttending = response.attendance === 'attending';
    const dietaryLabels = response.dietaryPreferences
      .map((id) => DIETARY_OPTIONS.find((option) => option.id === id)?.label)
      .filter(Boolean);
    const calendarUrl = createGoogleCalendarUrl(this.details);
    const syncLabel = result.syncedRemotely
      ? 'SYNCED TO THE GUEST LIST'
      : result.endpointConfigured
        ? 'SAVED HERE · CLOUD SYNC FAILED'
        : 'SAVED ON THIS DEVICE';

    const summaryRows = isAttending
      ? [
          ['PLAYER', response.guestName],
          ['PARTY', `${response.partySize} ${response.partySize === 1 ? 'GUEST' : 'GUESTS'}`],
          ['DIETARY', dietaryLabels.join(', ') || 'NO RESTRICTIONS'],
          ...(response.songRequest ? [['SONG REQUEST', response.songRequest]] : []),
        ]
      : [
          ['PLAYER', response.guestName],
          ['EMAIL', response.guestEmail],
          ...(response.declineMessage ? [['MESSAGE', response.declineMessage]] : []),
        ];

    const summaryMarkup = summaryRows
      .map(
        ([label, value]) => `
          <div class="pixel-dialog__summary-row">
            <dt>${escapeHtml(label)}</dt>
            <dd>${escapeHtml(value)}</dd>
          </div>
        `,
      )
      .join('');

    return `
      <p class="pixel-dialog__eyebrow">${isAttending ? 'SAVE COMPLETE' : 'MESSAGE RECEIVED'}</p>
      <h3 class="pixel-dialog__title" id="rsvp-confirmation-title">
        ${isAttending ? "YOU'RE ON THE GUEST LIST" : "WE'LL MISS YOU"}
      </h3>
      <p class="pixel-dialog__copy">
        ${
          isAttending
            ? `Thanks, ${escapeHtml(response.guestName)}. Your spot is saved. We cannot wait to celebrate with you.`
            : `Thanks for letting us know, ${escapeHtml(response.guestName)}. You will be missed, and we will save you a piece of cake in spirit.`
        }
      </p>
      <dl class="pixel-dialog__summary">${summaryMarkup}</dl>
      <p class="pixel-dialog__sync">${syncLabel}</p>
      <div class="pixel-dialog__actions">
        ${
          isAttending
            ? `<a class="pixel-button pixel-button--primary" href="${calendarUrl}" target="_blank" rel="noopener noreferrer">ADD TO CALENDAR</a>`
            : ''
        }
        <button class="pixel-button pixel-button--ghost" type="button" data-dialog-close>
          ${isAttending ? 'BACK TO THE PARTY' : 'CLOSE'}
        </button>
      </div>
    `;
  }
}

function escapeHtml(value) {
  return String(value ?? '').replace(
    /[&<>"']/g,
    (character) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[character],
  );
}
