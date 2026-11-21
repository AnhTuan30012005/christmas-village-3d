/* ==========================================================================
   CITY3D.JS - HIGH-DETAIL 3D VOXEL CHRISTMAS CITY (1:1 REFERENCE REBUILD)
   Features procedural crisp pixel/voxel CanvasTextures (cobblestones, gothic
   stone masonry, half-timbered walls, leaded-glass glowing windows, ornate
   rose window, Roman clock face), exact landmark layout, warm night lighting,
   dotted 8-ray glowing star, snowy roofs with fairy lights, and falling snow.
   ========================================================================== */

const TAU = 2 * Math.PI;

// ============================================================================
// PROCEDURAL PIXEL / VOXEL TEXTURE FORGE
// ============================================================================
class TextureForge {
  static makeCanvas(w, h) {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    return c;
  }

  static toTex(canvas, repeatX = 1, repeatY = 1, pixelated = true) {
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeatX, repeatY);
    if (pixelated) {
      tex.magFilter = THREE.NearestFilter;
      tex.minFilter = THREE.LinearMipMapLinearFilter;
    }
    return tex;
  }

  // 1. Dark European Cobblestone Plaza Texture
  static createCobblestone() {
    const c = this.makeCanvas(256, 256);
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#141821";
    ctx.fillRect(0, 0, 256, 256);

    const rows = 16;
    const h = 256 / rows;
    for (let r = 0; r < rows; r++) {
      const cols = 12;
      const w = 256 / cols;
      const offset = (r % 2) * (w * 0.5);
      for (let col = -1; col <= cols; col++) {
        const shade = 38 + Math.floor(Math.random() * 28);
        const blue = shade + 10 + Math.floor(Math.random() * 10);
        ctx.fillStyle = `rgb(${shade}, ${shade + 4}, ${blue})`;
        ctx.fillRect(col * w + offset + 1.5, r * h + 1.5, w - 3, h - 3);
        // Subtle top highlight
        ctx.fillStyle = `rgba(180, 205, 235, 0.08)`;
        ctx.fillRect(col * w + offset + 2, r * h + 2, w - 4, 2);
      }
    }
    return this.toTex(c, 9, 9, false);
  }

  // 2. Gothic Medieval Stone Masonry Texture (Cathedral & Clock Tower)
  static createStoneMasonry() {
    const c = this.makeCanvas(128, 128);
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#22252e";
    ctx.fillRect(0, 0, 128, 128);

    const rows = 8;
    const h = 128 / rows;
    for (let r = 0; r < rows; r++) {
      const cols = 4;
      const w = 128 / cols;
      const offset = (r % 2) * (w * 0.5);
      for (let col = -1; col <= cols; col++) {
        const v = 56 + Math.floor(Math.random() * 34);
        ctx.fillStyle = `rgb(${v + 4}, ${v + 2}, ${v + 6})`;
        ctx.fillRect(col * w + offset + 1, r * h + 1, w - 2, h - 2);
        // Weathering pixel noise
        ctx.fillStyle = "rgba(0,0,0,0.16)";
        ctx.fillRect(col * w + offset + 2, r * h + h - 3, w - 4, 2);
      }
    }
    return this.toTex(c, 2, 3, true);
  }

  // 3. Half-Timbered Cottage Wall Texture
  static createTimberWall() {
    const c = this.makeCanvas(128, 128);
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#48382b";
    ctx.fillRect(0, 0, 128, 128);

    // Subtle plaster/wood grain blocks
    for (let y = 0; y < 128; y += 8) {
      for (let x = 0; x < 128; x += 16) {
        const v = 60 + Math.floor(Math.random() * 22);
        ctx.fillStyle = `rgb(${v + 16}, ${v + 4}, ${v - 8})`;
        ctx.fillRect(x + 1, y + 1, 14, 6);
      }
    }
    // Dark oak timber frame border & cross
    ctx.fillStyle = "#23160d";
    ctx.fillRect(0, 0, 128, 10);
    ctx.fillRect(0, 118, 128, 10);
    ctx.fillRect(0, 0, 10, 128);
    ctx.fillRect(118, 0, 10, 128);
    ctx.fillRect(59, 0, 10, 128);
    ctx.fillRect(0, 59, 128, 10);
    return this.toTex(c, 1, 1, true);
  }

  // 4. Warm Glowing Multi-Pane Window Texture
  static createGlowingWindow() {
    const c = this.makeCanvas(64, 64);
    const ctx = c.getContext("2d");

    // Warm golden candlelight gradient
    const g = ctx.createRadialGradient(32, 34, 4, 32, 32, 38);
    g.addColorStop(0, "#fff8c4");
    g.addColorStop(0.55, "#ffca3a");
    g.addColorStop(1, "#e07a00");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);

    // Dark wood window frame & cross mullions
    ctx.fillStyle = "#1d120a";
    ctx.fillRect(0, 0, 64, 5);
    ctx.fillRect(0, 59, 64, 5);
    ctx.fillRect(0, 0, 5, 64);
    ctx.fillRect(59, 0, 5, 64);
    ctx.fillRect(29, 0, 6, 64);
    ctx.fillRect(0, 29, 64, 6);
    return this.toTex(c, 1, 1, true);
  }

  // 5. Ornate Gothic Rose Window Texture
  static createRoseWindow() {
    const c = this.makeCanvas(128, 128);
    const ctx = c.getContext("2d");
    ctx.clearRect(0, 0, 128, 128);

    const g = ctx.createRadialGradient(64, 64, 6, 64, 64, 58);
    g.addColorStop(0, "#fff7be");
    g.addColorStop(0.5, "#ffbe2e");
    g.addColorStop(0.9, "#d97706");
    g.addColorStop(1, "#3b2c1e");

    ctx.beginPath();
    ctx.arc(64, 64, 58, 0, TAU);
    ctx.fillStyle = g;
    ctx.fill();

    // Stone tracery rings & 12 spokes
    ctx.strokeStyle = "#2b2623";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(64, 64, 56, 0, TAU);
    ctx.stroke();

    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(64, 64, 24, 0, TAU);
    ctx.stroke();

    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * TAU;
      ctx.beginPath();
      ctx.moveTo(64, 64);
      ctx.lineTo(64 + Math.cos(a) * 56, 64 + Math.sin(a) * 56);
      ctx.stroke();
    }
    return this.toTex(c, 1, 1, false);
  }

  // 6. Glowing Clock Tower Face Texture (with hour ticks & hands at 10:10)
  static createClockFace() {
    const c = this.makeCanvas(128, 128);
    const ctx = c.getContext("2d");

    const g = ctx.createRadialGradient(64, 64, 8, 64, 64, 60);
    g.addColorStop(0, "#fffad1");
    g.addColorStop(0.7, "#ffce38");
    g.addColorStop(1, "#d98200");

    ctx.beginPath();
    ctx.arc(64, 64, 60, 0, TAU);
    ctx.fillStyle = g;
    ctx.fill();

    // Outer dark rim
    ctx.strokeStyle = "#221d18";
    ctx.lineWidth = 7;
    ctx.stroke();

    // 12 hour markers
    ctx.strokeStyle = "#1c1610";
    ctx.lineWidth = 4;
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * TAU;
      ctx.beginPath();
      ctx.moveTo(64 + Math.cos(a) * 44, 64 + Math.sin(a) * 44);
      ctx.lineTo(64 + Math.cos(a) * 54, 64 + Math.sin(a) * 54);
      ctx.stroke();
    }

    // Clock Hands (10:10)
    ctx.lineCap = "round";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(64, 64);
    ctx.lineTo(42, 46); // Hour hand
    ctx.stroke();

    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(64, 64);
    ctx.lineTo(94, 44); // Minute hand
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(64, 64, 5, 0, TAU);
    ctx.fillStyle = "#1c1610";
    ctx.fill();

    return this.toTex(c, 1, 1, false);
  }

  // 7. Gothic Arched Glowing Portal Texture
  static createGothicPortal() {
    const c = this.makeCanvas(128, 160);
    const ctx = c.getContext("2d");
    ctx.clearRect(0, 0, 128, 160);

    const g = ctx.createRadialGradient(64, 120, 10, 64, 100, 95);
    g.addColorStop(0, "#fffce0");
    g.addColorStop(0.5, "#ffc938");
    g.addColorStop(1, "#d97000");

    // Pointed gothic arch path
    ctx.beginPath();
    ctx.moveTo(8, 160);
    ctx.lineTo(8, 68);
    ctx.quadraticCurveTo(8, 16, 64, 4);
    ctx.quadraticCurveTo(120, 16, 120, 68);
    ctx.lineTo(120, 160);
    ctx.closePath();
    ctx.fillStyle = g;
    ctx.fill();

    // Inner gothic door mullions
    ctx.strokeStyle = "#3a2512";
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(64, 6);
    ctx.lineTo(64, 160);
    ctx.moveTo(36, 42);
    ctx.lineTo(36, 160);
    ctx.moveTo(92, 42);
    ctx.lineTo(92, 160);
    ctx.moveTo(10, 74);
    ctx.lineTo(118, 74);
    ctx.stroke();

    return this.toTex(c, 1, 1, false);
  }

  // 8. Soft Radial Glow Texture (for Star, Moon, Lanterns, Portal)
  static createGlow(colorInner, colorMid) {
    const c = this.makeCanvas(128, 128);
    const ctx = c.getContext("2d");
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0.0, colorInner);
    g.addColorStop(0.3, colorMid);
    g.addColorStop(0.65, "rgba(255, 190, 60, 0.08)");
    g.addColorStop(1.0, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }

  // 9. Crisp 6-Pointed Snowflake Sprite
  static createSnowflake() {
    const c = this.makeCanvas(64, 64);
    const ctx = c.getContext("2d");
    ctx.clearRect(0, 0, 64, 64);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * TAU;
      ctx.beginPath();
      ctx.moveTo(32, 32);
      ctx.lineTo(32 + Math.cos(a) * 24, 32 + Math.sin(a) * 24);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(32, 32, 5, 0, TAU);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    return new THREE.CanvasTexture(c);
  }

  // 10. Illuminated Festive Welcome Archway Signboard ("CHÚC MỪNG GIÁNG SINH")
  static createWelcomeSign(text = "CHÚC MỪNG GIÁNG SINH") {
    const c = this.makeCanvas(1024, 256);
    const ctx = c.getContext("2d");

    // Rich crimson-burgundy festive wood banner background
    const bg = ctx.createLinearGradient(0, 0, 0, 256);
    bg.addColorStop(0, "#6e0f1c");
    bg.addColorStop(0.5, "#8f1626");
    bg.addColorStop(1, "#540a14");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 1024, 256);

    // Ornate double golden frame border
    ctx.strokeStyle = "#ffd54f";
    ctx.lineWidth = 14;
    ctx.strokeRect(14, 14, 996, 228);

    ctx.strokeStyle = "#ffb300";
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, 964, 196);

    // Corner golden stars
    ctx.fillStyle = "#ffe066";
    ctx.font = "bold 36px 'Segoe UI', Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    [[64, 64], [960, 64], [64, 192], [960, 192]].forEach(([sx, sy]) => {
      ctx.fillText("✦", sx, sy);
    });

    // Main glowing golden Vietnamese greeting text
    const label = `★  ${text.toUpperCase()}  ★`;
    ctx.font = "900 58px 'Segoe UI', Tahoma, Arial, sans-serif";
    ctx.shadowColor = "rgba(255, 200, 40, 0.95)";
    ctx.shadowBlur = 18;
    ctx.fillStyle = "#fff4b8";
    ctx.fillText(label, 512, 132, 880);

    // Crisp second stroke pass for legibility
    ctx.shadowBlur = 0;
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#b45309";
    ctx.strokeText(label, 512, 132, 880);

    const tex = new THREE.CanvasTexture(c);
    tex.anisotropy = 8;
    return tex;
  }

  // 11. Radial-Fade Winter Snow Valley Ground (Eliminates hard floating-disc horizon edge!)
  static createSnowValleyGround() {
    const c = this.makeCanvas(512, 512);
    const ctx = c.getContext("2d");

    // Smooth radial fade from crisp moonlit snow around the village into pitch midnight black at horizon
    const g = ctx.createRadialGradient(256, 256, 36, 256, 256, 250);
    g.addColorStop(0.00, "#dce8fa");
    g.addColorStop(0.22, "#c6d8f2");
    g.addColorStop(0.42, "#5b7194");
    g.addColorStop(0.62, "#192338");
    g.addColorStop(0.80, "#050812");
    g.addColorStop(1.00, "#02040a");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 512, 512);

    // Subtle organic snow drift speckles inside inner valley
    for (let i = 0; i < 600; i++) {
      const a = Math.random() * TAU;
      const r = 45 + Math.random() * 115;
      const x = 256 + Math.cos(a) * r;
      const y = 256 + Math.sin(a) * r;
      ctx.fillStyle = `rgba(255, 255, 255, ${0.06 + Math.random() * 0.08})`;
      ctx.fillRect(x, y, 4 + Math.random() * 6, 3 + Math.random() * 5);
    }

    const tex = new THREE.CanvasTexture(c);
    return tex;
  }
}

