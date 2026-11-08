import type { LoveGameSceneType } from '../../types/wedding.ts';

interface LoveGameDioramaSvgProps {
  readonly sceneType: LoveGameSceneType;
  readonly isActionActive: boolean;
  readonly onTriggerAction: () => void;
}

/**
 * Reusable pixel-art sprite for Sir Muggi (Knight-Officer in steel & gold pauldrons).
 */
function SirMuggiSprite({ x, y, raiseArm = false }: { x: number; y: number; raiseArm?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {/* Officer royal plume */}
      <rect x="3" y="-3" width="4" height="2" fill="#71e0c0" />
      <rect x="2" y="-1" width="6" height="2" fill="#ffc857" />
      {/* Head & face */}
      <rect x="2" y="1" width="6" height="5" fill="#ffd7b5" />
      <rect x="2" y="1" width="6" height="1.5" fill="#4a2e1b" />
      <rect x="6" y="3" width="1" height="1" fill="#08040f" />
      {/* Knight armor & gold officer pauldrons */}
      <rect x="0" y="6" width="10" height="3" fill="#ffc857" />
      <rect x="1" y="7" width="8" height="7" fill="#3a506b" />
      <rect x="3" y="8" width="4" height="4" fill="#71e0c0" />
      {/* Raised goblet or sword arm */}
      {raiseArm ? (
        <g>
          <rect x="9" y="3" width="2" height="5" fill="#3a506b" />
          <rect x="9" y="0" width="3" height="3" fill="#ffc857" />
        </g>
      ) : (
        <rect x="9" y="7" width="2" height="5" fill="#3a506b" />
      )}
      {/* Boots */}
      <rect x="2" y="14" width="2.5" height="4" fill="#1b1136" />
      <rect x="5.5" y="14" width="2.5" height="4" fill="#1b1136" />
    </g>
  );
}

/**
 * Reusable pixel-art sprite for Lady Gili (Royal Recruit / Spellweaver).
 */
function LadyGiliSprite({ x, y, raiseArm = false }: { x: number; y: number; raiseArm?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {/* Crown / diadem */}
      <rect x="3" y="-2" width="4" height="2" fill="#ffc857" />
      {/* Hair & face */}
      <rect x="1" y="0" width="8" height="6" fill="#5c3118" />
      <rect x="2" y="1" width="6" height="5" fill="#ffe0c4" />
      <rect x="3" y="3" width="1" height="1" fill="#08040f" />
      {/* Medieval tunic & rose cloak */}
      <rect x="0" y="6" width="10" height="3" fill="#f2799b" />
      <rect x="1" y="7" width="8" height="7" fill="#b93d68" />
      <rect x="3" y="8" width="4" height="5" fill="#fff2d2" />
      {raiseArm ? (
        <g>
          <rect x="-1" y="3" width="2" height="5" fill="#f2799b" />
          <rect x="-2" y="0" width="3" height="3" fill="#ffc857" />
        </g>
      ) : (
        <rect x="-1" y="7" width="2" height="5" fill="#f2799b" />
      )}
      {/* Boots */}
      <rect x="2" y="14" width="2.5" height="4" fill="#24164a" />
      <rect x="5.5" y="14" width="2.5" height="4" fill="#24164a" />
    </g>
  );
}

/**
 * Reusable pixel-art flying dragon with rider.
 */
