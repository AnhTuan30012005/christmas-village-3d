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

  // 12. Luminous Frozen Ice Lake Texture (Glacial teal-blue with delicate skate arcs & frosty rim)
  static createIceLake() {
    const c = this.makeCanvas(512, 512);
    const ctx = c.getContext("2d");

    const g = ctx.createRadialGradient(256, 256, 20, 256, 256, 250);
    g.addColorStop(0.00, "#7dd3fc");
    g.addColorStop(0.45, "#3898d4");
    g.addColorStop(0.78, "#1e5b94");
    g.addColorStop(0.93, "#b8daf5");
    g.addColorStop(1.00, "#e6f2ff");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 512, 512);

    // Subtle crisp ice skate carve arcs & frost sparkles
    ctx.strokeStyle = "rgba(255, 255, 255, 0.22)";
    ctx.lineWidth = 2;
    for (let i = 0; i < 26; i++) {
      const rx = 60 + Math.random() * 140;
      const ry = 60 + Math.random() * 140;
      const a0 = Math.random() * TAU;
      ctx.beginPath();
      ctx.arc(256 + (Math.random() - 0.5) * 60, 256 + (Math.random() - 0.5) * 60, (rx + ry) * 0.45, a0, a0 + 0.9 + Math.random() * 1.1);
      ctx.stroke();
    }

    // Warm reflection glints near the shoreline
    ctx.fillStyle = "rgba(255, 224, 150, 0.14)";
    for (let i = 0; i < 45; i++) {
      const a = Math.random() * TAU;
      const r = 130 + Math.random() * 90;
      ctx.beginPath();
      ctx.arc(256 + Math.cos(a) * r, 256 + Math.sin(a) * r, 4 + Math.random() * 8, 0, TAU);
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(c);
    return tex;
  }

  // 13. Warm Honey-Amber Ground Light Pool Texture (Zero-PointLight warm snow bounce!)
  static createGroundGlow() {
    const c = this.makeCanvas(128, 128);
    const ctx = c.getContext("2d");
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0.00, "rgba(255, 210, 110, 0.85)");
    g.addColorStop(0.32, "rgba(255, 162, 48, 0.45)");
    g.addColorStop(0.68, "rgba(235, 110, 20, 0.14)");
    g.addColorStop(1.00, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
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
    this.ferrisWheel = null;
    this.ferrisCabins = [];
    this.campfires = [];
    this.trainAngle = 0.85;
    this.trainCars = [];
    this.trainSmoke = [];
    this.workshopGear = null;
    this.camFlight = null;
    this.walkthroughActive = false;
    this.walkthroughT = 0;

    this.unitBox = new THREE.BoxGeometry(1, 1, 1);
    this.bulbGeo = new THREE.SphereGeometry(0.072, 6, 6);
    this.groundGlowGeo = new THREE.PlaneGeometry(1, 1);

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
    this.scene.background = new THREE.Color(0x030612);
    this.scene.fog = new THREE.FogExp2(0x030612, 0.0040);

    // Grand Multi-Village Valley Panorama: Frames ALL 5 Villages (West Ice Lake -> Center -> East Ferris Wheel -> North Workshop -> Archway)
    this.camera = new THREE.PerspectiveCamera(46, this.width / this.height, 0.1, 580);
    this.camera.position.set(6.0, 36.0, 106.0);

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
    this.renderer.toneMappingExposure = 1.18;

    this.container.appendChild(this.renderer.domElement);
  }

  initLights() {
    // Warm-balanced winter twilight ambient (deep blue shadow + cozy warm bounce from glowing villages)
    const ambient = new THREE.AmbientLight(0x1b2944, 0.42);
    this.scene.add(ambient);

    // Cool moonlight casting crisp winter shadows across the entire 5-village valley
    const moon = new THREE.DirectionalLight(0x88b0e2, 0.72);
    moon.position.set(-34, 52, 38);
    moon.castShadow = true;
    moon.shadow.mapSize.width = 2048;
    moon.shadow.mapSize.height = 2048;
    moon.shadow.camera.near = 1;
    moon.shadow.camera.far = 200;
    const d = 76;
    moon.shadow.camera.left = -d;
    moon.shadow.camera.right = d;
    moon.shadow.camera.top = d;
    moon.shadow.camera.bottom = -d;
    moon.shadow.bias = -0.0005;
    this.scene.add(moon);

    // Warm golden valley ground bounce contrasting crisp arctic sky!
    const hemi = new THREE.HemisphereLight(0x365080, 0x3b2412, 0.46);
    this.scene.add(hemi);
  }

  initMaterials() {
    const cobbleTex = TextureForge.createCobblestone();
    const stoneTex = TextureForge.createStoneMasonry();
    const timberTex = TextureForge.createTimberWall();
    const winTex = TextureForge.createGlowingWindow();
    const roseTex = TextureForge.createRoseWindow();
    const clockTex = TextureForge.createClockFace();
    const portalTex = TextureForge.createGothicPortal();

    this.texGlowGold = TextureForge.createGlow("rgba(255,235,120,0.95)", "rgba(255,180,40,0.42)");
    this.texGlowWarm = TextureForge.createGlow("rgba(255,198,85,0.92)", "rgba(255,138,24,0.36)");
    this.texGlowMoon = TextureForge.createGlow("rgba(180,210,255,0.45)", "rgba(110,150,210,0.14)");
    this.texGroundGlow = TextureForge.createGroundGlow();
    this.texIceLake = TextureForge.createIceLake();
    this.texSnowflake = TextureForge.createSnowflake();

    // Shared animated twinkle bulb materials (6 shared materials = massive GPU speedup!)
    const bulbHex = [0xffcf54, 0xff9f2e, 0xff364c, 0x2ce068, 0xffe484, 0xff5a36];
    this.bulbMats = bulbHex.map(hex => new THREE.MeshStandardMaterial({
      color: hex,
      emissive: hex,
      emissiveIntensity: 2.8,
      roughness: 0.18
    }));

    this.groundGlowMat = new THREE.MeshBasicMaterial({
      map: this.texGroundGlow,
      transparent: true,
      opacity: 0.50,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.mat = {
      cobble: new THREE.MeshStandardMaterial({ map: cobbleTex, roughness: 0.88, metalness: 0.08 }),
      snow: new THREE.MeshStandardMaterial({ color: 0xeaf2ff, roughness: 0.82, metalness: 0.02 }),
      snowShadow: new THREE.MeshStandardMaterial({ color: 0xb8cce6, roughness: 0.88 }),
      stone: new THREE.MeshStandardMaterial({ map: stoneTex, roughness: 0.90, metalness: 0.08 }),
      stoneDark: new THREE.MeshStandardMaterial({ map: stoneTex, color: 0x7c8494, roughness: 0.92 }),
      stoneLight: new THREE.MeshStandardMaterial({ map: stoneTex, color: 0xc8d0dc, roughness: 0.84 }),
      timber: new THREE.MeshStandardMaterial({ map: timberTex, roughness: 0.86 }),
      woodDark: new THREE.MeshStandardMaterial({ color: 0x2b1a0e, roughness: 0.90 }),
      woodMed: new THREE.MeshStandardMaterial({ color: 0x5c3922, roughness: 0.84 }),
      roofDark: new THREE.MeshStandardMaterial({ color: 0x222633, roughness: 0.88 }),
      pineDark: new THREE.MeshStandardMaterial({ color: 0x0e3b18, roughness: 0.88 }),
      pineMid: new THREE.MeshStandardMaterial({ color: 0x195e28, roughness: 0.82 }),
      pineBright: new THREE.MeshStandardMaterial({ color: 0x257a36, roughness: 0.78 }),
      window: new THREE.MeshStandardMaterial({
        map: winTex,
        emissiveMap: winTex,
        emissive: new THREE.Color(0xffb636),
        emissiveIntensity: 2.45,
        roughness: 0.22
      }),
      rose: new THREE.MeshStandardMaterial({
        map: roseTex,
        emissiveMap: roseTex,
        emissive: new THREE.Color(0xffaa1a),
        emissiveIntensity: 2.5,
        transparent: true,
        roughness: 0.2
      }),
      clock: new THREE.MeshStandardMaterial({
        map: clockTex,
        emissiveMap: clockTex,
        emissive: new THREE.Color(0xffc933),
        emissiveIntensity: 2.3,
        roughness: 0.2
      }),
      portal: new THREE.MeshStandardMaterial({
        map: portalTex,
        emissiveMap: portalTex,
        emissive: new THREE.Color(0xffa41c),
        emissiveIntensity: 2.9,
        transparent: true,
        roughness: 0.15
      }),
      gold: new THREE.MeshStandardMaterial({
        color: 0xffd700,
        emissive: 0xffaa00,
        emissiveIntensity: 2.2,
        roughness: 0.25,
        metalness: 0.8
      }),
      red: new THREE.MeshStandardMaterial({ color: 0xd11f34, roughness: 0.52 }),
      white: new THREE.MeshStandardMaterial({ color: 0xf4f7fc, roughness: 0.65 }),
      blue: new THREE.MeshStandardMaterial({ color: 0x2060d8, roughness: 0.5 }),
      teal: new THREE.MeshStandardMaterial({ color: 0x0ea5a4, roughness: 0.45 }),
      iron: new THREE.MeshStandardMaterial({ color: 0x1b202b, roughness: 0.55, metalness: 0.65 }),
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

  // Warm honey-amber glow pool cast onto snow/cobblestone (makes the whole valley feel cozy & bright at zero shader cost!)
  addGroundGlow(x, z, size = 6.5, parent = this.cityGroup, y = 0.05) {
    const m = new THREE.Mesh(this.groundGlowGeo, this.groundGlowMat);
    m.rotation.x = -Math.PI / 2;
    m.position.set(x, y, z);
    m.scale.set(size, size, 1);
    parent.add(m);
    return m;
  }

  // Draped Overhead Warm Fairy Light String Garland between two 3D points
  addStringGarland(x1, y1, z1, x2, y2, z2, sag = 0.65, count = 11, warmOnly = false) {
    for (let i = 1; i < count; i++) {
      const u = i / count;
      const x = x1 + (x2 - x1) * u;
      const z = z1 + (z2 - z1) * u;
      const y = y1 + (y2 - y1) * u - sag * Math.sin(u * Math.PI);
      const matIdx = warmOnly ? (i % 2 === 0 ? 0 : (i % 3 === 0 ? 4 : 1)) : (i % this.bulbMats.length);
      const bulb = new THREE.Mesh(this.bulbGeo, this.bulbMats[matIdx]);
      bulb.position.set(x, y, z);
      this.cityGroup.add(bulb);
    }
  }

  // Reusable Red/White Striped Market Stall Builder
  placeMarketStall(x, z, rot) {
    const sGrp = new THREE.Group();
    sGrp.position.set(x, 0, z);
    sGrp.rotation.y = rot;
    this.cityGroup.add(sGrp);

    const sw = 1.9, sd = 1.38, sh = 1.08;
    this.addBox(-sw / 2, 0, -sd / 2, sw, sh, sd, this.mat.woodMed, sGrp);
    this.addBox(-sw / 2 + 0.14, 0.50, sd / 2 + 0.02, sw - 0.28, 0.46, 0.08, this.mat.window, sGrp);
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
    this.addGlow(0, sh + 0.42, 0.32, 2.5, sGrp, this.texGlowWarm, 0.58);
    this.addGroundGlow(0, 0.9, 4.8, sGrp);
  }

  // Reusable Victorian Streetlamp Builder
  placeStreetLamp(x, z, addLight = false) {
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    this.cityGroup.add(g);

    this.addBox(-0.07, 0, -0.07, 0.14, 2.0, 0.14, this.mat.woodDark, g);
    this.addBox(-0.22, 1.92, -0.05, 0.44, 0.07, 0.10, this.mat.woodDark, g);
    this.addBox(-0.19, 1.99, -0.19, 0.38, 0.46, 0.38, this.mat.window, g);
    this.addBox(-0.24, 2.45, -0.24, 0.48, 0.10, 0.48, this.mat.snow, g);

    if (addLight) {
      const light = new THREE.PointLight(0xffa628, 2.7, 14.0, 1.4);
      light.position.set(0, 2.2, 0);
      g.add(light);
    }
    this.addGlow(0, 2.2, 0, 2.7, g, this.texGlowWarm, 0.62);
    this.addGroundGlow(0, 0, 5.2, g);
  }

  // Reusable Crackling Campfire / Bonfire Builder with Flickering Flames & Rising Embers
  placeCampfire(x, z, addLight = true) {
    const grp = new THREE.Group();
    grp.position.set(x, 0, z);
    this.cityGroup.add(grp);

    // Circular stone fire ring
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * TAU;
      this.addBox(Math.cos(a) * 0.85 - 0.18, 0, Math.sin(a) * 0.85 - 0.18, 0.36, 0.28, 0.36, this.mat.stoneDark, grp);
    }
    // Crossed wooden logs
    for (let i = 0; i < 4; i++) {
      const log = new THREE.Mesh(this.unitBox, this.mat.woodDark);
      log.position.set(0, 0.22, 0);
      log.scale.set(1.15, 0.16, 0.18);
      log.rotation.y = (i / 4) * Math.PI;
      log.rotation.z = 0.24;
      grp.add(log);
    }

    // Layered voxel flickering flames
    const flameColors = [0xff4500, 0xff8c1a, 0xffe066];
    const flames = flameColors.map((col, idx) => {
      const fm = new THREE.Mesh(
        this.unitBox,
        new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 3.4, roughness: 0.1 })
      );
      const s = 0.54 - idx * 0.13;
      fm.scale.set(s, 0.72 + idx * 0.18, s);
      fm.position.set(0, 0.42 + idx * 0.12, 0);
      fm.rotation.y = idx * 0.55;
      grp.add(fm);
      return fm;
    });

    // Rising glowing ember sparks
    const embers = [];
    const emberMat = this.bulbMats[1];
    for (let i = 0; i < 7; i++) {
      const em = new THREE.Mesh(this.bulbGeo, emberMat);
      em.scale.setScalar(0.65);
      grp.add(em);
      embers.push({ mesh: em, phase: i / 7, seed: Math.random() * TAU });
    }

    if (addLight) {
      const fireLight = new THREE.PointLight(0xff7e1a, 3.6, 15.0, 1.35);
      fireLight.position.set(0, 1.3, 0);
      grp.add(fireLight);
      this.campfires.push({ flames, embers, light: fireLight, phase: Math.random() * TAU });
    } else {
      this.campfires.push({ flames, embers, light: null, phase: Math.random() * TAU });
    }

    this.addGlow(0, 0.9, 0, 4.4, grp, this.texGlowWarm, 0.75);
    this.addGroundGlow(0, 0, 10.5, grp);
  }

  // ==========================================================================
  // MASTER VALLEY BUILDER — CENTRAL DOUBLE-RING TOWN + 3 SATELLITE VILLAGES + POLAR EXPRESS
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
    this.buildWarmFairyCanopies();
    this.buildSnowyPines();
    this.buildEntranceBoulevardAndArchway();
    this.buildPolarExpress();
    this.buildWestIceLakeVillage();
    this.buildEastFairgroundVillage();
    this.buildNorthWorkshopVillage();
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

    // Seamless Radial-Fade Winter Snow Valley Floor (r = 280, dissolves invisibly into midnight horizon)
    const valleyTex = TextureForge.createSnowValleyGround();
    const valleyMat = new THREE.MeshStandardMaterial({
      map: valleyTex,
      roughness: 0.92,
      metalness: 0.02
    });
    const outerSnow = new THREE.Mesh(
      new THREE.CircleGeometry(280, 72),
      valleyMat
    );
    outerSnow.rotation.x = -Math.PI / 2;
    outerSnow.position.y = -0.02;
    outerSnow.receiveShadow = true;
    this.cityGroup.add(outerSnow);

    // Subtle decorative snowy garden rings between Ring 1 and Ring 2
    const midSnowRing = new THREE.Mesh(
      new THREE.RingGeometry(25.2, 29.8, 64),
      new THREE.MeshStandardMaterial({ color: 0xcedcf0, roughness: 0.92 })
    );
    midSnowRing.rotation.x = -Math.PI / 2;
    midSnowRing.position.y = 0.015;
    midSnowRing.receiveShadow = true;
    this.cityGroup.add(midSnowRing);

    // 4 Cardinal Cobblestone Avenues extending out to link all 3 Satellite Villages & South Archway
    const crossRoadMat = this.mat.cobble;
    const nsRoad = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.06, 94.0), crossRoadMat);
    nsRoad.position.set(0, 0.01, -9.0);
    nsRoad.receiveShadow = true;
    this.cityGroup.add(nsRoad);

    const ewRoad = new THREE.Mesh(new THREE.BoxGeometry(92.0, 0.06, 5.2), crossRoadMat);
    ewRoad.position.set(2.0, 0.01, 0);
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
      { x: 0.98, z: 1.62, s: 0.70, box: this.mat.red, rib: this.mat.gold },
      { x: 0.48, z: 1.82, s: 0.46, box: this.mat.red, rib: this.mat.gold }
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
    this.addBox(w / 2 - 0.02, 0.75, -0.35, 0.06, 0.82, 0.70, this.mat.window, grp);

    // Stepped Puffy Snow Roof (voxel blocks along sloped eaves)
    const rLevels = 9;
    for (let r = 0; r < rLevels; r++) {
      const ry = h + (r / rLevels) * rh;
      const span = (w + 0.56) * (1 - r / rLevels);
      this.addBox(-span / 2, ry, -d / 2 - 0.26, span, rh / rLevels + 0.05, d + 0.52, r > 1 ? this.mat.snow : this.mat.roofDark, grp);
    }

    // Festive Warm Gold/Red/Emerald Fairy String Lights draped along the roofline (shared materials!)
    if (cfg.lights !== false) {
      const count = Math.max(6, Math.floor(w * 2.5));
      for (let i = 0; i <= count; i++) {
        const u = i / count;
        const bx = -w / 2 - 0.24 + u * (w + 0.48);
        const bulb = new THREE.Mesh(this.bulbGeo, this.bulbMats[i % this.bulbMats.length]);
        bulb.position.set(bx, h - 0.02, d / 2 + 0.30);
        grp.add(bulb);
      }
    }

    // Warm honey-amber glow spilling onto snow outside cottage windows
    this.addGroundGlow(0, d / 2 + 1.35, Math.max(5.2, w * 1.6), grp);

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
      { deg: -48, r: 22.8, w: 3.6, d: 2.9, h: 3.1, rh: 1.9, stone: false, smoke: true },
      { deg: -62, r: 22.6, w: 3.5, d: 2.8, h: 2.9, rh: 1.8, stone: true, smoke: false },
      { deg: -76, r: 22.6, w: 3.6, d: 2.8, h: 3.2, rh: 1.9, stone: false, smoke: true },
      // Back-Left Arc (skipping North avenue at -90°)
      { deg: -104, r: 22.6, w: 3.5, d: 2.8, h: 3.0, rh: 1.8, stone: true, smoke: false },
      { deg: -118, r: 22.6, w: 3.6, d: 2.8, h: 2.9, rh: 1.8, stone: false, smoke: true },
      { deg: -133, r: 22.8, w: 3.4, d: 2.7, h: 3.1, rh: 1.9, stone: true, smoke: false },
      // Left-Side & South-West Arc (skipping West avenue at 180°)
      { deg: -168, r: 22.8, w: 3.5, d: 2.8, h: 3.0, rh: 1.8, stone: false, smoke: true },
      { deg: 166, r: 22.8, w: 3.6, d: 2.9, h: 3.2, rh: 1.9, stone: true, smoke: false },
      { deg: 150, r: 22.8, w: 3.5, d: 2.8, h: 3.0, rh: 1.8, stone: false, smoke: true },
      { deg: 134, r: 22.8, w: 3.4, d: 2.7, h: 2.9, rh: 1.7, stone: true, smoke: false },
      { deg: 118, r: 22.6, w: 3.2, d: 2.6, h: 2.6, rh: 1.6, stone: false, smoke: false },
      // Right-Side & South-East Arc (skipping East avenue at 0°)
      { deg: 14, r: 22.8, w: 3.6, d: 2.9, h: 3.1, rh: 1.9, stone: true, smoke: true },
      { deg: 30, r: 22.8, w: 3.5, d: 2.8, h: 2.9, rh: 1.8, stone: false, smoke: false },
      { deg: 46, r: 22.8, w: 3.4, d: 2.7, h: 2.8, rh: 1.7, stone: true, smoke: false },
      { deg: 62, r: 22.6, w: 3.2, d: 2.6, h: 2.6, rh: 1.6, stone: false, smoke: true }
    ];

    // RING 2: Outer Residential District (R = 33.4, 24 houses creating a true sprawling 2x Christmas Town!)
    const ring2Count = 30;
    const ring2 = [];
    for (let i = 0; i < ring2Count; i++) {
      const deg = -180 + (i / ring2Count) * 360 + 6;
      // Keep 4 cardinal avenues open (0°, -90°, ±180°, +90° South Boulevard)
      const nearSouth = deg > 76 && deg < 104;
      const nearNorth = deg > -98 && deg < -82;
      const nearEast = deg > -8 && deg < 8;
      const nearWest = deg > 172 || deg < -172;
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
      { deg: 46, r: 16.5 },
      { deg: 30, r: 16.5 },
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

  // 7. Victorian Wrought-Iron Streetlamps (Inner Ring R=13.0 + Outer Ring R=27.6, warm snow glow pools)
  buildStreetLamps() {
    const placeLampRing = (count, radius, lightEvery) => {
      for (let i = 0; i < count; i++) {
        const a = (i / count) * TAU + 0.19;
        this.placeStreetLamp(Math.cos(a) * radius, Math.sin(a) * radius, i % lightEvery === 0);
      }
    };
    placeLampRing(16, 13.0, 4); // 4 PointLights + 16 glowing lanterns + warm ground pools
    placeLampRing(16, 27.6, 8); // 2 PointLights + 16 glowing lanterns + warm ground pools
  }

  // 7B. Warm Golden Fairy Light Canopies across Central Plaza & All 4 Cardinal Avenues!
  buildWarmFairyCanopies() {
    // Radial warm golden light ribbons radiating from the Grand Christmas Tree crown out to the 16 Inner Streetlamps!
    for (let i = 0; i < 16; i += 2) {
      const a = (i / 16) * TAU + 0.19;
      this.addStringGarland(
        Math.cos(a) * 2.2, 8.2, Math.sin(a) * 2.2,
        Math.cos(a) * 13.0, 2.45, Math.sin(a) * 13.0,
        1.15, 13, true
      );
    }

    // Perimeter warm fairy string garlands connecting Ring 1 inner lamps
    for (let i = 0; i < 16; i++) {
      const a1 = (i / 16) * TAU + 0.19;
      const a2 = ((i + 1) / 16) * TAU + 0.19;
      this.addStringGarland(
        Math.cos(a1) * 13.0, 2.45, Math.sin(a1) * 13.0,
        Math.cos(a2) * 13.0, 2.45, Math.sin(a2) * 13.0,
        0.42, 8, true
      );
    }

    // East Avenue lamps & warm overhead fairy light arches (connecting Central Plaza -> East Fairground)
    [18, 25, 32, 43.5].forEach(ex => {
      this.placeStreetLamp(ex, -3.4, false);
      this.placeStreetLamp(ex, 3.4, false);
      this.addStringGarland(ex, 2.9, -3.4, ex, 2.9, 3.4, 0.50, 9, true);
    });

    // West Avenue lamps & warm overhead fairy light arches (connecting Central Plaza -> West Ice Lake)
    [-18, -25, -32, -42.5].forEach(wx => {
      this.placeStreetLamp(wx, -3.4, false);
      this.placeStreetLamp(wx, 3.4, false);
      this.addStringGarland(wx, 2.9, -3.4, wx, 2.9, 3.4, 0.50, 9, true);
    });

    // North Avenue lamps & warm overhead fairy light arches (connecting Central Plaza -> Santa Workshop)
    [-18, -25, -32].forEach(nz => {
      this.placeStreetLamp(-3.4, nz, false);
      this.placeStreetLamp(3.4, nz, false);
      this.addStringGarland(-3.4, 2.9, nz, 3.4, 2.9, nz, 0.50, 9, true);
    });
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

  // 8A-0. Extended Grand Festive Boulevard (z = 11.4 -> 63.0) + Tall Welcome Archway at z = 47.0 (Clear of Polar Express Track R=39.2!)
  buildEntranceBoulevardAndArchway() {
    // 1. Cobblestone Avenue extending past Polar Express Track (z = 39.2) and Welcome Archway (z = 47.0) to z = 63.5
    const roadTex = TextureForge.createCobblestone();
    roadTex.repeat.set(2.6, 18);
    const roadMat = new THREE.MeshStandardMaterial({ map: roadTex, roughness: 0.88, metalness: 0.08 });
    const road = new THREE.Mesh(new THREE.BoxGeometry(6.6, 0.14, 53.0), roadMat);
    road.position.set(0, 0.01, 37.5);
    road.receiveShadow = true;
    this.cityGroup.add(road);

    // Snow-topped low stone curbs flanking both sides of the extended avenue (split cleanly around track at z = 39.2)
    [-3.55, 3.25].forEach(cx => {
      this.addBox(cx, 0.02, 20.0, 0.30, 0.24, 17.5, this.mat.stoneDark);
      this.addBox(cx - 0.03, 0.26, 20.0, 0.36, 0.10, 17.5, this.mat.snow);
      this.addBox(cx, 0.02, 41.2, 0.30, 0.24, 22.8, this.mat.stoneDark);
      this.addBox(cx - 0.03, 0.26, 41.2, 0.36, 0.10, 22.8, this.mat.snow);
    });

    // Victorian Streetlamps & Overhead Warm Fairy Light Garlands along the Grand Boulevard
    const lampZs = [20.5, 26.5, 32.5, 42.2, 52.5, 59.5];
    lampZs.forEach((lz, idx) => {
      this.placeStreetLamp(-3.8, lz, false);
      this.placeStreetLamp(3.8, lz, false);
      if (idx === 1 || idx === 4) {
        const light = new THREE.PointLight(0xffa828, 2.8, 16.0, 1.4);
        light.position.set(0, 3.2, lz);
        this.cityGroup.add(light);
      }
      this.addStringGarland(-3.8, 3.05, lz, 3.8, 3.05, lz, 0.48, 12, false);
    });

    // 2. TALL GRAND WELCOME ARCHWAY ("★ CHÚC MỪNG GIÁNG SINH ★") Outside Polar Express Track at z = 47.0
    const archGrp = new THREE.Group();
    archGrp.position.set(0, 0, 47.0);
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
      this.addGlow(px, pillarH + 1.68, 0, 2.5, archGrp, this.texGlowGold, 0.68);

      const inDir = px < 0 ? 1 : -1;
      this.addBox(px + inDir * 0.48 - 0.22, 4.6, -0.06, 0.44, 0.10, 0.12, this.mat.woodDark, archGrp);
      this.addBox(px + inDir * 0.78 - 0.17, 4.10, -0.17, 0.34, 0.46, 0.34, this.mat.window, archGrp);
      this.addGlow(px + inDir * 0.78, 4.33, 0, 2.2, archGrp, this.texGlowWarm, 0.58);
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
      const b = new THREE.Mesh(this.bulbGeo, this.bulbMats[i % this.bulbMats.length]);
      b.position.set(gx, 5.30, 0.52);
      archGrp.add(b);
    }
    [-2.8, 0, 2.8].forEach(bx => {
      this.addBox(bx - 0.20, 5.22, 0.46, 0.40, 0.30, 0.16, this.mat.red, archGrp);
    });

    const archStar = new THREE.Mesh(new THREE.OctahedronGeometry(0.48, 0), this.mat.gold);
    archStar.position.set(0, 8.95, 0);
    archGrp.add(archStar);
    this.addGlow(0, 8.95, 0, 3.8, archGrp, this.texGlowGold, 0.78);

    const signTex = TextureForge.createWelcomeSign("CHÚC MỪNG GIÁNG SINH");
    this.archwaySignMat = new THREE.MeshStandardMaterial({
      map: signTex,
      emissiveMap: signTex,
      emissive: new THREE.Color(0xffe082),
      emissiveIntensity: 1.8,
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

    const archLight = new THREE.PointLight(0xffbe42, 4.6, 19, 1.4);
    archLight.position.set(0, 4.8, 1.6);
    archGrp.add(archLight);
    this.addGroundGlow(0, 0, 12.5, archGrp);

    // 3. COZY SOUTH GATEWAY DISTRICT HOUSES & STALLS (positioned cleanly outside R = 41.5 track clearance!)
    const boulevardHouses = [
      // Left side (facing East)
      { x: -7.8, z: 43.8, rot: Math.PI / 2 - 0.06, w: 3.5, d: 2.8, h: 3.0, rh: 1.8, stone: false, smoke: true },
      { x: -8.0, z: 49.4, rot: Math.PI / 2 + 0.05, w: 3.6, d: 2.8, h: 3.1, rh: 1.8, stone: true, smoke: false },
      { x: -7.6, z: 55.0, rot: Math.PI / 2 - 0.06, w: 3.5, d: 2.8, h: 2.9, rh: 1.7, stone: false, smoke: true },
      { x: -7.8, z: 60.2, rot: Math.PI / 2 + 0.12, w: 3.3, d: 2.6, h: 2.8, rh: 1.6, stone: true, smoke: false },
      // Right side (facing West)
      { x: 7.8, z: 43.8, rot: -Math.PI / 2 + 0.06, w: 3.5, d: 2.8, h: 3.0, rh: 1.8, stone: true, smoke: false },
      { x: 8.0, z: 49.4, rot: -Math.PI / 2 - 0.05, w: 3.6, d: 2.8, h: 3.1, rh: 1.8, stone: false, smoke: true },
      { x: 7.6, z: 55.0, rot: -Math.PI / 2 + 0.06, w: 3.4, d: 2.7, h: 2.9, rh: 1.7, stone: true, smoke: false },
      { x: 7.8, z: 60.2, rot: -Math.PI / 2 - 0.12, w: 3.3, d: 2.6, h: 2.8, rh: 1.6, stone: false, smoke: false }
    ];
    boulevardHouses.forEach(cfg => this.createCottage({ ...cfg, lights: true }));

    // Roadside stalls along the festive gateway street
    [
      { x: -5.1, z: 43.5, rot: Math.PI / 2 },
      { x: 5.1, z: 50.8, rot: -Math.PI / 2 },
      { x: -5.1, z: 56.4, rot: Math.PI / 2 },
      { x: 5.1, z: 28.5, rot: -Math.PI / 2 }
    ].forEach(st => this.placeMarketStall(st.x, st.z, st.rot));

    // Snowy voxel pines framing the gateway cottages
    [
      { x: -11.8, z: 44.5, h: 2.9 },
      { x: -12.0, z: 51.0, h: 3.2 },
      { x: -11.5, z: 57.5, h: 2.8 },
      { x: 11.8, z: 44.5, h: 2.9 },
      { x: 12.0, z: 51.0, h: 3.0 },
      { x: 11.5, z: 57.5, h: 2.7 }
    ].forEach(p => this.placeSnowyPine(p.x, 0, p.z, p.h, 5));
  }

  // 8A-1. POLAR EXPRESS STEAM TRAIN & CIRCULAR RAILWAY TRACK (R = 39.2 linking all 5 villages!)
  buildPolarExpress() {
    this.trainRadius = 39.2;
    const R = this.trainRadius;

    // 1. Twin metallic steel rails circling the entire Central Town
    const railMat = new THREE.MeshStandardMaterial({ color: 0x8ea0b8, roughness: 0.35, metalness: 0.85 });
    [R - 0.42, R + 0.42].forEach(rad => {
      const rail = new THREE.Mesh(new THREE.TorusGeometry(rad, 0.06, 6, 128), railMat);
      rail.rotation.x = Math.PI / 2;
      rail.position.y = 0.09;
      this.cityGroup.add(rail);
    });

    // 2. InstancedMesh dark oak railway sleepers (160 ties in ONE single draw call!)
    const tieCount = 160;
    const tieInst = new THREE.InstancedMesh(this.unitBox, this.mat.woodDark, tieCount);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < tieCount; i++) {
      const a = (i / tieCount) * TAU;
      dummy.position.set(Math.cos(a) * R, 0.04, Math.sin(a) * R);
      dummy.rotation.set(0, -a, 0);
      dummy.scale.set(1.45, 0.08, 0.24);
      dummy.updateMatrix();
      tieInst.setMatrixAt(i, dummy.matrix);
    }
    tieInst.receiveShadow = true;
    this.cityGroup.add(tieInst);

    // 3. Festive Level Crossing Posts with Warm Amber Beacons at all 4 Cardinal Avenues
    const crossings = [
      { x: -3.9, z: R }, { x: 3.9, z: R },     // South Boulevard
      { x: -3.9, z: -R }, { x: 3.9, z: -R },   // North Avenue
      { x: R, z: -3.6 }, { x: R, z: 3.6 },     // East Avenue
      { x: -R, z: -3.6 }, { x: -R, z: 3.6 }    // West Avenue
    ];
    crossings.forEach(c => {
      const g = new THREE.Group();
      g.position.set(c.x, 0, c.z);
      this.cityGroup.add(g);
      this.addBox(-0.10, 0, -0.10, 0.20, 1.2, 0.20, this.mat.red, g);
      this.addBox(-0.10, 1.2, -0.10, 0.20, 1.1, 0.20, this.mat.white, g);
      this.addBox(-0.18, 2.3, -0.18, 0.36, 0.36, 0.36, this.mat.gold, g);
      this.addGlow(0, 2.48, 0, 1.9, g, this.texGlowGold, 0.65);
    });

    // 4. Steam Locomotive + 3 Warm Illuminated Passenger Carriages
    const locoMatRed = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.45, metalness: 0.2 });
    const locoMatBlack = new THREE.MeshStandardMaterial({ color: 0x161a24, roughness: 0.5, metalness: 0.45 });
    const brassMat = this.mat.gold;

    // Locomotive (index 0, offset = 0)
    const loco = new THREE.Group();
    this.cityGroup.add(loco);
    // Chassis & Cowcatcher
    this.addBox(-0.66, 0.22, -1.75, 1.32, 0.32, 3.55, locoMatBlack, loco);
    this.addBox(-0.56, 0.16, 1.75, 1.12, 0.34, 0.45, brassMat, loco);
    // Boiler barrel + brass bands
    this.addBox(-0.52, 0.54, -0.35, 1.04, 0.96, 2.05, locoMatBlack, loco);
    this.addBox(-0.55, 0.52, 0.25, 1.10, 1.00, 0.14, brassMat, loco);
    this.addBox(-0.55, 0.52, 1.15, 1.10, 1.00, 0.14, brassMat, loco);
    // Smokestack & Steam Dome
    this.addBox(-0.20, 1.48, 1.10, 0.40, 0.68, 0.40, locoMatBlack, loco);
    this.addBox(-0.26, 2.12, 1.04, 0.52, 0.16, 0.52, brassMat, loco);
    // Engineer Cab (Crimson Red with Glowing Warm Windows & Snow Roof)
    this.addBox(-0.68, 0.54, -1.72, 1.36, 1.42, 1.40, locoMatRed, loco);
    this.addBox(-0.71, 1.10, -1.48, 0.06, 0.54, 0.86, this.mat.window, loco);
    this.addBox(0.65, 1.10, -1.48, 0.06, 0.54, 0.86, this.mat.window, loco);
    this.addBox(-0.78, 1.96, -1.84, 1.56, 0.18, 1.62, this.mat.snow, loco);
    // Radiant Golden Headlamp + Forward Light Beam Glow
    this.addBox(-0.22, 0.92, 1.68, 0.44, 0.44, 0.14, this.mat.window, loco);
    this.addGlow(0, 1.12, 2.05, 3.6, loco, this.texGlowGold, 0.85);
    this.addGroundGlow(0, 3.4, 7.2, loco, 0.12);
    // Red wheels
    [-1.2, -0.3, 0.6, 1.3].forEach(wz => {
      this.addBox(-0.72, 0.10, wz - 0.18, 0.10, 0.42, 0.42, locoMatRed, loco);
      this.addBox(0.62, 0.10, wz - 0.18, 0.10, 0.42, 0.42, locoMatRed, loco);
    });
    this.trainCars.push({ group: loco, angleOffset: 0 });

    // 3 Cozy Glowing Passenger Carriages
    const carColors = [locoMatRed, new THREE.MeshStandardMaterial({ color: 0x155e34, roughness: 0.5 }), locoMatRed];
    for (let c = 0; c < 3; c++) {
      const car = new THREE.Group();
      this.cityGroup.add(car);
      this.addBox(-0.64, 0.22, -1.55, 1.28, 0.28, 3.10, locoMatBlack, car);
      this.addBox(-0.62, 0.50, -1.48, 1.24, 1.24, 2.96, carColors[c], car);
      // Warm Golden Passenger Windows along both sides
      [-0.95, 0, 0.95].forEach(wz => {
        this.addBox(-0.65, 0.86, wz - 0.34, 0.06, 0.58, 0.68, this.mat.window, car);
        this.addBox(0.59, 0.86, wz - 0.34, 0.06, 0.58, 0.68, this.mat.window, car);
      });
      // Gold trim + Snow-dusted carriage roof
      this.addBox(-0.66, 1.66, -1.52, 1.32, 0.10, 3.04, brassMat, car);
      this.addBox(-0.70, 1.76, -1.56, 1.40, 0.20, 3.12, this.mat.snow, car);
      this.addGlow(0, 1.15, 0, 2.8, car, this.texGlowWarm, 0.45);
      this.addGroundGlow(0, 0, 5.2, car, 0.11);
      this.trainCars.push({ group: car, angleOffset: -(c + 1) * 0.105 });
    }

    // Dynamic Steam Puff Pool for Locomotive Chimney
    if (!this.smokeGeo) this.smokeGeo = new THREE.DodecahedronGeometry(0.24, 0);
    for (let i = 0; i < 12; i++) {
      const mat = new THREE.MeshStandardMaterial({
        color: 0xf4f8ff,
        emissive: 0x64748b,
        emissiveIntensity: 0.45,
        transparent: true,
        opacity: 0.0,
        depthWrite: false
      });
      const mesh = new THREE.Mesh(this.smokeGeo, mat);
      this.cityGroup.add(mesh);
      this.trainSmoke.push({ mesh, life: i / 12, ox: 0, oy: 2.3, oz: 0 });
    }
  }

  updatePolarExpress(dt) {
    if (!this.trainCars.length) return;
    const R = this.trainRadius;
    this.trainAngle = (this.trainAngle + dt * 0.105) % TAU;

    for (let i = 0; i < this.trainCars.length; i++) {
      const car = this.trainCars[i];
      const a = this.trainAngle + car.angleOffset;
      const x = Math.cos(a) * R;
      const z = Math.sin(a) * R;
      car.group.position.set(x, 0, z);
      // Face tangent direction along clockwise/CCW movement
      const dx = -Math.sin(a);
      const dz = Math.cos(a);
      car.group.rotation.y = Math.atan2(dx, dz);
    }

    // Emit rhythmic rising steam puffs from Locomotive smokestack
    const locoA = this.trainAngle + 0.028;
    const sx = Math.cos(locoA) * R;
    const sz = Math.sin(locoA) * R;
    for (let i = 0; i < this.trainSmoke.length; i++) {
      const p = this.trainSmoke[i];
      p.life += dt * 0.55;
      if (p.life >= 1.0) {
        p.life = 0;
        p.ox = sx;
        p.oy = 2.35;
        p.oz = sz;
      }
      const u = p.life;
      p.mesh.position.set(p.ox, p.oy + u * 3.8, p.oz);
      p.mesh.scale.setScalar(0.55 + u * 2.1);
      p.mesh.material.opacity = 0.65 * Math.min(1, u * 5.0) * Math.pow(1 - u, 1.3);
    }
  }

  // 8A-2. WEST SATELLITE VILLAGE — Làng Hồ Băng & Cầu Gỗ Đèn Lồng (center: x = -54, z = 0)
  buildWestIceLakeVillage() {
    const cx = -54.0, cz = 0.0;

    // 1. Shimmering Glacial Ice Lake Surface (Oval rx = 10.2, rz = 12.6)
    const iceMat = new THREE.MeshStandardMaterial({
      map: this.texIceLake,
      emissiveMap: this.texIceLake,
      emissive: new THREE.Color(0x2d8fd4),
      emissiveIntensity: 0.55,
      roughness: 0.14,
      metalness: 0.42
    });
    const lake = new THREE.Mesh(new THREE.CircleGeometry(10.8, 48), iceMat);
    lake.rotation.x = -Math.PI / 2;
    lake.scale.set(0.95, 1.18, 1);
    lake.position.set(cx, 0.04, cz);
    lake.receiveShadow = true;
    this.cityGroup.add(lake);

    // Snow-dusted stone/log shoreline ring framing the lake
    for (let i = 0; i < 34; i++) {
      const a = (i / 34) * TAU;
      if (Math.abs(Math.sin(a)) < 0.24 && Math.cos(a) > 0) continue; // keep East bridge entrance open
      const sx = cx + Math.cos(a) * 10.6;
      const sz = cz + Math.sin(a) * 12.8;
      this.addBox(sx - 0.55, 0, sz - 0.55, 1.1, 0.34, 1.1, i % 2 === 0 ? this.mat.snow : this.mat.stoneLight);
    }

    // 2. Arched Voxel Wooden Footbridge Spanning the Ice Lake (x = -43.0 -> -64.5) with Hanging Warm Lanterns!
    const bridgeSegs = 18;
    const xStart = cx + 11.2, xEnd = cx - 10.8;
    for (let i = 0; i <= bridgeSegs; i++) {
      const u = i / bridgeSegs;
      const bx = xStart + (xEnd - xStart) * u;
      const archY = Math.sin(u * Math.PI) * 1.65;
      // Wooden deck planks
      this.addBox(bx - 0.62, archY, cz - 1.45, 1.26, 0.22, 2.90, this.mat.woodMed);
      // Side railing posts + warm hanging lanterns every 3rd segment
      if (i % 2 === 0) {
        [-1.36, 1.24].forEach(rz => {
          this.addBox(bx - 0.08, archY + 0.22, cz + rz, 0.16, 0.85, 0.16, this.mat.woodDark);
          this.addBox(bx - 0.10, archY + 1.07, cz + rz - 0.02, 0.20, 0.08, 0.20, this.mat.snow);
        });
      }
      if (i === 4 || i === 9 || i === 14) {
        [-1.36, 1.36].forEach(rz => {
          this.addBox(bx - 0.12, archY + 1.12, cz + rz - 0.12, 0.24, 0.34, 0.24, this.mat.window);
          this.addGlow(bx, archY + 1.28, cz + rz, 2.4, this.cityGroup, this.texGlowWarm, 0.65);
        });
      }
    }
    // Warm overhead fairy light strings arching gracefully above the bridge
    this.addStringGarland(xStart, 2.4, cz - 1.35, (xStart + xEnd) / 2, 3.3, cz - 1.35, 0.35, 10, true);
    this.addStringGarland((xStart + xEnd) / 2, 3.3, cz - 1.35, xEnd, 2.4, cz - 1.35, 0.35, 10, true);
    this.addStringGarland(xStart, 2.4, cz + 1.35, (xStart + xEnd) / 2, 3.3, cz + 1.35, 0.35, 10, true);
    this.addStringGarland((xStart + xEnd) / 2, 3.3, cz + 1.35, xEnd, 2.4, cz + 1.35, 0.35, 10, true);

    // One warm PointLight floating over the bridge center to make the ice sparkle gold & turquoise
    const lakeLight = new THREE.PointLight(0xffb444, 3.8, 22.0, 1.35);
    lakeLight.position.set(cx, 4.2, cz);
    this.cityGroup.add(lakeLight);

    // 3. 8 Cozy Lakeside Cottages Ringing the Frozen Lake (Warm Winter Chalet Cluster!)
    const lakeHouses = [
      { deg: 42, rx: 14.5, rz: 16.5, w: 3.5, d: 2.8, h: 3.0, rh: 1.9, stone: false, smoke: true },
      { deg: 78, rx: 14.5, rz: 16.8, w: 3.6, d: 2.8, h: 3.1, rh: 1.8, stone: true, smoke: false },
      { deg: 118, rx: 14.8, rz: 16.5, w: 3.5, d: 2.7, h: 2.9, rh: 1.8, stone: false, smoke: true },
      { deg: 152, rx: 14.8, rz: 16.0, w: 3.4, d: 2.8, h: 3.0, rh: 1.8, stone: true, smoke: false },
      { deg: -152, rx: 14.8, rz: 16.0, w: 3.6, d: 2.8, h: 3.1, rh: 1.9, stone: false, smoke: true },
      { deg: -118, rx: 14.8, rz: 16.5, w: 3.4, d: 2.7, h: 2.9, rh: 1.7, stone: true, smoke: false },
      { deg: -78, rx: 14.5, rz: 16.8, w: 3.6, d: 2.8, h: 3.2, rh: 1.9, stone: false, smoke: true },
      { deg: -42, rx: 14.5, rz: 16.5, w: 3.4, d: 2.7, h: 2.8, rh: 1.7, stone: true, smoke: false }
    ];
    lakeHouses.forEach(s => {
      const a = s.deg * (Math.PI / 180);
      const hx = cx + Math.cos(a) * s.rx;
      const hz = cz + Math.sin(a) * s.rz;
      this.createCottage({
        x: hx, z: hz, rot: Math.atan2(cx - hx, cz - hz),
        w: s.w, d: s.d, h: s.h, rh: s.rh, stone: s.stone, smoke: s.smoke, lights: true
      });
    });

    // 4. Hot Cocoa & Skate Rental Stalls + Cozy Shoreline Campfire + Lamps
    this.placeMarketStall(cx + 11.4, cz - 5.2, -Math.PI / 2 - 0.35);
    this.placeMarketStall(cx + 11.4, cz + 5.2, -Math.PI / 2 + 0.35);
    this.placeCampfire(cx + 9.8, cz + 8.6, false);

    [25, 65, 115, 160, -160, -115, -65, -25].forEach(deg => {
      const a = deg * (Math.PI / 180);
      this.placeStreetLamp(cx + Math.cos(a) * 11.6, cz + Math.sin(a) * 13.8, false);
    });

    // Snowy lakeside pines framing the village
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * TAU;
      if (Math.abs(Math.sin(a)) < 0.35 && Math.cos(a) > 0) continue;
      this.placeSnowyPine(cx + Math.cos(a) * 18.2, 0, cz + Math.sin(a) * 20.0, 2.8 + (i % 3) * 0.5, 5);
    }
  }

  // 8A-3. EAST SATELLITE VILLAGE — Khu Hội Chợ Đêm, Vòng Quay Giáng Sinh & Lửa Trại (center: x = +54, z = 0)
  buildEastFairgroundVillage() {
    const cx = 54.0, cz = 0.0;

    // 1. Warm Cobblestone Fairground Plaza Disc
    const fairPlaza = new THREE.Mesh(
      new THREE.CylinderGeometry(13.8, 14.0, 0.22, 48),
      this.mat.cobble
    );
    fairPlaza.position.set(cx, -0.09, cz);
    fairPlaza.receiveShadow = true;
    this.cityGroup.add(fairPlaza);

    // 2. HERO LANDMARK: GIANT ILLUMINATED VOXEL FERRIS WHEEL ("Vòng Quay Giáng Sinh") at (cx + 4.5, cz - 2.0)
    const fwX = cx + 4.5, fwZ = cz - 2.0;
    const fwBase = new THREE.Group();
    fwBase.position.set(fwX, 0, fwZ);
    fwBase.rotation.y = -0.35; // angled heroically toward the overview camera!
    this.cityGroup.add(fwBase);

    const hubY = 9.2;
    const wheelR = 6.4;

    // Heavy stone/timber foundation + A-frame steel legs
    this.addBox(-3.6, 0, -2.6, 7.2, 0.45, 5.2, this.mat.stoneDark, fwBase);
    [-1.4, 1.4].forEach(zSide => {
      [-1, 1].forEach(xSign => {
        const leg = new THREE.Mesh(this.unitBox, this.mat.iron);
        leg.position.set(xSign * 1.45, hubY * 0.5, zSide);
        leg.scale.set(0.32, hubY * 1.06, 0.32);
        leg.rotation.z = xSign * 0.30;
        leg.castShadow = true;
        fwBase.add(leg);
      });
    });

    // Rotating Wheel Group
    const wheel = new THREE.Group();
    wheel.position.set(0, hubY, 0);
    fwBase.add(wheel);
    this.ferrisWheel = wheel;

    // Glowing Golden Hub Center Star
    const hubCore = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 2.4, 16), this.mat.gold);
    hubCore.rotation.x = Math.PI / 2;
    wheel.add(hubCore);
    this.addGlow(0, 0, 1.2, 4.2, wheel, this.texGlowGold, 0.78);

    // Double Steel Rim Rings studded with glowing warm fairy lights!
    [-0.95, 0.95].forEach(rz => {
      const rim = new THREE.Mesh(new THREE.TorusGeometry(wheelR, 0.14, 8, 36), this.mat.gold);
      rim.position.z = rz;
      wheel.add(rim);
      const innerRim = new THREE.Mesh(new THREE.TorusGeometry(wheelR * 0.62, 0.09, 6, 32), this.mat.iron);
      innerRim.position.z = rz;
      wheel.add(innerRim);
    });

    // 12 Spokes + 12 Self-Leveling Illuminated Passenger Gondolas!
    const cabinMats = [this.mat.red, this.mat.gold, this.mat.teal, this.mat.blue];
    const spokes = 12;
    for (let i = 0; i < spokes; i++) {
      const a = (i / spokes) * TAU;
      const sx = Math.cos(a) * wheelR;
      const sy = Math.sin(a) * wheelR;

      // Twin spokes front & back
      [-0.95, 0.95].forEach(rz => {
        const sp = new THREE.Mesh(this.unitBox, this.mat.iron);
        sp.position.set(sx * 0.5, sy * 0.5, rz);
        sp.scale.set(wheelR, 0.11, 0.11);
        sp.rotation.z = a;
        wheel.add(sp);

        // Glowing rim bulb at every spoke tip & midpoint
        const bulb = new THREE.Mesh(this.bulbGeo, this.bulbMats[i % this.bulbMats.length]);
        bulb.scale.setScalar(1.6);
        bulb.position.set(sx, sy, rz + (rz > 0 ? 0.14 : -0.14));
        wheel.add(bulb);
      });

      // Horizontal gondola crossbar
      const bar = new THREE.Mesh(this.unitBox, this.mat.gold);
      bar.position.set(sx, sy, 0);
      bar.scale.set(0.12, 0.12, 2.0);
      wheel.add(bar);

      // Self-leveling Hanging Cabin Gondola
      const cab = new THREE.Group();
      cab.position.set(sx, sy, 0);
      wheel.add(cab);

      const cMat = cabinMats[i % cabinMats.length];
      this.addBox(-0.46, -1.18, -0.46, 0.92, 0.52, 0.92, cMat, cab);       // lower cabin tub
      this.addBox(-0.42, -0.66, -0.42, 0.84, 0.42, 0.84, this.mat.window, cab); // glowing warm glass
      this.addBox(-0.50, -0.24, -0.50, 1.00, 0.14, 1.00, this.mat.snow, cab);   // snowy roof cap
      this.addGlow(0, -0.55, 0, 2.2, cab, this.texGlowWarm, 0.45);
      this.ferrisCabins.push(cab);
    }

    // Warm Golden PointLight illuminating the entire Fairground & Ferris Wheel
    const fairLight = new THREE.PointLight(0xffad32, 4.2, 26.0, 1.3);
    fairLight.position.set(cx, 7.5, cz);
    this.cityGroup.add(fairLight);
    this.addGroundGlow(fwX, fwZ, 14.0, this.cityGroup);

    // 3. Two Crackling Bonfires / Campfires with Warm Glow Pools (where villagers gather to stay warm!)
    this.placeCampfire(cx - 5.2, cz + 4.8, true);
    this.placeCampfire(cx + 2.5, cz + 8.8, false);

    // 4. Festive Market Stalls & 7 Cozy Fairground Cottages Surrounding the Fair
    [
      { x: cx - 6.8, z: cz - 6.8, rot: 0.7 },
      { x: cx - 3.2, z: cz - 9.2, rot: 0.25 },
      { x: cx + 1.2, z: cz - 10.2, rot: -0.15 },
      { x: cx - 8.2, z: cz + 7.5, rot: 2.3 },
      { x: cx - 3.5, z: cz + 10.2, rot: 2.9 }
    ].forEach(st => this.placeMarketStall(st.x, st.z, st.rot));

    const fairHouses = [
      { deg: -135, r: 16.5, w: 3.5, d: 2.8, h: 3.0, rh: 1.8, stone: false, smoke: true },
      { deg: -98, r: 16.8, w: 3.6, d: 2.8, h: 3.2, rh: 1.9, stone: true, smoke: false },
      { deg: -58, r: 17.2, w: 3.5, d: 2.8, h: 3.0, rh: 1.8, stone: false, smoke: true },
      { deg: -15, r: 17.8, w: 3.6, d: 2.8, h: 3.1, rh: 1.8, stone: true, smoke: false },
      { deg: 35, r: 17.2, w: 3.5, d: 2.8, h: 3.0, rh: 1.8, stone: false, smoke: true },
      { deg: 82, r: 16.8, w: 3.6, d: 2.8, h: 3.1, rh: 1.9, stone: true, smoke: false },
      { deg: 128, r: 16.5, w: 3.4, d: 2.7, h: 2.9, rh: 1.7, stone: false, smoke: true }
    ];
    fairHouses.forEach(s => {
      const a = s.deg * (Math.PI / 180);
      const hx = cx + Math.cos(a) * s.r;
      const hz = cz + Math.sin(a) * s.r;
      this.createCottage({
        x: hx, z: hz, rot: Math.atan2(cx - hx, cz - hz),
        w: s.w, d: s.d, h: s.h, rh: s.rh, stone: s.stone, smoke: s.smoke, lights: true
      });
    });

    // Overhead warm fairy string light canopy crisscrossing the Fairground Plaza!
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * TAU + 0.38;
      const lx = cx + Math.cos(a) * 12.2;
      const lz = cz + Math.sin(a) * 12.2;
      this.placeStreetLamp(lx, lz, false);
      if (i % 2 === 0) {
        this.addStringGarland(lx, 2.5, lz, cx, 4.8, cz, 0.7, 10, true);
      }
    }
  }

  // 8A-4. NORTH SATELLITE VILLAGE — Làng Xưởng Quà Ông Già Noel & Nhà Ga Polar Express (center: x = 0, z = -53)
  buildNorthWorkshopVillage() {
    const cx = 0.0, cz = -53.5;

    // 1. Cobblestone Courtyard for Santa's Workshop & Train Station
    const northPlaza = new THREE.Mesh(
      new THREE.CylinderGeometry(13.5, 13.8, 0.22, 48),
      this.mat.cobble
    );
    northPlaza.position.set(cx, -0.09, cz);
    northPlaza.receiveShadow = true;
    this.cityGroup.add(northPlaza);

    // 2. POLAR EXPRESS WOODEN TRAIN STATION facing the Circular Track (at x = 0, z = -43.2)
    const stGrp = new THREE.Group();
    stGrp.position.set(cx + 5.6, 0, -43.2);
    this.cityGroup.add(stGrp);

    // Timber boarding platform + station hall + overhanging canopy roof
    this.addBox(-4.2, 0, -1.8, 8.4, 0.36, 3.6, this.mat.woodMed, stGrp);
    this.addBox(-3.4, 0.36, -1.5, 6.8, 2.8, 2.4, this.mat.timber, stGrp);
    // Warm arched station windows
    [-2.0, 0, 2.0].forEach(wx => {
      this.addBox(wx - 0.55, 1.0, 0.92, 1.1, 1.25, 0.08, this.mat.window, stGrp);
    });
    // Snow-capped pitched station roof
    for (let r = 0; r < 6; r++) {
      const rw = 7.8 - r * 0.25;
      const rd = 4.2 * (1 - r / 6.5);
      this.addBox(-rw / 2, 3.16 + r * 0.28, -rd / 2 + 0.1, rw, 0.30, rd, r > 0 ? this.mat.snow : this.mat.roofDark, stGrp);
    }
    // Hanging station lanterns + warm platform glow
    [-3.6, 3.6].forEach(lx => {
      this.addBox(lx - 0.08, 0.36, 1.4, 0.16, 2.8, 0.16, this.mat.woodDark, stGrp);
      this.addBox(lx - 0.18, 2.55, 1.4 - 0.18, 0.36, 0.42, 0.36, this.mat.window, stGrp);
      this.addGlow(lx, 2.75, 1.4, 2.4, stGrp, this.texGlowGold, 0.65);
    });
    this.addGroundGlow(0, 1.2, 10.5, stGrp);

    // 3. HERO LANDMARK: SANTA'S GRAND TOY WORKSHOP at (0, -61.5)
    const wsGrp = new THREE.Group();
    wsGrp.position.set(cx, 0, cz - 8.2);
    this.cityGroup.add(wsGrp);

    // Main double-wing crimson-timber Alpine lodge
    const ww = 10.6, wd = 5.4, wh = 4.4;
    this.addBox(-ww / 2, 0, -wd / 2, ww, 0.55, wd, this.mat.stoneDark, wsGrp);
    this.addBox(-ww / 2, 0.55, -wd / 2, ww, wh - 0.55, wd, this.mat.timber, wsGrp);
    // Warm Festive Red Wing Accents & Huge Glowing Workshop Windows
    this.addBox(-ww / 2 - 0.1, wh - 0.25, -wd / 2 - 0.1, ww + 0.2, 0.28, wd + 0.2, this.mat.red, wsGrp);
    [-3.6, -1.8, 1.8, 3.6].forEach(wx => {
      this.addBox(wx - 0.55, 1.0, wd / 2 + 0.04, 1.10, 1.35, 0.08, this.mat.window, wsGrp);
      this.addBox(wx - 0.48, 2.65, wd / 2 + 0.04, 0.96, 1.05, 0.08, this.mat.window, wsGrp);
    });
    // Grand glowing double workshop entrance portal
    this.addBox(-1.05, 0.55, wd / 2 + 0.04, 2.10, 2.45, 0.08, this.mat.portal, wsGrp);
    this.addGlow(0, 1.8, wd / 2 + 0.6, 4.8, wsGrp, this.texGlowGold, 0.65);

    // Stepped Puffy Snow Roof + Twin Smoking Chimneys
    for (let r = 0; r < 10; r++) {
      const span = (wd + 0.9) * (1 - r / 10);
      this.addBox(-ww / 2 - 0.45, wh + r * 0.30, -span / 2, ww + 0.9, 0.34, span, r > 1 ? this.mat.snow : this.mat.roofDark, wsGrp);
    }
    [-3.4, 3.4].forEach(chX => {
      this.addBox(chX - 0.38, wh + 1.2, -0.38, 0.76, 2.4, 0.76, this.mat.stoneDark, wsGrp);
      this.addBox(chX - 0.44, wh + 3.6, -0.44, 0.88, 0.20, 0.88, this.mat.snow, wsGrp);
      this.addChimneySmoke(cx + chX, wh + 3.9, cz - 8.2);
    });

    // Animated Spinning Golden Clockwork Gear Emblem on the Workshop Roof Gable!
    const gear = new THREE.Group();
    gear.position.set(0, wh + 1.45, wd / 2 + 0.28);
    wsGrp.add(gear);
    const gearRing = new THREE.Mesh(new THREE.TorusGeometry(0.82, 0.14, 8, 16), this.mat.gold);
    gear.add(gearRing);
    for (let t = 0; t < 8; t++) {
      const a = (t / 8) * TAU;
      const tooth = new THREE.Mesh(this.unitBox, this.mat.gold);
      tooth.position.set(Math.cos(a) * 0.96, Math.sin(a) * 0.96, 0);
      tooth.scale.set(0.24, 0.24, 0.20);
      tooth.rotation.z = a;
      gear.add(tooth);
    }
    this.workshopGear = gear;

    // Towering Stack of Colorful Oversized Christmas Gifts outside the Workshop Dock!
    const giftStack = [
      { x: -4.2, y: 0, z: 3.8, s: 1.15, m: this.mat.red, r: this.mat.gold },
      { x: -2.9, y: 0, z: 4.0, s: 0.95, m: this.mat.blue, r: this.mat.white },
      { x: -3.5, y: 1.05, z: 3.9, s: 0.78, m: this.mat.teal, r: this.mat.gold },
      { x: 3.4, y: 0, z: 3.8, s: 1.10, m: this.mat.gold, r: this.mat.red },
      { x: 4.5, y: 0, z: 3.9, s: 0.88, m: this.mat.red, r: this.mat.white },
      { x: 3.9, y: 1.0, z: 3.8, s: 0.72, m: this.mat.blue, r: this.mat.gold }
    ];
    giftStack.forEach(g => {
      this.addBox(g.x - g.s / 2, g.y, g.z - g.s / 2, g.s, g.s * 0.9, g.s, g.m, wsGrp);
      this.addBox(g.x - 0.08, g.y + 0.01, g.z - g.s / 2 - 0.02, 0.16, g.s * 0.92, g.s + 0.04, g.r, wsGrp);
      this.addBox(g.x - g.s / 2 - 0.02, g.y + 0.01, g.z - 0.08, g.s + 0.04, g.s * 0.92, 0.16, g.r, wsGrp);
    });

    const wsLight = new THREE.PointLight(0xffb438, 4.0, 26.0, 1.3);
    wsLight.position.set(cx, 6.2, cz - 2.0);
    this.cityGroup.add(wsLight);
    this.addGroundGlow(cx, cz - 4.0, 15.0, this.cityGroup);

    // 4. Cozy Elf Cottages & Courtyard Campfire + Christmas Tree
    const elfHouses = [
      { x: -12.8, z: cz + 4.0, rot: 1.2, w: 3.4, d: 2.7, h: 2.9, rh: 1.8, stone: false, smoke: true },
      { x: -14.2, z: cz - 1.5, rot: 1.55, w: 3.5, d: 2.8, h: 3.0, rh: 1.8, stone: true, smoke: false },
      { x: -12.0, z: cz - 7.0, rot: 1.95, w: 3.4, d: 2.7, h: 2.8, rh: 1.7, stone: false, smoke: true },
      { x: 12.8, z: cz + 4.0, rot: -1.2, w: 3.4, d: 2.7, h: 2.9, rh: 1.8, stone: true, smoke: false },
      { x: 14.2, z: cz - 1.5, rot: -1.55, w: 3.5, d: 2.8, h: 3.0, rh: 1.8, stone: false, smoke: true },
      { x: 12.0, z: cz - 7.0, rot: -1.95, w: 3.4, d: 2.7, h: 2.8, rh: 1.7, stone: true, smoke: false }
    ];
    elfHouses.forEach(cfg => this.createCottage({ ...cfg, lights: true }));

    this.placeCampfire(cx - 5.2, cz + 2.2, false);
    this.placeMarketStall(cx - 8.2, cz + 6.5, 0.55);

    // Streetlamps & overhead warm lights across Santa's Courtyard
    [
      [-9.0, cz + 4.5], [9.0, cz + 4.5],
      [-9.5, cz - 3.5], [9.5, cz - 3.5]
    ].forEach(([lx, lz]) => this.placeStreetLamp(lx, lz, false));
    this.addStringGarland(-9.0, 2.5, cz + 4.5, 9.0, 2.5, cz + 4.5, 0.9, 14, true);
    this.addStringGarland(-9.5, 2.5, cz - 3.5, 9.5, 2.5, cz - 3.5, 0.9, 14, true);
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

    // Helper: check whether (x, z) falls inside any of the 3 satellite villages or South Gateway corridor
    const inVillageFootprint = (x, z) => {
      if (Math.hypot(x + 54, z) < 22.5) return true; // West Ice Lake Village
      if (Math.hypot(x - 54, z) < 22.5) return true; // East Fairground Village
      if (Math.hypot(x, z + 54) < 22.5) return true; // North Santa Workshop Village
      if (Math.abs(x) < 16.0 && z > 35.0) return true; // South Archway Boulevard
      return false;
    };

    // A. Low Stepped-Voxel Snowy Pine Hills Cradling the Outer 5-Village Valley (R = 52 to 76 in diagonal valleys)
    const hillCount = 30;
    for (let i = 0; i < hillCount; i++) {
      const a = (i / hillCount) * TAU + (rand() - 0.5) * 0.12;
      const deg = (a * 180 / Math.PI + 360) % 360;
      if (deg > 66 && deg < 114) continue;

      const r = 56.0 + rand() * 20.0;
      const hx = Math.cos(a) * r;
      const hz = Math.sin(a) * r;
      if (inVillageFootprint(hx, hz)) continue;

      const hW = 8.4 + rand() * 4.6;
      const hHeight = 1.9 + rand() * 2.2;
      buildVoxelPeak(hx, hz, hW, hHeight, 4, false);

      const treesOnHill = 2 + Math.floor(rand() * 2);
      for (let t = 0; t < treesOnHill; t++) {
        const ta = rand() * TAU;
        const tr = rand() * (hW * 0.36);
        const tx = hx + Math.cos(ta) * tr;
        const tz = hz + Math.sin(ta) * tr;
        const ty = Math.max(0, hHeight * (1 - tr / (hW * 0.55)) * 0.65);
        this.placeSnowyPine(tx, ty, tz, 2.5 + rand() * 1.9, 4);
      }
    }

    // Diagonal Alpine Pine Groves filling the snow valleys between the Polar Express track & satellite villages!
    for (let i = 0; i < 48; i++) {
      const a = (i / 48) * TAU + (rand() - 0.5) * 0.08;
      const r = 43.0 + rand() * 12.0;
      const px = Math.cos(a) * r;
      const pz = Math.sin(a) * r;
      if (inVillageFootprint(px, pz)) continue;
      this.placeSnowyPine(px, 0, pz, 2.5 + rand() * 2.0, 4);
    }

    // B. Sculpted Stepped-Voxel Snow-Capped Alpine Mountains Framing the Full Valley (R = 82 to 104)
    const peakCount = 28;
    for (let i = 0; i < peakCount; i++) {
      const a = (i / peakCount) * TAU + (rand() - 0.5) * 0.12;
      const deg = (a * 180 / Math.PI + 360) % 360;
      if (deg > 66 && deg < 114) continue;

      const r = 82.0 + rand() * 22.0;
      const mx = Math.cos(a) * r;
      const mz = Math.sin(a) * r;
      const mW = 14.5 + rand() * 7.5;
      const mH = 10.5 + rand() * 7.8;

      buildVoxelPeak(mx, mz, mW, mH, 9, true);

      const sa = a + 0.06;
      buildVoxelPeak(
        Math.cos(sa) * (r - 4.5),
        Math.sin(sa) * (r - 4.5),
        mW * 0.58,
        mH * 0.58,
        6,
        true
      );
    }

    // C. Far Misty Silhouette Mountain Horizon (R = 118 to 140)
    for (let i = 0; i < 22; i++) {
      const a = (i / 22) * TAU;
      const deg = (a * 180 / Math.PI + 360) % 360;
      if (deg > 62 && deg < 118) continue;
      const r = 118.0 + rand() * 22.0;
      const fw = 26.0 + rand() * 14.0;
      const fh = 14.0 + rand() * 11.0;
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
    this.addBox(0.37, 0, -1.0, 0.08, 0.08, 2.2, this.mat.gold, grp);
    // Sleigh body (red with gold trim)
    this.addBox(-0.48, 0.14, -0.85, 0.96, 0.45, 1.55, sleighRed, grp);
    this.addBox(-0.52, 0.56, -0.88, 1.04, 0.08, 1.60, this.mat.gold, grp);
    // Gift sack piled in back of sleigh
    this.addBox(-0.32, 0.58, -0.78, 0.64, 0.48, 0.58, this.mat.woodMed, grp);
    this.addBox(-0.18, 0.95, -0.68, 0.24, 0.24, 0.24, this.mat.blue, grp);
    this.addBox(0.08, 0.92, -0.58, 0.22, 0.22, 0.22, this.mat.gold, grp);

    // Santa Claus sitting at the reins
    this.addBox(-0.22, 0.58, -0.10, 0.44, 0.46, 0.34, sleighRed, grp);
    this.addBox(-0.16, 1.04, -0.06, 0.32, 0.28, 0.28, skinMat, grp);
    this.addBox(-0.17, 1.00, 0.14, 0.34, 0.16, 0.10, this.mat.white, grp); // beard
    this.addBox(-0.18, 1.30, -0.08, 0.36, 0.14, 0.32, sleighRed, grp);      // Santa hat
    this.addBox(-0.06, 1.44, -0.10, 0.12, 0.10, 0.12, this.mat.white, grp); // pom-pom

    // Warm golden glow halo around Santa's Sleigh
    this.addGlow(0, 0.7, 0, 3.6, grp, this.texGlowGold, 0.55);

    // 4 Prancing Voxel Reindeer leading ahead along +Z
    const deerOffsets = [
      { x: -0.38, z: 2.1, rudolph: false },
      { x: 0.38, z: 2.1, rudolph: false },
      { x: -0.38, z: 3.7, rudolph: false },
      { x: 0.38, z: 3.7, rudolph: true }
    ];
    deerOffsets.forEach((d, idx) => {
      const dg = new THREE.Group();
      dg.position.set(d.x, 0.2, d.z);
      grp.add(dg);

      // Reindeer body, neck, head, antlers & legs
      this.addBox(-0.14, 0.22, -0.36, 0.28, 0.26, 0.72, reindeerMat, dg);
      this.addBox(-0.09, 0.46, 0.18, 0.18, 0.26, 0.18, reindeerMat, dg);
      this.addBox(-0.10, 0.66, 0.18, 0.20, 0.18, 0.30, reindeerMat, dg);
      // Antlers
      this.addBox(-0.18, 0.84, 0.20, 0.05, 0.22, 0.05, this.mat.gold, dg);
      this.addBox(0.13, 0.84, 0.20, 0.05, 0.22, 0.05, this.mat.gold, dg);
      // Legs
      this.addBox(-0.12, 0, -0.30, 0.08, 0.24, 0.08, reindeerMat, dg);
      this.addBox(0.04, 0, -0.30, 0.08, 0.24, 0.08, reindeerMat, dg);
      this.addBox(-0.12, 0, 0.22, 0.08, 0.24, 0.08, reindeerMat, dg);
      this.addBox(0.04, 0, 0.22, 0.08, 0.24, 0.08, reindeerMat, dg);
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
    const dz = Math.cos(a) * rz;
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
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xf1c29b, roughness: 0.75 });
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5 });
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
      this.addBox(0.040, 0.12, 0.13, 0.035, 0.035, 0.015, eyeMat, head);

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
      [{ x: 0.4, z: 12.5 }, { x: 0.6, z: 6.5 }, { x: 6.0, z: 4.5 }, { x: 11.5, z: -2.0 }, { x: 7.5, z: -6.0 }, { x: 3.5, z: 6.5 }],
      [{ x: -0.8, z: 12.5 }, { x: -2.0, z: 6.5 }, { x: -8.5, z: 6.0 }, { x: -11.5, z: 4.0 }, { x: -6.5, z: -3.5 }, { x: -1.5, z: 7.2 }],
      [{ x: 9.0, z: 2.0 }, { x: 4.0, z: 6.5 }, { x: -4.0, z: 6.5 }, { x: -9.5, z: 5.0 }, { x: -3.5, z: 7.5 }, { x: 5.5, z: 5.5 }]
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
      { x: 10.8, z: 10.6, rot: 0.5 },
      { x: -1.8, z: 5.0, rot: 2.8 },
      { x: -1.0, z: 5.1, rot: -2.9 },
      { x: 12.4, z: -4.5, rot: 1.1 },
      { x: 2.2, z: 6.4, rot: 2.7 },
      { x: -3.6, z: 41.2, rot: -1.5 },
      { x: -3.3, z: 41.9, rot: -1.7 },
      { x: 3.6, z: 47.2, rot: 1.5 },
      { x: 3.3, z: 46.6, rot: 1.3 },
      { x: -2.6, z: 44.0, rot: 0.6 },
      { x: -2.0, z: 44.4, rot: -0.4 },
      { x: 2.8, z: 39.0, rot: -1.2 },
      { x: -2.8, z: 50.0, rot: 1.1 }
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
      const startZ = 11.5 + (i / 34) * 51.0;
      parts.root.position.set(laneBase, 0, startZ);
      parts.root.rotation.y = goingIn ? Math.PI : 0;

      this.villagers.push({
        mode: "boulevard",
        ...parts,
        goingIn,
        laneX: laneBase,
        minZ: 11.2,
        maxZ: 62.8,
        speed: 0.90 + (i % 4) * 0.18,
        walkPhase: Math.random() * TAU
      });
    }

    // Group E: 16 Graceful Ice Skaters gliding across the West Frozen Ice Lake (cx = -54, cz = 0)
    for (let i = 0; i < 16; i++) {
      const parts = createCharacter(i + 104, i % 4 === 1);
      const isNorthHalf = i % 2 === 0;
      const skZCenter = isNorthHalf ? -5.8 : 5.8;
      const rx = 3.2 + (i % 4) * 1.15;
      const rz = 2.4 + (i % 3) * 0.85;
      const dir = isNorthHalf ? 1 : -1;
      this.villagers.push({
        mode: "skate",
        ...parts,
        cx: -54.0 + ((i % 3) - 1) * 1.4,
        cz: skZCenter,
        rx,
        rz,
        angle: (i / 16) * TAU,
        speed: (0.42 + (i % 3) * 0.10) * dir,
        walkPhase: Math.random() * TAU
      });
    }

    // Group F: 14 Fairground Strollers & 10 Campfire Warmers in East Fairground Village (cx = 54, cz = 0)
    for (let i = 0; i < 14; i++) {
      const parts = createCharacter(i + 120, i % 5 === 0);
      const radius = 5.0 + (i % 4) * 1.8;
      const dir = i % 2 === 0 ? 1 : -1;
      this.villagers.push({
        mode: "localOrbit",
        ...parts,
        cx: 54.0,
        cz: 0.0,
        radius,
        angle: (i / 14) * TAU,
        speed: (0.14 + (i % 3) * 0.03) * dir,
        walkPhase: Math.random() * TAU
      });
    }
    // Campfire warmers gathered lovingly around the crackling bonfires!
    const campfireSpots = [
      { fx: 48.8, fz: 4.8, count: 6, r: 2.2 },
      { fx: 56.5, fz: 8.8, count: 5, r: 2.1 },
      { fx: -44.2, fz: 8.6, count: 4, r: 2.0 }, // West lake shore campfire
      { fx: -5.2, fz: -51.3, count: 5, r: 2.1 } // North Santa courtyard campfire
    ];
    let cfIdx = 134;
    campfireSpots.forEach(cf => {
      for (let k = 0; k < cf.count; k++) {
        const a = (k / cf.count) * TAU + 0.3;
        const vx = cf.fx + Math.cos(a) * cf.r;
        const vz = cf.fz + Math.sin(a) * cf.r;
        const parts = createCharacter(cfIdx++, k === 2);
        parts.root.position.set(vx, 0, vz);
        const faceFire = Math.atan2(cf.fx - vx, cf.fz - vz);
        parts.root.rotation.y = faceFire;
        this.villagers.push({
          mode: "idle",
          ...parts,
          baseRot: faceFire,
          walkPhase: Math.random() * TAU
        });
      }
    });

    // Group G: 14 Santa Workshop Elves & Train Station Visitors in North Village (cx = 0, cz = -53.5)
    for (let i = 0; i < 14; i++) {
      const parts = createCharacter(i + 156, i % 3 === 0); // playful elves!
      const radius = 4.6 + (i % 4) * 1.65;
      const dir = i % 2 === 0 ? -1 : 1;
      this.villagers.push({
        mode: "localOrbit",
        ...parts,
        cx: 0.0,
        cz: -52.5,
        radius,
        angle: (i / 14) * TAU,
        speed: (0.15 + (i % 3) * 0.04) * dir,
        walkPhase: Math.random() * TAU
      });
    }

    // Group H: 18 Avenue Travelers walking between Central Plaza & the East, West & North Satellite Villages!
    for (let i = 0; i < 12; i++) {
      const parts = createCharacter(i + 170, i % 5 === 1);
      const goingEast = i % 2 === 0;
      const laneZ = goingEast ? 0.9 + (i % 2) * 0.6 : -(0.9 + (i % 2) * 0.6);
      const startX = -41.0 + (i / 12) * 82.0;
      parts.root.position.set(startX, 0, laneZ);
      this.villagers.push({
        mode: "ewAvenue",
        ...parts,
        goingEast,
        laneZ,
        minX: -43.5,
        maxX: 43.5,
        speed: 1.05 + (i % 3) * 0.2,
        walkPhase: Math.random() * TAU
      });
    }
    for (let i = 0; i < 6; i++) {
      const parts = createCharacter(i + 182, i % 3 === 0);
      const goingNorth = i % 2 === 0;
      const laneX = goingNorth ? -1.0 : 1.0;
      const startZ = -12.0 - (i / 6) * 32.0;
      parts.root.position.set(laneX, 0, startZ);
      this.villagers.push({
        mode: "boulevard",
        ...parts,
        goingIn: goingNorth,
        laneX,
        minZ: -44.0,
        maxZ: -11.5,
        speed: 0.95 + (i % 3) * 0.16,
        walkPhase: Math.random() * TAU
      });
    }
  }

  updateVillagers() {
    const dt = 0.016;
    for (let i = 0; i < this.villagers.length; i++) {
      const v = this.villagers[i];

      if (v.mode === "orbit" || v.mode === "localOrbit") {
        v.angle += v.speed * dt;
        const ox = v.mode === "localOrbit" ? v.cx : 0;
        const oz = v.mode === "localOrbit" ? v.cz : 0;
        v.root.position.x = ox + Math.cos(v.angle) * v.radius;
        v.root.position.z = oz + Math.sin(v.angle) * v.radius;

        const dx = -Math.sin(v.angle) * v.speed;
        const dz = Math.cos(v.angle) * v.speed;
        v.root.rotation.y = Math.atan2(dx, dz);

        v.walkPhase += Math.abs(v.speed) * v.radius * dt * 8.5;
        const swing = Math.sin(v.walkPhase);
        v.legL.rotation.x = swing * 0.55;
        v.legR.rotation.x = -swing * 0.55;
        v.armL.rotation.x = -swing * 0.42;
        v.armR.rotation.x = swing * 0.42;
        v.root.position.y = Math.abs(swing) * 0.04;
      } else if (v.mode === "skate") {
        // Smooth elliptical ice-skating glide with graceful lean into the curve!
        v.angle += v.speed * dt;
        v.root.position.x = v.cx + Math.cos(v.angle) * v.rx;
        v.root.position.z = v.cz + Math.sin(v.angle) * v.rz;
        v.root.position.y = 0.06;

        const dx = -Math.sin(v.angle) * v.rx * v.speed;
        const dz = Math.cos(v.angle) * v.rz * v.speed;
        v.root.rotation.y = Math.atan2(dx, dz);
        v.root.rotation.z = v.speed > 0 ? 0.12 : -0.12;

        v.walkPhase += Math.abs(v.speed) * dt * 6.5;
        const glide = Math.sin(v.walkPhase);
        v.legL.rotation.x = glide * 0.35;
        v.legR.rotation.x = -glide * 0.35;
        v.armL.rotation.z = 0.28 + glide * 0.12;
        v.armR.rotation.z = -0.28 - glide * 0.12;
      } else if (v.mode === "ewAvenue") {
        const dir = v.goingEast ? 1 : -1;
        v.root.position.x += dir * v.speed * dt;
        v.root.position.z = v.laneZ + Math.sin(this.time * 0.7 + v.walkPhase * 0.1) * 0.12;
        v.root.rotation.y = v.goingEast ? Math.PI / 2 : -Math.PI / 2;
        if (v.goingEast && v.root.position.x > v.maxX) v.root.position.x = v.minX;
        else if (!v.goingEast && v.root.position.x < v.minX) v.root.position.x = v.maxX;

        v.walkPhase += v.speed * dt * 8.0;
        const swing = Math.sin(v.walkPhase);
        v.legL.rotation.x = swing * 0.55;
        v.legR.rotation.x = -swing * 0.55;
        v.armL.rotation.x = -swing * 0.42;
        v.armR.rotation.x = swing * 0.42;
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

          const desiredRot = Math.atan2(dx, dz);
          let diff = desiredRot - v.root.rotation.y;
          while (diff > Math.PI) diff -= TAU;
          while (diff < -Math.PI) diff += TAU;
          v.root.rotation.y += diff * 0.12;
        }

        v.walkPhase += v.speed * dt * 8.0;
        const swing = Math.sin(v.walkPhase);
        v.legL.rotation.x = swing * 0.55;
        v.legR.rotation.x = -swing * 0.55;
        v.armL.rotation.x = -swing * 0.42;
        v.armR.rotation.x = swing * 0.42;
        v.root.position.y = Math.abs(swing) * 0.04;
      } else if (v.mode === "boulevard") {
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
        v.legL.rotation.x = swing * 0.55;
        v.legR.rotation.x = -swing * 0.55;
        v.armL.rotation.x = -swing * 0.42;
        v.armR.rotation.x = swing * 0.42;
        v.root.position.y = Math.abs(swing) * 0.04;
      } else {
        v.walkPhase += dt * 1.8;
        v.head.rotation.y = Math.sin(v.walkPhase) * 0.28;
        v.armL.rotation.x = -0.35 + Math.sin(v.walkPhase * 1.6) * 0.10;
        v.armR.rotation.x = -0.35 - Math.sin(v.walkPhase * 1.6) * 0.10;
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
      sPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      sPos[i * 3 + 1] = r * Math.cos(phi);
      sPos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(sPos, 3));
    this.starPoints = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({ color: 0xeaf4ff, size: 0.42, transparent: true, opacity: 0.85 })
    );
    this.scene.add(this.starPoints);

    // Crisp falling 6-point snowflakes spanning the full 5-Village Christmas Valley
    const snowCount = 2600;
    const snowGeo = new THREE.BufferGeometry();
    const pos = new Float32Array(snowCount * 3);
    const speeds = new Float32Array(snowCount);

    for (let i = 0; i < snowCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 180;
      pos[i * 3 + 1] = Math.random() * 44;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 180;
      speeds[i] = 0.032 + Math.random() * 0.052;
    }

    snowGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    this.snowSpeeds = speeds;

    this.snowPoints = new THREE.Points(
      snowGeo,
      new THREE.PointsMaterial({
        map: this.texSnowflake,
        color: 0xffffff,
        size: 0.34,
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
      pos[i * 3] += wind;
      if (pos[i * 3 + 1] < 0) {
        pos[i * 3 + 1] = 42 + Math.random() * 2;
        pos[i * 3] = (Math.random() - 0.5) * 180;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 180;
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
      this.controls.maxDistance = 240;
      this.controls.target.set(2.0, 4.0, 2.0);
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

  // Smooth Cinematic Camera Presets + Grand 5-Village Valley Walkthrough
  flyToPreset(presetName) {
    this.walkthroughActive = false;
    this.autoRotate = false;

    if (presetName === "walkthrough") {
      this.camFlight = null;
      this.walkthroughActive = true;
      this.walkthroughT = 0;
      if (!this.walkCurve) {
        this.walkCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(0.0, 4.4, 66.0),   // Outside Welcome Archway
          new THREE.Vector3(0.0, 3.8, 49.0),   // Gliding under "CHÚC MỪNG GIÁNG SINH"
          new THREE.Vector3(0.8, 3.2, 22.0),   // Entering the Grand Central Square
          new THREE.Vector3(-28.0, 8.5, 16.0), // Flying west toward Frozen Ice Lake & Bridge
          new THREE.Vector3(-42.0, 10.5, -18.0), // Sweeping over skaters & lakeside cottages
          new THREE.Vector3(-14.0, 11.5, -42.0), // Approaching Santa's Workshop & Polar Express Station
          new THREE.Vector3(24.0, 12.0, -34.0),  // Crossing Polar Express track to East Fairground
          new THREE.Vector3(44.0, 11.0, 20.0),   // Admiring glowing Ferris Wheel & Campfires
          new THREE.Vector3(22.0, 32.0, 92.0)    // Rising to Grand 5-Village Panorama
        ]);
        this.walkLookCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(0.0, 5.2, 47.0),
          new THREE.Vector3(0.0, 4.5, 0.0),
          new THREE.Vector3(0.0, 4.8, 0.0),
          new THREE.Vector3(-54.0, 2.5, 0.0),
          new THREE.Vector3(-54.0, 2.5, 0.0),
          new THREE.Vector3(0.0, 3.8, -56.0),
          new THREE.Vector3(56.0, 6.5, -1.0),
          new THREE.Vector3(56.0, 6.5, -1.0),
          new THREE.Vector3(0.0, 4.0, 6.0)
        ]);
      }
      return;
    }

    const presets = {
      overview:   { pos: new THREE.Vector3(6.0, 36.0, 106.0),   target: new THREE.Vector3(2.0, 4.0, 2.0) },
      archway:    { pos: new THREE.Vector3(0.0, 5.4, 62.5),     target: new THREE.Vector3(0.0, 5.0, 34.0) },
      plaza:      { pos: new THREE.Vector3(-11.5, 7.0, 21.0),   target: new THREE.Vector3(0.5, 4.5, 0.0) },
      icelake:    { pos: new THREE.Vector3(-34.0, 11.5, 22.0),  target: new THREE.Vector3(-54.0, 2.2, 0.0) },
      fairground: { pos: new THREE.Vector3(29.0, 13.5, 25.0),   target: new THREE.Vector3(56.0, 6.2, -1.5) },
      workshop:   { pos: new THREE.Vector3(14.0, 12.5, -26.0),  target: new THREE.Vector3(0.0, 4.0, -56.0) },
      cathedral:  { pos: new THREE.Vector3(4.0, 8.5, 6.5),      target: new THREE.Vector3(21.5, 6.0, -11.5) }
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
      this.walkthroughT += dt * 0.036;
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
    this.updatePolarExpress(dt);
    this.updateSantaSleigh();

    // Rotate Ferris Wheel smoothly while keeping all 12 passenger gondolas perfectly upright!
    if (this.ferrisWheel) {
      this.ferrisWheel.rotation.z += dt * 0.22;
      for (let i = 0; i < this.ferrisCabins.length; i++) {
        this.ferrisCabins[i].rotation.z = -this.ferrisWheel.rotation.z;
      }
    }

    // Rotate Santa's Workshop golden clockwork gear
    if (this.workshopGear) {
      this.workshopGear.rotation.z -= dt * 0.55;
    }

    // Flickering Campfire flames & rising glowing embers
    for (let i = 0; i < this.campfires.length; i++) {
      const cf = this.campfires[i];
      const flick = 0.88 + 0.22 * Math.sin(this.time * 11.0 + cf.phase) + 0.12 * Math.cos(this.time * 17.0);
      cf.flames.forEach((fm, idx) => {
        fm.scale.y = (0.70 + idx * 0.16) * (0.85 + 0.30 * Math.sin(this.time * (10 + idx * 3) + cf.phase));
        fm.rotation.y += dt * (1.2 + idx * 0.6);
      });
      if (cf.light) cf.light.intensity = 3.5 * flick;
      cf.embers.forEach(em => {
        em.phase = (em.phase + dt * 0.55) % 1.0;
        const u = em.phase;
        em.mesh.position.set(
          Math.sin(this.time * 3.0 + em.seed) * (0.18 + u * 0.35),
          0.6 + u * 2.8,
          Math.cos(this.time * 2.5 + em.seed) * (0.18 + u * 0.35)
        );
        em.mesh.scale.setScalar(0.65 * (1 - u * 0.7));
      });
    }

    if (this.auroraUniforms) {
      this.auroraUniforms.uTime.value = this.time;
    }

    // Warm winter window & portal gentle glow breathing
    if (this.mat.window) {
      this.mat.window.emissiveIntensity = 2.35 + 0.25 * Math.sin(this.time * 2.0);
    }
    if (this.mat.portal) {
      this.mat.portal.emissiveIntensity = 2.80 + 0.35 * Math.sin(this.time * 1.7);
    }

    // Shared fairy-light twinkle (updates all 6 shared bulb materials across the entire 5-village valley!)
    if (this.bulbMats) {
      for (let i = 0; i < this.bulbMats.length; i++) {
        this.bulbMats[i].emissiveIntensity = 2.2 + 1.15 * Math.sin(this.time * 3.6 + i * 1.15);
      }
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
