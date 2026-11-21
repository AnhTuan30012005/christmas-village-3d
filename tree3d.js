/* ==========================================================================
   AGAC.PY - 3D ASCII CHRISTMAS VILLAGE & CATHEDRAL SQUARE ENGINE
   Faithfully reconstructs the exact scene from the reference photo:
   - Center: Majestic 3D Christmas Tree on circular stone planter with fence,
     golden star topper with radiant rays, tinsel garland, lights, and gifts.
   - Right: Gothic Twin-Spire Cathedral with glowing rose window, illuminated
     grand portal, arched windows, and golden spires with crosses (✝).
   - Left: Alpine Stone Clock Tower with illuminated clock face and townhouses.
   - Foreground: Christmas Market Stalls (Huttes) with red/white striped canopies,
     cozy cottages with thick puffy snow roofs and festive eave string lights.
   - Plaza: Cobblestone plaza with radial pathways, Victorian streetlamps,
     mini snowy pines, and drifting winter flurries under a starry sky.
   ========================================================================== */

const TAU = 2 * Math.PI;

// Element Types
const TYPE_NEEDLE       = 0;
const TYPE_SNOWCAP      = 1;
const TYPE_TRUNK        = 2;
const TYPE_GARLAND      = 3;
const TYPE_LIGHT        = 4;
const TYPE_BALL         = 5;
const TYPE_GIFT         = 6;
const TYPE_STAR         = 7;
const TYPE_BEAM         = 8;
const TYPE_GROUND       = 9;

// Village & Landmark Element Types
const TYPE_CATHEDRAL    = 10;
const TYPE_SPIRE        = 11;
const TYPE_CROSS        = 12;
const TYPE_ROSE_WINDOW  = 13;
const TYPE_PORTAL_LIT   = 14;
const TYPE_CLOCK_TOWER  = 15;
const TYPE_CLOCK_FACE   = 16;
const TYPE_COTTAGE_WALL = 17;
const TYPE_ROOF_SNOW    = 18;
const TYPE_WINDOW_LIT   = 19;
const TYPE_STALL_WOOD   = 20;
const TYPE_STALL_AWN_R  = 21; // Red stripe
const TYPE_STALL_AWN_W  = 22; // White stripe
const TYPE_EAVE_LIGHT   = 23; // Colored roofline lights
const TYPE_LAMP_POST    = 24;
const TYPE_LAMP_GLOW    = 25;
const TYPE_FENCE        = 26;
const TYPE_MINI_PINE    = 27;

const MONO_FONT = "'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, 'Courier New', monospace";

// Theme Palettes
const THEMES = {
  classic: {
    name: "Classic Noel",
    foliage: [[35, 134, 54], [46, 160, 67], [25, 108, 46], [13, 68, 32]],
    snow: [242, 248, 255],
    trunk: [[139, 90, 43], [92, 58, 33]],
    garland: [255, 215, 0],
    star: [255, 230, 80],
    lights: [[255, 51, 68], [255, 204, 0], [0, 229, 255], [63, 185, 80], [255, 64, 129]],
    ground: [45, 52, 64],
    skySnow: [220, 235, 255],
    stone: [[85, 95, 115], [70, 78, 92], [95, 105, 125]],
    warmLight: [255, 195, 45],
    spireCross: [255, 215, 0],
    stallRed: [230, 45, 55],
    woodWall: [[75, 55, 42], [90, 65, 48], [60, 45, 35]]
  },
  cyberpunk: {
    name: "Cyberpunk 2077",
    foliage: [[10, 80, 80], [0, 180, 160], [20, 50, 70], [0, 230, 200]],
    snow: [255, 100, 200],
    trunk: [[60, 30, 80], [40, 20, 60]],
    garland: [0, 255, 240],
    star: [255, 0, 128],
    lights: [[255, 0, 128], [0, 255, 240], [255, 230, 0], [180, 0, 255]],
    ground: [50, 30, 80],
    skySnow: [0, 240, 255],
    stone: [[50, 35, 75], [40, 25, 65], [60, 45, 90]],
    warmLight: [255, 0, 180],
    spireCross: [0, 255, 240],
    stallRed: [255, 0, 128],
    woodWall: [[40, 25, 55], [50, 30, 70], [30, 20, 45]]
  },
  arctic: {
    name: "Arctic Ice",
    foliage: [[40, 80, 100], [70, 130, 160], [100, 160, 190], [150, 200, 230]],
    snow: [255, 255, 255],
    trunk: [[70, 85, 105], [50, 65, 85]],
    garland: [190, 230, 255],
    star: [220, 245, 255],
    lights: [[120, 210, 255], [255, 255, 255], [170, 190, 255], [80, 160, 240]],
    ground: [70, 90, 120],
    skySnow: [240, 250, 255],
    stone: [[80, 100, 130], [65, 85, 110], [95, 115, 145]],
    warmLight: [180, 225, 255],
    spireCross: [230, 245, 255],
    stallRed: [100, 170, 240],
    woodWall: [[60, 80, 105], [70, 90, 115], [50, 70, 95]]
  },
  golden: {
    name: "Golden Glamour",
    foliage: [[60, 50, 20], [120, 95, 30], [170, 135, 45], [90, 70, 25]],
    snow: [255, 240, 200],
    trunk: [[90, 60, 30], [60, 40, 20]],
    garland: [255, 235, 140],
    star: [255, 255, 180],
    lights: [[255, 215, 0], [255, 160, 50], [255, 240, 150], [255, 110, 30]],
    ground: [70, 55, 35],
    skySnow: [255, 245, 220],
    stone: [[105, 85, 55], [90, 70, 45], [120, 100, 65]],
    warmLight: [255, 210, 60],
    spireCross: [255, 235, 120],
    stallRed: [210, 75, 40],
    woodWall: [[85, 65, 40], [100, 75, 45], [70, 55, 35]]
  }
};

class Tree3DEngine {
  constructor(canvas, hudElements) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", { alpha: false });
    this.hud = hudElements;

    // Viewport & DPI
    this.width = canvas.clientWidth || window.innerWidth;
    this.height = canvas.clientHeight || window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Initial Camera Angle Matching Reference Photo Exactly
    this.yaw = 0.08;      // Slight right offset showing Cathedral on right & Clock on left
    this.pitch = 0.22;    // Elevated perspective looking down into the square
    this.camDist = 5.75;  // Wide-angle panoramic framing matching reference photo
    this.fov = 1.05;
    this.autoRotate = true;
    this.rotSpeed = 0.22; // rad/s for majestic slow panorama
    this.isDragging = false;
    this.prevMouse = { x: 0, y: 0 };

    // Timeline & Growth Animation
    this.timeline = 20.0; // Defaults to fully decorated grand scene
    this.totalDuration = 20.0;
    this.isFullyGrown = true;
    this.lastFrameTime = performance.now();
    this.fps = 60;
    this.frameCount = 0;
    this.fpsTimer = performance.now();

