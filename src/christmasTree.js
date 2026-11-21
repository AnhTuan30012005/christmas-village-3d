/* ==========================================================================
   SRC/CHRISTMASTREE.JS - ORGANIC DENSE PARTICLE CHRISTMAS TREE (REFINED)
   Natural, irregular dense foliage volume with dark/mid/bright greens,
   blended golden spiral lights, red ornaments, warm white lights & star.
   Scaled ~12% smaller so the Christmas City is the hero subject.
   ========================================================================== */

const THREE = window.THREE;
const TAU = 2 * Math.PI;

export class ParticleChristmasTree {
  constructor(particleEngine, lightingSystem) {
    this.engine = particleEngine;
    this.lighting = lightingSystem;
  }

  createTree(options = {}) {
    const {
      position = new THREE.Vector3(0, 0, 0),
      scale = 0.86,
      height = 6.8,
      baseRadius = 2.95,
      tiers = 15
    } = options;

    const ox = position.x;
    const oy = position.y;
    const oz = position.z;

    const colPineDark   = 0x05260e;
    const colPineMid    = 0x0e4d1e;
    const colPineBright = 0x1e7d34;
    const colPineSoft   = 0x2f9e44;
    const colSnow       = 0xe8f4ff;
    const colGold       = 0xffc833;
    const colWarmWhite  = 0xffe8a3;
    const colRuby       = 0xff2442;

    // 1. Trunk Volume
    const trunkH = 1.25 * scale;
    const trunkR = 0.34 * scale;
    for (let i = 0; i < 160; i++) {
      const a = Math.random() * TAU;
      const r = trunkR * (0.4 + 0.6 * Math.random());
      const y = Math.random() * trunkH;
      this.engine.addParticle(
        ox + Math.cos(a) * r,
        oy + y,
        oz + Math.sin(a) * r,
        0x2e1d10, 0.17 * scale, 0
      );
    }

    const treeBaseY = oy + 0.72 * scale;
    const treeTopY = treeBaseY + height * scale;

    // 2. Dense Interior Foliage Volume (Eliminates hollow/wireframe look)
    const interiorCount = 3800;
    for (let i = 0; i < interiorCount; i++) {
      // Bias slightly toward lower/mid canopy where volume is wider
      const u = 1.0 - Math.sqrt(Math.random());
      const py = treeBaseY + u * (height * scale);
      const maxR = baseRadius * scale * Math.pow(1.0 - u, 0.88);
      // Organic irregular outer boundary
      const angle = Math.random() * TAU;
      const edgeNoise = 0.82 + 0.28 * Math.sin(angle * 5.0 + u * 12.0) + 0.14 * (Math.random() - 0.5);
      const r = maxR * Math.pow(Math.random(), 0.55) * edgeNoise;

      const px = ox + Math.cos(angle) * r;
      const pz = oz + Math.sin(angle) * r;
      const jitterY = (Math.random() - 0.5) * 0.24 * scale;

      const rr = Math.random();
      let col = colPineDark;
      if (rr > 0.78) col = colPineBright;
      else if (rr > 0.42) col = colPineMid;
      else if (rr > 0.94) col = colPineSoft;

      const pSize = (0.14 + Math.random() * 0.10) * scale;
      this.engine.addParticle(px, py + jitterY, pz, col, pSize, 0);
    }

    // 3. Organic Drooping Boughs & Irregular Silhouette Tips
    for (let t = 0; t < tiers; t++) {
      const frac = t / tiers;
      const tierY = treeBaseY + frac * (height * scale);
      const tierR = baseRadius * scale * Math.pow(1.0 - frac, 0.88);
      const branches = 11 + Math.floor((1.0 - frac) * 9);

      for (let b = 0; b < branches; b++) {
        const bAngle = (b / branches) * TAU + frac * 2.1 + (Math.random() - 0.5) * 0.28;
        const bLength = tierR * (0.76 + 0.36 * Math.random());

        const steps = 14;
        for (let s = 1; s <= steps; s++) {
          const u = s / steps;
          const dist = bLength * u;
          const sag = -0.32 * scale * Math.pow(u, 1.75);

          const jitterX = (Math.random() - 0.5) * 0.16 * scale;
          const jitterY = (Math.random() - 0.5) * 0.12 * scale;
          const jitterZ = (Math.random() - 0.5) * 0.16 * scale;

          const px = ox + Math.cos(bAngle) * dist + jitterX;
          const py = tierY + sag + jitterY;
          const pz = oz + Math.sin(bAngle) * dist + jitterZ;

          const col = u > 0.78 ? colPineBright : (u > 0.4 ? colPineMid : colPineDark);
          this.engine.addParticle(px, py, pz, col, (0.15 + Math.random() * 0.08) * scale, 0);

          // Organic side foliage puffs
          if (s > 3 && Math.random() < 0.65) {
            const spread = (0.14 + Math.random() * 0.18) * scale * u;
            const perpX = -Math.sin(bAngle) * spread;
            const perpZ =  Math.cos(bAngle) * spread;
            this.engine.addParticle(px + perpX, py - 0.03 * scale, pz + perpZ, colPineMid, 0.15 * scale, 0);
            this.engine.addParticle(px - perpX, py - 0.03 * scale, pz - perpZ, colPineDark, 0.15 * scale, 0);
          }

          // Subtle snow dusting on outer tips
          if (u > 0.84 && Math.random() < 0.42) {
            this.engine.addParticle(
              px + (Math.random() - 0.5) * 0.08 * scale,
              py + 0.07 * scale,
              pz + (Math.random() - 0.5) * 0.08 * scale,
              colSnow, 0.15 * scale, 0
            );
          }
        }
      }
    }

    // 4. Golden Spiral Garland (Blended naturally into the foliage)
    const garlandTurns = 4.8;
    const garlandSteps = 440;
    for (let i = 0; i <= garlandSteps; i++) {
      const u = i / garlandSteps;
      const gy = treeBaseY + 0.25 * scale + (height * scale - 0.55 * scale) * u;
      const ga = TAU * garlandTurns * u;
      const swag = -0.15 * scale * Math.abs(Math.sin(ga * 2.0));
      // Tuck slightly into foliage with organic jitter so it blends naturally
      const gr = (baseRadius * scale * Math.pow(1.0 - u, 0.88)) * (0.94 + 0.09 * Math.sin(ga * 3.0));

      const px = ox + Math.cos(ga) * gr + (Math.random() - 0.5) * 0.08 * scale;
      const py = gy + swag + (Math.random() - 0.5) * 0.06 * scale;
      const pz = oz + Math.sin(ga) * gr + (Math.random() - 0.5) * 0.08 * scale;

      this.engine.addParticle(px, py, pz, colGold, 0.23 * scale, 1, 1.8, ga);

      if (i % 3 === 0) {
        this.engine.addParticle(
          px + (Math.random() - 0.5) * 0.08 * scale,
          py + (Math.random() - 0.5) * 0.08 * scale,
          pz + (Math.random() - 0.5) * 0.08 * scale,
          colWarmWhite, 0.21 * scale, 1, 2.2, ga + 1.0
        );
      }
    }

    // 5. Warm White Lights, Gold Lights & Red Ornaments nestled in foliage
    const lightCount = 420;
    for (let i = 0; i < lightCount; i++) {
      const u = 0.05 + Math.random() * 0.88;
      const by = treeBaseY + (height * scale - 0.4 * scale) * u;
      const ba = Math.random() * TAU;
      const br = baseRadius * scale * Math.pow(1.0 - u, 0.88) * (0.72 + 0.30 * Math.random());

      const px = ox + Math.cos(ba) * br;
      const pz = oz + Math.sin(ba) * br;

      const r = Math.random();
      if (r < 0.36) {
        // Red ornament cluster (2-3 tiny points for volume)
        this.engine.addParticle(px, by, pz, colRuby, 0.23 * scale, 1, 0.9, ba);
        this.engine.addParticle(px + 0.04 * scale, by - 0.03 * scale, pz, 0xc9142c, 0.16 * scale, 0);
      } else if (r < 0.72) {
        // Warm white fairy light
        this.engine.addParticle(px, by, pz, colWarmWhite, 0.18 * scale, 1, 2.4, ba);
      } else {
        // Gold light
        this.engine.addParticle(px, by, pz, colGold, 0.20 * scale, 1, 2.0, ba);
      }
    }

    // 6. Radiant Golden 8-Pointed Star Topper (Preserved)
    const starY = treeTopY + 0.32 * scale;

    for (let i = 0; i < 42; i++) {
      const a = (i / 42) * TAU;
      const r = (0.04 + Math.random() * 0.16) * scale;
      this.engine.addParticle(
        ox + Math.cos(a) * r,
        starY + Math.sin(a) * r,
        oz + (Math.random() - 0.5) * 0.08 * scale,
        colWarmWhite, 0.24 * scale, 2, 2.2
      );
    }

    for (let b = 0; b < 8; b++) {
      const bAngle = (b / 8) * TAU;
      const isCardinal = (b % 2 === 0);
      const beamLen = (isCardinal ? 1.25 : 0.78) * scale;
      const bSteps = isCardinal ? 14 : 9;

      for (let s = 1; s <= bSteps; s++) {
        const u = s / bSteps;
        const dist = beamLen * u;
        const px = ox + Math.cos(bAngle) * dist;
        const py = starY + Math.sin(bAngle) * dist;
        const pSize = (0.20 - u * 0.09) * scale;
        this.engine.addParticle(px, py, oz, colGold, pSize, 2, 2.6, bAngle);
      }
    }

    for (let s = 0; s < 85; s++) {
      const sr = (0.18 + Math.random() * 1.25) * scale;
      const sa = Math.random() * TAU;
      this.engine.addParticle(
        ox + Math.cos(sa) * sr,
        starY + Math.sin(sa) * sr,
        oz + (Math.random() - 0.5) * 0.35 * scale,
        0xfff4cc, 0.13 * scale, 2, 3.2
      );
    }

    // Refined, moderate star halo (less overpowering bloom)
    if (this.lighting) {
      const starLight = new THREE.PointLight(0xffd866, 2.6, 16, 1.5);
      starLight.position.set(ox, starY + 0.2 * scale, oz);
      this.engine.scene.add(starLight);

      const starHalo = this.lighting.createGlowSprite(4.8 * scale, this.lighting.glowTexGold, 0.62);
      starHalo.position.set(ox, starY, oz);
      this.engine.scene.add(starHalo);
    }

    // 7. Dense Particle Gift Boxes Under Tree
    this.createParticleGift(ox - 0.85 * scale, oy + 0.08 * scale, oz + 0.78 * scale, 0.58 * scale, 0x1e56b5, colSnow);
    this.createParticleGift(ox + 0.78 * scale, oy + 0.08 * scale, oz + 0.62 * scale, 0.62 * scale, 0xc91a32, colGold);
    this.createParticleGift(ox + 0.12 * scale, oy + 0.08 * scale, oz - 0.85 * scale, 0.52 * scale, 0xd49a1a, colPineBright);
  }

  createParticleGift(x, y, z, size, boxColor, ribbonColor) {
    const s = size / 2;
    const h = size * 0.82;
    const count = 95;
    for (let i = 0; i < count; i++) {
      const face = Math.floor(Math.random() * 5);
      let gx = (Math.random() - 0.5) * size;
      let gy = Math.random() * h;
      let gz = (Math.random() - 0.5) * size;
      if (face === 0) gz = s;
      else if (face === 1) gz = -s;
      else if (face === 2) gx = s;
      else if (face === 3) gx = -s;
      else gy = h;

      const isRibbon = (Math.abs(gx) < size * 0.14) || (Math.abs(gz) < size * 0.14);
      this.engine.addParticle(x + gx, y + gy, z + gz, isRibbon ? ribbonColor : boxColor, 0.14, isRibbon ? 1 : 0);
    }
    this.engine.addParticle(x, y + h + 0.06, z, ribbonColor, 0.20, 1);
  }
}
