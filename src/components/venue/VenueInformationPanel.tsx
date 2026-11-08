import { createGoogleCalendarUrl } from '../../services/CalendarLinkBuilder.ts';
import type { WeddingDetails } from '../../types/wedding.ts';
import { VenuePixelMap } from './VenuePixelMap.tsx';

interface VenueInformationPanelProps {
  readonly details: WeddingDetails;
}

/**
 * Single-responsibility panel displaying the clickable Old Jaffa pixel map,
 * practical venue details, and outbound Google Maps + Google Calendar actions.
 */
export function VenueInformationPanel({ details }: VenueInformationPanelProps) {
  return (
    <div id="venue-information-root">
      <div className="venue-layout">
        <figure className="venue-map pixel-frame">
          <div className="venue-map__header">
            <span>INTERACTIVE WORLD MAP</span>
            <span>
              {details.venue.city.toUpperCase()} · {details.venue.country.toUpperCase()}
            </span>
          </div>

          <div className="venue-map__canvas">
            <VenuePixelMap
              venueMapsUrl={details.venue.mapsUrl}
              parkingMapsUrl={details.venue.parkingMapsUrl}
            />
          </div>

          <figcaption className="venue-map__caption">
            <span className="venue-map__caption-hint">
              TAP CONSUL HOUSE OR [P] PARKING TO OPEN IN MAPS
            </span>
            <div className="venue-map__quick-links">
              <a
                href={details.venue.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="venue-map__chip venue-map__chip--venue"
              >
                CONSUL HOUSE &gt;
              </a>
              <a
                href={details.venue.parkingMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="venue-map__chip venue-map__chip--parking"
              >
                [P] HAZORFIM LOT &gt;
              </a>
            </div>
          </figcaption>
        </figure>

        <div className="venue-details">
          <div className="venue-details__header">
            <p className="venue-details__eyebrow">DESTINATION UNLOCKED</p>
            <h3 className="venue-details__title">{details.venue.name}</h3>
            <p className="venue-details__address">{details.venue.address}</p>
          </div>

          <dl className="venue-facts">
            <div className="venue-fact">
              <dt>ARRIVAL</dt>
              <dd>{details.venue.arrivalNote}</dd>
            </div>
            <div className="venue-fact">
              <dt>PARKING</dt>
              <dd>
                {details.venue.parkingNote}{' '}
                <a
                  href={details.venue.parkingMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="venue-fact__inline-link"
                >
                  Open {details.venue.parkingName} in Maps ↗
                </a>
              </dd>
            </div>
            <div className="venue-fact">
              <dt>ACCESSIBILITY</dt>
              <dd>{details.venue.accessibilityNote}</dd>
            </div>
          </dl>

          <div className="venue-actions">
            <a
              className="pixel-button pixel-button--primary"
              href={details.venue.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              CONSUL HOUSE MAPS
            </a>
            <a
              className="pixel-button pixel-button--ghost"
              href={details.venue.parkingMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              PARKING MAPS
            </a>
            <a
              className="pixel-button pixel-button--ghost"
              href={createGoogleCalendarUrl(details)}
              target="_blank"
              rel="noopener noreferrer"
            >
              ADD TO CALENDAR
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