    // Theme & Options
    this.currentThemeKey = "classic";
    this.theme = THEMES.classic;
    this.snowDensity = 1.0;
    this.showGlow = true;
    this.showCity = true;

    // 3D Point Cloud Buffers
    this.points = [];
    this.cityPoints = [];
    this.snowParticles = [];
    this.lightCount = 0;

    // Build the grand 3D model
    this.initModel();
    this.initTownModel();
    this.initSnowParticles();
    this.bindEvents();
  }

  envelope(y, Y0, Y1) {
    const f = Math.max(0, Math.min(1, (y - Y0) / (Y1 - Y0)));
    return 0.03 + 0.84 * Math.pow(1 - f, 1.08);
  }

  fib(n) {
    const pts = [];
    for (let i = 0; i < n; i++) {
      const idx = i + 0.5;
      const y = 1 - 2 * idx / n;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const th = Math.PI * (3 - Math.sqrt(5)) * idx;
      pts.push({
        x: r * Math.cos(th),
        y: y,
        z: r * Math.sin(th)
      });
    }
    return pts;
  }

  // 1. Central 3D Christmas Tree & Circular Stone Dais
  initModel() {
    this.points = [];
    const Y0 = 0.42;
    const Y1 = 2.55;
    const tierCount = 14;
    const tips = [];

    let seed = 42;
    const rnd = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    const rndNorm = () => (rnd() + rnd() + rnd() + rnd() - 2) * 0.7;

    // Branches & Needles
    for (let i = 0; i < tierCount; i++) {
      const v = Y0 + 0.08 + (Y1 - Y0 - 0.23) * (i / (tierCount - 1));
      const R = this.envelope(v, Y0, Y1);
      const nb = Math.floor(6 + 8 * (1 - (v - Y0) / (Y1 - Y0)));

      for (let b = 0; b < nb; b++) {
        const a = (TAU * b) / nb + i * 0.618 * TAU + rndNorm() * 0.08;
        const L = R * (0.84 + rnd() * 0.22);
        const count = Math.floor(22 + 48 * (L / 0.8));

        const cosA = Math.cos(a), sinA = Math.sin(a);
        const d = { x: cosA, y: 0, z: sinA };
        const side = { x: -sinA, y: 0, z: cosA };

        for (let j = 0; j < count; j++) {
          const s = Math.pow(rnd(), 0.65);
          const spread = (0.035 + 0.11 * s) * rndNorm() * 0.35;
          const yy = v + 0.07 * s * L - 0.22 * Math.pow(s * L, 2) + rndNorm() * 0.025;

          const px = d.x * (s * L) + side.x * spread;
          const py = yy;
          const pz = d.z * (s * L) + side.z * spread;

          const nrm = {
            x: d.x * 0.75 + rndNorm() * 0.1,
            y: 0.55 + rndNorm() * 0.1,
            z: d.z * 0.75 + rndNorm() * 0.1
          };
          const nLen = Math.hypot(nrm.x, nrm.y, nrm.z) || 1;
          nrm.x /= nLen; nrm.y /= nLen; nrm.z /= nLen;

          const ao = 0.35 + 0.65 * Math.pow(s, 1.3);
          const t0 = 1.3 + 5.0 * ((v - Y0) / (Y1 - Y0)) + 0.45 * s;
          const isSnow = s > 0.45 && rnd() < 0.06 * s && nrm.y > 0.3;

          this.points.push({
            x: px, y: py, z: pz,
            nx: nrm.x, ny: nrm.y, nz: nrm.z,
            ao: ao,
            type: isSnow ? TYPE_SNOWCAP : TYPE_NEEDLE,
            colorIdx: Math.floor(rnd() * 4),
            t0: t0,
            glyph: isSnow ? ['*', '.', 'o', 'e'][Math.floor(rnd() * 4)] : ['%', '*', '#', '+', 'x', '&', '@'][Math.floor(rnd() * 7)]
          });
        }

        const tipY = v + 0.07 * L - 0.22 * L * L;
        tips.push({ x: d.x * L * 0.94, y: tipY, z: d.z * L * 0.94, dir: d });
      }
    }

    // Trunk
    const trunkHeight = 0.65;
    const trunkRad = 0.088;
    for (let th = -0.05; th <= trunkHeight; th += 0.035) {
      for (let ta = 0; ta < TAU; ta += TAU / 16) {
        const bark = 0.75 + 0.25 * Math.sin(th * 90 + ta * 3);
        this.points.push({
          x: trunkRad * Math.cos(ta),
          y: th,
          z: trunkRad * Math.sin(ta),
          nx: Math.cos(ta), ny: 0, nz: Math.sin(ta),
          ao: bark,
          type: TYPE_TRUNK,
          colorIdx: 0,
          t0: 0.8,
          glyph: ['#', '|', '%', 'I'][Math.floor(rnd() * 4)]
        });
      }
    }

    // Tinsel Garland
    const garlandPts = 550;
    const turns = 3.6;
    for (let g = 0; g < garlandPts; g++) {
      const u = g / garlandPts;
      const yg = Y0 + 0.15 + (Y1 - Y0 - 0.42) * u;
      const ag = TAU * turns * u + 0.9;
      const swag = -0.06 * Math.abs(Math.sin(ag * 2.5));
      const rg = this.envelope(yg, Y0, Y1) * 1.03 + 0.02;

      this.points.push({
        x: rg * Math.cos(ag),
        y: yg + swag,
        z: rg * Math.sin(ag),
        nx: Math.cos(ag), ny: 0.5, nz: Math.sin(ag),
        ao: 1.0,
        type: TYPE_GARLAND,
        t0: 8.0,
        glyph: ['~', '=', '*', 'o', '§', '#'][Math.floor(rnd() * 6)]
      });
    }

    // Golden Star Topper & 8 Radiant Light Beams
    const starCenterY = Y1 + 0.16;
    const starSphere = this.fib(90);
    starSphere.forEach(p => {
      this.points.push({
        x: p.x * 0.08,
        y: starCenterY + p.y * 0.08,
        z: p.z * 0.08,
        nx: p.x, ny: p.y, nz: p.z,
        ao: 1.0,
        type: TYPE_STAR,
        t0: 7.5,
        glyph: ['★', '✦', '#', '@', '8'][Math.floor(rnd() * 5)]
      });
    });

    const beamDirections = [
      { dx: 0, dy: 1, dz: 0, char: '|' },
      { dx: 0, dy: -1, dz: 0, char: '|' },
      { dx: 1, dy: 0, dz: 0, char: '-' },
      { dx: -1, dy: 0, dz: 0, char: '-' },
      { dx: 0.7, dy: 0.7, dz: 0, char: '/' },
      { dx: -0.7, dy: 0.7, dz: 0, char: '\\' },
      { dx: 0.7, dy: -0.7, dz: 0, char: '\\' },
      { dx: -0.7, dy: -0.7, dz: 0, char: '/' }
    ];
    beamDirections.forEach(dir => {
      for (let dist = 0.11; dist <= 0.45; dist += 0.04) {
        this.points.push({
          x: dir.dx * dist,
          y: starCenterY + dir.dy * dist,
          z: dir.dz * dist,
          nx: dir.dx, ny: dir.dy, nz: dir.dz,
          ao: 1.0 - (dist / 0.5) * 0.5,
          type: TYPE_BEAM,
          t0: 7.8,
          glyph: dist > 0.38 ? '*' : dir.char
        });
      }
    });

    // 170 Lights & Baubles
    let lightCounter = 0;
    tips.forEach((tip, idx) => {
      if (idx % 4 === 0) {
        const sphere = this.fib(12);
        const ballCol = idx % 4;
        sphere.forEach(bp => {
          this.points.push({
            x: tip.x + bp.x * 0.038,
            y: tip.y + bp.y * 0.038,
            z: tip.z + bp.z * 0.038,
            nx: bp.x, ny: bp.y, nz: bp.z,
            ao: 0.9,
            type: TYPE_BALL,
            colorIdx: ballCol,
            t0: 8.8,
            glyph: ['●', 'O', '0', '@'][Math.floor(rnd() * 4)]
          });
        });
      }

      if (lightCounter < 170) {
        lightCounter++;
        this.points.push({
          x: tip.x + (rnd() - 0.5) * 0.06,
          y: tip.y + (rnd() - 0.5) * 0.06,
          z: tip.z + (rnd() - 0.5) * 0.06,
          nx: tip.dir.x, ny: 0.5, nz: tip.dir.z,
          ao: 1.0,
          type: TYPE_LIGHT,
          colorIdx: lightCounter % 5,
          phase: rnd() * TAU,
          t0: 8.4,
          glyph: ['*', 'o', '+', '•'][Math.floor(rnd() * 4)]
        });
      }
    });
    this.lightCount = lightCounter;

    // Gifts under Tree
    const boxes = [
      { x: -0.32, y: 0.06, z: 0.30, size: 0.16, color: [220, 30, 50], ribCol: [255, 215, 0], t0: 10.2 },
      { x: 0.36, y: 0.05, z: 0.24, size: 0.14, color: [30, 110, 240], ribCol: [255, 255, 255], t0: 10.6 },
      { x: 0.04, y: 0.045, z: -0.38, size: 0.13, color: [240, 190, 20], ribCol: [35, 134, 54], t0: 11.0 }
    ];
    boxes.forEach(box => {
      const step = 0.035;
      const hs = box.size / 2;
      for (let bx = -hs; bx <= hs; bx += step) {
        for (let bz = -hs; bz <= hs; bz += step) {
          for (let by = -hs; by <= hs; by += step) {
            const isSurface = Math.abs(bx) >= hs - 0.01 || Math.abs(bz) >= hs - 0.01 || Math.abs(by) >= hs - 0.01;
            if (isSurface) {
              const isRibbon = Math.abs(bx) < 0.02 || Math.abs(bz) < 0.02;
              this.points.push({
                x: box.x + bx,
                y: box.y + by + hs,
                z: box.z + bz,
                nx: bx / hs, ny: by / hs, nz: bz / hs,
                ao: 0.85,
                type: TYPE_GIFT,
                customColor: isRibbon ? box.ribCol : box.color,
                t0: box.t0,
                glyph: isRibbon ? '+' : '#'
              });
            }
          }
        }
      }
    });

    // Circular Stone Dais Planter & Low Wooden Fence around Tree
    const planterRad = 0.72;
    for (let pa = 0; pa < TAU; pa += TAU / 32) {
      this.points.push({
        x: planterRad * Math.cos(pa),
        y: 0.06,
        z: planterRad * Math.sin(pa),
        type: TYPE_CATHEDRAL,
        glyph: '#',
        ao: 0.85
      });
    }

    const fenceRad = 0.86;
    for (let fa = 0; fa < TAU; fa += TAU / 28) {
      // Post
      this.points.push({
        x: fenceRad * Math.cos(fa),
        y: 0.12,
        z: fenceRad * Math.sin(fa),
        type: TYPE_FENCE,
        glyph: 'I',
        ao: 0.95
      });
      // Rail
      this.points.push({
        x: (fenceRad - 0.01) * Math.cos(fa + 0.1),
        y: 0.09,
        z: (fenceRad - 0.01) * Math.sin(fa + 0.1),
        type: TYPE_FENCE,
        glyph: '-',
        ao: 0.9
      });
    }

    // Plaza Cobblestones
    const groundRings = 24;
    for (let rIdx = 1; rIdx <= groundRings; rIdx++) {
      const gr = 0.2 + (rIdx / groundRings) * 2.8;
      const count = Math.floor(16 + rIdx * 7);
      for (let c = 0; c < count; c++) {
        const ga = (TAU * c) / count;
        const shadow = gr < 0.8 ? 0.35 + 0.65 * (gr / 0.8) : 1.0;
        this.points.push({
          x: gr * Math.cos(ga),
          y: -0.01,
          z: gr * Math.sin(ga),
          nx: 0, ny: 1, nz: 0,
          ao: shadow,
          type: TYPE_GROUND,
          t0: 0.0,
          glyph: gr > 2.0 ? '.' : ['-', '+', '.', '=', 'o'][Math.floor(rnd() * 5)]
        });
      }
    }
  }

  // 2. THE GRAND CHRISTMAS TOWN RECONSTRUCTION (From Reference Photo)
  initTownModel() {
    this.cityPoints = [];

    // =========================================================================
    // A. RIGHT LANDMARK: THE GOTHIC TWIN-SPIRE CATHEDRAL (Nhà Thờ Lớn Hai Tháp)
    // =========================================================================
    const cathX = 2.45, cathZ = -0.55;
    const cathW = 1.25, cathD = 1.6, cathH = 1.15;

    // 1. Cathedral Main Nave & Side Walls
    for (let y = 0.02; y <= cathH; y += 0.08) {
      // Facade (facing plaza, x)
      for (let w = -cathW/2; w <= cathW/2; w += 0.08) {
        const px = cathX + w;
        const pz = cathZ + cathD/2;

        // Grand Arched Golden Portal at Entrance
        const isPortal = y < 0.48 && Math.abs(w) < 0.22;
        if (isPortal) {
          this.cityPoints.push({
            x: px, y: y, z: pz,
            type: TYPE_PORTAL_LIT,
            glyph: y > 0.4 ? '∩' : '■',
            phase: Math.random() * TAU
          });
        } else {
          this.cityPoints.push({
            x: px, y: y, z: pz,
            type: TYPE_CATHEDRAL,
            glyph: ['#', 'H', 'I', '▓'][Math.floor(Math.random() * 4)],
            ao: 0.82 + 0.18 * (y / cathH)
          });
        }
      }

      // Nave Side Walls with Arched Illuminated Windows
      for (let d = -cathD/2; d < cathD/2; d += 0.09) {
        [-cathW/2, cathW/2].forEach((w, wIdx) => {
          const px = cathX + w;
          const pz = cathZ + d;
          // Arched windows along side
          const isSideWindow = y > 0.35 && y < 0.85 && (Math.abs(d) % 0.35 < 0.16);
          this.cityPoints.push({
            x: px, y: y, z: pz,
            type: isSideWindow ? TYPE_WINDOW_LIT : TYPE_CATHEDRAL,
            glyph: isSideWindow ? '∩' : '#',
            ao: 0.85
          });
        });
      }
    }

    // 2. Glowing Stained-Glass Rose Window on Facade
    const roseY = 0.82;
    const rosePts = this.fib(28);
    rosePts.forEach(rp => {
      this.cityPoints.push({
        x: cathX + rp.x * 0.18,
        y: roseY + rp.y * 0.18,
        z: cathZ + cathD/2 + 0.02,
        type: TYPE_ROSE_WINDOW,
        glyph: ['☼', '✦', 'o', '*', '8'][Math.floor(Math.random() * 5)],
        phase: Math.random() * TAU
      });
    });

    // 3. Cathedral Gabled Snow Roof
    const roofApex = cathH + 0.52;
    for (let ry = cathH; ry <= roofApex; ry += 0.07) {
      const rw = (cathW / 2) * (1 - (ry - cathH) / (roofApex - cathH));
      for (let rx = -rw; rx <= rw; rx += 0.08) {
        for (let rz = -cathD/2 - 0.04; rz <= cathD/2 + 0.04; rz += 0.08) {
          this.cityPoints.push({
            x: cathX + rx,
            y: ry,
            z: cathZ + rz,
            type: TYPE_ROOF_SNOW,
            glyph: ['*', '^', '▲', '#'][Math.floor(Math.random() * 4)],
            ao: 0.95
          });
        }
      }
    }

    // 4. Twin Spires (Tháp Chuông Đôi)
    const spireOffset = cathW * 0.38;
    const spireBaseY = cathH;
    const spireH = 1.55;
    [-spireOffset, spireOffset].forEach(ox => {
      const spX = cathX + ox;
      const spZ = cathZ + cathD/2 - 0.08;

      // Spire Tower shaft
      for (let sy = spireBaseY; sy <= spireBaseY + spireH; sy += 0.07) {
        const sw = 0.18 * (1 - (sy - spireBaseY) / spireH);
        for (let sx = -sw; sx <= sw; sx += 0.06) {
          for (let sz = -sw; sz <= sw; sz += 0.06) {
            this.cityPoints.push({
              x: spX + sx,
              y: sy,
              z: spZ + sz,
              type: TYPE_SPIRE,
              glyph: sy > spireBaseY + spireH - 0.15 ? '^' : ['#', '|', 'I'][Math.floor(Math.random() * 3)],
              ao: 0.9
            });
          }
        }
      }

      // Golden Cross (✝) at Apex of each spire!
      this.cityPoints.push({
        x: spX,
        y: spireBaseY + spireH + 0.08,
        z: spZ,
        type: TYPE_CROSS,
        glyph: '✝',
        ao: 1.0
      });
    });

    // =========================================================================
    // B. LEFT LANDMARK: THE STONE CLOCK TOWER (Tháp Đồng Hồ Cổ Kính)
    // =========================================================================
    const clkX = -2.35, clkZ = -0.75;
    const clkW = 0.65, clkH = 1.7;

    for (let y = 0.02; y <= clkH; y += 0.08) {
      for (let x = -clkW/2; x <= clkW/2; x += 0.08) {
        for (let z = -clkW/2; z <= clkW/2; z += 0.08) {
          const isSurface = Math.abs(x) >= clkW/2 - 0.04 || Math.abs(z) >= clkW/2 - 0.04;
          if (isSurface) {
            this.cityPoints.push({
              x: clkX + x,
              y: y,
              z: clkZ + z,
              type: TYPE_CLOCK_TOWER,
              glyph: ['#', 'H', 'I', '░'][Math.floor(Math.random() * 4)],
              ao: 0.8
            });
          }
        }
      }
    }

    // Glowing Circular Clock Face at Upper Tower
    const clkFaceY = 1.35;
    const clockPts = this.fib(22);
    clockPts.forEach(cp => {
      this.cityPoints.push({
        x: clkX + cp.x * 0.16,
        y: clkFaceY + cp.y * 0.16,
        z: clkZ + clkW/2 + 0.02,
        type: TYPE_CLOCK_FACE,
        glyph: ['●', 'O', '12', '3', '6', '9', '⏱'][Math.floor(Math.random() * 7)],
        phase: Math.random() * TAU
      });
    });

    // Clock Tower Peaked Snow Roof
    const clkRoofH = 0.45;
    for (let ry = 0; ry <= clkRoofH; ry += 0.06) {
      const rw = (clkW/2) * (1 - ry / clkRoofH);
      for (let rx = -rw; rx <= rw; rx += 0.06) {
        for (let rz = -rw; rz <= rw; rz += 0.06) {
          this.cityPoints.push({
            x: clkX + rx,
            y: clkH + ry,
            z: clkZ + rz,
            type: TYPE_ROOF_SNOW,
            glyph: '^',
            ao: 0.95
          });
        }
      }
    }

    // =========================================================================
    // C. FOREGROUND CHRISTMAS MARKET STALLS (Gian Hàng Hội Chợ Giáng Sinh)
    // =========================================================================
    const addMarketStall = (sx, sz, angle) => {
      const cosA = Math.cos(angle), sinA = Math.sin(angle);
      const rot = (x, z) => ({
        x: sx + x * cosA - z * sinA,
        z: sz + x * sinA + z * cosA
      });

      const sw = 0.52, sd = 0.42, sh = 0.38, awningH = 0.18;

      // Wooden counter & booth
      for (let y = 0.02; y <= sh; y += 0.06) {
        for (let x = -sw/2; x <= sw/2; x += 0.07) {
          const front = rot(x, sd/2);
          const back = rot(x, -sd/2);
          this.cityPoints.push({
            x: front.x, y: y, z: front.z,
            type: TYPE_STALL_WOOD,
            glyph: y > sh - 0.08 ? '=' : '#',
            ao: 0.85
          });
          this.cityPoints.push({
            x: back.x, y: y, z: back.z,
            type: TYPE_STALL_WOOD,
            glyph: '#',
            ao: 0.8
          });
        }
      }

      // Warm Golden Counter Light & Gingerbread Treats Display
      for (let lx = -sw/2 + 0.08; lx <= sw/2 - 0.08; lx += 0.08) {
        const lp = rot(lx, sd/2 - 0.05);
        this.cityPoints.push({
          x: lp.x, y: sh + 0.04, z: lp.z,
          type: TYPE_WINDOW_LIT,
          glyph: '☼',
          phase: Math.random() * TAU
        });
      }

      // Red & White Striped Canopy (Mái bạt sọc đỏ - trắng lễ hội)
      for (let ay = 0; ay <= awningH; ay += 0.04) {
        const span = (sw/2 + 0.06) * (1 - ay / (awningH * 1.5));
        for (let ax = -span; ax <= span; ax += 0.05) {
          for (let az = -sd/2; az <= sd/2 + 0.08; az += 0.05) {
            const pos = rot(ax, az);
            const isRedStripe = Math.floor((ax + 0.5) / 0.09) % 2 === 0;
            this.cityPoints.push({
              x: pos.x,
              y: sh + 0.12 + ay,
              z: pos.z,
              type: isRedStripe ? TYPE_STALL_AWN_R : TYPE_STALL_AWN_W,
              glyph: isRedStripe ? '=' : '~',
              ao: 0.95
            });
          }
        }
      }
    };

    // Stalls in foreground flanking the central square (like reference photo)
    addMarketStall(-1.45, 1.15, 0.4);
    addMarketStall(0.85, 1.35, -0.35);

    // =========================================================================
    // D. ALPINE COTTAGES WITH PUFFY SNOW ROOFS & EAVE FAIRY LIGHTS
    // =========================================================================
    const addCottage = (cx, cz, angle, width, depth, height, roofH, wallIdx) => {
      const cosA = Math.cos(angle), sinA = Math.sin(angle);
      const rot = (x, z) => ({
        x: cx + x * cosA - z * sinA,
        z: cz + x * sinA + z * cosA
      });

      const hw = width / 2, hd = depth / 2;
      const step = 0.08;

      // Timber Walls & Glowing Multi-paned Windows
      for (let y = 0.02; y <= height; y += step) {
        for (let x = -hw; x <= hw; x += step) {
          [-hd, hd].forEach((z, zIdx) => {
            const pos = rot(x, z);
            const isWindow = (y > 0.16 && y < 0.42 && Math.abs(x) < hw * 0.65 && Math.abs(x) > hw * 0.15) ||
                             (height > 0.55 && y > 0.46 && y < 0.68 && Math.abs(x) < hw * 0.5);

            if (isWindow && zIdx === 1) { // Facing plaza
              this.cityPoints.push({
                x: pos.x, y: y, z: pos.z,
                type: TYPE_WINDOW_LIT,
                glyph: ['■', '+', 'o', '#'][Math.floor(Math.random() * 4)],
                phase: Math.random() * TAU
              });
            } else {
              this.cityPoints.push({
                x: pos.x, y: y, z: pos.z,
                type: TYPE_COTTAGE_WALL,
                colorIdx: wallIdx,
                glyph: ['#', '|', 'H', 'I'][Math.floor(Math.random() * 4)],
                ao: 0.8
              });
            }
          });
        }
        for (let z = -hd; z <= hd; z += step) {
          [-hw, hw].forEach(x => {
            const pos = rot(x, z);
            this.cityPoints.push({
              x: pos.x, y: y, z: pos.z,
              type: TYPE_COTTAGE_WALL,
              colorIdx: wallIdx,
              glyph: ['#', '|', 'I'][Math.floor(Math.random() * 3)],
              ao: 0.8
            });
          });
        }
      }

      // Thick Puffy Snow Roof
      for (let ry = 0; ry <= roofH; ry += step * 0.8) {
        const span = hw * (1 - ry / roofH);
        for (let rx = -span; rx <= span; rx += step) {
          for (let rz = -hd - 0.05; rz <= hd + 0.05; rz += step) {
            const pos = rot(rx, rz);
            this.cityPoints.push({
              x: pos.x,
              y: height + ry,
              z: pos.z,
              type: TYPE_ROOF_SNOW,
              glyph: ['*', '^', '▲', '#', '•'][Math.floor(Math.random() * 5)],
              ao: 0.95
            });
          }
        }
      }

      // Eave Garland & Fairy String Lights along roofline (Dây đèn trang trí mái nhà)
      for (let ex = -hw - 0.03; ex <= hw + 0.03; ex += 0.07) {
        const ep = rot(ex, hd + 0.04);
        this.cityPoints.push({
          x: ep.x,
          y: height + 0.02,
          z: ep.z,
          type: TYPE_EAVE_LIGHT,
          colorIdx: Math.floor(Math.random() * 4),
          glyph: ['*', '•', 'o'][Math.floor(Math.random() * 3)],
          phase: Math.random() * TAU
        });
      }
    };

    // Surrounding European Houses (layout matching the photo)
    addCottage(-2.3, 1.25, -0.35, 0.65, 0.52, 0.58, 0.35, 0); // Front-left cottage
    addCottage(-2.7, 0.25, -0.15, 0.72, 0.55, 0.68, 0.38, 1); // Mid-left cottage
    addCottage(-1.8, -1.85, 0.35, 0.68, 0.50, 0.62, 0.36, 2); // Back-left cottage
    addCottage(-0.6, -2.35, 0.1, 0.62, 0.48, 0.58, 0.34, 0);  // Center-back cottage
    addCottage(0.9, -2.15, -0.2, 0.66, 0.50, 0.64, 0.36, 1);  // Back-right cottage
    addCottage(2.35, 1.15, 0.3, 0.68, 0.52, 0.60, 0.36, 2);   // Front-right cottage

    // =========================================================================
    // E. VICTORIAN WROUGHT-IRON STREETLAMPS & MINI SNOWY PINES
    // =========================================================================
    const lamps = [
      { x: 1.25, z: 0.45 },
      { x: -1.2, z: 0.48 },
      { x: 1.75, z: -0.65 },
      { x: -1.6, z: -0.45 },
      { x: 0.05, z: 1.55 },
      { x: -0.25, z: -1.25 }
    ];
    lamps.forEach(lp => {
      for (let ly = 0.0; ly <= 0.48; ly += 0.06) {
        this.cityPoints.push({
          x: lp.x, y: ly, z: lp.z,
          type: TYPE_LAMP_POST,
          glyph: ly > 0.42 ? 'T' : '|',
          ao: 0.9
        });
      }
      this.cityPoints.push({
        x: lp.x, y: 0.52, z: lp.z,
        type: TYPE_LAMP_GLOW,
        glyph: '☼',
        phase: Math.random() * TAU
      });
    });

    // Mini Snowy Pines dotted around plaza
    const miniPines = [
      { x: -0.9, z: 1.3, h: 0.55 },
      { x: 1.35, z: 0.95, h: 0.62 },
      { x: 1.75, z: -1.4, h: 0.70 },
      { x: -1.75, z: 0.85, h: 0.58 }
    ];
    miniPines.forEach(mp => {
      for (let py = 0.05; py <= mp.h; py += 0.06) {
        const rad = 0.22 * (1 - py / mp.h);
        for (let pa = 0; pa < TAU; pa += TAU / 8) {
          this.cityPoints.push({
            x: mp.x + rad * Math.cos(pa),
            y: py,
            z: mp.z + rad * Math.sin(pa),
            type: TYPE_MINI_PINE,
            glyph: ['*', '^', '%'][Math.floor(Math.random() * 3)],
            ao: 0.85
          });
        }
      }
    });
  }

  // 3. Falling Snowflakes (380 3D snow particles)
  initSnowParticles() {
    this.snowParticles = [];
    for (let i = 0; i < 380; i++) {
      this.snowParticles.push({
        x: (Math.random() - 0.5) * 7.5,
        y: Math.random() * 4.5,
        z: (Math.random() - 0.5) * 7.5,
        speedY: 0.15 + Math.random() * 0.28,
        driftPhase: Math.random() * TAU,
        glyph: ['*', '·', '.', '❄', '+', '•'][Math.floor(Math.random() * 6)]
      });
    }
  }

  updateSnow(dt) {
    const wind = Math.sin(this.timeline * 0.7) * 0.14;
    for (const p of this.snowParticles) {
      p.y -= p.speedY * dt;
      p.x += (Math.cos(this.timeline + p.driftPhase) * 0.08 + wind) * dt;
      if (p.y < 0) {
        p.y = 4.2 + Math.random() * 0.4;
        p.x = (Math.random() - 0.5) * 7.5;
        p.z = (Math.random() - 0.5) * 7.5;
      }
    }
  }

  // Event bindings for 3D Orbit Controls
  bindEvents() {
    const c = this.canvas;
    const onStart = (clientX, clientY) => {
      this.isDragging = true;
      this.prevMouse = { x: clientX, y: clientY };
    };
    const onMove = (clientX, clientY) => {
      if (!this.isDragging) return;
      const dx = clientX - this.prevMouse.x;
      const dy = clientY - this.prevMouse.y;
      this.yaw += dx * 0.007;
      this.pitch = Math.max(-0.25, Math.min(0.85, this.pitch + dy * 0.005));
      this.prevMouse = { x: clientX, y: clientY };
    };
    const onEnd = () => {
      this.isDragging = false;
    };

    c.addEventListener("mousedown", e => onStart(e.clientX, e.clientY));
    window.addEventListener("mousemove", e => onMove(e.clientX, e.clientY));
    window.addEventListener("mouseup", onEnd);

    c.addEventListener("touchstart", e => {
      if (e.touches.length === 1) onStart(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    window.addEventListener("touchmove", e => {
      if (e.touches.length === 1) onMove(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    window.addEventListener("touchend", onEnd);

    c.addEventListener("wheel", e => {
      e.preventDefault();
      this.camDist = Math.max(2.8, Math.min(8.8, this.camDist + e.deltaY * 0.003));
    }, { passive: false });

    window.addEventListener("resize", () => this.resize());
    this.resize();
  }

  resize() {
    const rect = this.canvas.parentElement ? this.canvas.parentElement.getBoundingClientRect() : { width: window.innerWidth, height: window.innerHeight };
    this.width = rect.width || window.innerWidth;
    this.height = rect.height || (window.innerHeight - 44);
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
  }

  setTheme(themeKey) {
    if (THEMES[themeKey]) {
      this.currentThemeKey = themeKey;
      this.theme = THEMES[themeKey];
    }
  }

  replayTimeline() {
    this.timeline = 0.0;
    this.isFullyGrown = false;
  }

  setFullyGrown() {
    this.timeline = this.totalDuration;
    this.isFullyGrown = true;
  }

  resetToPhotoAngle() {
    this.yaw = 0.08;
    this.pitch = 0.22;
    this.camDist = 5.75;
  }

  // Main Render Loop
  render(now) {
    const dt = Math.min(0.1, (now - this.lastFrameTime) / 1000);
    this.lastFrameTime = now;

    this.timeline += dt;
    if (this.timeline > this.totalDuration) {
      this.isFullyGrown = true;
    }

    if (this.autoRotate && !this.isDragging) {
      this.yaw += this.rotSpeed * dt;
    }
    this.yaw = this.yaw % TAU;

    this.updateSnow(dt);

    this.frameCount++;
    if (now - this.fpsTimer >= 500) {
      this.fps = Math.round((this.frameCount * 1000) / (now - this.fpsTimer));
      this.frameCount = 0;
      this.fpsTimer = now;
    }

    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    // Deep Winter Midnight Sky
    this.ctx.fillStyle = "#020409";
    this.ctx.fillRect(0, 0, this.width, this.height);

    const cosY = Math.cos(this.yaw), sinY = Math.sin(this.yaw);
    const cosP = Math.cos(this.pitch), sinP = Math.sin(this.pitch);

    const ldir = { x: 0.35, y: 0.75, z: 0.55 };
    const lMag = Math.hypot(ldir.x, ldir.y, ldir.z);
    ldir.x /= lMag; ldir.y /= lMag; ldir.z /= lMag;

    const projected = [];
    const cx = this.width * 0.5;
    const cy = this.height * 0.55;
    const projScale = this.height * this.fov;

    let activeLetters = 0;
    let activeLights = 0;

    // 1. Project Christmas Tree Points
    for (const pt of this.points) {
      if (this.timeline < pt.t0) continue;

      const x1 = pt.x * cosY + pt.z * sinY;
      const z1 = -pt.x * sinY + pt.z * cosY;

      const y2 = (pt.y - 1.2) * cosP - z1 * sinP;
      const z2 = (pt.y - 1.2) * sinP + z1 * cosP + this.camDist;

      if (z2 <= 0.2) continue;

      const invZ = 1 / z2;
      const sx = cx + x1 * projScale * invZ;
      const sy = cy - y2 * projScale * invZ;

      if (sx < -20 || sx > this.width + 20 || sy < -20 || sy > this.height + 20) continue;

      let diff = 0.5;
      if (pt.nx !== undefined) {
        const nx1 = pt.nx * cosY + pt.nz * sinY;
        const nz1 = -pt.nx * sinY + pt.nz * cosY;
        const ny2 = pt.ny * cosP - nz1 * sinP;
        const dot = Math.max(0, nx1 * ldir.x + ny2 * ldir.y + nz1 * ldir.z);
        diff = 0.35 + 0.65 * dot;
      }

      activeLetters++;
      if (pt.type === TYPE_LIGHT) activeLights++;

      projected.push({
        x: sx,
        y: sy,
        z: z2,
        scale: Math.max(6, Math.min(18, 14 * invZ * 3.5)),
        pt: pt,
        diff: diff
      });
    }

    // 2. Project Grand Christmas Town Points
    if (this.showCity) {
      for (const cpt of this.cityPoints) {
        const x1 = cpt.x * cosY + cpt.z * sinY;
        const z1 = -cpt.x * sinY + cpt.z * cosY;

        const y2 = (cpt.y - 1.2) * cosP - z1 * sinP;
        const z2 = (cpt.y - 1.2) * sinP + z1 * cosP + this.camDist;

        if (z2 <= 0.2) continue;

        const invZ = 1 / z2;
        const sx = cx + x1 * projScale * invZ;
        const sy = cy - y2 * projScale * invZ;

        if (sx < -40 || sx > this.width + 40 || sy < -40 || sy > this.height + 40) continue;

        activeLetters++;
        projected.push({
          x: sx,
          y: sy,
          z: z2,
          scale: Math.max(5, Math.min(16, 13 * invZ * 3.4)),
          pt: cpt,
          diff: 0.65
        });
      }
    }

    // 3. Project Falling Snow Particles
    for (const sp of this.snowParticles) {
      const x1 = sp.x * cosY + sp.z * sinY;
      const z1 = -sp.x * sinY + sp.z * cosY;
      const y2 = (sp.y - 1.2) * cosP - z1 * sinP;
      const z2 = (sp.y - 1.2) * sinP + z1 * cosP + this.camDist;
      if (z2 <= 0.2) continue;

      const invZ = 1 / z2;
      const sx = cx + x1 * projScale * invZ;
      const sy = cy - y2 * projScale * invZ;
      if (sx >= 0 && sx <= this.width && sy >= 0 && sy <= this.height) {
        projected.push({
          x: sx,
          y: sy,
          z: z2,
          scale: Math.max(5, Math.min(14, 12 * invZ * 3.2)),
          isSnowParticle: true,
          glyph: sp.glyph
        });
      }
    }

    // Depth Sorting
    projected.sort((a, b) => b.z - a.z);

    // Warm Ambient Radial Glow for Star, Cathedral Portal & Rose Window
    if (this.showGlow) {
      // 1. Star Topper Glow
      if (this.timeline >= 7.5) {
        const starPt = projected.find(p => p.pt && p.pt.type === TYPE_STAR);
        if (starPt) {
          const grad = this.ctx.createRadialGradient(starPt.x, starPt.y, 2, starPt.x, starPt.y, 100);
          grad.addColorStop(0, "rgba(255, 230, 80, 0.55)");
          grad.addColorStop(0.35, "rgba(255, 180, 40, 0.22)");
          grad.addColorStop(1, "rgba(255, 180, 40, 0)");
          this.ctx.fillStyle = grad;
          this.ctx.beginPath();
          this.ctx.arc(starPt.x, starPt.y, 100, 0, TAU);
          this.ctx.fill();
        }
      }
      // 2. Cathedral Grand Portal Glow
      if (this.showCity) {
        const portPt = projected.find(p => p.pt && p.pt.type === TYPE_PORTAL_LIT);
        if (portPt) {
          const pgrad = this.ctx.createRadialGradient(portPt.x, portPt.y, 2, portPt.x, portPt.y, 60);
          pgrad.addColorStop(0, "rgba(255, 200, 50, 0.45)");
          pgrad.addColorStop(0.5, "rgba(255, 140, 20, 0.15)");
          pgrad.addColorStop(1, "rgba(255, 140, 20, 0)");
          this.ctx.fillStyle = pgrad;
          this.ctx.beginPath();
          this.ctx.arc(portPt.x, portPt.y, 60, 0, TAU);
          this.ctx.fill();
        }
      }
    }

    // Render Glyphs
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";

    for (const item of projected) {
      if (item.isSnowParticle) {
        this.ctx.font = `${Math.round(item.scale)}px ${MONO_FONT}`;
        this.ctx.fillStyle = `rgba(220, 235, 255, ${Math.min(0.9, 2.5 / item.z)})`;
        this.ctx.fillText(item.glyph, item.x, item.y);
        continue;
      }

      const pt = item.pt;
      const ao = pt.ao || 1.0;
      const diff = item.diff || 0.65;
      const fontPx = Math.round(item.scale);
      this.ctx.font = `${fontPx}px ${MONO_FONT}`;

      let colStr = "#ffffff";
      switch (pt.type) {
        // Tree Elements
        case TYPE_NEEDLE: {
          const base = this.theme.foliage[pt.colorIdx || 0];
          const r = Math.min(255, Math.floor(base[0] * diff * ao));
          const g = Math.min(255, Math.floor(base[1] * diff * ao));
          const b = Math.min(255, Math.floor(base[2] * diff * ao));
          colStr = `rgb(${r}, ${g}, ${b})`;
          break;
        }
        case TYPE_SNOWCAP: {
          const sCol = this.theme.snow;
          const r = Math.min(255, Math.floor(sCol[0] * diff * ao));
          const g = Math.min(255, Math.floor(sCol[1] * diff * ao));
          const b = Math.min(255, Math.floor(sCol[2] * diff * ao));
          colStr = `rgb(${r}, ${g}, ${b})`;
          break;
        }
        case TYPE_TRUNK: {
          const tCol = this.theme.trunk[pt.colorIdx || 0];
          const r = Math.min(255, Math.floor(tCol[0] * diff * ao));
          const g = Math.min(255, Math.floor(tCol[1] * diff * ao));
          const b = Math.min(255, Math.floor(tCol[2] * diff * ao));
          colStr = `rgb(${r}, ${g}, ${b})`;
          break;
        }
        case TYPE_GARLAND: {
          const gCol = this.theme.garland;
          const shimmer = 0.8 + 0.3 * Math.sin(this.timeline * 4 + pt.x * 5);
          const r = Math.min(255, Math.floor(gCol[0] * shimmer));
          const g = Math.min(255, Math.floor(gCol[1] * shimmer));
          const b = Math.min(255, Math.floor(gCol[2] * shimmer));
          colStr = `rgb(${r}, ${g}, ${b})`;
          break;
        }
        case TYPE_STAR:
        case TYPE_BEAM: {
          const starCol = this.theme.star;
          const pulse = 0.9 + 0.25 * Math.sin(this.timeline * 6);
          const r = Math.min(255, Math.floor(starCol[0] * pulse));
          const g = Math.min(255, Math.floor(starCol[1] * pulse));
          const b = Math.min(255, Math.floor(starCol[2] * pulse));
          colStr = `rgb(${r}, ${g}, ${b})`;
          break;
        }
        case TYPE_LIGHT: {
          const lCol = this.theme.lights[pt.colorIdx % this.theme.lights.length];
          const blink = 0.5 + 0.5 * Math.sin(this.timeline * 5 + (pt.phase || 0));
          const r = Math.min(255, Math.floor(lCol[0] * (0.6 + 0.4 * blink)));
          const g = Math.min(255, Math.floor(lCol[1] * (0.6 + 0.4 * blink)));
          const b = Math.min(255, Math.floor(lCol[2] * (0.6 + 0.4 * blink)));
          colStr = `rgb(${r}, ${g}, ${b})`;
          break;
        }
        case TYPE_BALL: {
          const bCol = this.theme.lights[pt.colorIdx % this.theme.lights.length];
          const r = Math.min(255, Math.floor(bCol[0] * diff * ao));
          const g = Math.min(255, Math.floor(bCol[1] * diff * ao));
          const b = Math.min(255, Math.floor(bCol[2] * diff * ao));
          colStr = `rgb(${r}, ${g}, ${b})`;
          break;
        }
        case TYPE_GIFT: {
          const gCol = pt.customColor || [200, 50, 50];
          const r = Math.min(255, Math.floor(gCol[0] * diff * ao));
          const g = Math.min(255, Math.floor(gCol[1] * diff * ao));
          const b = Math.min(255, Math.floor(gCol[2] * diff * ao));
          colStr = `rgb(${r}, ${g}, ${b})`;
          break;
        }
        case TYPE_GROUND: {
          const grCol = this.theme.ground;
          const r = Math.min(255, Math.floor(grCol[0] * ao));
          const g = Math.min(255, Math.floor(grCol[1] * ao));
          const b = Math.min(255, Math.floor(grCol[2] * ao));
          colStr = `rgb(${r}, ${g}, ${b})`;
          break;
        }
        case TYPE_FENCE: {
          colStr = "rgb(150, 115, 80)";
          break;
        }
        // Cathedral & Landmark Elements
        case TYPE_CATHEDRAL:
        case TYPE_SPIRE:
        case TYPE_CLOCK_TOWER: {
          const stCol = this.theme.stone[Math.floor(Math.abs(pt.x * 5)) % this.theme.stone.length];
          const r = Math.min(255, Math.floor(stCol[0] * diff * ao));
          const g = Math.min(255, Math.floor(stCol[1] * diff * ao));
          const b = Math.min(255, Math.floor(stCol[2] * diff * ao));
          colStr = `rgb(${r}, ${g}, ${b})`;
          break;
        }
        case TYPE_CROSS: {
          const crCol = this.theme.spireCross;
          colStr = `rgb(${crCol[0]}, ${crCol[1]}, ${crCol[2]})`;
          break;
        }
        case TYPE_ROSE_WINDOW: {
          const wPulse = 0.85 + 0.2 * Math.sin(this.timeline * 3 + (pt.phase || 0));
          colStr = `rgb(255, ${Math.floor(215 * wPulse)}, 60)`;
          break;
        }
        case TYPE_PORTAL_LIT: {
          const portBreathe = 0.88 + 0.18 * Math.sin(this.timeline * 2.5);
          colStr = `rgb(255, ${Math.floor(190 * portBreathe)}, 40)`;
          break;
        }
        case TYPE_CLOCK_FACE: {
          colStr = "rgb(255, 240, 110)";
          break;
        }
        // Cottage & Market Elements
        case TYPE_COTTAGE_WALL: {
          const wCol = this.theme.woodWall[pt.colorIdx % this.theme.woodWall.length];
          const r = Math.min(255, Math.floor(wCol[0] * diff * ao));
          const g = Math.min(255, Math.floor(wCol[1] * diff * ao));
          const b = Math.min(255, Math.floor(wCol[2] * diff * ao));
          colStr = `rgb(${r}, ${g}, ${b})`;
          break;
        }
        case TYPE_ROOF_SNOW: {
          const rCol = this.theme.snow;
          const r = Math.min(255, Math.floor(rCol[0] * ao));
          const g = Math.min(255, Math.floor(rCol[1] * ao));
          const b = Math.min(255, Math.floor(rCol[2] * ao));
          colStr = `rgb(${r}, ${g}, ${b})`;
          break;
        }
        case TYPE_WINDOW_LIT: {
          const winCol = this.theme.warmLight;
          const breathe = 0.85 + 0.2 * Math.sin(this.timeline * 2.8 + (pt.phase || 0));
          colStr = `rgb(${Math.floor(winCol[0] * breathe)}, ${Math.floor(winCol[1] * breathe)}, 40)`;
          break;
        }
        case TYPE_STALL_WOOD: {
          colStr = "rgb(130, 85, 45)";
          break;
        }
        case TYPE_STALL_AWN_R: {
          const stR = this.theme.stallRed;
          colStr = `rgb(${stR[0]}, ${stR[1]}, ${stR[2]})`;
          break;
        }
        case TYPE_STALL_AWN_W: {
          colStr = "rgb(245, 248, 255)";
          break;
        }
        case TYPE_EAVE_LIGHT: {
          const eCol = this.theme.lights[pt.colorIdx % this.theme.lights.length];
          const eb = 0.6 + 0.4 * Math.sin(this.timeline * 4 + (pt.phase || 0));
          colStr = `rgb(${Math.floor(eCol[0] * eb)}, ${Math.floor(eCol[1] * eb)}, ${Math.floor(eCol[2] * eb)})`;
          break;
        }
        case TYPE_LAMP_POST: {
          colStr = "rgb(85, 95, 115)";
          break;
        }
        case TYPE_LAMP_GLOW: {
          const fl = 0.88 + 0.15 * Math.sin(this.timeline * 6 + (pt.phase || 0));
          colStr = `rgb(255, ${Math.floor(215 * fl)}, 75)`;
          break;
        }
        case TYPE_MINI_PINE: {
          const pr = Math.min(255, Math.floor(35 * diff * ao));
          const pg = Math.min(255, Math.floor(134 * diff * ao));
          const pb = Math.min(255, Math.floor(54 * diff * ao));
          colStr = `rgb(${pr}, ${pg}, ${pb})`;
          break;
        }
      }

      this.ctx.fillStyle = colStr;
      this.ctx.fillText(pt.glyph, item.x, item.y);
    }

    this.updateHUD(activeLetters, activeLights);
  }

  updateHUD(activeLetters, activeLights) {
    if (!this.hud) return;

    const secs = Math.floor(this.timeline);
    const ms = Math.floor((this.timeline % 1) * 100);
    const timeFormatted = `t ${String(secs).padStart(2, "0")}.${String(ms).padStart(2, "0")}s`;
    if (this.hud.time) this.hud.time.textContent = timeFormatted;

    const rotDeg = ((this.yaw % TAU + TAU) % TAU) * (180 / Math.PI);
    if (this.hud.rotation) this.hud.rotation.textContent = `${rotDeg.toFixed(2)}°`;

    if (this.hud.lights) this.hud.lights.textContent = activeLights;
    if (this.hud.letters) this.hud.letters.textContent = activeLetters.toLocaleString();
    if (this.hud.fps) this.hud.fps.textContent = `${this.fps} fps`;
  }
}

window.Tree3DEngine = Tree3DEngine;