// ============================================================================
// MAIN 3D CHRISTMAS CITY ENGINE
// ============================================================================
class ChristmasCity3D {
  constructor(container) {
    this.container = container;
    this.width = container.clientWidth || window.innerWidth;
    this.height = container.clientHeight || window.innerHeight;

    this.autoRotate = false;
    this.rotSpeed = 0.0022;
    this.time = 0;
    this.lastFrameTime = performance.now();
    this.twinkleBulbs = [];
    this.glowSprites = [];
    this.villagers = [];
    this.smokePuffs = [];
    this.archwaySignMat = null;
    this.auroraUniforms = null;
    this.santaGroup = null;
    this.santaStardust = [];
    this.camFlight = null;
    this.walkthroughActive = false;
    this.walkthroughT = 0;

    this.unitBox = new THREE.BoxGeometry(1, 1, 1);

    this.initScene();
    this.initLights();
    this.initMaterials();
    this.buildCity();
    this.buildAurora();
    this.buildSantaSleigh();
    this.initSkyAndSnow();
    this.setupControls();
    this.bindEvents();
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x02040a);
    this.scene.fog = new THREE.FogExp2(0x02040a, 0.0062);

    // Grand 2x Heroic 3/4 panorama: Welcome Archway -> Boulevard -> Double-Ring Village -> Tree -> Mountains
    this.camera = new THREE.PerspectiveCamera(44, this.width / this.height, 0.1, 460);
    this.camera.position.set(17.5, 22.5, 74.0);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
      preserveDrawingBuffer: true
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.12;