function PixelDragonWithRider({
  x,
  y,
  bodyColor,
  wingColor,
  riderColor,
  flip = false,
  breatheFire = false,
}: {
  x: number;
  y: number;
  bodyColor: string;
  wingColor: string;
  riderColor: string;
  flip?: boolean;
  breatheFire?: boolean;
}) {
  return (
    <g
      transform={`translate(${x} ${y})${flip ? ' scale(-1, 1)' : ''}`}
      className="love-scene__dragon"
    >
      {/* Wing */}
      <g className="love-scene__dragon-wing">
        <rect x="10" y="-10" width="14" height="4" fill={wingColor} />
        <rect x="8" y="-6" width="18" height="6" fill={wingColor} />
      </g>
      {/* Tail */}
      <rect x="-10" y="4" width="10" height="3" fill={bodyColor} />
      <rect x="-14" y="2" width="5" height="3" fill={bodyColor} />
      {/* Body */}
      <rect x="0" y="0" width="24" height="8" fill={bodyColor} />
      <rect x="4" y="6" width="16" height="3" fill="#ffc857" />
      {/* Neck & Head */}
      <rect x="22" y="-5" width="6" height="7" fill={bodyColor} />
      <rect x="26" y="-7" width="9" height="5" fill={bodyColor} />
      <rect x="25" y="-9" width="3" height="2" fill="#ffc857" />
      <rect x="31" y="-6" width="1.5" height="1.5" fill="#fff2d2" />
      {/* Rider on saddle */}
      <rect x="11" y="-8" width="5" height="5" fill={riderColor} />
      <rect x="11" y="-11" width="5" height="3" fill="#ffd7b5" />
      <rect x="11" y="-13" width="5" height="2" fill="#ffc857" />
      {/* Fire breath when action active */}
      {breatheFire && (
        <g className="love-scene__fire">
          <rect x="36" y="-6" width="6" height="3" fill="#ffc857" />
          <rect x="42" y="-8" width="8" height="6" fill="#ff7196" />
          <rect x="50" y="-9" width="6" height="8" fill="#ffc857" />
        </g>
      )}
    </g>
  );
}

/**
 * Pixel heart particle cluster when the player triggers a stage action.
 */
function CelebrationHearts({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} className="love-scene__hearts">
      <g fill="#f2799b">
        <rect x="1" y="0" width="2" height="1" />
        <rect x="5" y="0" width="2" height="1" />
        <rect x="0" y="1" width="8" height="2" />
        <rect x="1" y="3" width="6" height="1" />
        <rect x="2" y="4" width="4" height="1" />
        <rect x="3" y="5" width="2" height="1" />
      </g>
      <g fill="#ffc857" transform="translate(-16 -6)">
        <rect x="1" y="0" width="2" height="1" />
        <rect x="5" y="0" width="2" height="1" />
        <rect x="0" y="1" width="8" height="2" />
        <rect x="1" y="3" width="6" height="1" />
        <rect x="2" y="4" width="4" height="1" />
        <rect x="3" y="5" width="2" height="1" />
      </g>
      <g fill="#71e0c0" transform="translate(16 -5)">
        <rect x="1" y="0" width="2" height="1" />
        <rect x="5" y="0" width="2" height="1" />
        <rect x="0" y="1" width="8" height="2" />
        <rect x="1" y="3" width="6" height="1" />
        <rect x="2" y="4" width="4" height="1" />
        <rect x="3" y="5" width="2" height="1" />
      </g>
    </g>
  );
}

/**
 * Single-responsibility pixel-art medieval scene renderer for all 7 chapters
 * of Muggi & Gili's Love Game.
 */
