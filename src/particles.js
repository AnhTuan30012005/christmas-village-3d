/* ==========================================================================
   SRC/PARTICLES.JS - CHRISTMAS PARTICLE & FAIRY LIGHT SYSTEM (PHASE 2)
   ========================================================================== */

const THREE = window.THREE;
const TAU = 2 * Math.PI;

export class ParticleSystem {
  constructor(scene) {
    this.scene = scene;
    this.time = 0;
    this.particleGroups = [];

    this.initSkyStars();
  }

  // 1. Twinkling Night Sky Stars (1,200 points)
  initSkyStars() {
    const count = 1200;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const r = 45 + Math.random() * 30;
      const theta = Math.random() * TAU;
      const phi = Math.acos(Math.random() * 0.85 + 0.08);

      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi);
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      phases[i] = Math.random() * TAU;

      // Soft blue-white star colors
      const starTint = 0.85 + Math.random() * 0.15;
      colors[i * 3]     = starTint;
      colors[i * 3 + 1] = starTint;
      colors[i * 3 + 2] = 1.0;
    }

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.22,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    });

    this.skyStars = new THREE.Points(geo, mat);
    this.skyStarsPhases = phases;
    this.scene.add(this.skyStars);
  }

  // 2. Tree Fairy Light Particles (Over 1,500 twinkling points)
  createTreeFairyLights(baseY, height, maxRadius, turns = 4.2) {
    const count = 1600;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const baseColors = [];

    const palette = [
      new THREE.Color(0xffd700), // Gold
      new THREE.Color(0xff2244), // Ruby
      new THREE.Color(0x00d2ff), // Sapphire
      new THREE.Color(0x33ff66), // Emerald
      new THREE.Color(0xfff2aa), // Warm White
      new THREE.Color(0xff00bb)  // Magenta
    ];

    for (let i = 0; i < count; i++) {
      const u = i / count;
      const y = baseY + 0.3 + (height - 0.6) * u;
      
      // Half along spiral garland, half scattered on pine volume
      let px, pz;
      if (i % 2 === 0) {
        // Spiral garland track
        const ga = TAU * turns * u;
        const gr = maxRadius * Math.pow(1 - u, 0.85) + 0.12;
        const swag = -0.12 * Math.abs(Math.sin(ga * 2.5));
        px = gr * Math.cos(ga);
        pz = gr * Math.sin(ga);
      } else {
        // Random foliage volume
        const rad = maxRadius * Math.pow(1 - u, 0.85) * (0.4 + 0.6 * Math.random());
        const angle = Math.random() * TAU;
        px = rad * Math.cos(angle);
        pz = rad * Math.sin(angle);
      }

      positions[i * 3]     = px;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = pz;

      const col = palette[Math.floor(Math.random() * palette.length)].clone();
      baseColors.push(col);

      colors[i * 3]     = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;

      phases[i] = Math.random() * TAU;
    }

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.16,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    });

    const points = new THREE.Points(geo, mat);
    this.scene.add(points);

    this.particleGroups.push({
      points,
      phases,
      baseColors,
      count
    });

    return points;
  }

  // 3. Star Radiant Sparkles
  createStarSparkles(x, y, z) {
    const count = 180;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const rad = 0.2 + Math.random() * 1.6;
      const angle = Math.random() * TAU;
      positions[i * 3]     = x + Math.cos(angle) * rad;
      positions[i * 3 + 1] = y + Math.sin(angle) * rad;
      positions[i * 3 + 2] = z + (Math.random() - 0.5) * 0.4;

      colors[i * 3]     = 1.0;
      colors[i * 3 + 1] = 0.85 + Math.random() * 0.15;
      colors[i * 3 + 2] = 0.4;
    }

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });

    const starPoints = new THREE.Points(geo, mat);
    this.scene.add(starPoints);
    return starPoints;
  }

  // Animation update loop
  update(delta) {
    this.time += delta;

    // Twinkle tree fairy lights
    for (let g = 0; g < this.particleGroups.length; g++) {
      const group = this.particleGroups[g];
      const colors = group.points.geometry.attributes.color.array;
      const phases = group.phases;
      const baseColors = group.baseColors;

      for (let i = 0; i < group.count; i++) {
        // Individual twinkle curve
        const twinkle = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(this.time * 4.5 + phases[i]));
        const bc = baseColors[i];

        colors[i * 3]     = bc.r * twinkle;
        colors[i * 3 + 1] = bc.g * twinkle;
        colors[i * 3 + 2] = bc.b * twinkle;
      }
      group.points.geometry.attributes.color.needsUpdate = true;
    }
  }
}
