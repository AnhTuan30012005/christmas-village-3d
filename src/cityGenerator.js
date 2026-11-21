/* ==========================================================================
   SRC/CITYGENERATOR.JS - 7-LAYER DEEP ASYMMETRIC CHRISTMAS CITY
   Transforms the scene into a sprawling, multi-depth Christmas City:
   LAYER 1: Atmospheric snowfall
   LAYER 2: Spacious plaza & winding winter streets
   LAYER 3: Central Christmas tree (focal point)
   LAYER 4: Smaller asymmetric foreground houses, stalls & streetlamps (Z: +6 to -6)
   LAYER 5: Staggered midground village clusters (Z: -10 to -24)
   LAYER 6: Dense background village + distant Cathedral & Clock Tower (Z: -25 to -44)
   LAYER 7: Far distant city horizon silhouettes (Z: -46 to -66)
   ========================================================================== */

const THREE = window.THREE;

// Deterministic PRNG so the procedural city layout is rich, organic, and repeatable
function createRNG(seed = 20261225) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export class CityGenerator {
  constructor(particleEngine, buildingGen, decorationGen, treeGen) {
    this.engine = particleEngine;
    this.buildings = buildingGen;
    this.decorations = decorationGen;
    this.tree = treeGen;
  }

  generateCity() {
    console.log("[CityGenerator] Generating 7-Layer Deep Asymmetric Christmas City...");
    const rand = createRNG(12252026);

    // =======================================================================
    // LAYER 2: SPACIOUS ORGANIC PLAZA & STREETS
    // =======================================================================
    this.decorations.createPlaza({
      center: new THREE.Vector3(0, 0, -10.0),
      radius: 34.0
    });

    // =======================================================================
    // LAYER 3: CENTRAL CHRISTMAS TREE (FOCAL POINT)
    // =======================================================================
    this.tree.createTree({
      position: new THREE.Vector3(-0.4, 0, 0.4),
      scale: 0.86,
      height: 6.7,
      baseRadius: 2.9,
      tiers: 15
    });

    // =======================================================================
    // LAYER 4: FOREGROUND (SMALLER HOUSES ~25% REDUCED, STALLS, LAMPS, PINES)
    // Leaves generous open space for plaza, streets & sightlines to background city
    // =======================================================================
    this.decorations.createMarketStall({
      position: new THREE.Vector3(-4.8, 0, 4.6),
      rotationY: -0.46,
      width: 2.1,
      depth: 1.55,
      height: 1.42
    });
    this.decorations.createMarketStall({
      position: new THREE.Vector3(4.1, 0, 5.4),
      rotationY: 0.24,
      width: 2.0,
      depth: 1.50,
      height: 1.38
    });

    // Asymmetric streetlamps along plaza & curving street into midground
    const lampPositions = [
      { x: -3.4, z:  3.0 },
      { x:  4.2, z:  2.2 },
      { x: -6.2, z: -2.2 },
      { x:  5.4, z: -3.5 },
      { x:  1.0, z:  5.8 },
      { x: -2.2, z: -8.5 },
      { x:  3.2, z: -13.0 },
      { x: -5.0, z: -17.5 }
    ];
    lampPositions.forEach(lp => {
      this.decorations.createStreetLamp({
        position: new THREE.Vector3(lp.x, 0, lp.z),
        height: 2.25
      });
    });

    // Reduced-scale asymmetric foreground houses (25-30% smaller than before)
    const foregroundHouses = [
      { x: -10.4, z:  3.6, rot: -0.44, w: 3.3, d: 2.6, h: 2.6, rh: 1.8, wall: 0x1e2436, light: 0xffb32c, wreath: true,  lights: true,  decor: null,   density: 1.0,  bright: 1.0,  size: 1.0 },
      { x:  -7.8, z: -1.4, rot: -0.22, w: 2.9, d: 2.4, h: 2.3, rh: 1.6, wall: 0x261d16, light: 0xffbe38, wreath: false, lights: true,  decor: null,   density: 0.95, bright: 0.96, size: 0.98 },
      { x:  10.8, z:  2.4, rot:  0.52, w: 3.1, d: 2.5, h: 2.4, rh: 1.7, wall: 0x241c15, light: 0xffa622, wreath: true,  lights: true,  decor: null,   density: 1.0,  bright: 0.98, size: 1.0 },
      { x:   8.4, z: -2.8, rot:  0.28, w: 2.8, d: 2.3, h: 2.8, rh: 1.7, wall: 0x1c2232, light: 0xffb830, wreath: false, lights: true,  decor: "star", density: 0.92, bright: 0.94, size: 0.96 }
    ];

    // =======================================================================
    // LAYER 5: MIDDLE VILLAGE (Z = -8 to -24, ASYMMETRIC, OVERLAPPING HEIGHTS)
    // =======================================================================
    const middleHouses = [
      // Left-mid cluster (varied heights, some tucked behind foreground houses)
      { x: -14.2, z: -3.6,  rot:  0.16, w: 3.2, d: 2.5, h: 3.1, rh: 1.9, wall: 0x1a2030, light: 0xffaa24, wreath: false, lights: true,  decor: null,   density: 0.80, bright: 0.85, size: 0.92 },
      { x: -11.6, z: -9.2,  rot:  0.34, w: 3.4, d: 2.6, h: 2.6, rh: 1.8, wall: 0x251d16, light: 0xffb830, wreath: true,  lights: true,  decor: null,   density: 0.78, bright: 0.82, size: 0.90 },
      { x:  -6.8, z: -11.4, rot:  0.22, w: 3.1, d: 2.5, h: 3.4, rh: 1.9, wall: 0x1d2334, light: 0xffc040, wreath: false, lights: true,  decor: "tree", density: 0.78, bright: 0.82, size: 0.90 },
      { x: -17.8, z: -8.0,  rot: -0.25, w: 3.0, d: 2.4, h: 2.5, rh: 1.7, wall: 0x221b15, light: 0xffa420, wreath: false, lights: false, decor: null,   density: 0.68, bright: 0.75, size: 0.86 },

      // Center-back staggered cluster (leaving diagonal sightline open into far city)
      { x:  -2.8, z: -13.6, rot:  0.10, w: 3.2, d: 2.5, h: 2.5, rh: 1.7, wall: 0x241c15, light: 0xffb32c, wreath: true,  lights: true,  decor: null,   density: 0.74, bright: 0.78, size: 0.88 },
      { x:   4.2, z: -10.8, rot: -0.32, w: 3.0, d: 2.4, h: 2.7, rh: 1.8, wall: 0x1b2130, light: 0xffbc38, wreath: false, lights: true,  decor: null,   density: 0.76, bright: 0.80, size: 0.88 },

      // Right-mid cluster (different rhythm & taller narrow townhouse)
      { x:  13.2, z: -5.4,  rot: -0.20, w: 3.3, d: 2.6, h: 2.7, rh: 1.8, wall: 0x241c15, light: 0xffa824, wreath: false, lights: true,  decor: null,   density: 0.78, bright: 0.84, size: 0.90 },
      { x:   9.6, z: -12.4, rot: -0.40, w: 2.7, d: 2.4, h: 3.8, rh: 1.8, wall: 0x1b2232, light: 0xffc244, wreath: false, lights: true,  decor: "star", density: 0.74, bright: 0.78, size: 0.88 },
      { x:  16.8, z: -10.2, rot:  0.28, w: 3.1, d: 2.5, h: 2.6, rh: 1.7, wall: 0x231b15, light: 0xffaa24, wreath: false, lights: false, decor: null,   density: 0.66, bright: 0.74, size: 0.86 },

      // Deeper middle row (Z = -17 to -23)
      { x: -19.5, z: -16.8, rot:  0.20, w: 3.0, d: 2.4, h: 2.6, rh: 1.7, wall: 0x191f2e, light: 0xf2a528, wreath: false, lights: false, decor: null,   density: 0.56, bright: 0.66, size: 0.82 },
      { x: -10.4, z: -18.2, rot: -0.18, w: 3.2, d: 2.5, h: 3.0, rh: 1.9, wall: 0x211914, light: 0xf5ad30, wreath: false, lights: true,  decor: null,   density: 0.58, bright: 0.68, size: 0.82 },
      { x:  -4.6, z: -20.5, rot:  0.26, w: 2.9, d: 2.3, h: 3.3, rh: 1.8, wall: 0x1a2030, light: 0xf2a528, wreath: false, lights: true,  decor: null,   density: 0.56, bright: 0.65, size: 0.80 },
      { x:   1.2, z: -18.6, rot: -0.14, w: 3.3, d: 2.5, h: 2.5, rh: 1.7, wall: 0x221a14, light: 0xf5b034, wreath: false, lights: true,  decor: null,   density: 0.58, bright: 0.68, size: 0.82 },
      { x:   6.8, z: -19.8, rot:  0.22, w: 2.8, d: 2.3, h: 2.8, rh: 1.7, wall: 0x191f2e, light: 0xf0a226, wreath: false, lights: false, decor: null,   density: 0.56, bright: 0.66, size: 0.80 },
      { x:  13.4, z: -18.0, rot: -0.30, w: 3.2, d: 2.5, h: 2.7, rh: 1.8, wall: 0x211a14, light: 0xf2a82c, wreath: false, lights: true,  decor: null,   density: 0.56, bright: 0.66, size: 0.82 },
      { x:  20.4, z: -16.5, rot:  0.15, w: 3.0, d: 2.4, h: 2.5, rh: 1.7, wall: 0x1a202f, light: 0xeba024, wreath: false, lights: false, decor: null,   density: 0.54, bright: 0.64, size: 0.80 }
    ];

    [...foregroundHouses, ...middleHouses].forEach(cfg => {
      this.buildings.createParticleHouse({
        position: new THREE.Vector3(cfg.x, 0, cfg.z),
        rotationY: cfg.rot,
        width: cfg.w,
        depth: cfg.d,
        height: cfg.h,
        roofHeight: cfg.rh,
        wallColor: cfg.wall,
        lightColor: cfg.light,
        hasFairyLights: cfg.lights,
        hasWreath: cfg.wreath,
        hasChimney: cfg.density >= 0.58,
        rooftopDecor: cfg.decor,
        density: cfg.density,
        brightness: cfg.bright,
        sizeScale: cfg.size
      });
    });

    // =======================================================================
    // LAYER 6: DISTANT LANDMARKS (FAR FROM TREE SO THEY NEVER STEAL FOCAL POINT)
    // =======================================================================
    // Gothic Cathedral deep on the right-back
    this.buildings.createParticleCathedral({
      position: new THREE.Vector3(16.8, 0, -28.0),
      rotationY: -0.50,
      width: 5.0,
      depth: 8.2,
      height: 5.2,
      spireHeight: 7.0,
      brightness: 0.62
    });

    // Alpine Clock Tower deep on the left-back
    this.buildings.createParticleClockTower({
      position: new THREE.Vector3(-15.6, 0, -24.5),
      rotationY: 0.36,
      width: 2.7,
      height: 7.2,
      roofHeight: 3.0,
      brightness: 0.66
    });

    // =======================================================================
    // LAYER 6 & LAYER 7: PROCEDURAL SPRAWLING BACKGROUND VILLAGE & FAR CITY
    // 58 smaller, dimmer, atmospheric houses stretching from Z = -24 to Z = -66
    // =======================================================================
    const depthBands = [
      // Band A: Background village (Z = -24 to -34)
      { zMin: -34, zMax: -24, xSpan: 28, count: 20, scaleMin: 0.82, scaleMax: 1.05, brightMin: 0.46, brightMax: 0.60, sizeScale: 0.78, lightProb: 0.55 },
      // Band B: Deep background city (Z = -36 to -48)
      { zMin: -48, zMax: -36, xSpan: 36, count: 22, scaleMin: 0.66, scaleMax: 0.90, brightMin: 0.32, brightMax: 0.46, sizeScale: 0.68, lightProb: 0.40 },
      // Band C: Far distant horizon silhouettes (Z = -50 to -66)
      { zMin: -66, zMax: -50, xSpan: 44, count: 22, scaleMin: 0.52, scaleMax: 0.76, brightMin: 0.20, brightMax: 0.34, sizeScale: 0.58, lightProb: 0.25 }
    ];

    depthBands.forEach(band => {
      for (let i = 0; i < band.count; i++) {
        // Stratified X with strong organic jitter so no rigid grid or symmetry appears
        const baseX = -band.xSpan + ((i + 0.5) / band.count) * (band.xSpan * 2);
        const px = baseX + (rand() - 0.5) * 4.2;
        const pz = band.zMin + rand() * (band.zMax - band.zMin);

        // Avoid colliding directly inside Cathedral or Clock Tower footprint
        if (Math.hypot(px - 16.8, pz - (-28.0)) < 5.5) continue;
        if (Math.hypot(px - (-15.6), pz - (-24.5)) < 4.0) continue;

        const sc = band.scaleMin + rand() * (band.scaleMax - band.scaleMin);
        const isTallBuilding = rand() < 0.20;
        const w = (2.4 + rand() * 1.2) * sc;
        const d = (1.9 + rand() * 0.8) * sc;
        const h = (isTallBuilding ? (3.2 + rand() * 1.1) : (1.8 + rand() * 0.9)) * sc;
        const rh = (1.2 + rand() * 0.7) * sc;
        const bright = band.brightMin + rand() * (band.brightMax - band.brightMin);

        this.buildings.createDistantHouse({
          position: new THREE.Vector3(px, 0, pz),
          rotationY: (rand() - 0.5) * 0.65,
          width: w,
          depth: d,
          height: h,
          roofHeight: rh,
          brightness: bright,
          sizeScale: band.sizeScale,
          hasLights: rand() < band.lightProb
        });
      }
    });

    // =======================================================================
    // ASYMMETRIC SPRUCE TREES SCATTERED ACROSS PLAZA & VILLAGE DEPTH
    // =======================================================================
    const sprucePositions = [
      { x: -3.0, z:  5.4, h: 2.1, bright: 1.0 },
      { x:  5.8, z:  4.4, h: 2.4, bright: 1.0 },
      { x:  5.6, z:  0.4, h: 2.3, bright: 0.92 },
      { x: -5.4, z: -1.8, h: 2.2, bright: 0.90 },
      { x: -0.6, z: -6.2, h: 2.3, bright: 0.85 },
      { x:  6.4, z: -7.5, h: 2.4, bright: 0.82 },
      { x: -9.2, z: -6.5, h: 2.5, bright: 0.78 },
      { x:  1.8, z: -15.2, h: 2.4, bright: 0.65 },
      { x: -8.0, z: -15.8, h: 2.6, bright: 0.64 },
      { x: 12.2, z: -14.5, h: 2.5, bright: 0.64 },
      { x: -13.5, z: -21.0, h: 2.4, bright: 0.54 },
      { x:  8.5, z: -23.0, h: 2.5, bright: 0.52 }
    ];
    sprucePositions.forEach(sp => {
      this.decorations.createSpruceTree({
        position: new THREE.Vector3(sp.x, 0, sp.z),
        height: sp.h,
        baseRadius: sp.h * 0.44,
        brightness: sp.bright
      });
    });

    // Subtle rustic fence segment on left-front plaza edge
    this.decorations.createFenceSegment(
      new THREE.Vector3(-8.4, 0, 5.8),
      new THREE.Vector3(-6.0, 0, 6.4),
      6
    );
  }
}
