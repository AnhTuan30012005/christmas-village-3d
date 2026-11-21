/* ==========================================================================
   SRC/BUILDINGS.JS - DENSE VOLUMETRIC PARTICLE SILHOUETTES (REFINED)
   Renders Christmas houses, cathedral & clock tower as DENSE PARTICLE MASSES
   (filled snow roofs, filled dark timber/stone walls, warm glowing windows),
   NOT wireframe outlines.
   ========================================================================== */

const THREE = window.THREE;
const TAU = 2 * Math.PI;

export class ParticleBuildingGenerator {
  constructor(particleEngine) {
    this.engine = particleEngine;
  }

  rotatePoint(x, z, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
      x: x * cos - z * sin,
      z: x * sin + z * cos
    };
  }

  scaleHex(hex, mult) {
    const c = new THREE.Color(hex);
    return { r: c.r * mult, g: c.g * mult, b: c.b * mult };
  }

  // =========================================================================
  // 1. DENSE PARTICLE HOUSE GENERATOR (MASS / VOLUME)
  // =========================================================================
  createParticleHouse(options = {}) {
    const {
      position = new THREE.Vector3(0, 0, 0),
      rotationY = 0,
      width = 4.0,
      depth = 3.2,
      height = 3.2,
      roofHeight = 2.2,
      lightColor = 0xffb32c,
      wallColor = 0x1c2233,
      hasChimney = true,
      hasWreath = false,
      hasFairyLights = true,
      rooftopDecor = null, // "star" | "tree" | null
      density = 1.0,       // 1.0 foreground, 0.65 midground, 0.35 background
      brightness = 1.0,    // atmospheric perspective dimming for distant buildings
      sizeScale = 1.0      // smaller particles for more distant buildings
    } = options;

    const ox = position.x;
    const oy = position.y;
    const oz = position.z;

    const wallRGB    = this.scaleHex(wallColor, brightness);
    const wallAltRGB = this.scaleHex(0x28211b, brightness);
    const snowRGB    = this.scaleHex(0xeef6ff, 0.85 * brightness + 0.15 * brightness);
    const snowIceRGB = this.scaleHex(0x9ec5e8, 0.72 * brightness);
    const winRGB     = this.scaleHex(lightColor, Math.min(1.0, brightness * 1.15));
    const winHotRGB  = this.scaleHex(0xffe494, Math.min(1.0, brightness * 1.1));

    const addRGB = (lx, ly, lz, rgb, size = 0.16, type = 0, speed = 1.0) => {
      const rot = this.rotatePoint(lx, lz, rotationY);
      this.engine.addParticleRGB(ox + rot.x, oy + ly, oz + rot.z, rgb.r, rgb.g, rgb.b, size * sizeScale, type, speed);
    };

    const addHex = (lx, ly, lz, hex, size = 0.16, type = 0, speed = 1.0) => {
      const rgb = this.scaleHex(hex, brightness);
      addRGB(lx, ly, lz, rgb, size, type, speed);
    };

    const halfW = width / 2;
    const halfD = depth / 2;
    const overhang = 0.28;

    // Precompute window rects on front face so wall fill skips them cleanly
    const winCols = width >= 3.5 ? 2 : 1;
    const winW = Math.min(0.82, width * 0.22);
    const winH = Math.min(0.95, height * 0.30);
    const winY = height * 0.26;
    const hasUpperFloor = height >= 2.85;
    const upY = height * 0.62;
    const winXOffsets = winCols === 2 ? [-halfW * 0.48, halfW * 0.48] : [0];

    const isInsideFrontWindow = (x, y) => {
      for (let i = 0; i < winXOffsets.length; i++) {
        const wx = winXOffsets[i];
        if (Math.abs(x - wx) <= winW * 0.52 && y >= winY && y <= winY + winH) return true;
        if (hasUpperFloor && Math.abs(x - wx) <= winW * 0.52 && y >= upY && y <= upY + winH * 0.85) return true;
      }
      return false;
    };

    // A. FILLED WALL VOLUMES (Front, Left, Right, and Gable Triangles)
    // Surface area-proportional particle count for true solid mass
    const frontArea = width * height;
    const frontCount = Math.floor(frontArea * 28 * density);
    for (let i = 0; i < frontCount; i++) {
      const lx = (Math.random() - 0.5) * width;
      const ly = Math.random() * height;
      if (isInsideFrontWindow(lx, ly)) continue;
      const lz = halfD + (Math.random() - 0.5) * 0.10;
      const rgb = Math.random() < 0.65 ? wallRGB : wallAltRGB;
      addRGB(lx, ly, lz, rgb, 0.15 + Math.random() * 0.06, 0);
    }

    // Side walls (Left & Right)
    const sideArea = depth * height;
    const sideCount = Math.floor(sideArea * 22 * density);
    [-halfW, halfW].forEach(sideX => {
      for (let i = 0; i < sideCount; i++) {
        const lz = (Math.random() - 0.5) * depth;
        const ly = Math.random() * height;
        const lx = sideX + (Math.random() - 0.5) * 0.10;
        const rgb = Math.random() < 0.7 ? wallRGB : wallAltRGB;
        addRGB(lx, ly, lz, rgb, 0.15 + Math.random() * 0.05, 0);
      }
      // Side wall warm window
      if (depth >= 2.4 && density >= 0.45) {
        const swCount = Math.floor(26 * density);
        for (let i = 0; i < swCount; i++) {
          const wz = (Math.random() - 0.5) * 0.75;
          const wy = winY + Math.random() * (winH * 0.85);
          addRGB(sideX + (sideX > 0 ? 0.04 : -0.04), wy, wz, winRGB, 0.16, 0);
        }
      }
    });

    // Front & Back Gable Triangles (Filled dark mass under the snow roof)
    const gableArea = 0.5 * width * roofHeight;
    const gableCount = Math.floor(gableArea * 26 * density);
    [halfD, -halfD].forEach((gz, idx) => {
      const mult = idx === 0 ? 1.0 : 0.45;
      const cnt = Math.floor(gableCount * mult);
      for (let i = 0; i < cnt; i++) {
        const u = Math.random();
        const v = Math.random();
        const frac = 1.0 - Math.sqrt(u); // uniform in triangle
        const ly = height + frac * roofHeight;
        const span = halfW * (1.0 - frac);
        const lx = (v * 2.0 - 1.0) * span;
        addRGB(lx, ly, gz + (Math.random() - 0.5) * 0.08, wallRGB, 0.15, 0);
      }
    });

    // B. DENSE WARM YELLOW WINDOWS (Front Facade)
    winXOffsets.forEach(wx => {
      const fillWin = (wy, wh) => {
        const count = Math.floor(82 * density) + 22;
        for (let i = 0; i < count; i++) {
          const rx = (Math.random() - 0.5) * winW;
          const ry = Math.random() * wh;
          // Subtle mullion gap
          if (Math.abs(rx) < 0.035 || Math.abs(ry - wh * 0.5) < 0.035) continue;
          const isCore = Math.abs(rx) < winW * 0.34 && Math.abs(ry - wh * 0.5) < wh * 0.34;
          addRGB(wx + rx, wy + ry, halfD + 0.06, isCore ? winHotRGB : winRGB, 0.19 + Math.random() * 0.06, 0);
        }
      };

      fillWin(winY, winH);
      if (hasUpperFloor) {
        fillWin(upY, winH * 0.85);
      }
    });

    // Optional Warm Doorway on Center-Front (for wider houses)
    if (width >= 3.4 && density >= 0.6) {
      const doorW = 0.62, doorH = 1.15;
      const doorCount = Math.floor(28 * density);
      for (let i = 0; i < doorCount; i++) {
        const dx = (Math.random() - 0.5) * doorW;
        const dy = Math.random() * doorH;
        const isWarm = dy > doorH * 0.55 && Math.abs(dx) < doorW * 0.32;
        addRGB(dx, dy, halfD + 0.05, isWarm ? winRGB : wallAltRGB, 0.15, 0);
      }
    }

    // C. DENSE IRREGULAR SNOW-COVERED ROOF (VOLUMETRIC MASS, NOT LINES)
    const slopeLen = Math.hypot(halfW + overhang, roofHeight);
    const roofArea = 2 * slopeLen * (depth + overhang * 2);
    const roofParticles = Math.floor(roofArea * 34 * density);

    for (let i = 0; i < roofParticles; i++) {
      const side = Math.random() < 0.5 ? -1 : 1;
      const frac = Math.random(); // 0 at eave, 1 at ridge
      const lz = (Math.random() - 0.5) * (depth + overhang * 2);
      const lx = side * (halfW + overhang) * (1.0 - frac);
      // Irregular fluffy snow thickness
      const clump = 0.06 + 0.14 * Math.sin(lz * 2.3 + lx * 3.1) * 0.5 + Math.random() * 0.14;
      const ly = height + frac * roofHeight + clump;

      // Mix pure snow white and soft blue-white for winter depth
      const isIce = Math.random() < 0.28 || clump < 0.10;
      const pSize = (0.14 + Math.random() * 0.09) * (0.85 + 0.15 * density);
      addRGB(lx + (Math.random() - 0.5) * 0.09, ly, lz, isIce ? snowIceRGB : snowRGB, pSize, 0);
    }

    // Thick irregular snow ridge & eave drifts
    const ridgeCount = Math.floor((depth + overhang * 2) * 14 * density);
    for (let i = 0; i < ridgeCount; i++) {
      const lz = (Math.random() - 0.5) * (depth + overhang * 2);
      addRGB((Math.random() - 0.5) * 0.16, height + roofHeight + 0.08 + Math.random() * 0.10, lz, snowRGB, 0.18, 0);
    }

    // D. CHRISTMAS FAIRY LIGHTS ALONG EAVES (Yellow / Red / Green)
    if (hasFairyLights) {
      const bulbCount = Math.max(8, Math.floor(width * 3.8 * density));
      const palette = [0xffcf33, 0xff2a44, 0x22dd66, 0xffe68a];
      for (let b = 0; b <= bulbCount; b++) {
        const u = b / bulbCount;
        const bx = -halfW - overhang + u * (width + overhang * 2);
        const sag = -0.11 * Math.abs(Math.sin(u * Math.PI * 3.0));
        const col = palette[b % palette.length];
        addHex(bx, height + sag - 0.02, halfD + overhang + 0.05, col, 0.22, 1, 2.2);
      }
    }

    // E. CHRISTMAS WREATH
    if (hasWreath && density >= 0.6) {
      const wy = hasUpperFloor ? height * 0.48 : height * 0.80;
      for (let w = 0; w < 14; w++) {
        const wa = (w / 14) * TAU;
        addHex(Math.cos(wa) * 0.24, wy + Math.sin(wa) * 0.24, halfD + 0.10, 0x188c3a, 0.15, 0);
      }
      addHex(0, wy - 0.24, halfD + 0.12, 0xff2442, 0.18, 1);
    }

    // F. CHIMNEY WITH SNOW CAP & SUBTLE SMOKE
    if (hasChimney && density >= 0.45) {
      const chX = halfW * 0.48;
      const chZ = -halfD * 0.25;
      const chBaseY = height + roofHeight * 0.42;
      const chH = roofHeight * 0.72;
      const chW = 0.46;

      const chCount = Math.floor(34 * density);
      for (let i = 0; i < chCount; i++) {
        addRGB(
          chX + (Math.random() - 0.5) * chW,
          chBaseY + Math.random() * chH,
          chZ + (Math.random() - 0.5) * chW,
          wallRGB, 0.15, 0
        );
      }
      // Snow cap
      for (let i = 0; i < 8; i++) {
        addRGB(chX + (Math.random() - 0.5) * chW, chBaseY + chH + 0.05, chZ + (Math.random() - 0.5) * chW, snowRGB, 0.16, 0);
      }
      // Soft smoke wisp
      const smokeCol = this.scaleHex(0x6e7d91, brightness * 0.55);
      for (let sm = 1; sm <= 10; sm++) {
        const su = sm / 10;
        addRGB(
          chX + Math.sin(su * 2.5) * 0.35 * su + (Math.random() - 0.5) * 0.18,
          chBaseY + chH + su * 2.2,
          chZ + (Math.random() - 0.5) * 0.18,
          smokeCol, 0.14 + su * 0.10, 0
        );
      }
    }

    // G. OPTIONAL ROOFTOP CHRISTMAS DECORATIONS
    if (rooftopDecor === "star") {
      const ry = height + roofHeight + 0.45;
      for (let b = 0; b < 8; b++) {
        const a = (b / 8) * TAU;
        for (let s = 1; s <= 4; s++) {
          addHex(Math.cos(a) * s * 0.09, ry + Math.sin(a) * s * 0.09, halfD * 0.7, 0xffd24d, 0.16, 2, 2.2);
        }
      }
    } else if (rooftopDecor === "tree") {
      const ry = height + roofHeight * 0.55;
      for (let i = 0; i < 45; i++) {
        const u = Math.random();
        const r = 0.42 * (1.0 - u);
        const a = Math.random() * TAU;
        addHex(-halfW * 0.45 + Math.cos(a) * r, ry + u * 1.0, halfD * 0.35 + Math.sin(a) * r, i % 6 === 0 ? 0xffcc33 : 0x166b2c, 0.14, i % 6 === 0 ? 1 : 0);
      }
    }
  }

  // =========================================================================
  // 1B. LIGHTWEIGHT DISTANT VILLAGE HOUSE (LAYERS 6 & 7: Z = -24 to -68)
  // Dense enough to read as a snow-roofed house with warm windows,
  // lightweight enough to render 50+ distant houses at 60 FPS.
  // =========================================================================
  createDistantHouse(options = {}) {
    const {
      position = new THREE.Vector3(0, 0, -40),
      rotationY = 0,
      width = 2.6,
      depth = 2.0,
      height = 2.0,
      roofHeight = 1.3,
      brightness = 0.45,
      sizeScale = 0.78,
      hasLights = false
    } = options;

    const ox = position.x;
    const oy = position.y;
    const oz = position.z;

    const wallRGB = this.scaleHex(0x181f2e, brightness * 0.9);
    const snowRGB = this.scaleHex(0xdcecff, brightness * 0.95);
    const winRGB  = this.scaleHex(0xffb533, Math.min(0.95, brightness * 1.25));

    const addRGB = (lx, ly, lz, rgb, size = 0.15, type = 0) => {
      const rot = this.rotatePoint(lx, lz, rotationY);
      this.engine.addParticleRGB(ox + rot.x, oy + ly, oz + rot.z, rgb.r, rgb.g, rgb.b, size * sizeScale, type, 1.4);
    };

    const halfW = width / 2;
    const halfD = depth / 2;

    // 1. Subtle dark wall silhouette mass
    const wallCount = Math.floor(38 + width * height * 5);
    for (let i = 0; i < wallCount; i++) {
      const lx = (Math.random() - 0.5) * width;
      const ly = Math.random() * height;
      const lz = halfD + (Math.random() - 0.5) * 0.2;
      addRGB(lx, ly, lz, wallRGB, 0.16, 0);
    }

    // 2. Dense white snow roof mass (primary visual read at distance)
    const roofCount = Math.floor(55 + width * roofHeight * 14);
    for (let i = 0; i < roofCount; i++) {
      const side = Math.random() < 0.5 ? -1 : 1;
      const frac = Math.random();
      const lx = side * (halfW + 0.18) * (1.0 - frac);
      const lz = (Math.random() - 0.5) * (depth + 0.3);
      const ly = height + frac * roofHeight + Math.random() * 0.10;
      addRGB(lx, ly, lz, snowRGB, 0.16 + Math.random() * 0.05, 0);
    }

    // 3. Warm yellow window specks (2 to 4 warm glowing panes)
    const winCount = width > 2.4 ? 2 : 1;
    const xs = winCount === 2 ? [-halfW * 0.44, halfW * 0.44] : [0];
    xs.forEach(wx => {
      for (let i = 0; i < 16; i++) {
        addRGB(
          wx + (Math.random() - 0.5) * 0.55,
          height * 0.28 + Math.random() * (height * 0.38),
          halfD + 0.06,
          winRGB, 0.18, 0
        );
      }
      if (height > 2.4) {
        for (let i = 0; i < 10; i++) {
          addRGB(
            wx + (Math.random() - 0.5) * 0.50,
            height * 0.68 + Math.random() * (height * 0.25),
            halfD + 0.06,
            winRGB, 0.17, 0
          );
        }
      }
    });

    // 4. Optional faint Christmas eave lights
    if (hasLights) {
      const cols = [0xffc833, 0xff334b, 0x28cc66];
      for (let i = 0; i <= 5; i++) {
        const lx = -halfW + (i / 5) * width;
        const c = this.scaleHex(cols[i % cols.length], brightness * 1.15);
        addRGB(lx, height, halfD + 0.12, c, 0.17, 1);
      }
    }
  }

  // =========================================================================
  // 2. DENSE PARTICLE GOTHIC CATHEDRAL (BACKGROUND LANDMARK)
  // =========================================================================
  createParticleCathedral(options = {}) {
    const {
      position = new THREE.Vector3(11.5, 0, -13.5),
      rotationY = -0.52,
      width = 5.0,
      depth = 8.2,
      height = 5.2,
      spireHeight = 6.8,
      brightness = 0.78
    } = options;

    const ox = position.x;
    const oy = position.y;
    const oz = position.z;

    const stoneDarkRGB = this.scaleHex(0x1b202e, brightness);
    const stoneMidRGB  = this.scaleHex(0x2c3448, brightness);
    const snowRGB      = this.scaleHex(0xe8f4ff, brightness * 0.92);
    const goldRGB      = this.scaleHex(0xffc933, brightness);
    const portalRGB    = this.scaleHex(0xff9e1f, brightness * 1.1);
    const winRGB       = this.scaleHex(0xffbe3b, brightness);

    const addRGB = (lx, ly, lz, rgb, size = 0.16, type = 0, speed = 1.0) => {
      const rot = this.rotatePoint(lx, lz, rotationY);
      this.engine.addParticleRGB(ox + rot.x, oy + ly, oz + rot.z, rgb.r, rgb.g, rgb.b, size, type, speed);
    };

    const halfW = width / 2;
    const halfD = depth / 2;

    // Filled Front & Side Nave Walls
    for (let i = 0; i < 650; i++) {
      const lx = (Math.random() - 0.5) * width;
      const ly = Math.random() * height;
      addRGB(lx, ly, halfD + (Math.random() - 0.5) * 0.12, Math.random() < 0.6 ? stoneDarkRGB : stoneMidRGB, 0.16, 0);
    }
    [-halfW, halfW].forEach(sx => {
      for (let i = 0; i < 420; i++) {
        addRGB(sx + (Math.random() - 0.5) * 0.12, Math.random() * height, (Math.random() - 0.5) * depth, stoneDarkRGB, 0.15, 0);
      }
    });

    // Side Nave Warm Arched Windows
    for (let z = -halfD + 1.2; z <= halfD - 1.2; z += 1.55) {
      for (let i = 0; i < 28; i++) {
        const wy = 1.6 + Math.random() * 2.0;
        const wz = z + (Math.random() - 0.5) * 0.55;
        addRGB(-halfW - 0.06, wy, wz, winRGB, 0.16, 0);
      }
    }

    // Grand Arched Illuminated Entrance Portal
    const portalW = 1.85, portalH = 2.6;
    for (let i = 0; i < 160; i++) {
      const px = (Math.random() - 0.5) * portalW;
      const py = Math.random() * portalH;
      // Arch top
      if (py > portalH - 0.7 && Math.hypot(px, py - (portalH - 0.7)) > portalW * 0.52) continue;
      addRGB(px, py, halfD + 0.10, portalRGB, 0.18, 1, 1.0);
    }

    // Glowing Circular Rose Window
    const roseY = height - 1.15;
    const roseR = 0.80;
    for (let i = 0; i < 110; i++) {
      const r = Math.sqrt(Math.random()) * roseR;
      const a = Math.random() * TAU;
      addRGB(Math.cos(a) * r, roseY + Math.sin(a) * r, halfD + 0.12, winRGB, 0.17, 1, 1.5);
    }

    // Filled Nave Gabled Snow Roof
    for (let i = 0; i < 820; i++) {
      const side = Math.random() < 0.5 ? -1 : 1;
      const frac = Math.random();
      const lz = (Math.random() - 0.5) * (depth + 0.4);
      const lx = side * (halfW + 0.25) * (1.0 - frac);
      const ly = height + frac * 2.1 + Math.random() * 0.12;
      addRGB(lx, ly, lz, snowRGB, 0.17, 0);
    }

    // Majestic Twin Spires (Dense volumetric stone + snow cones)
    const spireW = 1.38;
    const spireOffsets = [-halfW + spireW / 2, halfW - spireW / 2];

    spireOffsets.forEach(sx => {
      const sz = halfD - spireW / 2;
      const towerBaseH = height + 1.2;

      // Filled tower shaft
      for (let i = 0; i < 240; i++) {
        const face = Math.floor(Math.random() * 4);
        let dx = (Math.random() - 0.5) * spireW;
        let dz = (Math.random() - 0.5) * spireW;
        if (face === 0) dz = spireW / 2;
        else if (face === 1) dz = -spireW / 2;
        else if (face === 2) dx = spireW / 2;
        else dx = -spireW / 2;
        addRGB(sx + dx, Math.random() * towerBaseH, sz + dz, stoneMidRGB, 0.15, 0);
      }

      // Belfry glowing windows
      for (let i = 0; i < 36; i++) {
        addRGB(sx + (Math.random() - 0.5) * 0.48, height - 0.3 + Math.random() * 1.15, sz + spireW / 2 + 0.06, winRGB, 0.16, 0);
      }

      // Filled conical/pyramidal spire roof
      const spireApex = towerBaseH + spireHeight;
      for (let i = 0; i < 320; i++) {
        const u = 1.0 - Math.sqrt(Math.random());
        const sy = towerBaseH + u * spireHeight;
        const sr = (spireW * 0.56) * (1.0 - u);
        const a = Math.random() * TAU;
        const isSnow = u > 0.45 || Math.random() < 0.35;
        addRGB(sx + Math.cos(a) * sr, sy, sz + Math.sin(a) * sr, isSnow ? snowRGB : stoneMidRGB, 0.16, 0);
      }

      // Golden Cross atop Spire
      for (let cy = 0; cy <= 0.85; cy += 0.10) {
        addRGB(sx, spireApex + cy, sz, goldRGB, 0.19, 1, 1.8);
      }
      for (let cx = -0.28; cx <= 0.28; cx += 0.10) {
        addRGB(sx + cx, spireApex + 0.52, sz, goldRGB, 0.19, 1, 1.8);
      }
    });
  }

  // =========================================================================
  // 3. DENSE PARTICLE CLOCK TOWER (LEFT BACKGROUND LANDMARK)
  // =========================================================================
  createParticleClockTower(options = {}) {
    const {
      position = new THREE.Vector3(-11.2, 0, -11.5),
      rotationY = 0.38,
      width = 2.7,
      height = 7.2,
      roofHeight = 3.0,
      brightness = 0.80
    } = options;

    const ox = position.x;
    const oy = position.y;
    const oz = position.z;

    const stoneDarkRGB = this.scaleHex(0x1b202e, brightness);
    const stoneMidRGB  = this.scaleHex(0x2e364a, brightness);
    const snowRGB      = this.scaleHex(0xe8f4ff, brightness * 0.92);
    const goldRGB      = this.scaleHex(0xffc933, brightness);
    const clockRGB     = this.scaleHex(0xffe48a, brightness * 1.1);

    const addRGB = (lx, ly, lz, rgb, size = 0.16, type = 0, speed = 1.0) => {
      const rot = this.rotatePoint(lx, lz, rotationY);
      this.engine.addParticleRGB(ox + rot.x, oy + ly, oz + rot.z, rgb.r, rgb.g, rgb.b, size, type, speed);
    };

    const halfW = width / 2;

    // Filled Square Tower Shaft
    for (let i = 0; i < 420; i++) {
      const face = Math.floor(Math.random() * 4);
      let dx = (Math.random() - 0.5) * width;
      let dz = (Math.random() - 0.5) * width;
      if (face === 0) dz = halfW;
      else if (face === 1) dz = -halfW;
      else if (face === 2) dx = halfW;
      else dx = -halfW;
      addRGB(dx, Math.random() * height, dz, Math.random() < 0.65 ? stoneDarkRGB : stoneMidRGB, 0.16, 0);
    }

    // Illuminated Circular Clock Face
    const clockY = height - 1.35;
    const clockR = 0.80;
    for (let i = 0; i < 120; i++) {
      const r = Math.sqrt(Math.random()) * clockR;
      const a = Math.random() * TAU;
      addRGB(Math.cos(a) * r, clockY + Math.sin(a) * r, halfW + 0.08, clockRGB, 0.17, 1, 1.2);
    }
    for (let i = 0; i < 28; i++) {
      const a = (i / 28) * TAU;
      addRGB(Math.cos(a) * (clockR + 0.05), clockY + Math.sin(a) * (clockR + 0.05), halfW + 0.10, goldRGB, 0.17, 1);
    }

    // Filled Pyramidal Snow Roof
    const roofApex = height + roofHeight;
    for (let i = 0; i < 360; i++) {
      const u = 1.0 - Math.sqrt(Math.random());
      const ry = height + u * roofHeight;
      const rw = (halfW + 0.22) * (1.0 - u);
      const face = Math.floor(Math.random() * 4);
      let dx = (Math.random() * 2 - 1) * rw;
      let dz = (Math.random() * 2 - 1) * rw;
      if (face === 0) dz = rw;
      else if (face === 1) dz = -rw;
      else if (face === 2) dx = rw;
      else dx = -rw;
      addRGB(dx, ry + Math.random() * 0.08, dz, u > 0.22 ? snowRGB : stoneMidRGB, 0.17, 0);
    }

    // Roof Spire Pin
    for (let py = 0; py <= 0.75; py += 0.10) {
      addRGB(0, roofApex + py, 0, goldRGB, 0.19, 1);
    }
  }
}
