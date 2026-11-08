import { createGoogleCalendarUrl, WEDDING_DETAILS } from '../data/weddingDetails.js';

/**
 * Renders the world-map card, practical venue facts, and the two useful
 * outbound links: directions and a calendar save.
 */
export class VenueInformationPanel {
  constructor({ root, details = WEDDING_DETAILS }) {
    this.root = root;
    this.details = details;

    if (!this.root) return;

    this.render();
  }

  render() {
    this.root.innerHTML = `
      <div class="venue-layout">
        <figure class="venue-map pixel-frame">
          <div class="venue-map__header">
            <span>WORLD MAP</span>
            <span>${this.details.venue.city.toUpperCase()} · ${this.details.venue.country.toUpperCase()}</span>
          </div>

          <div class="venue-map__canvas">
            ${this.createPixelMapMarkup()}
          </div>

          <figcaption class="venue-map__caption">
            <span>ILLUSTRATIVE MAP</span>
            <span>NOT TO SCALE</span>
          </figcaption>
        </figure>

        <div class="venue-details">
          <div class="venue-details__header">
            <p class="venue-details__eyebrow">DESTINATION UNLOCKED</p>
            <h3 class="venue-details__title">${this.details.venue.name}</h3>
            <p class="venue-details__address">${this.details.venue.address}</p>
          </div>

          <dl class="venue-facts">
            <div class="venue-fact">
              <dt>ARRIVAL</dt>
              <dd>${this.details.venue.arrivalNote}</dd>
            </div>
            <div class="venue-fact">
              <dt>PARKING</dt>
              <dd>${this.details.venue.parkingNote}</dd>
            </div>
            <div class="venue-fact">
              <dt>ACCESSIBILITY</dt>
              <dd>${this.details.venue.accessibilityNote}</dd>
            </div>
          </dl>

          <div class="venue-actions">
            <a
              class="pixel-button pixel-button--primary"
              href="${this.details.venue.mapsUrl}"
              target="_blank"
              rel="noopener noreferrer"
            >
              OPEN IN MAPS
            </a>
            <a
              class="pixel-button pixel-button--ghost"
              href="${createGoogleCalendarUrl(this.details)}"
              target="_blank"
              rel="noopener noreferrer"
            >
              ADD TO CALENDAR
            </a>
          </div>
        </div>
      </div>
    `;
  }

