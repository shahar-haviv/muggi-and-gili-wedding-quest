import * as THREE from 'three';
import { PIXEL_PALETTE } from './pixelPalette.ts';
import { createEnvironmentTextures } from './createEnvironmentTextures.ts';
import {
  CHARACTER_PALETTES,
  createCharacterSpriteTexture,
  createGuestPalette,
  type CharacterArchetype,
  type CharacterPalette,
} from './createCharacterSprite.ts';
import { createSeededRandom } from './createPixelTexture.ts';

const ISLAND_WIDTH = 16;
const ISLAND_DEPTH = 12;
const CHUPPAH_X = 0;
const CHUPPAH_Z = -2.9;
const DANCE_FLOOR_X = 0;
const DANCE_FLOOR_Z = 2.2;

export interface WeddingDioramaOptions {
  readonly scene: THREE.Scene;
  readonly isCompactViewport?: boolean;
  readonly reducedMotion?: boolean;
}

export interface WeddingDioramaHandle {
  readonly update: (
    deltaSeconds: number,
    elapsedSeconds: number,
    incomingCelebrationEnergy?: number,
  ) => void;
  readonly triggerCelebration: () => void;
  readonly dispose: () => void;
}

interface BoxConfig {
  readonly width: number;
  readonly height: number;
  readonly depth: number;
  readonly colour?: number;
  readonly x?: number;
  readonly y?: number;
  readonly z?: number;
  readonly material?: THREE.Material;
  readonly rotationY?: number;
  readonly isDynamic?: boolean;
}

interface AnimatedCharacter {
  readonly sprite: THREE.Sprite;
  readonly phase: number;
  readonly danceAmount: number;
  readonly baseHeight: number;
}

interface FloatingHeart {
  readonly sprite: THREE.Sprite;
  speed: number;
  readonly drift: number;
  readonly phase: number;
  baseX: number;
  baseScale: number;
}

interface PulsingBulb {
  readonly mesh: THREE.Mesh;
  readonly phase: number;
  readonly baseScaleVector: THREE.Vector3;
}

interface DriftingFirefly {
  readonly mesh: THREE.Mesh;
  readonly anchorX: number;
  readonly anchorZ: number;
  readonly radius: number;
  readonly speed: number;
  readonly phase: number;
}