    this.container.appendChild(this.renderer.domElement);
  }

  initLights() {
    // Deep winter midnight ambient for dramatic warm-vs-cool contrast
    const ambient = new THREE.AmbientLight(0x111c30, 0.34);
    this.scene.add(ambient);

    // Cool moonlight casting crisp winter shadows across the expanded 2x village
    const moon = new THREE.DirectionalLight(0x7ca2d6, 0.68);
    moon.position.set(-24, 38, 28);
    moon.castShadow = true;
    moon.shadow.mapSize.width = 2048;
    moon.shadow.mapSize.height = 2048;
    moon.shadow.camera.near = 1;
    moon.shadow.camera.far = 140;
    const d = 44;
    moon.shadow.camera.left = -d;
    moon.shadow.camera.right = d;
    moon.shadow.camera.top = d;
    moon.shadow.camera.bottom = -d;
    moon.shadow.bias = -0.0005;
    this.scene.add(moon);

    const hemi = new THREE.HemisphereLight(0x283b5c, 0x0a0d14, 0.35);
    this.scene.add(hemi);
  }

  initMaterials() {
    const cobbleTex = TextureForge.createCobblestone();
    const stoneTex  = TextureForge.createStoneMasonry();
    const timberTex = TextureForge.createTimberWall();
    const winTex    = TextureForge.createGlowingWindow();
    const roseTex   = TextureForge.createRoseWindow();
    const clockTex  = TextureForge.createClockFace();
    const portalTex = TextureForge.createGothicPortal();

    this.texGlowGold = TextureForge.createGlow("rgba(255,235,120,0.95)", "rgba(255,180,40,0.40)");
    this.texGlowWarm = TextureForge.createGlow("rgba(255,200,80,0.90)", "rgba(255,145,20,0.32)");
    this.texGlowMoon = TextureForge.createGlow("rgba(180,210,255,0.45)", "rgba(110,150,210,0.14)");
    this.texSnowflake = TextureForge.createSnowflake();

    this.mat = {
      cobble: new THREE.MeshStandardMaterial({ map: cobbleTex, roughness: 0.88, metalness: 0.08 }),
      snow: new THREE.MeshStandardMaterial({ color: 0xeaf2ff, roughness: 0.82, metalness: 0.02 }),
      snowShadow: new THREE.MeshStandardMaterial({ color: 0xb8cce6, roughness: 0.88 }),
      stone: new THREE.MeshStandardMaterial({ map: stoneTex, roughness: 0.90, metalness: 0.08 }),
      stoneDark: new THREE.MeshStandardMaterial({ map: stoneTex, color: 0x7c8494, roughness: 0.92 }),
      stoneLight: new THREE.MeshStandardMaterial({ map: stoneTex, color: 0xc8d0dc, roughness: 0.84 }),
      timber: new THREE.MeshStandardMaterial({ map: timberTex, roughness: 0.88 }),
      woodDark: new THREE.MeshStandardMaterial({ color: 0x26170d, roughness: 0.92 }),
      woodMed: new THREE.MeshStandardMaterial({ color: 0x4b2f1c, roughness: 0.86 }),
      roofDark: new THREE.MeshStandardMaterial({ color: 0x1e212a, roughness: 0.90 }),
      pineDark: new THREE.MeshStandardMaterial({ color: 0x0e3b18, roughness: 0.88 }),
      pineMid: new THREE.MeshStandardMaterial({ color: 0x195e28, roughness: 0.82 }),
      pineBright: new THREE.MeshStandardMaterial({ color: 0x257a36, roughness: 0.78 }),
      window: new THREE.MeshStandardMaterial({
        map: winTex,
        emissiveMap: winTex,
        emissive: new THREE.Color(0xffb833),
        emissiveIntensity: 2.2,
        roughness: 0.25
      }),
      rose: new THREE.MeshStandardMaterial({
        map: roseTex,
        emissiveMap: roseTex,
        emissive: new THREE.Color(0xffaa1a),
        emissiveIntensity: 2.4,
        transparent: true,
        roughness: 0.2
      }),
      clock: new THREE.MeshStandardMaterial({
        map: clockTex,
        emissiveMap: clockTex,
        emissive: new THREE.Color(0xffc933),
        emissiveIntensity: 2.2,
        roughness: 0.2
      }),
      portal: new THREE.MeshStandardMaterial({
        map: portalTex,
        emissiveMap: portalTex,
        emissive: new THREE.Color(0xffa41c),
        emissiveIntensity: 2.8,
        transparent: true,
        roughness: 0.15
      }),
      gold: new THREE.MeshStandardMaterial({
        color: 0xffd700,
        emissive: 0xffaa00,
        emissiveIntensity: 2.0,
        roughness: 0.25,
        metalness: 0.8
      }),
      red: new THREE.MeshStandardMaterial({ color: 0xc91a2e, roughness: 0.55 }),
      white: new THREE.MeshStandardMaterial({ color: 0xf4f7fc, roughness: 0.65 }),
      blue: new THREE.MeshStandardMaterial({ color: 0x2060d8, roughness: 0.5 }),
      wreath: new THREE.MeshStandardMaterial({ color: 0x135424, roughness: 0.85 })
    };
  }

  addBox(x, y, z, sx, sy, sz, mat, parent = this.cityGroup) {
    const m = new THREE.Mesh(this.unitBox, mat);
    m.position.set(x + sx / 2, y + sy / 2, z + sz / 2);
    m.scale.set(sx, sy, sz);
    m.castShadow = true;
    m.receiveShadow = true;
    parent.add(m);
    return m;
  }

  addGlow(x, y, z, size, parent, tex = this.texGlowWarm, opacity = 0.72) {
    const sm = new THREE.SpriteMaterial({
      map: tex,
      transparent: true,
      opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const sp = new THREE.Sprite(sm);
    sp.position.set(x, y, z);
    sp.scale.set(size, size, 1);
    parent.add(sp);
    this.glowSprites.push({ sprite: sp, baseScale: size, phase: Math.random() * TAU });
    return sp;
  }

  // ==========================================================================
  // MASTER CITY BUILDER — EXACT 1:1 LAYOUT OF REFERENCE PHOTO
  // ==========================================================================
  buildCity() {
    this.cityGroup = new THREE.Group();
    this.scene.add(this.cityGroup);

    this.buildCobblestonePlaza();
    this.buildCentralTree();
    this.buildGothicCathedral();
    this.buildClockTower();
    this.buildTownhouses();
    this.buildMarketStallsAndBooths();
    this.buildStreetLamps();
    this.buildSnowyPines();
    this.buildEntranceBoulevardAndArchway();
    this.buildMountainsAndPineHills();
    this.buildVillagers();
    this.buildBackgroundMoon();
  }

  // 1. Grand 2x Cobblestone Circular Town Basin, Radial-Fade Snow Valley & Curved Fence
  buildCobblestonePlaza() {
    // 2x Expanded circular textured cobblestone basin (r = 36.5) with scaled tiling
    this.mat.cobble.map.repeat.set(16, 16);
    const plaza = new THREE.Mesh(
      new THREE.CylinderGeometry(36.5, 36.5, 0.3, 72),
      this.mat.cobble
    );
    plaza.position.y = -0.15;
    plaza.receiveShadow = true;
    this.cityGroup.add(plaza);

    // Seamless Radial-Fade Winter Snow Valley Floor (r = 210, dissolves invisibly into midnight horizon)
    const valleyTex = TextureForge.createSnowValleyGround();
    const valleyMat = new THREE.MeshStandardMaterial({
      map: valleyTex,
      roughness: 0.92,
      metalness: 0.02
    });
    const outerSnow = new THREE.Mesh(
      new THREE.CircleGeometry(210, 72),
      valleyMat
    );
    outerSnow.rotation.x = -Math.PI / 2;
    outerSnow.position.y = -0.02;
    outerSnow.receiveShadow = true;
    this.cityGroup.add(outerSnow);

    // Subtle decorative snowy garden rings between Ring 1 and Ring 2 (spacious zones for future scenes!)
    const midSnowRing = new THREE.Mesh(
      new THREE.RingGeometry(25.2, 29.8, 64),
      new THREE.MeshStandardMaterial({ color: 0xcedcf0, roughness: 0.92 })
    );
    midSnowRing.rotation.x = -Math.PI / 2;
    midSnowRing.position.y = 0.015;
    midSnowRing.receiveShadow = true;
    this.cityGroup.add(midSnowRing);

    // 4 Cardinal Cobblestone Avenues cutting cleanly across the snowy mid-ring (N, S, E, W)
    const crossRoadMat = this.mat.cobble;
    const nsRoad = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.06, 68.0), crossRoadMat);
    nsRoad.position.set(0, 0.01, 0);
    nsRoad.receiveShadow = true;
    this.cityGroup.add(nsRoad);

    const ewRoad = new THREE.Mesh(new THREE.BoxGeometry(68.0, 0.06, 5.2), crossRoadMat);
    ewRoad.position.set(0, 0.01, 0);
    ewRoad.receiveShadow = true;
    this.cityGroup.add(ewRoad);

    // Low curved rustic wooden fence around the grand central plaza (r = 11.4)
    const fenceR = 11.4;
    const totalPosts = 76;
    for (let i = 0; i < totalPosts; i++) {
      const a = (i / totalPosts) * TAU;
      // 4 clean walkway openings (East/Cathedral, South/Front, West, North)
      if (
        (a < 0.20 || a > TAU - 0.20) ||
        (a > Math.PI * 0.5 - 0.22 && a < Math.PI * 0.5 + 0.22) ||
        (a > Math.PI - 0.18 && a < Math.PI + 0.18) ||
        (a > Math.PI * 1.5 - 0.18 && a < Math.PI * 1.5 + 0.18)
      ) continue;
      const px = Math.cos(a) * fenceR;
      const pz = Math.sin(a) * fenceR;
      this.addBox(px - 0.07, 0, pz - 0.07, 0.14, 0.56, 0.14, this.mat.woodDark);
      this.addBox(px - 0.08, 0.56, pz - 0.08, 0.16, 0.08, 0.16, this.mat.snow);

      const aNext = ((i + 1) / totalPosts) * TAU;
      const nx = Math.cos(aNext) * fenceR;
      const nz = Math.sin(aNext) * fenceR;
      const mx = (px + nx) / 2;
      const mz = (pz + nz) / 2;
      const len = Math.hypot(nx - px, nz - pz);
      const rail = new THREE.Mesh(this.unitBox, this.mat.woodMed);
      rail.position.set(mx, 0.36, mz);
      rail.scale.set(len, 0.08, 0.08);
      rail.rotation.y = -Math.atan2(nz - pz, nx - px);
      this.cityGroup.add(rail);
    }
  }

  // 2. Grand Central Christmas Tree (Scaled 1.25x to command the 2x Grand Square)
  buildCentralTree() {
    const grp = new THREE.Group();
    grp.position.set(0, 0, 0);
    grp.scale.setScalar(1.25);
    this.cityGroup.add(grp);

    // Circular raised stone planter dais (exact match to photo)
    const daisOuter = new THREE.Mesh(
      new THREE.CylinderGeometry(2.5, 2.65, 0.45, 32),
      this.mat.stone
    );
    daisOuter.position.y = 0.225;
    daisOuter.receiveShadow = true;
    grp.add(daisOuter);

    const daisTop = new THREE.Mesh(
      new THREE.CylinderGeometry(2.35, 2.35, 0.08, 32),
      this.mat.woodDark
    );
    daisTop.position.y = 0.45;
    grp.add(daisTop);

    // Sturdy voxel trunk
    this.addBox(-0.34, 0.45, -0.34, 0.68, 1.5, 0.68, this.mat.woodMed, grp);

    // Lush Multi-Tiered Voxel Foliage (14 staggered tiers, rich varied pine greens)
    const tiers = 14;
    const baseY = 1.05;
    const treeH = 6.2;
    const maxR = 2.65;

    for (let t = 0; t < tiers; t++) {
      const u = t / tiers;
      const ty = baseY + u * treeH;
      const rad = maxR * Math.pow(1 - u, 0.86);
      const bSize = 0.34 - u * 0.08;

      const rings = Math.max(1, Math.ceil(rad / (bSize * 0.78)));
      for (let r = 1; r <= rings; r++) {
        const rr = (r / rings) * rad;
        const count = Math.max(5, Math.floor((rr * TAU) / (bSize * 0.92)));
        for (let i = 0; i < count; i++) {
          const a = (i / count) * TAU + t * 0.65;
          const wobble = 1.0 + 0.14 * Math.sin(a * 5 + t * 2);
          const bx = Math.cos(a) * rr * wobble;
          const bz = Math.sin(a) * rr * wobble;
          const by = ty - (r / rings) * 0.14;

          const pMat = (r === rings)
            ? (i % 3 === 0 ? this.mat.pineBright : this.mat.pineMid)
            : this.mat.pineDark;

          this.addBox(bx - bSize / 2, by, bz - bSize / 2, bSize, bSize * 0.95, bSize, pMat, grp);
        }
      }
    }

    // Tree tip spire block
    this.addBox(-0.14, baseY + treeH, -0.14, 0.28, 0.32, 0.28, this.mat.pineBright, grp);

    // Bright Glowing Golden Spiral Garland (Beads of warm light winding 4.5 turns)
    const turns = 4.6;
    const beads = 210;
    const beadGeo = new THREE.SphereGeometry(0.068, 6, 6);
    const beadMat = new THREE.MeshStandardMaterial({
      color: 0xfff088,
      emissive: 0xffcc00,
      emissiveIntensity: 3.4,
      roughness: 0.15
    });
    for (let i = 0; i <= beads; i++) {
      const u = i / beads;
      const gy = baseY + 0.28 + (treeH - 0.65) * u;
      const ga = TAU * turns * u;
      const swag = -0.14 * Math.abs(Math.sin(ga * 2.0));
      const gr = (maxR + 0.12) * Math.pow(1 - u, 0.86);

      const m = new THREE.Mesh(beadGeo, beadMat);
      m.position.set(Math.cos(ga) * gr, gy + swag, Math.sin(ga) * gr);
      grp.add(m);
    }

    // Ruby Red Baubles & Festive Lights nestled in pine foliage
    const ornGeo = new THREE.SphereGeometry(0.11, 8, 8);
    const redOrbMat = new THREE.MeshStandardMaterial({ color: 0xe61c2e, emissive: 0xaa0011, emissiveIntensity: 1.4, roughness: 0.25 });
    const goldOrbMat = new THREE.MeshStandardMaterial({ color: 0xffd13b, emissive: 0xffaa00, emissiveIntensity: 2.2, roughness: 0.2 });

    for (let i = 0; i < 90; i++) {
      const u = 0.05 + (i / 90) * 0.86;
      const oy = baseY + u * (treeH - 0.35);
      const oa = i * 2.3999;
      const or = (maxR + 0.04) * Math.pow(1 - u, 0.86);
      const orb = new THREE.Mesh(ornGeo, i % 3 === 0 ? goldOrbMat : redOrbMat);
      orb.position.set(Math.cos(oa) * or, oy, Math.sin(oa) * or);
      grp.add(orb);
    }

    // Iconic Dotted 8-Ray Golden Star Topper (Exact match to reference photo!)
    const starY = baseY + treeH + 0.88;
    const core = new THREE.Mesh(
      new THREE.SphereGeometry(0.30, 14, 14),
      new THREE.MeshStandardMaterial({
        color: 0xfff8a0,
        emissive: 0xffd000,
        emissiveIntensity: 4.0,
        roughness: 0.1
      })
    );
    core.position.set(0, starY, 0);
    grp.add(core);

    // 8 radiating dotted golden light beams
    const dotGeo = new THREE.SphereGeometry(0.038, 6, 6);
    for (let ray = 0; ray < 8; ray++) {
      const a = (ray / 8) * TAU;
      const isCardinal = ray % 2 === 0;
      const dots = isCardinal ? 11 : 8;
      const maxLen = isCardinal ? 1.55 : 1.08;
      for (let d = 1; d <= dots; d++) {
        const f = d / dots;
        const dist = 0.30 + f * maxLen;
        const dot = new THREE.Mesh(dotGeo, beadMat);
        dot.position.set(Math.cos(a) * dist, starY + Math.sin(a) * dist, 0);
        dot.scale.setScalar(1.15 - f * 0.55);
        grp.add(dot);
      }
    }

    // Star warm halo & light
    this.addGlow(0, starY, 0, 5.4, grp, this.texGlowGold, 0.82);
    const starLight = new THREE.PointLight(0xffd24d, 3.2, 16, 1.6);
    starLight.position.set(0, starY, 0.5);
    grp.add(starLight);

    // Iconic Blue & Red Gift Boxes with Ribbons at Tree Base (clearly visible on front of dais)
    const gifts = [
      { x: -1.05, z: 1.68, s: 0.64, box: this.mat.blue, rib: this.mat.white },
      { x:  0.98, z: 1.62, s: 0.70, box: this.mat.red,  rib: this.mat.gold },
      { x:  0.48, z: 1.82, s: 0.46, box: this.mat.red,  rib: this.mat.gold }
    ];
    gifts.forEach(g => {
      this.addBox(g.x - g.s / 2, 0.45, g.z - g.s / 2, g.s, g.s * 0.86, g.s, g.box, grp);
      this.addBox(g.x - 0.05, 0.46, g.z - g.s / 2 - 0.01, 0.10, g.s * 0.87, g.s + 0.02, g.rib, grp);
      this.addBox(g.x - g.s / 2 - 0.01, 0.46, g.z - 0.05, g.s + 0.02, g.s * 0.87, 0.10, g.rib, grp);
    });
  }

  // 3. Majestic Gothic Twin-Spire Cathedral (Positioned on Ring 1 facing center, 1.22x heroic scale)
  buildGothicCathedral() {
    const grp = new THREE.Group();
    const angle = -28 * (Math.PI / 180);
    const radius = 24.8;
    const cx = Math.cos(angle) * radius;
    const cz = Math.sin(angle) * radius;
    grp.position.set(cx, 0, cz);
    grp.rotation.y = Math.atan2(-cx, -cz);
    grp.scale.setScalar(1.22);
    this.cityGroup.add(grp);

    const w = 4.6, d = 7.4, h = 5.0;

    // 3 Wide Stone Entrance Steps
    for (let s = 0; s < 3; s++) {
      this.addBox(-1.9 - s * 0.18, s * 0.12, d / 2 + (2 - s) * 0.30, 3.8 + s * 0.36, 0.12, 0.34, this.mat.stoneLight, grp);
    }

    // Main Nave Body (Textured Gothic Masonry)
    this.addBox(-w / 2, 0, -d / 2, w, h, d, this.mat.stone, grp);

    // Side Stone Buttresses & Glowing Arched Nave Windows
    for (let bz = -d / 2 + 0.8; bz <= d / 2 - 1.2; bz += 1.45) {
      [-w / 2 - 0.3, w / 2].forEach(bx => {
        this.addBox(bx, 0, bz, 0.3, h + 0.25, 0.42, this.mat.stoneDark, grp);
        this.addBox(bx - 0.02, h + 0.25, bz - 0.02, 0.34, 0.16, 0.46, this.mat.snow, grp);
      });
      // Glowing arched stained-glass windows along side walls
      this.addBox(-w / 2 - 0.06, 1.6, bz + 0.55, 0.08, 1.9, 0.58, this.mat.window, grp);
      this.addBox(w / 2 - 0.02, 1.6, bz + 0.55, 0.08, 1.9, 0.58, this.mat.window, grp);
    }

    // Grand Arched Glowing Portal (Custom Gothic Arch Texture)
    const portalPlane = new THREE.Mesh(new THREE.PlaneGeometry(1.85, 2.45), this.mat.portal);
    portalPlane.position.set(0, 1.25, d / 2 + 0.08);
    grp.add(portalPlane);

    // Flanking narrow glowing gothic windows on left & right of portal
    [-1.45, 1.45].forEach(wx => {
      this.addBox(wx - 0.28, 0.55, d / 2 + 0.02, 0.56, 1.75, 0.08, this.mat.window, grp);
      this.addBox(wx - 0.26, 2.95, d / 2 + 0.02, 0.52, 1.35, 0.08, this.mat.window, grp);
    });

    // Evergreen Christmas Garland Arch + Red Bow above Portal
    const wreath = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.14, 8, 18, Math.PI), this.mat.wreath);
    wreath.position.set(0, 2.35, d / 2 + 0.18);
    grp.add(wreath);
    this.addBox(-0.14, 3.22, d / 2 + 0.22, 0.28, 0.24, 0.14, this.mat.red, grp);

    // Radiant Portal Warm PointLight & Halo
    const portalLight = new THREE.PointLight(0xffa020, 4.2, 12, 1.4);
    portalLight.position.set(0, 1.5, d / 2 + 1.0);
    grp.add(portalLight);
    this.addGlow(0, 1.4, d / 2 + 0.5, 4.2, grp, this.texGlowWarm, 0.55);

    // Glowing Ornate Circular Rose Window (Center Facade)
    const roseDisc = new THREE.Mesh(new THREE.CircleGeometry(0.76, 24), this.mat.rose);
    roseDisc.position.set(0, 4.45, d / 2 + 0.10);
    grp.add(roseDisc);

    // Central Triangular Gable with Snow Trim
    const gLevels = 9;
    const gableH = 2.0;
    for (let i = 0; i < gLevels; i++) {
      const gy = h + (i / gLevels) * gableH;
      const gw = (w - 0.5) * (1 - i / gLevels);
      this.addBox(-gw / 2, gy, d / 2 - 0.45, gw, gableH / gLevels + 0.02, 0.45, this.mat.stoneLight, grp);
      this.addBox(-gw / 2 - 0.06, gy + gableH / gLevels, d / 2 - 0.50, gw + 0.12, 0.12, 0.55, this.mat.snow, grp);
    }

    // Main Nave Gabled Snow Roof
    const rLayers = 11;
    for (let i = 0; i < rLayers; i++) {
      const ry = h + (i / rLayers) * 1.9;
      const span = (w + 0.5) * (1 - i / rLayers);
      this.addBox(-span / 2, ry, -d / 2 - 0.2, span, 0.22, d + 0.2, i > 1 ? this.mat.snow : this.mat.roofDark, grp);
    }

    // Twin Slender Gothic Spires with Stepped Snow & Golden Crosses (✝)
    const spireW = 1.32;
    const spireH = 4.6;
    const spireXs = [-w / 2 + 0.04, w / 2 - spireW - 0.04];

    spireXs.forEach(sx => {
      const sz = d / 2 - spireW + 0.05;
      // Upper belfry stage
      this.addBox(sx, 0, sz, spireW, h + 1.4, spireW, this.mat.stoneLight, grp);
      this.addBox(sx + 0.28, h + 0.15, sz + spireW + 0.02, spireW - 0.56, 1.05, 0.08, this.mat.window, grp);
      // Decorative stone collar
      this.addBox(sx - 0.1, h + 1.35, sz - 0.1, spireW + 0.2, 0.2, spireW + 0.2, this.mat.snow, grp);

      // Stepped pyramidal spire with alternating snow ridges
      const sLevels = 16;
      const sBase = h + 1.55;
      for (let s = 0; s < sLevels; s++) {
        const sy = sBase + (s / sLevels) * spireH;
        const sw = (spireW + 0.12) * (1 - s / sLevels);
        this.addBox(
          sx + (spireW - sw) / 2, sy, sz + (spireW - sw) / 2,
          sw, spireH / sLevels + 0.02, sw,
          s % 3 === 0 || s > sLevels - 4 ? this.mat.snow : this.mat.stoneLight,
          grp
        );
      }

      // Glowing Golden Cross (✝) atop each spire
      const cx = sx + spireW / 2;
      const cy = sBase + spireH;
      const cz = sz + spireW / 2;
      this.addBox(cx - 0.045, cy, cz - 0.045, 0.09, 0.78, 0.09, this.mat.gold, grp);
      this.addBox(cx - 0.26, cy + 0.45, cz - 0.045, 0.52, 0.09, 0.09, this.mat.gold, grp);
    });
  }

  // 4. Alpine Stone Clock Tower (Positioned on Ring 1 facing center, 1.20x heroic scale)
  buildClockTower() {
    const grp = new THREE.Group();
    const angle = -152 * (Math.PI / 180);
    const radius = 23.8;
    const tx = Math.cos(angle) * radius;
    const tz = Math.sin(angle) * radius;
    grp.position.set(tx, 0, tz);
    grp.rotation.y = Math.atan2(-tx, -tz);
    grp.scale.setScalar(1.20);
    this.cityGroup.add(grp);

    const w = 2.4, d = 2.4, h = 6.8;

    // Textured Stone Tower Shaft
    this.addBox(-w / 2, 0, -d / 2, w, h, d, this.mat.stone, grp);
    // Stone Cornices
    this.addBox(-w / 2 - 0.12, 2.8, -d / 2 - 0.12, w + 0.24, 0.22, d + 0.24, this.mat.stoneLight, grp);
    this.addBox(-w / 2 - 0.16, h - 0.35, -d / 2 - 0.16, w + 0.32, 0.35, d + 0.32, this.mat.stoneLight, grp);
    this.addBox(-w / 2 - 0.18, h, -d / 2 - 0.18, w + 0.36, 0.12, d + 0.36, this.mat.snow, grp);

    // Small warm tower windows below clock
    this.addBox(-0.22, 3.6, d / 2 + 0.02, 0.44, 0.65, 0.06, this.mat.window, grp);

    // Illuminated Circular Clock Face (Roman Ticks + Hands at 10:10)
    const clockY = h - 1.25;
    const face = new THREE.Mesh(new THREE.CircleGeometry(0.68, 24), this.mat.clock);
    face.position.set(0, clockY, d / 2 + 0.08);
    grp.add(face);

    const clkLight = new THREE.PointLight(0xffd244, 2.2, 7.5);
    clkLight.position.set(0, clockY, d / 2 + 0.6);
    grp.add(clkLight);
    this.addGlow(0, clockY, d / 2 + 0.3, 2.4, grp, this.texGlowGold, 0.45);

    // Steep Pyramidal Snow-Dusted Roof
    const rLevels = 12;
    const rH = 2.4;
    for (let i = 0; i < rLevels; i++) {
      const ry = h + 0.12 + (i / rLevels) * rH;
      const rw = (w + 0.38) * (1 - i / rLevels);
      this.addBox(-rw / 2, ry, -rw / 2, rw, rH / rLevels + 0.02, rw, i % 2 === 0 || i > rLevels - 4 ? this.mat.snow : this.mat.stoneLight, grp);
    }
    // Spire finial
    this.addBox(-0.04, h + rH + 0.12, -0.04, 0.08, 0.55, 0.08, this.mat.stoneLight, grp);
  }

  // Helper: Build a detailed European Half-Timbered House with Puffy Snow Roof & Eave Fairy Lights
  createCottage(cfg) {
    const grp = new THREE.Group();
    grp.position.set(cfg.x, 0, cfg.z);
    grp.rotation.y = cfg.rot;
    this.cityGroup.add(grp);

    const { w, d, h, rh } = cfg;

    // Foundation & Textured Half-Timbered Walls
    this.addBox(-w / 2, 0, -d / 2, w, 0.42, d, this.mat.stoneDark, grp);
    this.addBox(-w / 2, 0.42, -d / 2, w, h - 0.42, d, cfg.stone ? this.mat.stone : this.mat.timber, grp);

    // Multi-pane Glowing Windows on Front & Side
    const winW = Math.min(0.75, w * 0.24);
    const winH = 0.85;
    const cols = w >= 3.2 ? [-w * 0.27, w * 0.27] : [0];
    cols.forEach(wx => {
      this.addBox(wx - winW / 2, 0.72, d / 2 + 0.03, winW, winH, 0.06, this.mat.window, grp);
      if (h > 2.65) {
        this.addBox(wx - winW / 2, 1.82, d / 2 + 0.03, winW, winH * 0.9, 0.06, this.mat.window, grp);
      }
    });
    // Side glowing windows
    this.addBox(-w / 2 - 0.04, 0.75, -0.35, 0.06, 0.82, 0.70, this.mat.window, grp);
    this.addBox( w / 2 - 0.02, 0.75, -0.35, 0.06, 0.82, 0.70, this.mat.window, grp);

    // Stepped Puffy Snow Roof (voxel blocks along sloped eaves)
    const rLevels = 9;
    for (let r = 0; r < rLevels; r++) {
      const ry = h + (r / rLevels) * rh;
      const span = (w + 0.56) * (1 - r / rLevels);
      this.addBox(-span / 2, ry, -d / 2 - 0.26, span, rh / rLevels + 0.05, d + 0.52, r > 1 ? this.mat.snow : this.mat.roofDark, grp);
    }

    // Festive Red/Green/Gold Fairy String Lights draped along the roofline
    if (cfg.lights !== false) {
      const palette = [0xff2a3c, 0x24d658, 0xffd028];
      const count = Math.max(6, Math.floor(w * 2.8));
      const bulbGeo = new THREE.SphereGeometry(0.068, 6, 6);
      for (let i = 0; i <= count; i++) {
        const u = i / count;
        const bx = -w / 2 - 0.24 + u * (w + 0.48);
        const col = palette[i % palette.length];
        const bMat = new THREE.MeshStandardMaterial({
          color: col,
          emissive: col,
          emissiveIntensity: 2.6,
          roughness: 0.2
        });
        const bulb = new THREE.Mesh(bulbGeo, bMat);
        bulb.position.set(bx, h - 0.02, d / 2 + 0.30);
        grp.add(bulb);
        this.twinkleBulbs.push({ mesh: bulb, phase: Math.random() * TAU });
      }
    }

    // Chimney with Snow Cap & Optional Animated Rising Smoke
    this.addBox(w * 0.28, h + rh * 0.35, -d * 0.22, 0.44, rh * 0.8, 0.44, this.mat.stoneDark, grp);
    this.addBox(w * 0.28 - 0.05, h + rh * 1.15, -d * 0.22 - 0.05, 0.54, 0.14, 0.54, this.mat.snow, grp);

    if (cfg.smoke) {
      const lx = w * 0.28 + 0.22;
      const ly = h + rh * 1.28;
      const lz = -d * 0.22 + 0.22;
      const cos = Math.cos(cfg.rot);
      const sin = Math.sin(cfg.rot);
      const wx = cfg.x + lx * cos + lz * sin;
      const wz = cfg.z - lx * sin + lz * cos;
      this.addChimneySmoke(wx, ly, wz);
    }
  }

  // Animated Chimney Smoke Emitter (Rising, Expanding & Gently Drifting Puffs)
  addChimneySmoke(x, y, z) {
    if (!this.smokeGeo) {
      this.smokeGeo = new THREE.DodecahedronGeometry(0.24, 0);
    }
    const puffCount = 9;
    for (let i = 0; i < puffCount; i++) {
      const mat = new THREE.MeshStandardMaterial({
        color: 0xeaf1fb,
        emissive: 0x475569,
        emissiveIntensity: 0.55,
        roughness: 1.0,
        transparent: true,
        opacity: 0.62,
        depthWrite: false
      });
      const mesh = new THREE.Mesh(this.smokeGeo, mat);
      this.cityGroup.add(mesh);
      this.smokePuffs.push({
        mesh,
        originX: x,
        originY: y,
        originZ: z,
        phase: i / puffCount,
        speed: 0.17 + (i % 3) * 0.025,
        driftSeed: Math.random() * TAU
      });
    }
  }

  updateSmoke() {
    const dt = 0.016;
    for (let i = 0; i < this.smokePuffs.length; i++) {
      const p = this.smokePuffs[i];
      p.phase = (p.phase + p.speed * dt) % 1.0;
      const u = p.phase;
      // Rise up to 4.4 units while drifting smoothly with winter breeze
      p.mesh.position.set(
        p.originX + Math.sin(this.time * 0.9 + p.driftSeed + u * 3.5) * (0.28 + u * 0.65) + u * 0.55,
        p.originY + u * 4.4,
        p.originZ + Math.cos(this.time * 0.7 + p.driftSeed) * (0.18 + u * 0.35) - u * 0.25
      );
      const scale = 0.55 + u * 1.95;
      p.mesh.scale.setScalar(scale);
      p.mesh.rotation.y += dt * 0.6;
      // Smooth fade in at chimney mouth, fade out high in night sky
      const fadeIn = Math.min(1, u * 5.0);
      const fadeOut = Math.pow(1 - u, 1.25);
      p.mesh.material.opacity = 0.64 * fadeIn * fadeOut;
    }
  }

  // 5. Grand Double-Ring European Townhouses (2x Village Footprint: Ring 1 R=22.8 + Ring 2 R=33.4)
  buildTownhouses() {
    // RING 1: Inner Plaza Perimeter (R = 22.8, leaves 4 cardinal avenues + Cathedral at -28° + Clock Tower at -152°)
    const ring1 = [
      // Back-Right Arc
      { deg:  -48, r: 22.8, w: 3.6, d: 2.9, h: 3.1, rh: 1.9, stone: false, smoke: true  },
      { deg:  -62, r: 22.6, w: 3.5, d: 2.8, h: 2.9, rh: 1.8, stone: true,  smoke: false },
      { deg:  -76, r: 22.6, w: 3.6, d: 2.8, h: 3.2, rh: 1.9, stone: false, smoke: true  },
      // Back-Left Arc (skipping North avenue at -90°)
      { deg: -104, r: 22.6, w: 3.5, d: 2.8, h: 3.0, rh: 1.8, stone: true,  smoke: false },
      { deg: -118, r: 22.6, w: 3.6, d: 2.8, h: 2.9, rh: 1.8, stone: false, smoke: true  },
      { deg: -133, r: 22.8, w: 3.4, d: 2.7, h: 3.1, rh: 1.9, stone: true,  smoke: false },
      // Left-Side & South-West Arc (skipping West avenue at 180°)
      { deg: -168, r: 22.8, w: 3.5, d: 2.8, h: 3.0, rh: 1.8, stone: false, smoke: true  },
      { deg:  166, r: 22.8, w: 3.6, d: 2.9, h: 3.2, rh: 1.9, stone: true,  smoke: false },
      { deg:  150, r: 22.8, w: 3.5, d: 2.8, h: 3.0, rh: 1.8, stone: false, smoke: true  },
      { deg:  134, r: 22.8, w: 3.4, d: 2.7, h: 2.9, rh: 1.7, stone: true,  smoke: false },
      { deg:  118, r: 22.6, w: 3.2, d: 2.6, h: 2.6, rh: 1.6, stone: false, smoke: false },
      // Right-Side & South-East Arc (skipping East avenue at 0°)
      { deg:   14, r: 22.8, w: 3.6, d: 2.9, h: 3.1, rh: 1.9, stone: true,  smoke: true  },
      { deg:   30, r: 22.8, w: 3.5, d: 2.8, h: 2.9, rh: 1.8, stone: false, smoke: false },
      { deg:   46, r: 22.8, w: 3.4, d: 2.7, h: 2.8, rh: 1.7, stone: true,  smoke: false },
      { deg:   62, r: 22.6, w: 3.2, d: 2.6, h: 2.6, rh: 1.6, stone: false, smoke: true  }
    ];

    // RING 2: Outer Residential District (R = 33.4, 24 houses creating a true sprawling 2x Christmas Town!)
    const ring2Count = 30;
    const ring2 = [];
    for (let i = 0; i < ring2Count; i++) {
      const deg = -180 + (i / ring2Count) * 360 + 6;
      // Keep 4 cardinal avenues open (0°, -90°, ±180°, +90° South Boulevard)
      const nearSouth = deg > 76 && deg < 104;
      const nearNorth = deg > -98 && deg < -82;
      const nearEast  = deg > -8 && deg < 8;
      const nearWest  = deg > 172 || deg < -172;
      if (nearSouth || nearNorth || nearEast || nearWest) continue;

      ring2.push({
        deg,
        r: 33.2 + (i % 3) * 0.65,
        w: 3.3 + (i % 3) * 0.35,
        d: 2.7 + (i % 2) * 0.25,
        h: 2.8 + (i % 4) * 0.32,
        rh: 1.7 + (i % 3) * 0.20,
        stone: i % 2 === 0,
        smoke: i % 5 === 0
      });
    }

    [...ring1, ...ring2].forEach(s => {
      const a = s.deg * (Math.PI / 180);
      const x = Math.cos(a) * s.r;
      const z = Math.sin(a) * s.r;
      const rot = Math.atan2(-x, -z);
      this.createCottage({
        x, z, rot,
        w: s.w, d: s.d, h: s.h, rh: s.rh,
        stone: s.stone,
        smoke: s.smoke,
        lights: true
      });
    });
  }

  // 6. Red/White Striped Market Stalls & Plaza Gatehouse Booths (6 Stalls in 4 Quadrants)
  buildMarketStallsAndBooths() {
    const stallSlots = [
      { deg: 148, r: 16.5 },
      { deg: 132, r: 16.5 },
      { deg:  46, r: 16.5 },
      { deg:  30, r: 16.5 },
      { deg: -64, r: 16.8 },
      { deg: -116, r: 16.8 }
    ];
    stallSlots.forEach((slot, idx) => {
      const a = slot.deg * (Math.PI / 180);
      const sx = Math.cos(a) * slot.r;
      const sz = Math.sin(a) * slot.r;

      const sGrp = new THREE.Group();
      sGrp.position.set(sx, 0, sz);
      sGrp.rotation.y = Math.atan2(-sx, -sz);
      this.cityGroup.add(sGrp);

      const sw = 1.9, sd = 1.4, sh = 1.1;
      this.addBox(-sw / 2, 0, -sd / 2, sw, sh, sd, this.mat.woodMed, sGrp);
      this.addBox(-sw / 2 + 0.14, 0.50, sd / 2 + 0.02, sw - 0.28, 0.48, 0.08, this.mat.window, sGrp);

      [-sw / 2, sw / 2 - 0.1].forEach(px => {
        [-sd / 2, sd / 2 - 0.1].forEach(pz => {
          this.addBox(px, sh, pz, 0.10, 0.74, 0.10, this.mat.woodDark, sGrp);
        });
      });

      const stripes = 8;
      for (let s = 0; s < stripes; s++) {
        const bx = -sw / 2 - 0.1 + (s / stripes) * (sw + 0.2);
        const sW = (sw + 0.2) / stripes;
        const m = s % 2 === 0 ? this.mat.red : this.mat.white;
        for (let l = 0; l < 5; l++) {
          const ly = sh + 0.66 + l * 0.09;
          const lSpan = (sd + 0.34) * (1 - l / 6.5);
          this.addBox(bx, ly, -lSpan / 2, sW, 0.08, lSpan, m, sGrp);
        }
      }
      this.addGlow(0, sh + 0.4, 0.3, 2.2, sGrp, this.texGlowWarm, 0.50);
    });

    // Two Cozy Low Snow-Roofed Gatehouse Booths flanking the South Boulevard Entrance
    [72, 108].forEach(deg => {
      const a = deg * (Math.PI / 180);
      const r = 17.8;
      const x = Math.cos(a) * r;
      const z = Math.sin(a) * r;
      this.createCottage({
        x, z,
        rot: Math.atan2(-x, -z),
        w: 2.3, d: 1.8, h: 1.55, rh: 1.25,
        stone: false, lights: true
      });
    });
  }

  // 7. Victorian Wrought-Iron Streetlamps (Inner Ring R=13.0 + Outer Ring R=27.6, budgeted PointLights)
  buildStreetLamps() {
    const placeLampRing = (count, radius, lightEvery) => {
      for (let i = 0; i < count; i++) {
        const a = (i / count) * TAU + 0.19;
        const g = new THREE.Group();
        g.position.set(Math.cos(a) * radius, 0, Math.sin(a) * radius);
        this.cityGroup.add(g);

        this.addBox(-0.07, 0, -0.07, 0.14, 1.9, 0.14, this.mat.woodDark, g);
        this.addBox(-0.22, 1.82, -0.05, 0.44, 0.07, 0.10, this.mat.woodDark, g);
        this.addBox(-0.19, 1.89, -0.19, 0.38, 0.46, 0.38, this.mat.window, g);
        this.addBox(-0.24, 2.35, -0.24, 0.48, 0.10, 0.48, this.mat.snow, g);

        if (i % lightEvery === 0) {
          const light = new THREE.PointLight(0xffa828, 2.6, 13.0, 1.4);
          light.position.set(0, 2.1, 0);
          g.add(light);
        }
        this.addGlow(0, 2.1, 0, 2.5, g, this.texGlowWarm, 0.56);
      }
    };
    placeLampRing(16, 13.0, 4); // 4 PointLights + 16 glowing lanterns
    placeLampRing(16, 27.6, 4); // 4 PointLights + 16 glowing lanterns
  }

  // 8. Snowy Voxel Spruce Trees decorating both Inner Ring & Mid-Ring Garden Belt
  buildSnowyPines() {
    for (let i = 0; i < 20; i++) {
      const deg = (i / 20) * 360 + 9;
      if ((deg > 78 && deg < 102) || (deg > 262 && deg < 278) || deg < 8 || deg > 352 || (deg > 172 && deg < 188)) continue;
      const a = deg * (Math.PI / 180);
      this.placeSnowyPine(Math.cos(a) * 19.2, 0, Math.sin(a) * 19.2, 2.4 + (i % 3) * 0.35, 5);
    }
    for (let i = 0; i < 24; i++) {
      const deg = (i / 24) * 360 + 7;
      if ((deg > 76 && deg < 104) || (deg > 260 && deg < 280) || deg < 10 || deg > 350 || (deg > 170 && deg < 190)) continue;
      const a = deg * (Math.PI / 180);
      this.placeSnowyPine(Math.cos(a) * 29.2, 0, Math.sin(a) * 29.2, 2.6 + (i % 3) * 0.45, 5);
    }
  }

  // Handcrafted Stepped-Voxel Snowy Pine Tree (Unifies visual language with central tree & cottages!)
  placeSnowyPine(x, y, z, h, tiers = 5) {
    const g = new THREE.Group();
    g.position.set(x, y, z);
    g.rotation.y = (x * 1.7 + z * 2.3) % TAU;
    this.cityGroup.add(g);

    const sc = h / 2.6;
    // Trunk
    this.addBox(-0.14 * sc, 0, -0.14 * sc, 0.28 * sc, 0.52 * sc, 0.28 * sc, this.mat.woodDark, g);

    // Alternating rotated voxel pine slabs + staggered white snow ledges
    for (let t = 0; t < tiers; t++) {
      const u = t / tiers;
      const ty = 0.42 * sc + u * h * 0.92;
      const w = (1.65 * sc) * (1 - u * 0.78);
      const thick = 0.34 * sc;
      const pMat = (t % 2 === 0) ? this.mat.pineDark : this.mat.pineMid;

      const slab = new THREE.Mesh(this.unitBox, pMat);
      slab.position.set(0, ty + thick * 0.5, 0);
      slab.scale.set(w, thick, w);
      slab.rotation.y = (t % 2) * (Math.PI / 4);
      slab.castShadow = true;
      slab.receiveShadow = true;
      g.add(slab);

      // Snow cap slab resting on top of foliage tier
      const snowSlab = new THREE.Mesh(this.unitBox, this.mat.snow);
      snowSlab.position.set(0, ty + thick + 0.06 * sc, 0);
      snowSlab.scale.set(w * 0.86, 0.12 * sc, w * 0.86);
      snowSlab.rotation.y = (t % 2) * (Math.PI / 4);
      g.add(snowSlab);
    }

    // Pine tip voxel + snow top
    const tipY = 0.42 * sc + h * 0.94;
    this.addBox(-0.14 * sc, tipY, -0.14 * sc, 0.28 * sc, 0.32 * sc, 0.28 * sc, this.mat.pineMid, g);
    this.addBox(-0.11 * sc, tipY + 0.32 * sc, -0.11 * sc, 0.22 * sc, 0.14 * sc, 0.22 * sc, this.mat.snow, g);
  }

  // 8A-0. Extended Grand Festive Boulevard (z = 11.4 -> 58.0) + Tall Welcome Archway at z = 44.5
  buildEntranceBoulevardAndArchway() {
    // 1. Cobblestone Avenue extending past Ring 2 outer edge (z = 36.5) all the way to z = 58.5
    const roadTex = TextureForge.createCobblestone();
    roadTex.repeat.set(2.6, 16);
    const roadMat = new THREE.MeshStandardMaterial({ map: roadTex, roughness: 0.88, metalness: 0.08 });
    const road = new THREE.Mesh(new THREE.BoxGeometry(6.6, 0.14, 48.0), roadMat);
    road.position.set(0, 0.01, 35.0);
    road.receiveShadow = true;
    this.cityGroup.add(road);

    // Snow-topped low stone curbs flanking both sides of the extended avenue
    [-3.55, 3.25].forEach(cx => {
      this.addBox(cx, 0.02, 20.0, 0.30, 0.24, 39.0, this.mat.stoneDark);
      this.addBox(cx - 0.03, 0.26, 20.0, 0.36, 0.10, 39.0, this.mat.snow);
    });

    // Victorian Streetlamps & Overhead Festive Fairy Light Garlands along the Grand Boulevard
    const lampZs = [20.0, 26.0, 32.0, 38.5, 44.5, 50.5, 56.5];
    const bulbGeo = new THREE.SphereGeometry(0.075, 6, 6);
    const bulbCols = [0xff2a3c, 0x24d658, 0xffd028];

    lampZs.forEach((lz, idx) => {
      [-3.8, 3.8].forEach(lx => {
        const g = new THREE.Group();
        g.position.set(lx, 0, lz);
        this.cityGroup.add(g);

        this.addBox(-0.07, 0, -0.07, 0.14, 2.1, 0.14, this.mat.woodDark, g);
        this.addBox(-0.22, 2.02, -0.05, 0.44, 0.07, 0.10, this.mat.woodDark, g);
        this.addBox(-0.19, 2.09, -0.19, 0.38, 0.46, 0.38, this.mat.window, g);
        this.addBox(-0.24, 2.55, -0.24, 0.48, 0.10, 0.48, this.mat.snow, g);

        this.addGlow(0, 2.3, 0, 2.3, g, this.texGlowWarm, 0.54);
      });

      // Single centered warm PointLight every second pair for fast 60 FPS shading
      if (idx === 1 || idx === 5) {
        const light = new THREE.PointLight(0xffa828, 2.8, 15.0, 1.4);
        light.position.set(0, 3.2, lz);
        this.cityGroup.add(light);
      }

      if (lz !== 44.5) {
        const steps = 12;
        for (let s = 1; s < steps; s++) {
          const u = s / steps;
          const bx = -3.8 + u * 7.6;
          const sag = -0.48 * Math.sin(u * Math.PI);
          const col = bulbCols[(s + idx) % bulbCols.length];
          const bulb = new THREE.Mesh(
            bulbGeo,
            new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 2.8, roughness: 0.2 })
          );
          bulb.position.set(bx, 3.05 + sag, lz);
          this.cityGroup.add(bulb);
          this.twinkleBulbs.push({ mesh: bulb, phase: Math.random() * TAU });
        }
      }
    });

    // 2. TALL GRAND WELCOME ARCHWAY ("★ CHÚC MỪNG GIÁNG SINH ★") Outside Outer Village Ring at z = 44.5
    const archGrp = new THREE.Group();
    archGrp.position.set(0, 0, 44.5);
    this.cityGroup.add(archGrp);

    const pillarX = 4.35;
    const pillarH = 7.0;

    [-pillarX, pillarX].forEach(px => {
      this.addBox(px - 0.68, 0, -0.68, 1.36, 1.0, 1.36, this.mat.stoneDark, archGrp);
      this.addBox(px - 0.50, 1.0, -0.50, 1.00, pillarH - 1.0, 1.00, this.mat.stoneLight, archGrp);
      [-0.52, 0.40].forEach(tx => {
        [-0.52, 0.40].forEach(tz => {
          this.addBox(px + tx, 1.0, tz, 0.12, pillarH - 1.0, 0.12, this.mat.woodDark, archGrp);
        });
      });
      this.addBox(px - 0.68, pillarH, -0.68, 1.36, 0.26, 1.36, this.mat.woodDark, archGrp);
      for (let r = 0; r < 5; r++) {
        const sw = 1.44 * (1 - r / 5.5);
        this.addBox(px - sw / 2, pillarH + 0.26 + r * 0.24, -sw / 2, sw, 0.24, sw, r > 0 ? this.mat.snow : this.mat.roofDark, archGrp);
      }
      this.addBox(px - 0.20, pillarH + 1.46, -0.20, 0.40, 0.46, 0.40, this.mat.window, archGrp);
      this.addGlow(px, pillarH + 1.68, 0, 2.4, archGrp, this.texGlowGold, 0.65);

      const inDir = px < 0 ? 1 : -1;
      this.addBox(px + inDir * 0.48 - 0.22, 4.6, -0.06, 0.44, 0.10, 0.12, this.mat.woodDark, archGrp);
      this.addBox(px + inDir * 0.78 - 0.17, 4.10, -0.17, 0.34, 0.46, 0.34, this.mat.window, archGrp);
      this.addGlow(px + inDir * 0.78, 4.33, 0, 2.1, archGrp, this.texGlowWarm, 0.55);
    });

    // High Overhead Arch Beam & Snow Roof Canopy
    this.addBox(-pillarX - 0.32, 5.55, -0.45, (pillarX + 0.32) * 2, 0.38, 0.90, this.mat.woodDark, archGrp);
    this.addBox(-pillarX - 0.32, 7.28, -0.48, (pillarX + 0.32) * 2, 0.34, 0.96, this.mat.woodDark, archGrp);
    for (let r = 0; r < 4; r++) {
      const rw = (pillarX + 0.55) * 2 - r * 0.28;
      const rd = 1.45 * (1 - r / 5);
      this.addBox(-rw / 2, 7.62 + r * 0.20, -rd / 2, rw, 0.21, rd, this.mat.snow, archGrp);
    }

    for (let i = 0; i <= 16; i++) {
      const gx = -pillarX + 0.45 + (i / 16) * ((pillarX - 0.45) * 2);
      this.addBox(gx - 0.25, 5.32, -0.48, 0.50, 0.30, 0.96, this.mat.wreath, archGrp);
      const col = bulbCols[i % bulbCols.length];
      const b = new THREE.Mesh(
        bulbGeo,
        new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 3.0, roughness: 0.2 })
      );
      b.position.set(gx, 5.30, 0.52);
      archGrp.add(b);
      this.twinkleBulbs.push({ mesh: b, phase: Math.random() * TAU });
    }
    [-2.8, 0, 2.8].forEach(bx => {
      this.addBox(bx - 0.20, 5.22, 0.46, 0.40, 0.30, 0.16, this.mat.red, archGrp);
    });

    const archStar = new THREE.Mesh(new THREE.OctahedronGeometry(0.48, 0), this.mat.gold);
    archStar.position.set(0, 8.95, 0);
    archGrp.add(archStar);
    this.addGlow(0, 8.95, 0, 3.6, archGrp, this.texGlowGold, 0.75);

    const signTex = TextureForge.createWelcomeSign("CHÚC MỪNG GIÁNG SINH");
    this.archwaySignMat = new THREE.MeshStandardMaterial({
      map: signTex,
      emissiveMap: signTex,
      emissive: new THREE.Color(0xffe082),
      emissiveIntensity: 1.7,
      roughness: 0.25
    });

    this.addBox(-3.85, 5.88, -0.28, 7.70, 1.46, 0.56, this.mat.woodDark, archGrp);
    const frontSign = new THREE.Mesh(new THREE.PlaneGeometry(7.50, 1.36), this.archwaySignMat);
    frontSign.position.set(0, 6.61, 0.30);
    archGrp.add(frontSign);

    const backSign = new THREE.Mesh(new THREE.PlaneGeometry(7.50, 1.36), this.archwaySignMat);
    backSign.position.set(0, 6.61, -0.30);
    backSign.rotation.y = Math.PI;
    archGrp.add(backSign);

    const archLight = new THREE.PointLight(0xffbe42, 4.5, 18, 1.4);
    archLight.position.set(0, 4.8, 1.6);
    archGrp.add(archLight);

    // 3. COZY HOUSES, ROADSIDE STALLS & PINE TREES LINING BOTH SIDES OF THE OUTER BOULEVARD
    const boulevardHouses = [
      // Left side of avenue (facing East toward the street)
      { x: -7.2, z: 38.8, rot:  Math.PI / 2 - 0.06, w: 3.5, d: 2.8, h: 3.0, rh: 1.8, stone: false, smoke: true  },
      { x: -7.6, z: 44.2, rot:  Math.PI / 2 + 0.05, w: 3.4, d: 2.7, h: 2.9, rh: 1.7, stone: true,  smoke: false },
      { x: -7.2, z: 49.6, rot:  Math.PI / 2 - 0.06, w: 3.6, d: 2.8, h: 3.1, rh: 1.8, stone: false, smoke: true  },
      { x: -7.4, z: 54.8, rot:  Math.PI / 2 + 0.10, w: 3.2, d: 2.6, h: 2.7, rh: 1.6, stone: true,  smoke: false },
      // Right side of avenue (facing West toward the street)
      { x:  7.2, z: 39.0, rot: -Math.PI / 2 + 0.06, w: 3.4, d: 2.8, h: 2.9, rh: 1.8, stone: true,  smoke: false },
      { x:  7.6, z: 44.4, rot: -Math.PI / 2 - 0.05, w: 3.5, d: 2.8, h: 3.1, rh: 1.8, stone: false, smoke: true  },
      { x:  7.2, z: 49.8, rot: -Math.PI / 2 + 0.06, w: 3.3, d: 2.7, h: 2.8, rh: 1.7, stone: true,  smoke: false },
      { x:  7.4, z: 55.0, rot: -Math.PI / 2 - 0.10, w: 3.2, d: 2.6, h: 2.7, rh: 1.6, stone: false, smoke: false }
    ];
    boulevardHouses.forEach(cfg => this.createCottage({ ...cfg, lights: true }));

    // Roadside market stalls beside the boulevard
    const roadStalls = [
      { x: -4.9, z: 41.2, rot:  Math.PI / 2 },
      { x:  4.9, z: 47.2, rot: -Math.PI / 2 },
      { x: -4.9, z: 52.2, rot:  Math.PI / 2 },
      { x:  4.9, z: 28.5, rot: -Math.PI / 2 }
    ];
    roadStalls.forEach(st => {
      const sGrp = new THREE.Group();
      sGrp.position.set(st.x, 0, st.z);
      sGrp.rotation.y = st.rot;
      this.cityGroup.add(sGrp);

      const sw = 1.9, sd = 1.35, sh = 1.05;
      this.addBox(-sw / 2, 0, -sd / 2, sw, sh, sd, this.mat.woodMed, sGrp);
      this.addBox(-sw / 2 + 0.14, 0.50, sd / 2 + 0.02, sw - 0.28, 0.45, 0.08, this.mat.window, sGrp);
      [-sw / 2, sw / 2 - 0.1].forEach(px => {
        [-sd / 2, sd / 2 - 0.1].forEach(pz => {
          this.addBox(px, sh, pz, 0.10, 0.72, 0.10, this.mat.woodDark, sGrp);
        });
      });
      for (let s = 0; s < 8; s++) {
        const bx = -sw / 2 - 0.1 + (s / 8) * (sw + 0.2);
        const sW = (sw + 0.2) / 8;
        const m = s % 2 === 0 ? this.mat.red : this.mat.white;
        for (let l = 0; l < 5; l++) {
          const ly = sh + 0.65 + l * 0.09;
          const lSpan = (sd + 0.32) * (1 - l / 6.5);
          this.addBox(bx, ly, -lSpan / 2, sW, 0.08, lSpan, m, sGrp);
        }
      }
      this.addGlow(0, sh + 0.4, 0.3, 2.2, sGrp, this.texGlowWarm, 0.50);
    });

    // Snowy voxel pines framing the outer boulevard cottages
    [
      { x: -10.5, z: 41.5, h: 2.8 },
      { x: -10.8, z: 47.0, h: 3.1 },
      { x: -10.5, z: 53.0, h: 2.7 },
      { x:  10.5, z: 41.8, h: 2.9 },
      { x:  10.8, z: 47.2, h: 2.8 },
      { x:  10.5, z: 53.2, h: 2.6 }
    ].forEach(p => this.placeSnowyPine(p.x, 0, p.z, p.h, 5));
  }

  // Dynamic Signboard Updater (triggered by 💌 Lời Chúc modal)
  setArchwayText(text) {
    if (!this.archwaySignMat) return;
    const newTex = TextureForge.createWelcomeSign(text);
    if (this.archwaySignMat.map) this.archwaySignMat.map.dispose();
    this.archwaySignMat.map = newTex;
    this.archwaySignMat.emissiveMap = newTex;
    this.archwaySignMat.needsUpdate = true;
  }

  // 8A. Sculpted Stepped-Voxel Snow Mountains & Low Pine Hills (Unified Voxel Architectural Language)
  buildMountainsAndPineHills() {
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x1e2536, roughness: 0.94, metalness: 0.06 });
    const rockDarkMat = new THREE.MeshStandardMaterial({ color: 0x131824, roughness: 0.96 });
    const hillSnowMat = new THREE.MeshStandardMaterial({ color: 0xcfe0f5, roughness: 0.88 });
    const farPeakMat = new THREE.MeshStandardMaterial({ color: 0x0d1322, roughness: 0.98 });

    let seed = 202612;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };

    // Helper: Build a stepped-voxel Alpine hill or mountain peak (Zero smooth primitive cones!)
    const buildVoxelPeak = (x, z, baseW, height, steps, isMountain = true) => {
      const grp = new THREE.Group();
      grp.position.set(x, 0, z);
      grp.rotation.y = rand() * TAU;
      this.cityGroup.add(grp);

      const stepH = height / steps;
      let offX = 0, offZ = 0;
      for (let s = 0; s < steps; s++) {
        const u = s / steps;
        const w = baseW * Math.pow(1 - u, 0.84) * (0.92 + rand() * 0.16);
        const d = baseW * Math.pow(1 - u, 0.84) * (0.86 + rand() * 0.22);
        offX += (rand() - 0.5) * 0.35;
        offZ += (rand() - 0.5) * 0.35;

        let mat = hillSnowMat;
        if (isMountain) {
          if (u > 0.52) mat = this.mat.snow;
          else if (u > 0.40 && rand() < 0.5) mat = hillSnowMat;
          else mat = (s % 2 === 0) ? rockMat : rockDarkMat;
        }
        this.addBox(offX - w / 2, s * stepH, offZ - d / 2, w, stepH + 0.04, d, mat, grp);
      }
      return grp;
    };

    // A. Low Stepped-Voxel Snowy Pine Hills Outside Ring 2 (R = 41.0 to 52.0)
    const hillCount = 26;
    for (let i = 0; i < hillCount; i++) {
      const a = (i / hillCount) * TAU + (rand() - 0.5) * 0.12;
      const deg = (a * 180 / Math.PI + 360) % 360;
      if (deg > 66 && deg < 114) continue;

      const r = 41.5 + rand() * 10.5;
      const hx = Math.cos(a) * r;
      const hz = Math.sin(a) * r;
      const hW = 7.4 + rand() * 4.2;
      const hHeight = 1.6 + rand() * 1.9;

      buildVoxelPeak(hx, hz, hW, hHeight, 4, false);

      const treesOnHill = 2 + Math.floor(rand() * 2);
      for (let t = 0; t < treesOnHill; t++) {
        const ta = rand() * TAU;
        const tr = rand() * (hW * 0.38);
        const tx = hx + Math.cos(ta) * tr;
        const tz = hz + Math.sin(ta) * tr;
        const ty = Math.max(0, hHeight * (1 - tr / (hW * 0.55)) * 0.65);
        this.placeSnowyPine(tx, ty, tz, 2.4 + rand() * 1.8, 4);
      }
    }

    // Subtle voxel pine belt just outside Ring 2 houses (R = 38.0 to 42.5)
    for (let i = 0; i < 42; i++) {
      const a = (i / 42) * TAU + (rand() - 0.5) * 0.08;
      const deg = (a * 180 / Math.PI + 360) % 360;
      if (deg > 66 && deg < 114) continue;
      const r = 38.2 + rand() * 4.2;
      this.placeSnowyPine(Math.cos(a) * r, 0, Math.sin(a) * r, 2.5 + rand() * 1.8, 4);
    }

    // B. Sculpted Stepped-Voxel Snow-Capped Alpine Mountains (R = 58 to 74)
    const peakCount = 24;
    for (let i = 0; i < peakCount; i++) {
      const a = (i / peakCount) * TAU + (rand() - 0.5) * 0.14;
      const deg = (a * 180 / Math.PI + 360) % 360;
      if (deg > 64 && deg < 116) continue;

      const r = 58.0 + rand() * 16.0;
      const mx = Math.cos(a) * r;
      const mz = Math.sin(a) * r;
      const mW = 12.0 + rand() * 6.5;
      const mH = 8.2 + rand() * 6.2;

      buildVoxelPeak(mx, mz, mW, mH, 9, true);

      const sa = a + 0.07;
      buildVoxelPeak(
        Math.cos(sa) * (r - 3.5),
        Math.sin(sa) * (r - 3.5),
        mW * 0.58,
        mH * 0.56,
        6,
        true
      );
    }

    // C. Far Misty Silhouette Mountain Horizon (R = 90 to 108)
    for (let i = 0; i < 20; i++) {
      const a = (i / 20) * TAU;
      const deg = (a * 180 / Math.PI + 360) % 360;
      if (deg > 60 && deg < 120) continue;
      const r = 92.0 + rand() * 16.0;
      const fw = 22.0 + rand() * 12.0;
      const fh = 11.0 + rand() * 9.0;
      const m = new THREE.Mesh(new THREE.ConeGeometry(fw * 0.65, fh, 5), farPeakMat);
      m.position.set(Math.cos(a) * r, fh * 0.45, Math.sin(a) * r);
      m.rotation.y = rand() * TAU;
      this.cityGroup.add(m);
    }
  }

  // 8C. Ethereal Northern Lights — Aurora Borealis Shader Ribbons Behind the Mountains
  buildAurora() {
    this.auroraUniforms = {
      uTime: { value: 0 }
    };

    const auroraMat = new THREE.ShaderMaterial({
      uniforms: this.auroraUniforms,
      vertexShader: `
        uniform float uTime;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 pos = position;
          pos.z += sin(pos.x * 0.09 + uTime * 0.45) * 3.8 + cos(pos.x * 0.04 - uTime * 0.3) * 2.2;
          pos.y += sin(pos.x * 0.06 + uTime * 0.35) * 1.4;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec2 vUv;
        void main() {
          // Vertical curtain fade (soft bottom, long fading top)
          float vert = smoothstep(0.0, 0.28, vUv.y) * smoothstep(1.0, 0.18, vUv.y);
          // Horizontal ends fade softly into night sky
          float horiz = smoothstep(0.0, 0.22, vUv.x) * smoothstep(1.0, 0.78, vUv.x);
          // Shimmering vertical curtain bands
          float wave1 = 0.5 + 0.5 * sin(vUv.x * 26.0 + uTime * 0.75 + sin(vUv.y * 4.0));
          float wave2 = 0.5 + 0.5 * sin(vUv.x * 14.0 - uTime * 0.52);
          float bands = pow(wave1 * 0.65 + wave2 * 0.35, 1.6);

          vec3 colGreen  = vec3(0.08, 0.85, 0.55);
          vec3 colCyan   = vec3(0.10, 0.72, 0.90);
          vec3 colViolet = vec3(0.45, 0.22, 0.88);
          vec3 col = mix(colGreen, colCyan, smoothstep(0.15, 0.6, vUv.y));
          col = mix(col, colViolet, smoothstep(0.55, 0.95, vUv.y));

          float alpha = vert * horiz * bands * 0.30;
          gl_FragColor = vec4(col, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    });

    // Two sweeping curved ribbons across the expanded northern night sky
    const ribbon1 = new THREE.Mesh(new THREE.PlaneGeometry(195, 30, 48, 8), auroraMat);
    ribbon1.position.set(-6, 36, -96);
    ribbon1.rotation.y = 0.12;
    this.scene.add(ribbon1);

    const ribbon2 = new THREE.Mesh(new THREE.PlaneGeometry(165, 24, 40, 6), auroraMat);
    ribbon2.position.set(18, 40, -108);
    ribbon2.rotation.y = -0.18;
    this.scene.add(ribbon2);
  }

  // 8D. Flying Voxel Santa Sleigh & 4 Prancing Reindeer with Golden Stardust Trail
  buildSantaSleigh() {
    const grp = new THREE.Group();
    this.scene.add(grp);
    this.santaGroup = grp;
    this.santaReindeer = [];

    const sleighRed = new THREE.MeshStandardMaterial({ color: 0xd91a2e, emissive: 0x550810, emissiveIntensity: 0.6, roughness: 0.4 });
    const reindeerMat = new THREE.MeshStandardMaterial({ color: 0x6b4226, roughness: 0.85 });
    const noseRedMat = new THREE.MeshStandardMaterial({ color: 0xff2222, emissive: 0xff1111, emissiveIntensity: 4.0 });
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xf4c49c, roughness: 0.75 });

    // Sleigh runners (gold)
    this.addBox(-0.45, 0, -1.0, 0.08, 0.08, 2.2, this.mat.gold, grp);
    this.addBox( 0.37, 0, -1.0, 0.08, 0.08, 2.2, this.mat.gold, grp);
    // Sleigh body (red with gold trim)
    this.addBox(-0.48, 0.14, -0.85, 0.96, 0.45, 1.55, sleighRed, grp);
    this.addBox(-0.52, 0.56, -0.88, 1.04, 0.08, 1.60, this.mat.gold, grp);
    // Gift sack piled in back of sleigh
    this.addBox(-0.32, 0.58, -0.78, 0.64, 0.48, 0.58, this.mat.woodMed, grp);
    this.addBox(-0.18, 0.95, -0.68, 0.24, 0.24, 0.24, this.mat.blue, grp);
    this.addBox( 0.08, 0.92, -0.58, 0.22, 0.22, 0.22, this.mat.gold, grp);

    // Santa Claus sitting at the reins
    this.addBox(-0.22, 0.58, -0.10, 0.44, 0.46, 0.34, sleighRed, grp);
    this.addBox(-0.16, 1.04, -0.06, 0.32, 0.28, 0.28, skinMat, grp);
    this.addBox(-0.17, 1.00,  0.14, 0.34, 0.16, 0.10, this.mat.white, grp); // beard
    this.addBox(-0.18, 1.30, -0.08, 0.36, 0.14, 0.32, sleighRed, grp);      // Santa hat
    this.addBox(-0.06, 1.44, -0.10, 0.12, 0.10, 0.12, this.mat.white, grp); // pom-pom

    // Warm golden glow halo around Santa's Sleigh
    this.addGlow(0, 0.7, 0, 3.6, grp, this.texGlowGold, 0.55);

    // 4 Prancing Voxel Reindeer leading ahead along +Z
    const deerOffsets = [
      { x: -0.38, z: 2.1, rudolph: false },
      { x:  0.38, z: 2.1, rudolph: false },
      { x: -0.38, z: 3.7, rudolph: false },
      { x:  0.38, z: 3.7, rudolph: true  }
    ];
    deerOffsets.forEach((d, idx) => {
      const dg = new THREE.Group();
      dg.position.set(d.x, 0.2, d.z);
      grp.add(dg);

      // Reindeer body, neck, head, antlers & legs
      this.addBox(-0.14, 0.22, -0.36, 0.28, 0.26, 0.72, reindeerMat, dg);
      this.addBox(-0.09, 0.46,  0.18, 0.18, 0.26, 0.18, reindeerMat, dg);
      this.addBox(-0.10, 0.66,  0.18, 0.20, 0.18, 0.30, reindeerMat, dg);
      // Antlers
      this.addBox(-0.18, 0.84, 0.20, 0.05, 0.22, 0.05, this.mat.gold, dg);
      this.addBox( 0.13, 0.84, 0.20, 0.05, 0.22, 0.05, this.mat.gold, dg);
      // Legs
      this.addBox(-0.12, 0, -0.30, 0.08, 0.24, 0.08, reindeerMat, dg);
      this.addBox( 0.04, 0, -0.30, 0.08, 0.24, 0.08, reindeerMat, dg);
      this.addBox(-0.12, 0,  0.22, 0.08, 0.24, 0.08, reindeerMat, dg);
      this.addBox( 0.04, 0,  0.22, 0.08, 0.24, 0.08, reindeerMat, dg);
      // Rudolph's glowing red nose!
      if (d.rudolph) {
        this.addBox(-0.045, 0.71, 0.48, 0.09, 0.09, 0.09, noseRedMat, dg);
        this.addGlow(0, 0.75, 0.54, 1.3, dg, this.texGlowWarm, 0.8);
      }

      // Golden rein line connecting to sleigh
      this.addBox(d.x - 0.02, 0.52, 0.5, 0.04, 0.03, d.z - 0.5, this.mat.gold, grp);

      this.santaReindeer.push({ group: dg, phase: idx * 1.1 });
    });

    // Golden stardust trail pool (24 shimmering sparkles)
    const starGeo = new THREE.OctahedronGeometry(0.11, 0);
    for (let i = 0; i < 24; i++) {
      const sm = new THREE.MeshStandardMaterial({
        color: 0xffe880,
        emissive: 0xffc824,
        emissiveIntensity: 3.0,
        transparent: true,
        opacity: 0.0
      });
      const sp = new THREE.Mesh(starGeo, sm);
      this.scene.add(sp);
      this.santaStardust.push({ mesh: sp, life: i / 24, vx: 0, vy: 0, vz: 0 });
    }
  }

  updateSantaSleigh() {
    if (!this.santaGroup) return;
    // Wide graceful elliptical flight high above the 2x Christmas Village & Alpine peaks
    const a = this.time * 0.13 + 0.9;
    const rx = 44.0, rz = 38.0;
    const x = Math.cos(a) * rx;
    const z = Math.sin(a) * rz - 8.0;
    const y = 21.5 + Math.sin(a * 2.0) * 2.4;

    this.santaGroup.position.set(x, y, z);
    const dx = -Math.sin(a) * rx;
    const dz =  Math.cos(a) * rz;
    this.santaGroup.rotation.y = Math.atan2(dx, dz);
    this.santaGroup.rotation.z = -0.12; // graceful bank into turn

    // Prancing reindeer bob
    for (let i = 0; i < this.santaReindeer.length; i++) {
      const rd = this.santaReindeer[i];
      rd.group.position.y = 0.2 + Math.sin(this.time * 7.0 + rd.phase) * 0.14;
      rd.group.rotation.x = Math.cos(this.time * 7.0 + rd.phase) * 0.16;
    }

    // Update trailing golden stardust particles
    const dt = 0.016;
    for (let i = 0; i < this.santaStardust.length; i++) {
      const st = this.santaStardust[i];
      st.life -= dt * 0.55;
      if (st.life <= 0) {
        st.life = 1.0;
        st.mesh.position.set(
          x + (Math.random() - 0.5) * 0.8,
          y + 0.3 + (Math.random() - 0.5) * 0.5,
          z + (Math.random() - 0.5) * 0.8
        );
      } else {
        st.mesh.position.y -= dt * 0.35;
        st.mesh.rotation.y += dt * 3.0;
      }
      st.mesh.scale.setScalar(Math.max(0.05, st.life));
      st.mesh.material.opacity = st.life * 0.85;
    }
  }

  // 8B. Lively Voxel Winter Villagers Strolling Around the Plaza & Market
  buildVillagers() {
    const coatColors = [0xb91c1c, 0x166534, 0x1e3a8a, 0x9a6536, 0x6b21a8, 0xb45309, 0x0f766e, 0x9f1239];
    const scarfColors = [0xfef08a, 0xffffff, 0xf87171, 0x38bdf8, 0x4ade80];
    const pantsMat = new THREE.MeshStandardMaterial({ color: 0x181c24, roughness: 0.9 });
    const skinMat  = new THREE.MeshStandardMaterial({ color: 0xf1c29b, roughness: 0.75 });
    const eyeMat   = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5 });
    const lanternMat = new THREE.MeshStandardMaterial({
      color: 0xfff3aa,
      emissive: 0xffb322,
      emissiveIntensity: 3.0,
      roughness: 0.2
    });

    const coatMats = coatColors.map(c => new THREE.MeshStandardMaterial({ color: c, roughness: 0.75 }));
    const scarfMats = scarfColors.map(c => new THREE.MeshStandardMaterial({ color: c, roughness: 0.8 }));

    const createCharacter = (idx, isChild = false) => {
      const root = new THREE.Group();
      const s = isChild ? 0.74 : (0.92 + (idx % 3) * 0.06);
      root.scale.setScalar(s);

      const coatMat = coatMats[idx % coatMats.length];
      const scarfMat = scarfMats[(idx * 2 + 1) % scarfMats.length];
      const hatMat = (idx % 2 === 0) ? this.mat.red : coatMats[(idx + 3) % coatMats.length];

      // Left & Right Legs (pivoted at hip y = 0.34)
      const legL = new THREE.Group();
      legL.position.set(-0.08, 0.34, 0);
      this.addBox(-0.065, -0.34, -0.065, 0.13, 0.34, 0.13, pantsMat, legL);
      root.add(legL);

      const legR = new THREE.Group();
      legR.position.set(0.08, 0.34, 0);
      this.addBox(-0.065, -0.34, -0.065, 0.13, 0.34, 0.13, pantsMat, legR);
      root.add(legR);

      // Winter Coat Torso
      this.addBox(-0.16, 0.32, -0.11, 0.32, 0.38, 0.22, coatMat, root);
      // Warm Scarf
      this.addBox(-0.17, 0.67, -0.12, 0.34, 0.08, 0.24, scarfMat, root);

      // Left & Right Arms (pivoted at shoulder y = 0.66)
      const armL = new THREE.Group();
      armL.position.set(-0.20, 0.66, 0);
      this.addBox(-0.055, -0.30, -0.055, 0.11, 0.32, 0.11, coatMat, armL);
      root.add(armL);

      const armR = new THREE.Group();
      armR.position.set(0.20, 0.66, 0);
      this.addBox(-0.055, -0.30, -0.055, 0.11, 0.32, 0.11, coatMat, armR);
      // Every 4th villager carries a tiny glowing hand lantern
      if (idx % 4 === 0 && !isChild) {
        this.addBox(-0.045, -0.40, 0.02, 0.09, 0.12, 0.09, lanternMat, armR);
      }
      root.add(armR);

      // Head + Tiny Eyes
      const head = new THREE.Group();
      head.position.set(0, 0.75, 0);
      this.addBox(-0.13, 0, -0.13, 0.26, 0.25, 0.26, skinMat, head);
      this.addBox(-0.075, 0.12, 0.13, 0.035, 0.035, 0.015, eyeMat, head);
      this.addBox( 0.040, 0.12, 0.13, 0.035, 0.035, 0.015, eyeMat, head);

      // Cozy Winter Hat / Santa Hat with White Trim & Pom-Pom
      this.addBox(-0.145, 0.23, -0.145, 0.29, 0.06, 0.29, this.mat.white, head);
      this.addBox(-0.125, 0.29, -0.125, 0.25, 0.11, 0.25, hatMat, head);
      this.addBox(-0.045, 0.40, -0.045, 0.09, 0.08, 0.09, this.mat.white, head);
      root.add(head);

      this.cityGroup.add(root);
      return { root, legL, legR, armL, armR, head };
    };

    // Group A: 24 Strollers walking around the grand central cobblestone square (r = 5.0 -> 10.2)
    for (let i = 0; i < 24; i++) {
      const parts = createCharacter(i, i % 5 === 0);
      const radius = 5.0 + (i % 6) * 1.0;
      const dir = (i % 2 === 0) ? 1 : -1;
      const angle = (i / 24) * TAU;
      const speed = (0.095 + (i % 3) * 0.025) * dir;

      this.villagers.push({
        mode: "orbit",
        ...parts,
        radius,
        angle,
        speed,
        walkPhase: Math.random() * TAU
      });
    }

    // Group A2: 20 Strollers walking around the outer Ring 2 promenade (r = 26.4 -> 29.2)
    for (let i = 0; i < 20; i++) {
      const parts = createCharacter(i + 24, i % 6 === 1);
      const radius = 26.4 + (i % 4) * 0.85;
      const dir = (i % 2 === 0) ? -1 : 1;
      const angle = (i / 20) * TAU;
      const speed = (0.045 + (i % 3) * 0.012) * dir;

      this.villagers.push({
        mode: "orbit",
        ...parts,
        radius,
        angle,
        speed,
        walkPhase: Math.random() * TAU
      });
    }

    // Group B: 12 Waypoint Walkers crossing between Central Square, Cathedral & Market Quadrants
    const paths = [
      [ { x: 0.4, z: 12.5 }, { x: 0.6, z: 6.5 }, { x: 6.0, z: 4.5 }, { x: 11.5, z: -2.0 }, { x: 7.5, z: -6.0 }, { x: 3.5, z: 6.5 } ],
      [ { x: -0.8, z: 12.5 }, { x: -2.0, z: 6.5 }, { x: -8.5, z: 6.0 }, { x: -11.5, z: 4.0 }, { x: -6.5, z: -3.5 }, { x: -1.5, z: 7.2 } ],
      [ { x: 9.0, z: 2.0 }, { x: 4.0, z: 6.5 }, { x: -4.0, z: 6.5 }, { x: -9.5, z: 5.0 }, { x: -3.5, z: 7.5 }, { x: 5.5, z: 5.5 } ]
    ];

    for (let i = 0; i < 12; i++) {
      const parts = createCharacter(i + 44, i % 4 === 3);
      const pts = paths[i % paths.length];
      const seg = i % pts.length;
      const startPt = pts[seg];
      parts.root.position.set(startPt.x, 0, startPt.z);

      this.villagers.push({
        mode: "path",
        ...parts,
        pts,
        targetIdx: (seg + 1) % pts.length,
        speed: 0.85 + (i % 3) * 0.18,
        walkPhase: Math.random() * TAU
      });
    }

    // Group C: 14 Stationary Villagers admiring the tree, shopping at stalls & socializing by the Welcome Archway
    const standSpots = [
      { x: -10.8, z: 10.6, rot: -0.5 },
      { x:  10.8, z: 10.6, rot:  0.5 },
      { x:  -1.8, z:  5.0, rot:  2.8 },
      { x:  -1.0, z:  5.1, rot: -2.9 },
      { x:  12.4, z: -4.5, rot:  1.1 },
      { x:   2.2, z:  6.4, rot:  2.7 },
      { x:  -3.6, z: 41.2, rot: -1.5 },
      { x:  -3.3, z: 41.9, rot: -1.7 },
      { x:   3.6, z: 47.2, rot:  1.5 },
      { x:   3.3, z: 46.6, rot:  1.3 },
      { x:  -2.6, z: 44.0, rot:  0.6 },
      { x:  -2.0, z: 44.4, rot: -0.4 },
      { x:   2.8, z: 39.0, rot: -1.2 },
      { x:  -2.8, z: 50.0, rot:  1.1 }
    ];
    standSpots.forEach((sp, i) => {
      const parts = createCharacter(i + 56, i === 3 || i === 7 || i === 11);
      parts.root.position.set(sp.x, 0, sp.z);
      parts.root.rotation.y = sp.rot;
      this.villagers.push({
        mode: "idle",
        ...parts,
        baseRot: sp.rot,
        walkPhase: Math.random() * TAU
      });
    });

    // Group D: 34 Bustling Boulevard Strollers streaming continuously IN & OUT under the "CHÚC MỪNG GIÁNG SINH" Archway
    for (let i = 0; i < 34; i++) {
      const parts = createCharacter(i + 70, i % 5 === 2);
      const goingIn = (i % 2 === 0);
      const laneBase = goingIn ? 0.72 + (i % 3) * 0.65 : -(0.72 + (i % 3) * 0.65);
      const startZ = 11.5 + (i / 34) * 46.5;
      parts.root.position.set(laneBase, 0, startZ);
      parts.root.rotation.y = goingIn ? Math.PI : 0;

      this.villagers.push({
        mode: "boulevard",
        ...parts,
        goingIn,
        laneX: laneBase,
        minZ: 11.2,
        maxZ: 58.2,
        speed: 0.90 + (i % 4) * 0.18,
        walkPhase: Math.random() * TAU
      });
    }
  }

  updateVillagers() {
    const dt = 0.016;
    for (let i = 0; i < this.villagers.length; i++) {
      const v = this.villagers[i];

      if (v.mode === "orbit") {
        v.angle += v.speed * dt;
        const x = Math.cos(v.angle) * v.radius;
        const z = Math.sin(v.angle) * v.radius;
        v.root.position.x = x;
        v.root.position.z = z;

        // Tangent facing direction
        const dx = -Math.sin(v.angle) * v.speed;
        const dz =  Math.cos(v.angle) * v.speed;
        v.root.rotation.y = Math.atan2(dx, dz);

        v.walkPhase += Math.abs(v.speed) * v.radius * dt * 8.5;
        const swing = Math.sin(v.walkPhase);
        v.legL.rotation.x =  swing * 0.55;
        v.legR.rotation.x = -swing * 0.55;
        v.armL.rotation.x = -swing * 0.42;
        v.armR.rotation.x =  swing * 0.42;
        v.root.position.y = Math.abs(swing) * 0.04;
      } else if (v.mode === "path") {
        const target = v.pts[v.targetIdx];
        const dx = target.x - v.root.position.x;
        const dz = target.z - v.root.position.z;
        const dist = Math.hypot(dx, dz);

        if (dist < 0.25) {
          v.targetIdx = (v.targetIdx + 1) % v.pts.length;
        } else {
          const step = v.speed * dt;
          v.root.position.x += (dx / dist) * step;
          v.root.position.z += (dz / dist) * step;

          // Smooth turn toward waypoint
          const desiredRot = Math.atan2(dx, dz);
          let diff = desiredRot - v.root.rotation.y;
          while (diff > Math.PI) diff -= TAU;
          while (diff < -Math.PI) diff += TAU;
          v.root.rotation.y += diff * 0.12;
        }

        v.walkPhase += v.speed * dt * 8.0;
        const swing = Math.sin(v.walkPhase);
        v.legL.rotation.x =  swing * 0.55;
        v.legR.rotation.x = -swing * 0.55;
        v.armL.rotation.x = -swing * 0.42;
        v.armR.rotation.x =  swing * 0.42;
        v.root.position.y = Math.abs(swing) * 0.04;
      } else if (v.mode === "boulevard") {
        // Bustling two-way stream passing under the Welcome Archway into the village square
        const dir = v.goingIn ? -1 : 1;
        v.root.position.z += dir * v.speed * dt;
        v.root.position.x = v.laneX + Math.sin(this.time * 0.7 + v.walkPhase * 0.1) * 0.14;
        v.root.rotation.y = v.goingIn ? Math.PI : 0;

        if (v.goingIn && v.root.position.z < v.minZ) {
          v.root.position.z = v.maxZ;
        } else if (!v.goingIn && v.root.position.z > v.maxZ) {
          v.root.position.z = v.minZ;
        }

        v.walkPhase += v.speed * dt * 8.2;
        const swing = Math.sin(v.walkPhase);
        v.legL.rotation.x =  swing * 0.55;
        v.legR.rotation.x = -swing * 0.55;
        v.armL.rotation.x = -swing * 0.42;
        v.armR.rotation.x =  swing * 0.42;
        v.root.position.y = Math.abs(swing) * 0.04;
      } else {
        // Gentle idle head turn & festive sway
        v.walkPhase += dt * 1.8;
        v.head.rotation.y = Math.sin(v.walkPhase) * 0.28;
        v.armL.rotation.x = Math.sin(v.walkPhase * 1.3) * 0.08;
        v.armR.rotation.x = -Math.sin(v.walkPhase * 1.3) * 0.08;
      }
    }
  }

  // 9. Faint Misty Moon Upper-Left of the Star (Subtle signature detail from photo)
  buildBackgroundMoon() {
    const moon = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: this.texGlowMoon,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    );
    moon.position.set(-2.6, 8.2, -3.5);
    moon.scale.set(5.2, 5.2, 1);
    this.scene.add(moon);
  }

  // 10. Starry Night Sky & Crisp Falling Snowflakes
  initSkyAndSnow() {
    // Crisp night stars dome scaled for 2x valley
    const starCount = 1100;
    const starGeo = new THREE.BufferGeometry();
    const sPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = 125 + Math.random() * 45;
      const theta = Math.random() * TAU;
      const phi = Math.acos(Math.random() * 0.82 + 0.12);
      sPos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      sPos[i * 3 + 1] = r * Math.cos(phi);
      sPos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(sPos, 3));
    this.starPoints = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({ color: 0xeaf4ff, size: 0.42, transparent: true, opacity: 0.85 })
    );
    this.scene.add(this.starPoints);

    // Crisp falling 6-point snowflakes spanning the full 2x Christmas Village
    const snowCount = 2000;
    const snowGeo = new THREE.BufferGeometry();
    const pos = new Float32Array(snowCount * 3);
    const speeds = new Float32Array(snowCount);

    for (let i = 0; i < snowCount; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 120;
      pos[i * 3 + 1] = Math.random() * 38;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 120 + 6;
      speeds[i]      = 0.032 + Math.random() * 0.052;
    }

    snowGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    this.snowSpeeds = speeds;

    this.snowPoints = new THREE.Points(
      snowGeo,
      new THREE.PointsMaterial({
        map: this.texSnowflake,
        color: 0xffffff,
        size: 0.30,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    );
    this.scene.add(this.snowPoints);
  }

  updateSnow() {
    if (!this.snowPoints || !this.snowPoints.visible) return;
    const pos = this.snowPoints.geometry.attributes.position.array;
    const wind = Math.sin(this.time * 0.5) * 0.015;
    for (let i = 0; i < this.snowSpeeds.length; i++) {
      pos[i * 3 + 1] -= this.snowSpeeds[i];
      pos[i * 3]     += wind;
      if (pos[i * 3 + 1] < 0) {
        pos[i * 3 + 1] = 36 + Math.random() * 2;
        pos[i * 3]     = (Math.random() - 0.5) * 120;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 120 + 6;
      }
    }
    this.snowPoints.geometry.attributes.position.needsUpdate = true;
  }

  setupControls() {
    if (window.THREE && window.THREE.OrbitControls) {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.maxPolarAngle = Math.PI / 2 - 0.04;
      this.controls.minDistance = 8;
      this.controls.maxDistance = 165;
      this.controls.target.set(-1.0, 4.0, 12.0);
      this.controls.addEventListener("start", () => {
        this.camFlight = null;
        this.walkthroughActive = false;
      });
    }
  }

  bindEvents() {
    window.addEventListener("resize", () => {
      this.width = this.container.clientWidth || window.innerWidth;
      this.height = this.container.clientHeight || window.innerHeight;
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height);
    });
  }

  // Smooth Cinematic Camera Presets + Fly-Through Walkthrough (Scaled for 2x Grand Village)
  flyToPreset(presetName) {
    this.walkthroughActive = false;
    this.autoRotate = false;

    if (presetName === "walkthrough") {
      this.camFlight = null;
      this.walkthroughActive = true;
      this.walkthroughT = 0;
      if (!this.walkCurve) {
        this.walkCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3( 0.0, 4.2, 62.0),  // Outside Welcome Archway
          new THREE.Vector3( 0.0, 3.6, 48.0),  // Approaching "CHÚC MỪNG GIÁNG SINH"
          new THREE.Vector3( 0.2, 3.0, 36.0),  // Passing right under the Archway into Ring 2
          new THREE.Vector3( 0.8, 2.8, 19.0),  // Crossing into the Grand Central Square
          new THREE.Vector3( 8.5, 4.8, 10.5),  // Sweeping past the giant Christmas tree
          new THREE.Vector3(11.0, 6.8,  0.5),  // Admiring the Twin-Spire Cathedral
          new THREE.Vector3(-7.0, 8.0,-11.0),  // Orbiting behind tree past Clock Tower
          new THREE.Vector3(-15.0,10.0, 14.0), // Gliding over outer Ring 2 & market stalls
          new THREE.Vector3(17.5, 22.5, 74.0)  // Returning to grand 2x panoramic view
        ]);
        this.walkLookCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3( 0.0, 5.2, 44.5),
          new THREE.Vector3( 0.0, 5.4, 38.0),
          new THREE.Vector3( 0.0, 4.2,  0.0),
          new THREE.Vector3( 0.0, 4.8,  0.0),
          new THREE.Vector3( 3.0, 4.8, -2.0),
          new THREE.Vector3(22.0, 6.0,-12.0),
          new THREE.Vector3( 0.0, 4.5,  0.0),
          new THREE.Vector3( 0.0, 4.0,  0.0),
          new THREE.Vector3(-1.0, 4.0, 12.0)
        ]);
      }
      return;
    }

    const presets = {
      overview:  { pos: new THREE.Vector3( 17.5, 22.5, 74.0), target: new THREE.Vector3(-1.0, 4.0,  12.0) },
      archway:   { pos: new THREE.Vector3(  0.0,  5.2, 59.0), target: new THREE.Vector3( 0.0, 5.0,  32.0) },
      plaza:     { pos: new THREE.Vector3(-11.5,  6.8, 20.5), target: new THREE.Vector3( 0.5, 4.5,   0.0) },
      cathedral: { pos: new THREE.Vector3(  4.0,  8.5,  6.5), target: new THREE.Vector3(21.5, 6.0, -11.5) }
    };
    const p = presets[presetName] || presets.overview;
    this.camFlight = {
      startPos: this.camera.position.clone(),
      endPos: p.pos.clone(),
      startTarget: this.controls ? this.controls.target.clone() : new THREE.Vector3(0, 3, 0),
      endTarget: p.target.clone(),
      t: 0,
      duration: 1.35
    };
  }

  resetToPhotoAngle() {
    this.flyToPreset("overview");
  }

  updateCameraFlight(dt = 0.016) {
    if (this.walkthroughActive && this.walkCurve) {
      this.walkthroughT += dt * 0.045;
      if (this.walkthroughT >= 1.0) {
        this.walkthroughActive = false;
        this.walkthroughT = 1.0;
      }
      const pos = this.walkCurve.getPointAt(this.walkthroughT);
      const look = this.walkLookCurve.getPointAt(this.walkthroughT);
      this.camera.position.copy(pos);
      if (this.controls) {
        this.controls.target.copy(look);
      } else {
        this.camera.lookAt(look);
      }
      return;
    }

    if (this.camFlight) {
      this.camFlight.t += dt / this.camFlight.duration;
      const raw = Math.min(1.0, this.camFlight.t);
      const ease = raw < 0.5 ? 4 * raw * raw * raw : 1 - Math.pow(-2 * raw + 2, 3) / 2;
      this.camera.position.lerpVectors(this.camFlight.startPos, this.camFlight.endPos, ease);
      if (this.controls) {
        this.controls.target.lerpVectors(this.camFlight.startTarget, this.camFlight.endTarget, ease);
      }
      if (raw >= 1.0) this.camFlight = null;
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    const now = performance.now();
    const dt = Math.min(0.1, Math.max(0.004, (now - this.lastFrameTime) / 1000));
    this.lastFrameTime = now;
    this.time += dt;

    if (this.autoRotate && this.cityGroup && !this.walkthroughActive) {
      this.cityGroup.rotation.y += this.rotSpeed * (dt * 60);
    }
    this.updateCameraFlight(dt);
    if (this.controls) this.controls.update();
    this.updateSnow();
    this.updateVillagers();
    this.updateSmoke();
    this.updateSantaSleigh();

    if (this.auroraUniforms) {
      this.auroraUniforms.uTime.value = this.time;
    }

    // Gentle warm light breathing
    if (this.mat.window) {
      this.mat.window.emissiveIntensity = 2.05 + 0.25 * Math.sin(this.time * 2.0);
    }
    if (this.mat.portal) {
      this.mat.portal.emissiveIntensity = 2.65 + 0.35 * Math.sin(this.time * 1.7);
    }

    // Fairy lights twinkle
    for (let i = 0; i < this.twinkleBulbs.length; i++) {
      const tb = this.twinkleBulbs[i];
      tb.mesh.material.emissiveIntensity = 1.6 + 1.2 * Math.sin(this.time * 3.8 + tb.phase);
    }

    // Subtle glow sprite pulse
    for (let i = 0; i < this.glowSprites.length; i++) {
      const gs = this.glowSprites[i];
      const s = gs.baseScale * (1.0 + 0.05 * Math.sin(this.time * 2.2 + gs.phase));
      gs.sprite.scale.set(s, s, 1);
    }

    this.renderer.render(this.scene, this.camera);
  }
}

window.ChristmasCity3D = ChristmasCity3D;