export function LoveGameDioramaSvg({
  sceneType,
  isActionActive,
  onTriggerAction,
}: LoveGameDioramaSvgProps) {
  return (
    <svg
      className={`love-scene__svg${isActionActive ? ' is-action-active' : ''}`}
      viewBox="0 0 240 135"
      role="img"
      aria-label="Animated pixel-art medieval scene of Muggi and Gili's love story"
      shape-rendering="crispEdges"
      onClick={onTriggerAction}
    >
      {/* Sky backdrop */}
      <rect width="240" height="135" fill="#0b0618" />

      {/* Twinkling background stars */}
      <g fill="#fff2d2" opacity="0.75">
        <rect x="18" y="12" width="2" height="2" />
        <rect x="52" y="20" width="2" height="2" />
        <rect x="94" y="10" width="2" height="2" />
        <rect x="148" y="16" width="2" height="2" />
        <rect x="192" y="11" width="2" height="2" />
        <rect x="220" y="24" width="2" height="2" />
      </g>

      {/* ===================================================================
          SCENE 1: TAVERN FEAST (Officer Muggi & Recruit Gili meet at a party)
      =================================================================== */}
      {sceneType === 'tavern-feast' && (
        <g>
          {/* Medieval castle stone hall interior */}
          <rect x="10" y="14" width="220" height="96" fill="#1b1136" stroke="#4b2f78" stroke-width="2" />
          {/* Stone brick pattern */}
          <g fill="#24164a">
            <rect x="18" y="20" width="24" height="8" />
            <rect x="48" y="20" width="24" height="8" />
            <rect x="168" y="20" width="24" height="8" />
            <rect x="198" y="20" width="24" height="8" />
          </g>
          {/* Royal banners */}
          <polygon points="34,16 50,16 50,48 42,42 34,48" fill="#b93d68" />
          <rect x="40" y="22" width="4" height="12" fill="#ffc857" />
          <polygon points="190,16 206,16 206,48 198,42 190,48" fill="#1e5c4e" />
          <rect x="196" y="22" width="4" height="12" fill="#ffc857" />

          {/* Arched medieval window at center */}
          <rect x="104" y="22" width="32" height="34" fill="#091529" stroke="#ffc857" stroke-width="2" />
          <rect x="116" y="28" width="8" height="8" fill="#ffc857" opacity="0.85" />

          {/* Flickering wall torches */}
          <g className="love-scene__torches">
            <rect x="68" y="40" width="3" height="8" fill="#8b5a2b" />
            <rect x="67" y="34" width="5" height="6" fill="#ff7196" />
            <rect x="68" y="35" width="3" height="4" fill="#ffc857" />

            <rect x="169" y="40" width="3" height="8" fill="#8b5a2b" />
            <rect x="168" y="34" width="5" height="6" fill="#ff7196" />
            <rect x="169" y="35" width="3" height="4" fill="#ffc857" />
          </g>

          {/* Banquet hall floor */}
          <rect x="10" y="94" width="220" height="28" fill="#2c1b47" />

          {/* Long wooden medieval feast table */}
          <rect x="54" y="86" width="132" height="8" fill="#8b5a2b" />
          <rect x="62" y="94" width="6" height="12" fill="#5c3a1a" />
          <rect x="172" y="94" width="6" height="12" fill="#5c3a1a" />
          {/* Golden goblets & feast platter */}
          <rect x="92" y="81" width="4" height="5" fill="#ffc857" />
          <rect x="144" y="81" width="4" height="5" fill="#ffc857" />
          <rect x="114" y="82" width="12" height="4" fill="#f2799b" />

          {/* Sir Muggi (LVL 20 Officer) & Lady Gili (LVL 19 Recruit) */}
          <SirMuggiSprite x={isActionActive ? 98 : 76} y={68} raiseArm={isActionActive} />
          <LadyGiliSprite x={isActionActive ? 132 : 154} y={68} raiseArm={isActionActive} />

          {/* Role tags */}
          <text x="58" y="62" className="love-scene__tag love-scene__tag--mint">
            SIR MUGGI (20)
          </text>
          <text x="150" y="62" className="love-scene__tag love-scene__tag--rose">
            LADY GILI (19)
          </text>

          {isActionActive && <CelebrationHearts x={116} y={50} />}
        </g>
      )}

      {/* ===================================================================
          SCENE 2: FIRST ALLIANCE (Years together in the Kingdom)
      =================================================================== */}
      {sceneType === 'first-alliance' && (
        <g>
          {/* Crescent moon */}
          <rect x="190" y="16" width="14" height="14" fill="#ffc857" />
          <rect x="195" y="16" width="9" height="10" fill="#0b0618" />

          {/* Distant rolling hills & kingdom watchtowers */}
          <polygon points="0,95 45,62 95,95" fill="#162822" />
          <polygon points="75,95 135,56 195,95" fill="#1d352d" />
          <polygon points="155,95 205,66 240,95" fill="#162822" />

          {/* Watchtower silhouette */}
          <rect x="40" y="48" width="12" height="22" fill="#24164a" stroke="#4b2f78" stroke-width="1" />
          <rect x="44" y="53" width="4" height="5" fill="#ffc857" />

          {/* Cobblestone kingdom road */}
          <rect x="0" y="92" width="240" height="30" fill="#1d3128" />
          <rect x="0" y="98" width="240" height="14" fill="#3b2d54" />
          <path d="M4 105 H236" stroke="#ffc857" stroke-width="1.5" stroke-dasharray="5 5" />

          {/* Warm campfire in the center */}
          <rect x="114" y="93" width="12" height="3" fill="#8b5a2b" />
          <rect x="116" y="86" width="8" height="7" fill="#ff7196" />
          <rect x="118" y="88" width="4" height="5" fill="#ffc857" />

          {/* Heroes side by side */}
          <SirMuggiSprite x={isActionActive ? 100 : 90} y={80} raiseArm={isActionActive} />
          <LadyGiliSprite x={isActionActive ? 130 : 140} y={80} raiseArm={isActionActive} />

          {isActionActive && <CelebrationHearts x={116} y={56} />}
        </g>
      )}

      {/* ===================================================================
          SCENE 3: TWIN DRAGONS (Flying separately across South America)
      =================================================================== */}
      {sceneType === 'twin-dragons' && (
        <g>
          {/* Andean mountain peaks & stepped jungle pyramids of South America */}
          <polygon points="0,115 38,54 78,115" fill="#1e2f4d" />
          <polygon points="30,66 38,54 46,66" fill="#fff2d2" />
          <polygon points="58,115 110,48 162,115" fill="#2a1d49" />
          <polygon points="101,60 110,48 119,60" fill="#fff2d2" />

          {/* Ancient stepped jungle temple on the right */}
          <rect x="168" y="96" width="52" height="18" fill="#234736" />
          <rect x="176" y="84" width="36" height="12" fill="#2e5c46" />
          <rect x="184" y="72" width="20" height="12" fill="#3f8a5f" />
          <rect x="191" y="66" width="6" height="6" fill="#ffc857" />

          {/* Ocean & Southern Continent horizon */}
          <rect x="0" y="110" width="240" height="16" fill="#102a4f" />

          {/* Sir Muggi on the Emerald Wyvern (upper left sky) */}
          <PixelDragonWithRider
            x={isActionActive ? 54 : 38}
            y={38}
            bodyColor="#2eb88a"
            wingColor="#71e0c0"
            riderColor="#3a506b"
            breatheFire={isActionActive}
          />
          <text x="24" y="20" className="love-scene__tag love-scene__tag--mint">
            MUGGI&apos;S WYVERN · ANDES
          </text>

          {/* Lady Gili on the Crimson Dragon (lower right sky, flying to a different realm of South America) */}
          <PixelDragonWithRider
            x={isActionActive ? 148 : 162}
            y={56}
            bodyColor="#d94c7a"
            wingColor="#f2799b"
            riderColor="#b93d68"
            breatheFire={isActionActive}
          />
          <text x="136" y="28" className="love-scene__tag love-scene__tag--rose">
            GILI&apos;S DRAGON · SELVAS
          </text>

          {/* Golden destiny thread connecting both dragons when action is triggered */}
          {isActionActive && (
            <g>
              <path
                d="M78 40 Q118 28 152 54"
                stroke="#ffc857"
                stroke-width="1.5"
                stroke-dasharray="3 3"
                fill="none"
              />
              <CelebrationHearts x={114} y={18} />
            </g>
          )}
        </g>
      )}

      {/* ===================================================================
          SCENE 4: REKINDLED FLAME (Return to Israel & falling in love again)
      =================================================================== */}
      {sceneType === 'rekindled-flame' && (
        <g>
          {/* Ancient stone archway of the Homeland */}
          <rect x="64" y="28" width="16" height="72" fill="#3b2d54" stroke="#ffc857" stroke-width="1.5" />
          <rect x="160" y="28" width="16" height="72" fill="#3b2d54" stroke="#ffc857" stroke-width="1.5" />
          <rect x="58" y="20" width="124" height="12" fill="#4b2f78" stroke="#ffc857" stroke-width="1.5" />

          {/* Resting dragons perched on the outer columns */}
          <PixelDragonWithRider
            x={18}
            y={74}
            bodyColor="#2eb88a"
            wingColor="#71e0c0"
            riderColor="#2eb88a"
          />
          <PixelDragonWithRider
            x={222}
            y={74}
            bodyColor="#d94c7a"
            wingColor="#f2799b"
            riderColor="#d94c7a"
            flip
          />

          {/* Ground courtyard */}
          <rect x="0" y="98" width="240" height="24" fill="#24164a" />

          {/* Giant glowing pixel heart in the arch center */}
          <g transform="translate(108 40) scale(3)">
            <g fill={isActionActive ? '#ffc857' : '#f2799b'}>
              <rect x="1" y="0" width="2" height="1" />
              <rect x="5" y="0" width="2" height="1" />
              <rect x="0" y="1" width="8" height="2" />
              <rect x="1" y="3" width="6" height="1" />
              <rect x="2" y="4" width="4" height="1" />
              <rect x="3" y="5" width="2" height="1" />
            </g>
          </g>

          {/* Muggi & Gili reuniting in the center */}
          <SirMuggiSprite x={isActionActive ? 106 : 92} y={80} raiseArm={isActionActive} />
          <LadyGiliSprite x={isActionActive ? 124 : 138} y={80} raiseArm={isActionActive} />

          {isActionActive && <CelebrationHearts x={116} y={28} />}
        </g>
      )}

      {/* ===================================================================
          SCENE 5: CASTLE I — THE NORTHERN CITADEL (North Tel Aviv)
      =================================================================== */}
      {sceneType === 'castle-north' && (
        <g>
          {/* Sea & Yarkon River along the front */}
          <rect x="0" y="98" width="240" height="24" fill="#102a4f" />
          <rect x="0" y="92" width="240" height="8" fill="#1f4d3a" />

          {/* White-stone Northern Citadel */}
          <rect x="68" y="44" width="104" height="50" fill="#3a2c59" stroke="#71e0c0" stroke-width="2" />
          {/* Left & right battlement towers */}
          <rect x="56" y="30" width="24" height="64" fill="#4b3870" stroke="#71e0c0" stroke-width="1.5" />
          <rect x="160" y="30" width="24" height="64" fill="#4b3870" stroke="#71e0c0" stroke-width="1.5" />
          {/* Crenellations */}
          <g fill="#71e0c0">
            <rect x="56" y="26" width="5" height="4" />
            <rect x="65" y="26" width="5" height="4" />
            <rect x="75" y="26" width="5" height="4" />
            <rect x="160" y="26" width="5" height="4" />
            <rect x="169" y="26" width="5" height="4" />
            <rect x="179" y="26" width="5" height="4" />
          </g>

          {/* Flagpole & hoisting royal M&G banner */}
          <rect x="119" y="14" width="2" height="30" fill="#fff2d2" />
          <rect
            x="121"
            y={isActionActive ? 15 : 26}
            width="24"
            height="10"
            fill="#f2799b"
          />
          <text x="133" y={isActionActive ? 22 : 33} className="love-scene__banner-text" text-anchor="middle">
            M&amp;G
          </text>

          {/* Castle gate & glowing windows */}
          <rect x="108" y="68" width="24" height="26" fill="#1b1136" stroke="#ffc857" stroke-width="1.5" />
          <rect x="82" y="54" width="10" height="12" fill="#ffc857" />
          <rect x="148" y="54" width="10" height="12" fill="#ffc857" />

          <SirMuggiSprite x={98} y={78} raiseArm={isActionActive} />
          <LadyGiliSprite x={132} y={78} raiseArm={isActionActive} />

          <text x="120" y="112" className="love-scene__tag love-scene__tag--mint" text-anchor="middle">
            CASTLE I · NORTHERN TEL AVIV CITADEL
          </text>

          {isActionActive && <CelebrationHearts x={116} y={36} />}
        </g>
      )}

      {/* ===================================================================
          SCENE 6: CASTLE II — THE KEEP OF KING GEORGE (King George St.)
      =================================================================== */}
      {sceneType === 'castle-king-george' && (
        <g>
          {/* Bustling royal avenue ground */}
          <rect x="0" y="96" width="240" height="26" fill="#25173d" />

          {/* Flanking medieval market stalls on King George */}
          <rect x="18" y="72" width="32" height="24" fill="#382257" stroke="#ffc857" stroke-width="1" />
          <rect x="16" y="66" width="36" height="6" fill="#f2799b" />
          <rect x="190" y="72" width="32" height="24" fill="#382257" stroke="#ffc857" stroke-width="1" />
          <rect x="188" y="66" width="36" height="6" fill="#71e0c0" />

          {/* Grand Central Keep of King George */}
          <rect x="64" y="28" width="112" height="68" fill="#2f1d4f" stroke="#b89cff" stroke-width="2" />
          {/* Royal Golden Crown emblem atop the Keep */}
          <polygon points="102,28 106,16 114,23 120,14 126,23 134,16 138,28" fill="#ffc857" />

          {/* Windows that light up brightly */}
          <g fill={isActionActive ? '#ffc857' : '#8b6a35'}>
            <rect x="76" y="38" width="10" height="12" />
            <rect x="96" y="38" width="10" height="12" />
            <rect x="134" y="38" width="10" height="12" />
            <rect x="154" y="38" width="10" height="12" />
            <rect x="76" y="58" width="10" height="12" />
            <rect x="154" y="58" width="10" height="12" />
          </g>

          {/* Keep archway */}
          <rect x="106" y="64" width="28" height="32" fill="#140b24" stroke="#ffc857" stroke-width="1.5" />

          <SirMuggiSprite x={104} y={78} raiseArm={isActionActive} />
          <LadyGiliSprite x={126} y={78} raiseArm={isActionActive} />

          <text x="120" y="112" className="love-scene__tag love-scene__tag--gold" text-anchor="middle">
            CASTLE II · THE KEEP OF KING GEORGE
          </text>

          {isActionActive && <CelebrationHearts x={116} y={32} />}
        </g>
      )}

      {/* ===================================================================
          SCENE 7: CASTLE III — STRONGHOLD OF MASARYK SQUARE
      =================================================================== */}
      {sceneType === 'castle-masaryk' && (
        <g>
          {/* Lush green Masaryk Square courtyard */}
          <rect x="0" y="94" width="240" height="28" fill="#183328" />

          {/* Sanctuary Castle of Masaryk Square in the background */}
          <rect x="52" y="24" width="136" height="70" fill="#2d1a47" stroke="#f2799b" stroke-width="2" />
          <rect x="44" y="18" width="24" height="76" fill="#3c235e" stroke="#f2799b" stroke-width="1.5" />
          <rect x="172" y="18" width="24" height="76" fill="#3c235e" stroke="#f2799b" stroke-width="1.5" />
          {/* Pointed fairy-tale roofs */}
          <polygon points="42,18 56,4 70,18" fill="#f2799b" />
          <polygon points="170,18 184,4 198,18" fill="#f2799b" />

          {/* Warm windows */}
          <g fill="#ffc857">
            <rect x="80" y="34" width="12" height="14" />
            <rect x="114" y="34" width="12" height="14" />
            <rect x="148" y="34" width="12" height="14" />
          </g>

          {/* Iconic Masaryk Square Trees */}
          <g fill="#3f8a5f">
            <rect x="16" y="64" width="18" height="18" />
            <rect x="23" y="82" width="4" height="12" fill="#5c3a1a" />
            <rect x="206" y="64" width="18" height="18" />
            <rect x="213" y="82" width="4" height="12" fill="#5c3a1a" />
          </g>

          {/* Iconic Enchanted Fountain of Masaryk Square */}
          <rect x="96" y="86" width="48" height="10" fill="#564373" stroke="#fff2d2" stroke-width="1" />
          <rect x="102" y="82" width="36" height="5" fill="#2d63a6" />
          <rect x="117" y="72" width="6" height="12" fill="#8ec5ff" />
          <rect x="111" y="75" width="18" height="3" fill="#71e0c0" />

          {/* Heroes flanking the Masaryk Fountain */}
          <SirMuggiSprite x={76} y={76} raiseArm={isActionActive} />
          <LadyGiliSprite x={154} y={76} raiseArm={isActionActive} />

          <text x="120" y="112" className="love-scene__tag love-scene__tag--rose" text-anchor="middle">
            CASTLE III · MASARYK SQUARE -&gt; JAFFA 19.05.2027
          </text>

          {isActionActive && <CelebrationHearts x={116} y={24} />}
        </g>
      )}
    </svg>
  );
}