export function buildWeddingDiorama({
  scene,
  isCompactViewport = false,
  reducedMotion = false,
}: WeddingDioramaOptions): WeddingDioramaHandle {
  const textures = createEnvironmentTextures();
  const world = new THREE.Group();
  scene.add(world);

  const unitBoxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const contactShadowGeometry = new THREE.CircleGeometry(1, 12);
  const contactShadowMaterial = new THREE.MeshBasicMaterial({
    color: 0x05020a,
    transparent: true,
    opacity: 0.3,
    depthWrite: false,
    toneMapped: false,
  });

  const flatLambertMaterials = new Map<number, THREE.MeshLambertMaterial>();
  const flatBasicMaterials = new Map<string, THREE.MeshBasicMaterial>();
  const animatedCharacters: AnimatedCharacter[] = [];
  const floatingHearts: FloatingHeart[] = [];
  const pulsingBulbs: PulsingBulb[] = [];
  const driftingFireflies: DriftingFirefly[] = [];

  let canopyMesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial> | null = null;
  let starField: THREE.Points | null = null;
  let chuppahLight: THREE.PointLight | null = null;
  let danceFloorLight: THREE.PointLight | null = null;
  let celebrationEnergy = 0;

  function getLambertMaterial(colour: number = PIXEL_PALETTE.cream): THREE.MeshLambertMaterial {
    if (!flatLambertMaterials.has(colour)) {
      flatLambertMaterials.set(colour, new THREE.MeshLambertMaterial({ color: colour }));
    }
    return flatLambertMaterials.get(colour)!;
  }

  function getBasicMaterial(
    colour: number,
    options: THREE.MeshBasicMaterialParameters = {},
  ): THREE.MeshBasicMaterial {
    const cacheKey = `${colour}:${JSON.stringify(options)}`;
    if (!flatBasicMaterials.has(cacheKey)) {
      flatBasicMaterials.set(
        cacheKey,
        new THREE.MeshBasicMaterial({ color: colour, toneMapped: false, ...options }),
      );
    }
    return flatBasicMaterials.get(cacheKey)!;
  }

  function addBox(
    parent: THREE.Object3D,
    {
      width,
      height,
      depth,
      colour = PIXEL_PALETTE.cream,
      x = 0,
      y = 0,
      z = 0,
      material,
      rotationY = 0,
      isDynamic = false,
    }: BoxConfig,
  ): THREE.Mesh {
    const mesh = new THREE.Mesh(unitBoxGeometry, material ?? getLambertMaterial(colour));
    mesh.scale.set(width, height, depth);
    mesh.position.set(x, y, z);
    mesh.rotation.y = rotationY;
    if (!isDynamic) {
      mesh.updateMatrix();
      mesh.matrixAutoUpdate = false;
    }
    parent.add(mesh);
    return mesh;
  }

  function addContactShadow(x: number, z: number, radius: number): void {
    const shadow = new THREE.Mesh(contactShadowGeometry, contactShadowMaterial);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.set(x, 0.045, z);
    shadow.scale.set(radius, radius, 1);
    shadow.updateMatrix();
    shadow.matrixAutoUpdate = false;
    world.add(shadow);
  }

  function addSpriteCharacter({
    archetype,
    palette,
    x,
    z,
    height,
    phase,
    danceAmount = 0,
  }: {
    readonly archetype: CharacterArchetype;
    readonly palette: CharacterPalette;
    readonly x: number;
    readonly z: number;
    readonly height: number;
    readonly phase: number;
    readonly danceAmount?: number;
  }): THREE.Sprite {
    const maskTexture = createCharacterSpriteTexture({ archetype, palette });
    const spriteMaterial = new THREE.SpriteMaterial({
      map: maskTexture,
      alphaTest: 0.5,
      transparent: false,
      depthWrite: true,
      toneMapped: false,
    });
    const characterSprite = new THREE.Sprite(spriteMaterial);
    characterSprite.center.set(0.5, 0);
    characterSprite.scale.set(height * (14 / 22), height, 1);
    characterSprite.position.set(x, 0.055, z);
    world.add(characterSprite);
    addContactShadow(x, z, height * 0.25);

    animatedCharacters.push({
      sprite: characterSprite,
      phase,
      danceAmount,
      baseHeight: 0.055,
    });

    return characterSprite;
  }

  const skyMaterial = new THREE.ShaderMaterial({
    uniforms: {
      topColor: { value: new THREE.Color(PIXEL_PALETTE.skyTop) },
      horizonColor: { value: new THREE.Color(PIXEL_PALETTE.skyHorizon) },
      glowColor: { value: new THREE.Color(PIXEL_PALETTE.skyGlow) },
    },
    vertexShader: /* glsl */ `
      varying vec3 vSkyDirection;

      void main() {
        vSkyDirection = normalize(position);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 topColor;
      uniform vec3 horizonColor;
      uniform vec3 glowColor;
      varying vec3 vSkyDirection;

      void main() {
        float heightMix = smoothstep(-0.08, 0.7, vSkyDirection.y);
        vec3 skyColour = mix(horizonColor, topColor, heightMix);

        float glowBand = smoothstep(0.0, 0.25, vSkyDirection.y)
          * (1.0 - smoothstep(0.28, 0.72, vSkyDirection.y));
        skyColour = mix(skyColour, glowColor, glowBand * 0.34);

        gl_FragColor = vec4(skyColour, 1.0);
      }
    `,
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
  });

  const skyDome = new THREE.Mesh(new THREE.SphereGeometry(48, 14, 10), skyMaterial);
  skyDome.updateMatrix();
  skyDome.matrixAutoUpdate = false;
  world.add(skyDome);

  const starRandom = createSeededRandom(2027);
  const starCount = isCompactViewport ? 90 : 170;
  const starPositions = new Float32Array(starCount * 3);
  const starColours = new Float32Array(starCount * 3);
  const starPalette = [
    new THREE.Color(PIXEL_PALETTE.starWarm),
    new THREE.Color(PIXEL_PALETTE.starRose),
    new THREE.Color(PIXEL_PALETTE.starMint),
  ];

  for (let index = 0; index < starCount; index += 1) {
    const horizontalAngle = starRandom() * Math.PI * 2;
    const verticalAngle = starRandom() * Math.PI * 0.43;
    const radius = 43;

    starPositions[index * 3] =
      Math.sin(verticalAngle) * Math.cos(horizontalAngle) * radius;
    starPositions[index * 3 + 1] = Math.cos(verticalAngle) * radius;
    starPositions[index * 3 + 2] =
      Math.sin(verticalAngle) * Math.sin(horizontalAngle) * radius;

    const starColour = starPalette[Math.floor(starRandom() * starPalette.length)];
    starColours[index * 3] = starColour.r;
    starColours[index * 3 + 1] = starColour.g;
    starColours[index * 3 + 2] = starColour.b;
  }

  const starGeometry = new THREE.BufferGeometry();
  starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  starGeometry.setAttribute('color', new THREE.BufferAttribute(starColours, 3));

  const starMaterial = new THREE.PointsMaterial({
    size: isCompactViewport ? 1.4 : 1.7,
    sizeAttenuation: false,
    vertexColors: true,
    transparent: true,
    opacity: 0.92,
    depthWrite: false,
    fog: false,
    toneMapped: false,
  });

  starField = new THREE.Points(starGeometry, starMaterial);
  world.add(starField);

  const moonMaterial = new THREE.SpriteMaterial({
    map: textures.moon,
    transparent: true,
    alphaTest: 0.5,
    depthWrite: false,
    fog: false,
    toneMapped: false,
  });
  const moonSprite = new THREE.Sprite(moonMaterial);
  moonSprite.position.set(-4, 7.6, 4);
  moonSprite.scale.set(2.3, 2.3, 1);
  world.add(moonSprite);

  const hillRandom = createSeededRandom(311);
  const hillColours = [0x1c1030, 0x24143c, 0x2c1947];

  for (let index = 0; index < 13; index += 1) {
    const angle = THREE.MathUtils.degToRad(135 + index * 15 + hillRandom() * 5);
    const radius = 27 + hillRandom() * 5;
    const hillWidth = 7 + hillRandom() * 6;
    const hillHeight = 4 + hillRandom() * 7;
    addBox(world, {
      width: hillWidth,
      height: hillHeight,
      depth: 5,
      colour: hillColours[index % hillColours.length],
      x: Math.cos(angle) * radius,
      y: hillHeight / 2 - 1.6,
      z: Math.sin(angle) * radius,
      rotationY: angle,
    });
  }

  const grassMaterial = new THREE.MeshLambertMaterial({ map: textures.grass });
  const dirtMaterial = new THREE.MeshLambertMaterial({ map: textures.dirt, color: 0xffffff });
  const islandBase = new THREE.Mesh(
    new THREE.BoxGeometry(ISLAND_WIDTH, 1.8, ISLAND_DEPTH),
    [
      dirtMaterial,
      dirtMaterial,
      grassMaterial,
      dirtMaterial,
      dirtMaterial,
      dirtMaterial,
    ],
  );
  islandBase.position.y = -0.9;
  islandBase.updateMatrix();
  islandBase.matrixAutoUpdate = false;
  world.add(islandBase);

  addBox(world, {
    width: ISLAND_WIDTH + 0.3,
    height: 0.4,
    depth: ISLAND_DEPTH + 0.3,
    colour: PIXEL_PALETTE.dirtDark,
    y: -1.95,
  });

  const pathTexture = textures.stone;
  const pathMaterial = new THREE.MeshLambertMaterial({ map: pathTexture });
  const stonePath = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 11), pathMaterial);
  stonePath.rotation.x = -Math.PI / 2;
  stonePath.position.set(0, 0.022, 0.4);
  stonePath.updateMatrix();
  stonePath.matrixAutoUpdate = false;
  world.add(stonePath);

  const platformTexture = textures.stone.clone();
  platformTexture.repeat.set(4, 3);
  platformTexture.needsUpdate = true;
  const platformMaterial = new THREE.MeshLambertMaterial({ map: platformTexture });
  const ceremonyPlatform = new THREE.Mesh(new THREE.PlaneGeometry(5.8, 4.8), platformMaterial);
  ceremonyPlatform.rotation.x = -Math.PI / 2;
  ceremonyPlatform.position.set(CHUPPAH_X, 0.03, CHUPPAH_Z);
  ceremonyPlatform.updateMatrix();
  ceremonyPlatform.matrixAutoUpdate = false;
  world.add(ceremonyPlatform);

  const chuppahGroup = new THREE.Group();
  chuppahGroup.position.set(CHUPPAH_X, 0, CHUPPAH_Z);
  world.add(chuppahGroup);

  const chuppahPostPositions: readonly [number, number][] = [
    [-2.05, -2.05],
    [2.05, -2.05],
    [-2.05, 2.05],
    [2.05, 2.05],
  ];

  chuppahPostPositions.forEach(([postX, postZ]) => {
    addBox(chuppahGroup, {
      width: 0.16,
      height: 3.6,
      depth: 0.16,
      colour: PIXEL_PALETTE.cream,
      x: postX,
      y: 1.8,
      z: postZ,
    });
    addBox(chuppahGroup, {
      width: 0.32,
      height: 0.18,
      depth: 0.32,
      colour: PIXEL_PALETTE.gold,
      x: postX,
      y: 0.09,
      z: postZ,
    });
    addBox(chuppahGroup, {
      width: 0.3,
      height: 0.18,
      depth: 0.3,
      colour: PIXEL_PALETTE.gold,
      x: postX,
      y: 3.58,
      z: postZ,
    });

    const flowerColours = [
      PIXEL_PALETTE.rose,
      PIXEL_PALETTE.roseBright,
      PIXEL_PALETTE.cream,
      PIXEL_PALETTE.gold,
    ];
    for (let petal = 0; petal < 5; petal += 1) {
      addBox(chuppahGroup, {
        width: 0.18,
        height: 0.18,
        depth: 0.18,
        colour: flowerColours[petal % flowerColours.length],
        x: postX + (petal - 2) * 0.14,
        y: 3.72 + (petal % 2) * 0.1,
        z: postZ + (petal % 2 === 0 ? 0.1 : -0.1),
      });
    }
  });

  const canopyGeometry = new THREE.PlaneGeometry(4.9, 4.9, 6, 6);
  const canopyMaterial = new THREE.MeshBasicMaterial({
    map: textures.canopy,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.5,
    depthWrite: false,
    toneMapped: false,
  });
  canopyMesh = new THREE.Mesh(canopyGeometry, canopyMaterial);
  canopyMesh.rotation.x = -Math.PI / 2;
  canopyMesh.position.set(0, 3.56, 0);
  chuppahGroup.add(canopyMesh);

  chuppahPostPositions.forEach(([lanternX, lanternZ], index) => {
    const chuppahLantern = addBox(chuppahGroup, {
      width: 0.16,
      height: 0.22,
      depth: 0.16,
      colour: PIXEL_PALETTE.bulbWarm,
      material: getBasicMaterial(PIXEL_PALETTE.bulbWarm),
      x: lanternX,
      y: 3.38,
      z: lanternZ,
    });
    pulsingBulbs.push({
      mesh: chuppahLantern,
      phase: index * 1.2,
      baseScaleVector: chuppahLantern.scale.clone(),
    });
  });

  addContactShadow(CHUPPAH_X, CHUPPAH_Z, 3.4);

  const danceFloorMaterial = new THREE.MeshBasicMaterial({
    map: textures.danceFloor,
    toneMapped: false,
  });
  const danceFloor = new THREE.Mesh(new THREE.PlaneGeometry(6, 4), danceFloorMaterial);
  danceFloor.rotation.x = -Math.PI / 2;
  danceFloor.position.set(DANCE_FLOOR_X, 0.04, DANCE_FLOOR_Z);
  danceFloor.updateMatrix();
  danceFloor.matrixAutoUpdate = false;
  world.add(danceFloor);

  const danceFloorBorderMaterial = getLambertMaterial(PIXEL_PALETTE.goldDeep);
  addBox(world, {
    width: 6.16,
    height: 0.06,
    depth: 0.12,
    colour: PIXEL_PALETTE.gold,
    material: danceFloorBorderMaterial,
    y: 0.075,
    z: DANCE_FLOOR_Z - 2.02,
  });
  addBox(world, {
    width: 6.16,
    height: 0.06,
    depth: 0.12,
    colour: PIXEL_PALETTE.gold,
    material: danceFloorBorderMaterial,
    y: 0.075,
    z: DANCE_FLOOR_Z + 2.02,
  });
  addBox(world, {
    width: 0.12,
    height: 0.06,
    depth: 4.12,
    colour: PIXEL_PALETTE.gold,
    material: danceFloorBorderMaterial,
    x: DANCE_FLOOR_X - 3.02,
    y: 0.075,
    z: DANCE_FLOOR_Z,
  });
  addBox(world, {
    width: 0.12,
    height: 0.06,
    depth: 4.12,
    colour: PIXEL_PALETTE.gold,
    material: danceFloorBorderMaterial,
    x: DANCE_FLOOR_X + 3.02,
    y: 0.075,
    z: DANCE_FLOOR_Z,
  });

  const borderBulbColours = [
    PIXEL_PALETTE.bulbWarm,
    PIXEL_PALETTE.bulbRose,
    PIXEL_PALETTE.bulbMint,
  ];
  const borderBulbMaterials = borderBulbColours.map((bulbColour) =>
    getBasicMaterial(bulbColour),
  );

  function addBorderBulb(x: number, z: number, index: number): void {
    const bulb = addBox(world, {
      width: 0.1,
      height: 0.1,
      depth: 0.1,
      colour: borderBulbColours[index % borderBulbColours.length],
      material: borderBulbMaterials[index % borderBulbMaterials.length],
      x,
      y: 0.11,
      z,
    });
    pulsingBulbs.push({ mesh: bulb, phase: index * 0.42, baseScaleVector: bulb.scale.clone() });
  }

  let borderBulbIndex = 0;
  for (let x = -2.8; x <= 2.8; x += 0.7) {
    addBorderBulb(x, DANCE_FLOOR_Z - 2.1, borderBulbIndex);
    borderBulbIndex += 1;
    addBorderBulb(x, DANCE_FLOOR_Z + 2.1, borderBulbIndex);
    borderBulbIndex += 1;
  }
  for (let z = DANCE_FLOOR_Z - 1.4; z <= DANCE_FLOOR_Z + 1.4; z += 0.7) {
    addBorderBulb(-3.1, z, borderBulbIndex);
    borderBulbIndex += 1;
    addBorderBulb(3.1, z, borderBulbIndex);
    borderBulbIndex += 1;
  }

  const tableclothMaterial = new THREE.MeshLambertMaterial({ map: textures.tablecloth });
  const tableTopMaterial = getLambertMaterial(PIXEL_PALETTE.cream);
  const tableWoodMaterial = getLambertMaterial(PIXEL_PALETTE.woodDark);
  const plateGeometry = new THREE.CylinderGeometry(0.11, 0.11, 0.025, 6);
  const plateMaterial = getLambertMaterial(PIXEL_PALETTE.cream);
  const candleMaterial = getBasicMaterial(PIXEL_PALETTE.bulbWarm);

  function addGuestTable({
    x,
    z,
    rotationY = 0,
  }: {
    readonly x: number;
    readonly z: number;
    readonly rotationY?: number;
  }): THREE.Group {
    const tableGroup = new THREE.Group();
    tableGroup.position.set(x, 0, z);
    tableGroup.rotation.y = rotationY;
    tableGroup.scale.setScalar(0.9);
    world.add(tableGroup);

    const tablecloth = new THREE.Mesh(
      new THREE.CylinderGeometry(0.86, 1.02, 0.8, 8, 1, false),
      [tableclothMaterial, tableTopMaterial, tableWoodMaterial],
    );
    tablecloth.position.y = 0.4;
    tablecloth.updateMatrix();
    tablecloth.matrixAutoUpdate = false;
    tableGroup.add(tablecloth);

    const tableTop = new THREE.Mesh(
      new THREE.CylinderGeometry(0.93, 0.93, 0.07, 8),
      tableTopMaterial,
    );
    tableTop.position.y = 0.83;
    tableTop.updateMatrix();
    tableTop.matrixAutoUpdate = false;
    tableGroup.add(tableTop);

    for (let plateIndex = 0; plateIndex < 4; plateIndex += 1) {
      const angle = (plateIndex / 4) * Math.PI * 2 + 0.4;
      const plate = new THREE.Mesh(plateGeometry, plateMaterial);
      plate.position.set(Math.cos(angle) * 0.55, 0.88, Math.sin(angle) * 0.55);
      plate.updateMatrix();
      plate.matrixAutoUpdate = false;
      tableGroup.add(plate);
    }

    addBox(tableGroup, {
      width: 0.12,
      height: 0.18,
      depth: 0.12,
      colour: PIXEL_PALETTE.cream,
      y: 0.98,
    });
    const candleFlame = addBox(tableGroup, {
      width: 0.07,
      height: 0.1,
      depth: 0.07,
      colour: PIXEL_PALETTE.bulbWarm,
      material: candleMaterial,
      y: 1.11,
    });
    pulsingBulbs.push({
      mesh: candleFlame,
      phase: x + z,
      baseScaleVector: candleFlame.scale.clone(),
    });

    for (let chairIndex = 0; chairIndex < 3; chairIndex += 1) {
      const angle = (chairIndex / 3) * Math.PI * 2 + 0.8;
      const chairX = Math.cos(angle) * 1.35;
      const chairZ = Math.sin(angle) * 1.35;

      addBox(tableGroup, {
        width: 0.38,
        height: 0.32,
        depth: 0.38,
        colour: PIXEL_PALETTE.woodDark,
        x: chairX,
        y: 0.16,
        z: chairZ,
        rotationY: -angle,
      });
      addBox(tableGroup, {
        width: 0.38,
        height: 0.46,
        depth: 0.1,
        colour: PIXEL_PALETTE.wood,
        x: chairX,
        y: 0.46,
        z: chairZ,
        rotationY: -angle,
      });
    }

    addContactShadow(x, z, 1.55);
    return tableGroup;
  }

  addGuestTable({ x: -5.35, z: 2.15, rotationY: 0.2 });
  addGuestTable({ x: 5.35, z: 2.15, rotationY: -0.2 });
  addGuestTable({ x: -5.35, z: -1.85, rotationY: -0.1 });

  const barGroup = new THREE.Group();
  barGroup.position.set(5.35, 0, -3.75);
  world.add(barGroup);

  addBox(barGroup, {
    width: 2.8,
    height: 1,
    depth: 0.9,
    colour: PIXEL_PALETTE.wood,
    y: 0.5,
  });
  addBox(barGroup, {
    width: 3,
    height: 0.12,
    depth: 1.02,
    colour: PIXEL_PALETTE.cream,
    y: 1.06,
  });
  addBox(barGroup, {
    width: 2.5,
    height: 0.14,
    depth: 0.06,
    colour: PIXEL_PALETTE.roseDeep,
    y: 0.55,
    z: 0.47,
  });

  const bottleColours = [
    PIXEL_PALETTE.mint,
    PIXEL_PALETTE.gold,
    PIXEL_PALETTE.roseBright,
    PIXEL_PALETTE.lilac,
    PIXEL_PALETTE.creamDim,
  ];
  bottleColours.forEach((bottleColour, bottleIndex) => {
    addBox(barGroup, {
      width: 0.13,
      height: 0.4 + (bottleIndex % 2) * 0.12,
      depth: 0.13,
      colour: bottleColour,
      x: -1 + bottleIndex * 0.5,
      y: 1.3,
      z: -0.12,
    });
    addBox(barGroup, {
      width: 0.05,
      height: 0.1,
      depth: 0.05,
      colour: PIXEL_PALETTE.cream,
      x: -1 + bottleIndex * 0.5,
      y: 1.55 + (bottleIndex % 2) * 0.12,
      z: -0.12,
    });
  });

  [-0.9, 0.9].forEach((stoolX) => {
    const stool = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.22, 0.12, 8),
      getLambertMaterial(PIXEL_PALETTE.roseDeep),
    );
    stool.position.set(stoolX, 0.62, 1.1);
    stool.updateMatrix();
    stool.matrixAutoUpdate = false;
    barGroup.add(stool);

    addBox(barGroup, {
      width: 0.12,
      height: 0.6,
      depth: 0.12,
      colour: PIXEL_PALETTE.woodDark,
      x: stoolX,
      y: 0.3,
      z: 1.1,
    });
  });

  addContactShadow(5.35, -3.75, 1.9);

  function addVoxelTree({
    x,
    z,
    size = 1,
    leafColour,
    accentColour,
    hasLanterns = false,
  }: {
    readonly x: number;
    readonly z: number;
    readonly size?: number;
    readonly leafColour: number;
    readonly accentColour?: number;
    readonly hasLanterns?: boolean;
  }): THREE.Group {
    const treeGroup = new THREE.Group();
    treeGroup.position.set(x, 0, z);
    world.add(treeGroup);

    addBox(treeGroup, {
      width: 0.34 * size,
      height: 1.3 * size,
      depth: 0.34 * size,
      colour: PIXEL_PALETTE.woodDark,
      y: 0.65 * size,
    });

    const leafLayers = [
      { width: 2.1, height: 0.72, depth: 2.1, y: 1.5 },
      { width: 1.65, height: 0.66, depth: 1.65, y: 2.02 },
      { width: 1.1, height: 0.6, depth: 1.1, y: 2.5 },
    ];

    leafLayers.forEach((layer, layerIndex) => {
      addBox(treeGroup, {
        width: layer.width * size,
        height: layer.height * size,
        depth: layer.depth * size,
        colour: leafColour,
        x: layerIndex % 2 === 0 ? 0 : 0.1 * size,
        y: layer.y * size,
        z: layerIndex % 2 === 0 ? 0 : -0.08 * size,
      });
    });

    if (accentColour) {
      const accentPositions: readonly [number, number, number][] = [
        [-0.7, 1.8, 0.5],
        [0.6, 2.2, 0.4],
        [-0.35, 2.6, -0.4],
        [0.5, 1.65, -0.65],
      ];
      accentPositions.forEach(([accentX, accentY, accentZ]) => {
        addBox(treeGroup, {
          width: 0.2,
          height: 0.2,
          depth: 0.2,
          colour: accentColour,
          x: accentX * size,
          y: accentY * size,
          z: accentZ * size,
        });
      });
    }

    if (hasLanterns) {
      const lantern = addBox(treeGroup, {
        width: 0.13,
        height: 0.2,
        depth: 0.13,
        colour: PIXEL_PALETTE.bulbWarm,
        material: getBasicMaterial(PIXEL_PALETTE.bulbWarm),
        x: 0.65 * size,
        y: 1.45 * size,
        z: 0.65 * size,
      });
      pulsingBulbs.push({
        mesh: lantern,
        phase: x,
        baseScaleVector: lantern.scale.clone(),
      });
    }

    addContactShadow(x, z, 1.3 * size);
    return treeGroup;
  }

  addVoxelTree({
    x: -6.7,
    z: -4.35,
    size: 1.18,
    leafColour: PIXEL_PALETTE.grassDark,
    accentColour: PIXEL_PALETTE.rose,
    hasLanterns: true,
  });
  addVoxelTree({
    x: 6.75,
    z: -4.45,
    size: 1.1,
    leafColour: PIXEL_PALETTE.grassDark,
    accentColour: PIXEL_PALETTE.gold,
    hasLanterns: true,
  });
  addVoxelTree({
    x: -6.9,
    z: 4.45,
    size: 1.05,
    leafColour: PIXEL_PALETTE.grassBase,
    accentColour: PIXEL_PALETTE.cream,
  });
  addVoxelTree({
    x: 6.9,
    z: 4.35,
    size: 1.2,
    leafColour: PIXEL_PALETTE.grassDark,
    accentColour: PIXEL_PALETTE.lilac,
  });
  addVoxelTree({
    x: 3.2,
    z: -5.1,
    size: 0.8,
    leafColour: PIXEL_PALETTE.grassBase,
    accentColour: PIXEL_PALETTE.roseBright,
  });

  const hedgeColour = PIXEL_PALETTE.grassDeep;
  addBox(world, {
    width: 3.4,
    height: 0.55,
    depth: 0.5,
    colour: hedgeColour,
    x: -5.3,
    y: 0.275,
    z: -5.55,
  });
  addBox(world, {
    width: 2.6,
    height: 0.5,
    depth: 0.5,
    colour: hedgeColour,
    x: 5.75,
    y: 0.25,
    z: -5.55,
  });
  addBox(world, {
    width: 0.5,
    height: 0.5,
    depth: 2.8,
    colour: hedgeColour,
    x: -7.35,
    y: 0.25,
    z: 2.2,
  });
  addBox(world, {
    width: 0.5,
    height: 0.5,
    depth: 2.8,
    colour: hedgeColour,
    x: 7.35,
    y: 0.25,
    z: 2.2,
  });

  const flowerRandom = createSeededRandom(5150);
  const flowerColours = [
    PIXEL_PALETTE.rose,
    PIXEL_PALETTE.roseBright,
    PIXEL_PALETTE.gold,
    PIXEL_PALETTE.cream,
    PIXEL_PALETTE.lilac,
  ];
  let flowersPlaced = 0;
  let flowerAttempts = 0;

  while (flowersPlaced < 26 && flowerAttempts < 200) {
    flowerAttempts += 1;
    const flowerX = -7 + flowerRandom() * 14;
    const flowerZ = -5.2 + flowerRandom() * 10.4;

    const isOnPath = Math.abs(flowerX) < 1.5;
    const isOnDanceFloor =
      Math.abs(flowerX) < 3.4 &&
      flowerZ > DANCE_FLOOR_Z - 2.4 &&
      flowerZ < DANCE_FLOOR_Z + 2.4;
    const isUnderChuppah =
      Math.abs(flowerX) < 2.8 && flowerZ < CHUPPAH_Z + 2.7 && flowerZ > CHUPPAH_Z - 2.7;

    if (isOnPath || isOnDanceFloor || isUnderChuppah) continue;

    const flowerColour = flowerColours[Math.floor(flowerRandom() * flowerColours.length)];
    addBox(world, {
      width: 0.04,
      height: 0.16,
      depth: 0.04,
      colour: PIXEL_PALETTE.grassDark,
      x: flowerX,
      y: 0.08,
      z: flowerZ,
    });
    addBox(world, {
      width: 0.14,
      height: 0.06,
      depth: 0.14,
      colour: flowerColour,
      x: flowerX,
      y: 0.17,
      z: flowerZ,
    });
    flowersPlaced += 1;
  }

  const wireMaterial = new THREE.LineBasicMaterial({
    color: 0x1b1028,
    transparent: true,
    opacity: 0.85,
  });

  function addStringLights(
    start: THREE.Vector3,
    end: THREE.Vector3,
    { sag = 0.8, bulbSpacing = 0.46 }: { readonly sag?: number; readonly bulbSpacing?: number } = {},
  ): void {
    const distance = start.distanceTo(end);
    const segmentCount = Math.max(10, Math.round(distance * 4));
    const points: THREE.Vector3[] = [];

    for (let index = 0; index <= segmentCount; index += 1) {
      const interpolation = index / segmentCount;
      points.push(
        new THREE.Vector3(
          THREE.MathUtils.lerp(start.x, end.x, interpolation),
          THREE.MathUtils.lerp(start.y, end.y, interpolation) -
            sag * 4 * interpolation * (1 - interpolation),
          THREE.MathUtils.lerp(start.z, end.z, interpolation),
        ),
      );
    }

    const wireGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const wire = new THREE.Line(wireGeometry, wireMaterial);
    wire.updateMatrix();
    wire.matrixAutoUpdate = false;
    world.add(wire);

    const bulbCount = Math.max(4, Math.round(distance / bulbSpacing));
    for (let index = 1; index < bulbCount; index += 1) {
      const interpolation = index / bulbCount;
      const bulbPosition = new THREE.Vector3(
        THREE.MathUtils.lerp(start.x, end.x, interpolation),
        THREE.MathUtils.lerp(start.y, end.y, interpolation) -
          sag * 4 * interpolation * (1 - interpolation) -
          0.06,
        THREE.MathUtils.lerp(start.z, end.z, interpolation),
      );

      const bulbColour =
        index % 3 === 0 ? PIXEL_PALETTE.bulbRose : PIXEL_PALETTE.bulbWarm;
      const bulb = addBox(world, {
        width: 0.09,
        height: 0.12,
        depth: 0.09,
        colour: bulbColour,
        material: getBasicMaterial(bulbColour),
        x: bulbPosition.x,
        y: bulbPosition.y,
        z: bulbPosition.z,
      });
      pulsingBulbs.push({
        mesh: bulb,
        phase: index * 0.7,
        baseScaleVector: bulb.scale.clone(),
      });
    }
  }

  addStringLights(
    new THREE.Vector3(-2.05, 3.55, CHUPPAH_Z - 2.05),
    new THREE.Vector3(-6.6, 2.9, -4.2),
  );
  addStringLights(
    new THREE.Vector3(2.05, 3.55, CHUPPAH_Z - 2.05),
    new THREE.Vector3(6.6, 2.9, -4.3),
  );
  addStringLights(new THREE.Vector3(-6.8, 2.85, 4.3), new THREE.Vector3(6.8, 2.85, 4.2), {
    sag: 1.15,
    bulbSpacing: 0.55,
  });
  addStringLights(new THREE.Vector3(-6.6, 2.9, -4.2), new THREE.Vector3(-6.8, 2.85, 4.3), {
    sag: 0.55,
  });
  addStringLights(new THREE.Vector3(6.6, 2.9, -4.3), new THREE.Vector3(6.8, 2.85, 4.2), {
    sag: 0.55,
  });

  addSpriteCharacter({
    archetype: 'groom',
    palette: CHARACTER_PALETTES.groom,
    x: -0.48,
    z: CHUPPAH_Z + 0.25,
    height: 1.55,
    phase: 0.4,
    danceAmount: 0.012,
  });
  addSpriteCharacter({
    archetype: 'bride',
    palette: CHARACTER_PALETTES.bride,
    x: 0.5,
    z: CHUPPAH_Z + 0.25,
    height: 1.62,
    phase: 1.7,
    danceAmount: 0.012,
  });
  addSpriteCharacter({
    archetype: 'guestSuit',
    palette: CHARACTER_PALETTES.officiant,
    x: 0,
    z: CHUPPAH_Z - 1.55,
    height: 1.48,
    phase: 2.8,
  });

  const guestDefinitions: readonly {
    readonly x: number;
    readonly z: number;
    readonly archetype: CharacterArchetype;
    readonly height: number;
    readonly seed: number;
  }[] = [
    { x: 3.5, z: 4.55, archetype: 'guestDress', height: 1.28, seed: 11 },
    { x: -3.5, z: 4.5, archetype: 'guestSuit', height: 1.34, seed: 23 },
    { x: 4.45, z: 1.1, archetype: 'guestSuit', height: 1.3, seed: 37 },
    { x: -4.55, z: 0.9, archetype: 'guestDress', height: 1.26, seed: 51 },
    { x: 2.75, z: -0.55, archetype: 'guestDress', height: 1.3, seed: 67 },
    { x: -2.85, z: -0.75, archetype: 'guestSuit', height: 1.35, seed: 79 },
    { x: 5.4, z: -2.35, archetype: 'guestSuit', height: 1.32, seed: 91 },
    { x: -4.55, z: -4.45, archetype: 'guestDress', height: 1.27, seed: 103 },
    { x: 2.1, z: 3.2, archetype: 'guestDress', height: 1.12, seed: 111 },
  ];

  guestDefinitions.forEach((guest, index) => {
    addSpriteCharacter({
      archetype: guest.archetype,
      palette: createGuestPalette({ seed: guest.seed, archetype: guest.archetype }),
      x: guest.x,
      z: guest.z,
      height: guest.height,
      phase: index * 0.73,
      danceAmount: index < 6 ? 0.045 : 0.015,
    });
  });

  const heartRandom = createSeededRandom(1206);
  const heartCount = isCompactViewport ? 12 : 20;
  const heartMaterial = new THREE.SpriteMaterial({
    map: textures.heart,
    transparent: true,
    depthWrite: false,
    toneMapped: false,
    opacity: 0.9,
  });

  for (let index = 0; index < heartCount; index += 1) {
    const heart = new THREE.Sprite(heartMaterial);
    const heartScale = 0.16 + heartRandom() * 0.12;
    heart.scale.set(heartScale, heartScale * 0.86, 1);
    heart.position.set(
      -6 + heartRandom() * 12,
      0.8 + heartRandom() * 5.5,
      -4.5 + heartRandom() * 9,
    );
    world.add(heart);
    floatingHearts.push({
      sprite: heart,
      speed: 0.18 + heartRandom() * 0.3,
      drift: 0.22 + heartRandom() * 0.3,
      phase: heartRandom() * Math.PI * 2,
      baseX: heart.position.x,
      baseScale: heartScale,
    });
  }

  const fireflyRandom = createSeededRandom(808);
  const fireflyCount = isCompactViewport ? 8 : 14;
  const fireflyColours = [PIXEL_PALETTE.bulbWarm, PIXEL_PALETTE.bulbRose, PIXEL_PALETTE.bulbMint];
  const fireflyMaterials = fireflyColours.map(
    (fireflyColour) =>
      new THREE.MeshBasicMaterial({
        color: fireflyColour,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
        fog: false,
      }),
  );

  for (let index = 0; index < fireflyCount; index += 1) {
    const firefly = addBox(world, {
      width: 0.08,
      height: 0.08,
      depth: 0.08,
      colour: fireflyColours[index % fireflyColours.length],
      material: fireflyMaterials[index % fireflyMaterials.length],
      x: -5 + fireflyRandom() * 10,
      y: 1 + fireflyRandom() * 2.5,
      z: -4 + fireflyRandom() * 8,
      isDynamic: true,
    });

    driftingFireflies.push({
      mesh: firefly,
      anchorX: firefly.position.x,
      anchorZ: firefly.position.z,
      radius: 0.4 + fireflyRandom() * 0.9,
      speed: 0.25 + fireflyRandom() * 0.35,
      phase: fireflyRandom() * Math.PI * 2,
    });
  }

  chuppahLight = new THREE.PointLight(0xffb072, 34, 13, 2);
  chuppahLight.position.set(CHUPPAH_X, 3.3, CHUPPAH_Z);
  world.add(chuppahLight);

  danceFloorLight = new THREE.PointLight(0xff7e9f, 22, 10, 2);
  danceFloorLight.position.set(DANCE_FLOOR_X, 1.8, DANCE_FLOOR_Z);
  world.add(danceFloorLight);

  function update(
    deltaSeconds: number,
    elapsedSeconds: number,
    incomingCelebrationEnergy: number = 0,
  ): void {
    celebrationEnergy = incomingCelebrationEnergy;

    if (starField && !reducedMotion) {
      starField.rotation.y += deltaSeconds * 0.004;
    }

    if (canopyMesh && !reducedMotion) {
      const canopyPositions = canopyMesh.geometry.attributes.position;
      for (let index = 0; index < canopyPositions.count; index += 1) {
        const x = canopyPositions.getX(index);
        const y = canopyPositions.getY(index);
        canopyPositions.setZ(
          index,
          Math.sin(x * 1.6 + elapsedSeconds * 1.35) * 0.05 +
            Math.cos(y * 2.1 + elapsedSeconds * 1.05) * 0.04,
        );
      }
      canopyPositions.needsUpdate = true;
    }

    if (!reducedMotion) {
      animatedCharacters.forEach((character) => {
        const bob =
          Math.abs(Math.sin(elapsedSeconds * 2.2 + character.phase)) *
            (0.012 + character.danceAmount * 0.45) +
          Math.sin(elapsedSeconds * 5.2 + character.phase) * character.danceAmount * 0.18;
        character.sprite.position.y = character.baseHeight + bob;
        character.sprite.material.rotation =
          Math.sin(elapsedSeconds * 1.7 + character.phase) * (0.012 + character.danceAmount * 0.5);
      });
    }

    pulsingBulbs.forEach((bulb) => {
      const travel = Math.sin(elapsedSeconds * 3.1 + bulb.phase) * 0.16;
      const celebrationBoost = celebrationEnergy * 0.22;
      bulb.mesh.scale
        .copy(bulb.baseScaleVector)
        .multiplyScalar(1 + travel + celebrationBoost);
      bulb.mesh.updateMatrix();
    });

    if (!reducedMotion) {
      floatingHearts.forEach((heart) => {
        const heartSpeed = heart.speed * (1 + celebrationEnergy * 2.8);
        heart.sprite.position.y += deltaSeconds * heartSpeed;
        heart.sprite.position.x =
          heart.baseX + Math.sin(elapsedSeconds * 0.7 + heart.phase) * heart.drift;
        const heartScale = heart.baseScale * (1 + celebrationEnergy * 0.8);
        heart.sprite.scale.set(heartScale, heartScale * 0.86, 1);

        if (heart.sprite.position.y > 7.6) {
          heart.sprite.position.y = 0.7;
          heart.baseX = -6 + Math.random() * 12;
          heart.sprite.position.z = -4.5 + Math.random() * 9;
        }
      });

      driftingFireflies.forEach((firefly) => {
        const angle = elapsedSeconds * firefly.speed + firefly.phase;
        firefly.mesh.position.x = firefly.anchorX + Math.cos(angle) * firefly.radius;
        firefly.mesh.position.z = firefly.anchorZ + Math.sin(angle * 1.2) * firefly.radius;
        firefly.mesh.position.y = 1.4 + Math.sin(angle * 1.8) * 0.65;
      });
    }

    if (chuppahLight) {
      chuppahLight.intensity =
        34 + Math.sin(elapsedSeconds * 3.3) * 2.5 + celebrationEnergy * 24;
    }
    if (danceFloorLight) {
      danceFloorLight.intensity =
        22 + Math.sin(elapsedSeconds * 4.1) * 1.8 + celebrationEnergy * 20;
    }
  }

  function triggerCelebration(): void {
    const burstCount = Math.min(10, floatingHearts.length);

    for (let index = 0; index < burstCount; index += 1) {
      const heart = floatingHearts[index];
      heart.sprite.position.set(
        (Math.random() - 0.5) * 4.4,
        1.4 + Math.random() * 2.8,
        CHUPPAH_Z + 0.5 + Math.random() * 2.4,
      );
      heart.baseX = heart.sprite.position.x;
      heart.speed = 0.55 + Math.random() * 0.7;
      heart.baseScale = 0.16 + Math.random() * 0.1;
    }
  }

  function dispose(): void {
    scene.remove(world);

    const disposedGeometries = new Set<THREE.BufferGeometry>();
    const disposedMaterials = new Set<THREE.Material>();
    const disposedTextures = new Set<THREE.Texture>();

    world.traverse((object) => {
      const meshLike = object as THREE.Mesh;
      if (meshLike.geometry && !disposedGeometries.has(meshLike.geometry)) {
        disposedGeometries.add(meshLike.geometry);
        meshLike.geometry.dispose();
      }

      const objectMaterials = Array.isArray(meshLike.material)
        ? meshLike.material
        : meshLike.material
          ? [meshLike.material]
          : [];

      objectMaterials.forEach((material) => {
        if (!material || disposedMaterials.has(material)) return;
        disposedMaterials.add(material);

        const mappedMaterial = material as THREE.MeshBasicMaterial;
        if (mappedMaterial.map && !disposedTextures.has(mappedMaterial.map)) {
          disposedTextures.add(mappedMaterial.map);
          mappedMaterial.map.dispose();
        }
        material.dispose();
      });
    });

    Object.values(textures).forEach((texture) => {
      if (!disposedTextures.has(texture)) {
        disposedTextures.add(texture);
        texture.dispose();
      }
    });

    unitBoxGeometry.dispose();
    contactShadowGeometry.dispose();
    contactShadowMaterial.dispose();
    skyMaterial.dispose();
    starGeometry.dispose();
    starMaterial.dispose();
    moonMaterial.dispose();
    pathMaterial.dispose();
    platformMaterial.dispose();
    platformTexture.dispose();
    grassMaterial.dispose();
    dirtMaterial.dispose();
    danceFloorMaterial.dispose();
    tableclothMaterial.dispose();
    tableTopMaterial.dispose();
    tableWoodMaterial.dispose();
    plateGeometry.dispose();
    plateMaterial.dispose();
    candleMaterial.dispose();
    wireMaterial.dispose();
  }

  return { update, triggerCelebration, dispose };
}
