/* ==========================================================================
   SRC/DECORATIONS.JS - ORGANIC PLAZA, STALLS, STREETLAMPS & SPRUCE TREES (REFINED)
   No rigid geometric circle around tree. Natural snow drifts, subtle street
   cobbles, warm lamp pools fading into dark winter background.
   ========================================================================== */

const THREE = window.THREE;
const TAU = 2 * Math.PI;

export class ParticleDecorations {
  constructor(particleEngine, lightingSystem) {
    this.engine = particleEngine;
    this.lighting = lightingSystem;
  }

  rotatePoint(x, z, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
      x: x * cos - z * sin,
      z: x * sin + z * cos
    };
  }

  // 1. Organic City Square & Deep Winter Streets (Extends across Z=+10 to Z=-56)
  createPlaza(options = {}) {
    const {
      center = new THREE.Vector3(0, 0, -10.0),
      radius = 34.0
    } = options;

    const colDarkCobble = 0x111622;
    const colMidCobble  = 0x1b2333;
    const colSnowSoft   = 0x9ec0e0;
    const colSnowBright = 0xdceeff;

    // Wide organic city ground & snowy streets dissolving smoothly into darkness
    const groundCount = 4600;
    for (let i = 0; i < groundCount; i++) {
      const r = radius * Math.pow(Math.random(), 0.72);
      const a = Math.random() * TAU;
      const px = center.x + Math.cos(a) * r * 1.25;
      const pz = center.z + Math.sin(a) * r * 1.15;

      // Subtle winding street corridor curving back into the village
      const streetCenter = Math.sin(pz * 0.08) * 3.2;
      const onStreet = Math.abs(px - streetCenter) < 2.8 && pz < 8 && pz > -48;

      const snowNoise = Math.sin(px * 0.28) * Math.cos(pz * 0.32) + 0.5 * Math.sin((px + pz) * 0.18);
      const distFade = Math.max(0.16, 1.0 - r / (radius * 1.15));

      let col = colDarkCobble;
      let size = 0.15;
      if (onStreet) {
        col = Math.random() < 0.55 ? colMidCobble : colDarkCobble;
        size = 0.15;
      } else if (snowNoise > 0.38) {
        col = Math.random() < 0.45 ? colSnowBright : colSnowSoft;
        size = 0.16 + Math.random() * 0.05;
      } else if (Math.random() < 0.38) {
        col = colMidCobble;
      }

      const c = new THREE.Color(col);
      this.engine.addParticleRGB(
        px,
        center.y + (!onStreet && snowNoise > 0.5 ? 0.04 + Math.random() * 0.07 : 0.01),
        pz,
        c.r * distFade, c.g * distFade, c.b * distFade,
        size, 0
      );
    }

    // Subtle warm reflected light pools on the plaza & streets
    const lightPools = [
      { x: -0.2, z: 0.2, r: 3.8, col: 0x73541d },
      { x: -4.8, z: 4.5, r: 2.2, col: 0x6e4718 },
      { x:  4.2, z: 4.8, r: 2.2, col: 0x6e4718 },
      { x: -6.8, z: 0.2, r: 1.9, col: 0x5c3c14 },
      { x:  7.8, z: 1.2, r: 1.9, col: 0x5c3c14 },
      { x:  1.4, z: -12.0, r: 2.4, col: 0x4d3412 },
      { x: -3.2, z: -20.0, r: 2.2, col: 0x452d10 }
    ];
    lightPools.forEach(pool => {
      const c = new THREE.Color(pool.col);
      for (let i = 0; i < 95; i++) {
        const pr = Math.sqrt(Math.random()) * pool.r;
        const pa = Math.random() * TAU;
        const fade = 1.0 - pr / pool.r;
        this.engine.addParticleRGB(
          pool.x + Math.cos(pa) * pr,
          0.03,
          pool.z + Math.sin(pa) * pr,
          c.r * fade, c.g * fade, c.b * fade,
          0.17, 0
        );
      }
    });
  }

  // 2. Dense Particle Christmas Market Stall
  createMarketStall(options = {}) {
    const {
      position = new THREE.Vector3(-4.0, 0, 4.2),
      rotationY = -0.35,
      width = 2.3,
      depth = 1.7,
      height = 1.55
    } = options;

    const ox = position.x;
    const oy = position.y;
    const oz = position.z;

    const colWood  = 0x2e1c11;
    const colRed   = 0xc9142c;
    const colWhite = 0xeef5ff;
    const colWarm  = 0xffad29;

    const addPt = (lx, ly, lz, colHex, size = 0.15, type = 0, speed = 1.0) => {
      const rot = this.rotatePoint(lx, lz, rotationY);
      this.engine.addParticle(ox + rot.x, oy + ly, oz + rot.z, colHex, size, type, speed);
    };

    const halfW = width / 2;
    const halfD = depth / 2;

    // Filled wooden counter body
    for (let i = 0; i < 140; i++) {
      const lx = (Math.random() - 0.5) * width;
      const ly = Math.random() * (height * 0.58);
      const lz = Math.random() < 0.65 ? halfD : (Math.random() - 0.5) * depth;
      addPt(lx, ly, lz, colWood, 0.15, 0);
    }

    // Warm counter display glow
    for (let i = 0; i < 65; i++) {
      addPt((Math.random() - 0.5) * (width - 0.35), height * 0.58 + Math.random() * 0.25, halfD - 0.15 - Math.random() * 0.35, colWarm, 0.17, 1, 1.1);
    }

    // Corner support posts
    [-halfW, halfW].forEach(px => {
      [-halfD, halfD].forEach(pz => {
        for (let y = 0; y <= height; y += 0.16) {
          addPt(px, y, pz, colWood, 0.14, 0);
        }
      });
    });

    // Dense Striped Red & White Canopy
    const stripes = 8;
    const awH = 0.60;
    for (let s = 0; s < stripes; s++) {
      const isRed = (s % 2 === 0);
      const col = isRed ? colRed : colWhite;
      const sStart = -halfW - 0.14 + (s / stripes) * (width + 0.28);
      const sWidth = (width + 0.28) / stripes;

      for (let i = 0; i < 28; i++) {
        const u = Math.random();
        const lx = sStart + Math.random() * sWidth;
        const ly = height + Math.sin(u * Math.PI) * awH * 0.48 + u * awH * 0.45;
        const lz = -halfD + u * (depth + 0.35);
        addPt(lx, ly, lz, col, 0.16, 0);
      }
    }

    // Tight, subtle warm halo (reduced bloom)
    if (this.lighting) {
      const sHalo = this.lighting.createGlowSprite(1.9, this.lighting.glowTexWarm, 0.38);
      sHalo.position.set(ox, oy + height * 0.72, oz);
      this.engine.scene.add(sHalo);
    }
  }

  // 3. Victorian Streetlamp (Crisp, delicate warm glow, no oversized blob)
  createStreetLamp(options = {}) {
    const {
      position = new THREE.Vector3(3.5, 0, 2.5),
      height = 2.4
    } = options;

    const x = position.x;
    const y = position.y;
    const z = position.z;

    const colIron    = 0x1d2330;
    const colLantern = 0xffd666;
    const colSnow    = 0xeef5ff;

    for (let py = 0; py <= height; py += 0.14) {
      this.engine.addParticle(x, y + py, z, colIron, 0.14, 0);
    }
    for (let cx = -0.28; cx <= 0.28; cx += 0.10) {
      this.engine.addParticle(x + cx, y + height - 0.18, z, colIron, 0.12, 0);
    }

    const lanternY = y + height;
    for (let i = 0; i < 28; i++) {
      this.engine.addParticle(
        x + (Math.random() - 0.5) * 0.28,
        lanternY + Math.random() * 0.36,
        z + (Math.random() - 0.5) * 0.28,
        colLantern, 0.17, 1, 1.5
      );
    }
    this.engine.addParticle(x, lanternY + 0.42, z, colSnow, 0.18, 0);

    // Subtle warm light pool on the ground directly under lamp
    const poolCol = new THREE.Color(0x6e4d18);
    for (let i = 0; i < 28; i++) {
      const pr = Math.sqrt(Math.random()) * 1.4;
      const pa = Math.random() * TAU;
      const f = 1.0 - pr / 1.4;
      this.engine.addParticleRGB(x + Math.cos(pa) * pr, y + 0.03, z + Math.sin(pa) * pr, poolCol.r * f, poolCol.g * f, poolCol.b * f, 0.16, 0);
    }

    // Subtle tight lantern halo (reduced from 3.2/0.75 to 1.6/0.42)
    if (this.lighting) {
      const halo = this.lighting.createGlowSprite(1.6, this.lighting.glowTexWarm, 0.42);
      halo.position.set(x, lanternY + 0.18, z);
      this.engine.scene.add(halo);
    }
  }

  // 4. Dense Organic Secondary Spruce Trees (Volume-filled Pine + Snow)
  createSpruceTree(options = {}) {
    const {
      position = new THREE.Vector3(-3.0, 0, 3.8),
      height = 2.6,
      baseRadius = 1.15,
      brightness = 1.0
    } = options;

    const ox = position.x;
    const oy = position.y;
    const oz = position.z;

    const colPineDark = new THREE.Color(0x062d11);
    const colPineMid  = new THREE.Color(0x115924);
    const colSnow     = new THREE.Color(0xe6f3ff);

    const count = Math.floor(240 * (height / 2.5));
    for (let i = 0; i < count; i++) {
      const u = 1.0 - Math.sqrt(Math.random());
      const py = oy + 0.18 + u * height;
      const maxR = baseRadius * Math.pow(1.0 - u, 0.85);
      const a = Math.random() * TAU;
      const r = maxR * Math.pow(Math.random(), 0.55) * (0.85 + 0.25 * Math.sin(a * 4.0 + u * 8.0));

      const px = ox + Math.cos(a) * r;
      const pz = oz + Math.sin(a) * r;

      const isSnow = r > maxR * 0.72 && Math.random() < 0.42;
      const c = isSnow ? colSnow : (Math.random() < 0.5 ? colPineDark : colPineMid);

      this.engine.addParticleRGB(
        px, py, pz,
        c.r * brightness, c.g * brightness, c.b * brightness,
        0.15 + Math.random() * 0.05, 0
      );
    }
  }

  // 5. Subtle Rustic Fence Segment
  createFenceSegment(p1, p2, posts = 7) {
    const colWood = 0x241910;
    const colSnow = 0xdceeff;

    for (let i = 0; i <= posts; i++) {
      const t = i / posts;
      const px = p1.x + (p2.x - p1.x) * t;
      const pz = p1.z + (p2.z - p1.z) * t;
      for (let y = 0; y <= 0.58; y += 0.14) {
        this.engine.addParticle(px, y, pz, colWood, 0.13, 0);
      }
      this.engine.addParticle(px, 0.64, pz, colSnow, 0.14, 0);
    }
  }
}
