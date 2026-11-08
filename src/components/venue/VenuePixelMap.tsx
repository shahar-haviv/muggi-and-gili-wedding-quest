interface VenuePixelMapProps {
  readonly venueMapsUrl: string;
  readonly parkingMapsUrl: string;
}

/**
 * Interactive, geographically accurate pixel-art map of Consul House (HaZorfim 15)
 * and HaZorfim Parking Lot (HaZorfim 15A) in Old Jaffa.
 *
 * Real-world West -> East orientation:
 * - West (left): Mediterranean Sea & Mifratz Shlomo promenade
 * - West-Central Ridge: Old Jaffa Gardens & Consul House (HaZorfim 15) overlooking the sea
 * - Center-East street: HaZorfim Street running S -> N along the ridge
 * - East of HaZorfim St (inland): HaZorfim Parking Lot (15A) & Yefet Street
 */
export function VenuePixelMap({ venueMapsUrl, parkingMapsUrl }: VenuePixelMapProps) {
  return (
    <svg
      className="venue-map__svg"
      viewBox="0 0 160 120"
      role="group"
      aria-labelledby="venue-map-title venue-map-description"
      shape-rendering="crispEdges"
    >
      <title id="venue-map-title">
        Interactive pixel-art map of Consul House and HaZorfim Parking in Old Jaffa
      </title>
      <desc id="venue-map-description">
        Oriented with the Mediterranean Sea on the west, Consul House on the Old Jaffa coastal ridge
        at HaZorfim 15, HaZorfim Street in the center, and HaZorfim Parking Lot inland to the east
        near Yefet Street. Click Consul House or Parking to open directions in Google Maps.
      </desc>

      {/* Base night ground */}
      <rect width="160" height="120" fill="#13221b" />

      {/* WEST: Mediterranean Sea (x: 0..34) */}
      <rect x="0" y="0" width="34" height="120" fill="#0d2342" />
      <rect x="0" y="0" width="34" height="10" fill="#163663" />
      <rect x="31" y="0" width="3" height="120" fill="#1f4b82" />

      {/* Sea waves */}
      <g fill="#2d63a6" opacity="0.85">
        <rect x="5" y="18" width="12" height="2" />
        <rect x="18" y="28" width="9" height="2" />
        <rect x="4" y="42" width="15" height="2" />
        <rect x="14" y="56" width="11" height="2" />
        <rect x="6" y="72" width="16" height="2" />
        <rect x="17" y="86" width="9" height="2" />
        <rect x="5" y="98" width="13" height="2" />
      </g>

      {/* Old Jaffa coastal cliff / Mifratz Shlomo promenade wall (x: 34..38) */}
      <rect x="34" y="0" width="4" height="120" fill="#3b2d4a" />
      <rect x="37" y="0" width="1" height="120" fill="#6e5785" />

      {/* Old Jaffa garden terraces & city blocks */}
      <g fill="#1b3126">
        <rect x="40" y="8" width="44" height="16" />
        <rect x="40" y="86" width="44" height="26" />
        <rect x="104" y="8" width="36" height="20" />
        <rect x="104" y="92" width="36" height="20" />
      </g>

      {/* EAST: Yefet Street (x: 146..156) + connector into HaZorfim St (x: 90..100) */}
      <g fill="#352a47">
        {/* HaZorfim Street (South-to-North central artery) */}
        <rect x="88" y="0" width="12" height="120" />
        {/* Yefet Street (Eastern artery) */}
        <rect x="146" y="0" width="11" height="120" />
        {/* Connector street between Yefet St and HaZorfim St */}
        <rect x="88" y="80" width="68" height="10" />
      </g>

      {/* Road curbs */}
      <g fill="#564373">
        <rect x="88" y="0" width="1" height="120" />
        <rect x="99" y="0" width="1" height="80" />
        <rect x="99" y="90" width="1" height="30" />
        <rect x="146" y="0" width="1" height="80" />
        <rect x="146" y="90" width="1" height="30" />
        <rect x="156" y="0" width="1" height="120" />
        <rect x="100" y="80" width="46" height="1" />
        <rect x="100" y="89" width="46" height="1" />
      </g>

      {/* Dashed road centerlines (starting below street labels so text stays crisp) */}
      <path
        d="M94 36 V116 M151.5 38 V116 M98 85 H148"
        stroke="#ffc857"
        stroke-width="1"
        stroke-dasharray="3 4"
        fill="none"
        opacity="0.65"
      />

      {/* Parking lot driveway entrance from the connector street */}
      <rect x="119" y="74" width="8" height="7" fill="#352a47" />
      <rect x="118" y="74" width="1" height="7" fill="#564373" />
      <rect x="127" y="74" width="1" height="7" fill="#564373" />

      {/* Old Jaffa cypress & olive trees */}
      <g fill="#3f8a5f">
        <rect x="44" y="13" width="4" height="4" />
        <rect x="45" y="17" width="2" height="2" fill="#28593d" />
        <rect x="54" y="11" width="4" height="4" />
        <rect x="55" y="15" width="2" height="2" fill="#28593d" />
        <rect x="44" y="92" width="4" height="4" />
        <rect x="45" y="96" width="2" height="2" fill="#28593d" />
        <rect x="76" y="94" width="4" height="4" />
        <rect x="77" y="98" width="2" height="2" fill="#28593d" />
        <rect x="110" y="14" width="4" height="4" />
        <rect x="111" y="18" width="2" height="2" fill="#28593d" />
        <rect x="134" y="96" width="4" height="4" />
        <rect x="135" y="100" width="2" height="2" fill="#28593d" />
      </g>

      {/* Crosswalk & walking path from Parking (East) across HaZorfim St to Consul House (West) */}
      <g fill="#fff2d2" opacity="0.75">
        <rect x="90" y="54" width="8" height="1.5" />
        <rect x="90" y="57" width="8" height="1.5" />
        <rect x="90" y="60" width="8" height="1.5" />
        <rect x="90" y="63" width="8" height="1.5" />
      </g>
      <path
        d="M84 59 H104"
        stroke="#71e0c0"
        stroke-width="1.5"
        stroke-dasharray="2 2"
        fill="none"
      />

      {/* Non-interactive area labels */}
      <text x="17" y="108" className="venue-map__label venue-map__label--sea" text-anchor="middle">
        MED. SEA
      </text>
      <text x="62" y="108" className="venue-map__label" text-anchor="middle">
        OLD JAFFA
      </text>
      <text
        x="94"
        y="18"
        className="venue-map__street-label"
        text-anchor="middle"
        transform="rotate(-90 94 18)"
      >
        HAZORFIM ST
      </text>
      <text
        x="151.5"
        y="22"
        className="venue-map__street-label"
        text-anchor="middle"
        transform="rotate(-90 151.5 22)"
      >
        YEFET ST
      </text>

      {/*Compass badge in top-left over the sea*/}
      <g transform="translate(6 6)">
        <rect x="0" y="0" width="16" height="18" fill="#091529" stroke="#2d63a6" stroke-width="1" />
        {/* Crisp upward pixel arrow ▲ */}
        <rect x="7" y="2" width="2" height="2" fill="#ffc857" />
        <rect x="6" y="4" width="4" height="2" fill="#ffc857" />
        <rect x="5" y="6" width="6" height="2" fill="#ffc857" />
        <text x="8" y="15" className="venue-map__north" text-anchor="middle">
          N
        </text>
      </g>

      {/* =====================================================================
          CLICKABLE HOTSPOT 1: CONSUL HOUSE (West side of HaZorfim St, #15)
          Overlooking the Mediterranean Sea
      ===================================================================== */}
      <a
        href={venueMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="venue-map__hotspot venue-map__hotspot--venue"
        aria-label="Open Consul House (HaZorfim 15, Jaffa) in Google Maps"
      >
        <title>Click to open Consul House (HaZorfim 15, Jaffa) in Google Maps</title>

        {/* Transparent hit target covering label + building */}
        <rect x="40" y="20" width="47" height="62" fill="transparent" />

        {/* Label pill above Consul House */}
        <rect
          x="41"
          y="21"
          width="45"
          height="12"
          fill="#1b1136"
          stroke="#f2799b"
          stroke-width="1"
          className="venue-map__hotspot-pill"
        />
        <text x="63.5" y="26.5" className="venue-map__hotspot-title" text-anchor="middle">
          CONSUL HOUSE
        </text>
        <text x="63.5" y="31" className="venue-map__hotspot-subtitle" text-anchor="middle">
          HAZORFIM 15 &gt;
        </text>

        {/* Historic 1845 courtyard & terrace building */}
        <rect
          x="42"
          y="36"
          width="42"
          height="42"
          fill="#24164a"
          stroke="#f2799b"
          stroke-width="1.5"
          className="venue-map__building-box"
        />

        {/* Sea-view western terrace with golden fairy lights */}
        <rect x="44" y="38" width="12" height="38" fill="#1b1038" stroke="#4b2f78" stroke-width="1" />
        <g fill="#ffc857">
          <rect x="46" y="41" width="2" height="2" />
          <rect x="46" y="49" width="2" height="2" />
          <rect x="46" y="57" width="2" height="2" />
          <rect x="46" y="65" width="2" height="2" />
          <rect x="46" y="72" width="2" height="2" />
        </g>

        {/* Rooftop Chuppah canopy & couple sprites */}
        <rect x="59" y="41" width="20" height="18" fill="#2d1b59" stroke="#fff2d2" stroke-width="1" />
        <rect x="59" y="41" width="20" height="3.5" fill="#f2799b" />
        <g fill="#ffc857">
          <rect x="58" y="40" width="2" height="2" />
          <rect x="78" y="40" width="2" height="2" />
          <rect x="58" y="58" width="2" height="2" />
          <rect x="78" y="58" width="2" height="2" />
        </g>
        {/* Couple pixel sprites under the chuppah */}
        <rect x="65" y="49" width="3" height="5" fill="#fff2d2" />
        <rect x="70" y="49" width="3" height="5" fill="#71e0c0" />
        <rect x="65" y="47" width="3" height="2" fill="#ffc857" />
        <rect x="70" y="47" width="3" height="2" fill="#f2799b" />

        {/* Ottoman stone arches along the eastern entrance on HaZorfim 15 */}
        <rect x="59" y="63" width="20" height="11" fill="#1a1033" />
        <rect x="61" y="65" width="4" height="7" fill="#ffc857" />
        <rect x="67" y="65" width="4" height="7" fill="#ffc857" />
        <rect x="73" y="65" width="4" height="7" fill="#ffc857" />
        {/* Entrance gate on HaZorfim St */}
        <rect x="82" y="56" width="3" height="6" fill="#71e0c0" />

        {/* Bobbing Pixel Heart Pin on Consul House */}
        <g className="venue-map__pin">
          <g fill="#ffc857">
            <rect x="50" y="47" width="2" height="1" />
            <rect x="54" y="47" width="2" height="1" />
            <rect x="49" y="48" width="8" height="2" />
            <rect x="50" y="50" width="6" height="1" />
            <rect x="51" y="51" width="4" height="1" />
            <rect x="52" y="52" width="2" height="1" />
          </g>
        </g>
      </a>

      {/* =====================================================================
          CLICKABLE HOTSPOT 2: HAZORFIM PARKING LOT (East side of HaZorfim St, #15A)
          Inland between HaZorfim St & Yefet St
      ===================================================================== */}
      <a
        href={parkingMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="venue-map__hotspot venue-map__hotspot--parking"
        aria-label="Open HaZorfim Parking Lot (HaZorfim 15A, Jaffa) in Google Maps"
      >
        <title>Click to open HaZorfim Parking Lot (חניון הצורפים) in Google Maps</title>

        {/* Transparent hit target */}
        <rect x="102" y="30" width="42" height="48" fill="transparent" />

        {/* Label pill above Parking Lot */}
        <rect
          x="103"
          y="31"
          width="40"
          height="12"
          fill="#1b1136"
          stroke="#71e0c0"
          stroke-width="1"
          className="venue-map__hotspot-pill"
        />
        <text x="123" y="36.5" className="venue-map__hotspot-title venue-map__hotspot-title--mint" text-anchor="middle">
          PARKING LOT
        </text>
        <text x="123" y="41" className="venue-map__hotspot-subtitle" text-anchor="middle">
          HAZORFIM 15A &gt;
        </text>

        {/* Parking lot surface & bays */}
        <rect
          x="104"
          y="46"
          width="38"
          height="28"
          fill="#191230"
          stroke="#71e0c0"
          stroke-width="1.5"
          className="venue-map__building-box"
        />

        {/* Parking bay lines */}
        <g fill="#4b2f78">
          <rect x="107" y="48" width="1" height="7" />
          <rect x="113" y="48" width="1" height="7" />
          <rect x="119" y="48" width="1" height="7" />
          <rect x="125" y="48" width="1" height="7" />
          <rect x="131" y="48" width="1" height="7" />
          <rect x="137" y="48" width="1" height="7" />

          <rect x="107" y="65" width="1" height="7" />
          <rect x="113" y="65" width="1" height="7" />
          <rect x="119" y="65" width="1" height="7" />
          <rect x="125" y="65" width="1" height="7" />
          <rect x="131" y="65" width="1" height="7" />
          <rect x="137" y="65" width="1" height="7" />
        </g>

        {/* Little pixel cars parked in bays */}
        <rect x="109" y="49" width="3" height="5" fill="#f2799b" />
        <rect x="127" y="49" width="3" height="5" fill="#b89cff" />
        <rect x="115" y="66" width="3" height="5" fill="#71e0c0" />
        <rect x="133" y="66" width="3" height="5" fill="#ffc857" />

        {/* Central [ P ] badge inside the lot */}
        <rect x="117" y="54" width="12" height="11" fill="#0b0618" stroke="#ffc857" stroke-width="1" />
        <text x="123" y="62" className="venue-map__parking-label" text-anchor="middle">
          P
        </text>
      </a>
    </svg>
  );
}