  createPixelMapMarkup() {
    return `
      <svg
        class="venue-map__svg"
        viewBox="0 0 120 90"
        role="img"
        aria-labelledby="venue-map-title venue-map-description"
        shape-rendering="crispEdges"
      >
        <title id="venue-map-title">Pixel-art map to Consul House in Jaffa, Tel Aviv</title>
        <desc id="venue-map-description">
          An illustrative Old Jaffa seaside map with HaZorfim Street leading past parking to Consul House,
          its arched courtyard, rooftop chuppah, and entrance marker.
        </desc>

        <rect width="120" height="90" fill="#0b1024" />
        <rect x="0" y="0" width="34" height="90" fill="#102a4f" />
        <rect x="0" y="0" width="34" height="8" fill="#1a3f73" />

        <g fill="#2d5c99" opacity="0.85">
          <rect x="4" y="16" width="12" height="2" />
          <rect x="20" y="24" width="8" height="2" />
          <rect x="2" y="36" width="16" height="2" />
          <rect x="14" y="50" width="12" height="2" />
          <rect x="4" y="64" width="18" height="2" />
          <rect x="20" y="76" width="8" height="2" />
        </g>

        <rect x="34" y="0" width="86" height="90" fill="#14251d" />
        <g fill="#1d3528">
          <rect x="38" y="8" width="28" height="18" />
          <rect x="70" y="6" width="16" height="14" />
          <rect x="90" y="30" width="24" height="20" />
          <rect x="40" y="34" width="18" height="16" />
          <rect x="56" y="70" width="22" height="16" />
          <rect x="88" y="60" width="24" height="22" />
        </g>

        <path d="M88 90 V70 H54 V60" stroke="#8b6a35" stroke-width="7" fill="none" />
        <path
          d="M88 90 V70 H54 V60"
          stroke="#ffe3a8"
          stroke-width="1"
          stroke-dasharray="3 3"
          fill="none"
        />

        <rect x="34" y="52" width="18" height="14" fill="#1b1136" stroke="#4b2f78" stroke-width="1" />
        <text x="43" y="61.5" class="venue-map__parking-label" text-anchor="middle">P</text>

        <rect x="66" y="18" width="34" height="22" fill="#2a1a4d" stroke="#4b2f78" stroke-width="2" />
        <rect x="69" y="21" width="28" height="7" fill="#f2799b" />
        <g fill="#ffc857">
          <rect x="72" y="22" width="4" height="4" />
          <rect x="80" y="22" width="4" height="4" />
          <rect x="88" y="22" width="4" height="4" />
        </g>

        <rect x="68" y="44" width="36" height="24" fill="#24164a" stroke="#4b2f78" />
        <rect x="78" y="47" width="16" height="14" fill="none" stroke="#fff2d2" stroke-width="1.5" />
        <rect x="78" y="47" width="16" height="3" fill="#f2799b" />
        <g fill="#ffc857">
          <rect x="77" y="46" width="2" height="2" />
          <rect x="93" y="46" width="2" height="2" />
          <rect x="77" y="60" width="2" height="2" />
          <rect x="93" y="60" width="2" height="2" />
        </g>

        <rect x="84" y="54" width="4" height="4" fill="#fff2d2" />
        <rect x="92" y="54" width="4" height="4" fill="#fff2d2" />
        <rect x="84" y="57" width="4" height="1" fill="#ffc857" />
        <rect x="92" y="57" width="4" height="1" fill="#ffc857" />

        <g fill="#3f8a5f">
          <rect x="44" y="18" width="2" height="3" />
          <rect x="43" y="15" width="4" height="4" />
          <rect x="59" y="28" width="2" height="3" />
          <rect x="58" y="25" width="4" height="4" />
          <rect x="104" y="27" width="2" height="3" />
          <rect x="103" y="24" width="4" height="4" />
          <rect x="48" y="72" width="2" height="3" />
          <rect x="47" y="69" width="4" height="4" />
          <rect x="101" y="69" width="2" height="3" />
          <rect x="100" y="66" width="4" height="4" />
        </g>

        <path d="M52 58 H66" stroke="#71e0c0" stroke-width="1" stroke-dasharray="2 2" fill="none" />

        <g class="venue-map__pin">
          <rect x="49" y="45" width="8" height="8" fill="#ffc857" opacity="0.18" />
          <g fill="#ffc857">
            <rect x="50" y="42" width="2" height="1" />
            <rect x="54" y="42" width="2" height="1" />
            <rect x="49" y="43" width="8" height="2" />
            <rect x="50" y="45" width="6" height="1" />
            <rect x="51" y="46" width="4" height="1" />
            <rect x="52" y="47" width="2" height="1" />
          </g>
        </g>

        <text x="8" y="84" class="venue-map__label">SEA</text>
        <text x="52" y="38" class="venue-map__label" text-anchor="middle">HAZORFIM 15</text>
        <text x="35" y="77" class="venue-map__label">PARKING</text>
        <text x="83" y="15" class="venue-map__label" text-anchor="middle">CONSUL HOUSE</text>

        <g transform="translate(104 8)" fill="#cbb99e">
          <rect x="0" y="0" width="2" height="9" />
          <rect x="0" y="0" width="5" height="2" />
          <rect x="5" y="0" width="2" height="6" />
          <rect x="0" y="3" width="5" height="2" />
          <text x="1" y="15" class="venue-map__north">N</text>
        </g>
      </svg>
    `;
  }
}
