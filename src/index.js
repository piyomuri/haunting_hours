
const canvas = document.getElementById("storm");
const ctx = canvas.getContext("2d");

let width, height;
let frame = 0;
let lightningFlash = 0;
let lightningPath = [];
let animationId;

const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

let paused = reducedMotion;

const random = (min, max) =>
  Math.random() * (max - min) + min;

let stars = [];
let clouds = [];
let rain = [];
let fog = [];

// ------------------------------------
// CANVAS INITIALIZATION
// ------------------------------------

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  width = window.innerWidth;
  height = window.innerHeight;

  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);

  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  createAtmosphere();
  drawScene();
}

function createAtmosphere() {
  stars = Array.from({ length: Math.floor(width / 5) }, () => ({
    x: random(0, width),
    y: random(0, height * 0.6),
    radius: random(0.3, 1.2),
    opacity: random(0.15, 0.7)
  }));

  clouds = Array.from({ length: 30 }, (_, i) => ({
    x: random(-width * 0.2, width * 1.2),
    y: height * random(0.25, 0.7),
    scale: random(0.7, 1.8),
    speed: random(0.08, 0.3) * (i % 2 ? 1 : -1),
    darkness: random(8, 25),
    phase: random(0, Math.PI * 2)
  }));

  rain = Array.from({ length: Math.floor(width * 0.22) }, () => ({
    x: random(0, width),
    y: random(0, height),
    length: random(8, 20),
    speed: random(4, 10),
    opacity: random(0.12, 0.4)
  }));

  fog = Array.from({ length: 10 }, () => ({
    x: random(-width, width),
    y: random(height * 0.65, height * 0.95),
    scale: random(0.7, 1.7),
    speed: random(0.1, 0.35),
    opacity: random(0.02, 0.06)
  }));
}

// ------------------------------------
// BACKGROUND SKY
// ------------------------------------

function drawSky() {
  const gradient = ctx.createLinearGradient(0, 0, 0, height);

  gradient.addColorStop(0, "#080817");
  gradient.addColorStop(0.35, "#21142f");
  gradient.addColorStop(0.65, "#51223d");
  gradient.addColorStop(1, "#100d20");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Atmospheric orange storm glow
  const glow = ctx.createRadialGradient(
    width * 0.76,
    height * 0.37,
    2,
    width * 0.76,
    height * 0.37,
    height * 0.48
  );

  glow.addColorStop(0, "rgba(244, 100, 46, 0.22)");
  glow.addColorStop(1, "rgba(170, 46, 84, 0)");

  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);
}

// ------------------------------------
// STARS
// ------------------------------------

function drawStars() {
  for (const star of stars) {
    ctx.globalAlpha = star.opacity;
    ctx.fillStyle = "#e9d6ff";

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = 1;
}

// ------------------------------------
// GLOWING HALLOWEEN MOON
// ------------------------------------

function drawMoon() {
  const moonX = width * 0.76;
  const moonY = height * 0.35;
  const moonRadius = Math.min(width, height) * 0.105;

  // Moonlight halo
  const halo = ctx.createRadialGradient(
    moonX,
    moonY,
    0,
    moonX,
    moonY,
    moonRadius * 2.5
  );

  halo.addColorStop(0, "rgba(255, 120, 51, 0.2)");
  halo.addColorStop(1, "rgba(255, 100, 50, 0)");

  ctx.fillStyle = halo;
  ctx.fillRect(
    moonX - moonRadius * 2.5,
    moonY - moonRadius * 2.5,
    moonRadius * 5,
    moonRadius * 5
  );

  // Orange moon
  ctx.save();

  ctx.shadowColor = "#ff7c38";
  ctx.shadowBlur = 24;
  ctx.fillStyle = "#ffb05b";

  ctx.beginPath();
  ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
  ctx.fill();

  // Crescent shadow
  ctx.shadowBlur = 0;
  ctx.globalCompositeOperation = "destination-out";

  ctx.beginPath();
  ctx.arc(
    moonX + moonRadius * 0.48,
    moonY - moonRadius * 0.18,
    moonRadius * 0.87,
    0,
    Math.PI * 2
  );
  ctx.fill();

  ctx.restore();

  ctx.globalCompositeOperation = "source-over";
}

// ------------------------------------
// STORM CLOUDS
// ------------------------------------

function drawCloud(cloud) {
  ctx.save();

  ctx.translate(cloud.x, cloud.y);
  ctx.scale(cloud.scale, cloud.scale);

  const pulse = Math.sin(frame * 0.006 + cloud.phase) * 2;

  const gradient = ctx.createRadialGradient(
    0, -10, 3,
    0, 0, 80
  );

  gradient.addColorStop(
    0,
    `rgb(${cloud.darkness + 15}, ${cloud.darkness + 12}, ${cloud.darkness + 31})`
  );

  gradient.addColorStop(
    0.7,
    `rgb(${cloud.darkness + 3}, ${cloud.darkness + 2}, ${cloud.darkness + 13})`
  );

  gradient.addColorStop(1, "rgba(6, 5, 16, 0)");

  ctx.fillStyle = gradient;

  ctx.beginPath();

  // Multiple overlapping cloud masses
  ctx.ellipse(0, 0, 83, 34 + pulse, 0, 0, Math.PI * 2);
  ctx.ellipse(-37, -14, 40, 30, 0, 0, Math.PI * 2);
  ctx.ellipse(4, -25, 46, 39, 0, 0, Math.PI * 2);
  ctx.ellipse(40, -10, 38, 28, 0, 0, Math.PI * 2);

  ctx.fill();
  ctx.restore();
}

function updateClouds() {
  for (const cloud of clouds) {
    cloud.x += cloud.speed;

    if (cloud.x > width + 150) {
      cloud.x = -150;
    }

    if (cloud.x < -160) {
      cloud.x = width + 150;
    }

    drawCloud(cloud);
  }
}

// ------------------------------------
// ATMOSPHERIC FOG
// ------------------------------------

function drawFog() {
  for (const mist of fog) {
    mist.x += mist.speed;

    if (mist.x > width + 150) {
      mist.x = -150;
    }

    ctx.fillStyle = `rgba(178, 130, 175, ${mist.opacity})`;

    ctx.beginPath();

    ctx.ellipse(
      mist.x,
      mist.y,
      120 * mist.scale,
      18 * mist.scale,
      0,
      0,
      Math.PI * 2
    );

    ctx.fill();
  }
}

// ------------------------------------
// RAIN
// ------------------------------------

function drawRain() {
  ctx.strokeStyle = "#b4c9e8";
  ctx.lineWidth = 0.8;

  for (const drop of rain) {
    drop.x -= 1.1;
    drop.y += drop.speed;

    if (drop.y > height) {
      drop.y = -drop.length;
      drop.x = random(0, width);
    }

    if (drop.x < 0) {
      drop.x = width;
    }

    ctx.globalAlpha = drop.opacity;

    ctx.beginPath();
    ctx.moveTo(drop.x, drop.y);
    ctx.lineTo(drop.x - 3, drop.y + drop.length);
    ctx.stroke();
  }

  ctx.globalAlpha = 1;
}

// ------------------------------------
// LIGHTNING
// ------------------------------------

function createLightning() {
  let x = random(width * 0.15, width * 0.85);
  let y = 0;

  lightningPath = [[x, y]];

  while (y < height * 0.57) {
    x += random(-width * 0.065, width * 0.065);
    y += random(12, 28);

    lightningPath.push([x, y]);

    // Small branching lightning bolts
    if (Math.random() < 0.22 && y < height * 0.4) {
      const branchX = x + random(-40, 40);
      const branchY = y + random(10, 25);

      lightningPath.push([branchX, branchY]);
      lightningPath.push([x, y]);
    }
  }

  lightningFlash = random(0.55, 0.95);
}

function drawLightning() {
  if (lightningFlash <= 0) return;

  // Brief flash over the entire sky
  ctx.fillStyle = `rgba(220, 208, 255, ${lightningFlash * 0.24})`;
  ctx.fillRect(0, 0, width, height);

  // Lightning bolt
  ctx.save();

  ctx.strokeStyle = `rgba(235, 227, 255, ${lightningFlash})`;
  ctx.lineWidth = 1.5;
  ctx.shadowColor = "#b5a5ff";
  ctx.shadowBlur = 12;

  ctx.beginPath();

  lightningPath.forEach(([x, y], index) => {
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.stroke();
  ctx.restore();

  lightningFlash *= 0.84;

  if (lightningFlash < 0.025) {
    lightningFlash = 0;
  }
}

// ------------------------------------
// DISTANT DARKNESS
// ------------------------------------

function drawGroundShadow() {
  const gradient = ctx.createLinearGradient(
    0,
    height * 0.72,
    0,
    height
  );

  gradient.addColorStop(0, "rgba(11, 9, 25, 0)");
  gradient.addColorStop(1, "rgba(5, 6, 15, 0.9)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, height * 0.65, width, height * 0.35);
}

// ------------------------------------
// MAIN SCENE
// ------------------------------------

function drawScene() {
  ctx.clearRect(0, 0, width, height);

  drawSky();
  drawStars();
  drawMoon();
  updateClouds();
  drawGroundShadow();
  drawFog();
  drawLightning();
  drawRain();

  // Random distant lightning
  if (Math.random() < 0.0035 && lightningFlash === 0) {
    createLightning();
  }
}

// ------------------------------------
// ANIMATION LOOP
// ------------------------------------

function animate() {
  if (paused) return;

  frame++;

  drawScene();

  animationId = requestAnimationFrame(animate);
}

// ------------------------------------
// OPTIONAL CONTROLS
// ------------------------------------

function pauseStorm() {
  paused = !paused;

  if (paused) {
    cancelAnimationFrame(animationId);
  } else {
    animate();
  }
}

function triggerLightning() {
  createLightning();

  if (paused) {
    drawScene();
  }
}

// Optional buttons:
// <button onclick="pauseStorm()">Pause / Play</button>
// <button onclick="triggerLightning()">Lightning</button>

window.addEventListener("resize", resizeCanvas);

resizeCanvas();

if (!paused) {
  animate();
}

// Expose controls for optional HTML buttons
window.pauseStorm = pauseStorm;
window.triggerLightning = triggerLightning;

useEffect(() => {
    const heroBgContainer = document.getElementById('heroBgContainer');
    const heroBg = document.getElementById('heroBg');
    const hhHeader = document.getElementById('hhHeader');
    const rootHder = document.querySelector('body');
    if (!heroBgContainer || !heroBg) return;
  
    const ctx = heroBg.getContext('2d');
  
    if (!ctx) return;
  
    const TOTAL_FRAMES = 18;
    const FRAME_DURATION = 20;
  
    let frameIndex = 0;
    let lastFrameTime = 0;
    let animationId;
    let isRunning = true;
  
    const batSprite = new Image();
    
    // Size the canvas using its container.
    function resizeCanvas() {
      const container = heroBgContainer.parentElement;
  
      if (!container) return;
  
      const width = container.clientWidth;
      const height = 500;
  
      heroBg.width = width;
      heroBg.height = height;
  
      setHeroBackground({
        width,
        height,
      });
    }
  
    function drawBatSprite() {
      if (!batSprite.complete || !batSprite.naturalWidth) return;
  
      // Assumes all frames are arranged horizontally.
      const frameWidth = batSprite.naturalWidth / TOTAL_FRAMES;
      const frameHeight = batSprite.naturalHeight;
  
      const displayHeight = 160;
      const displayWidth = displayHeight * (frameWidth / frameHeight);
  
      const x = (heroBg.width - displayWidth) / 2;
      const y = (heroBg.height - displayHeight) / 2;
  
      ctx.drawImage(
        batSprite,
        frameIndex * frameWidth,
        0,
        frameWidth,
        frameHeight,
        x,
        y,
        displayWidth,
        displayHeight
      );
    }
  
    function animate(timestamp) {
      if (!isRunning) return;
  
      if (timestamp - lastFrameTime >= FRAME_DURATION) {
        frameIndex = (frameIndex + 1) % TOTAL_FRAMES;
        lastFrameTime = timestamp;
      }
  
      ctx.clearRect(0, 0, heroBg.width, heroBg.height);
  
      // Background.
      // ctx.fillStyle = '#202023';
      // ctx.fillRect(0, 0, heroBg.width, heroBg.height);
  
      drawBatSprite();
  
      animationId = requestAnimationFrame(animate);
    }
  
    function handleResize() {
      resizeCanvas();
  
      // Redraw immediately after resizing.
      ctx.clearRect(0, 0, heroBg.width, heroBg.height);
      // ctx.fillStyle = '#202023';
      ctx.fillRect(0, 0, heroBg.width, heroBg.height);
  
      drawBatSprite();
    }
  
    function handleImageLoad() {
      if (!isRunning) return;
  
      console.log('Sprite loaded:', {
        width: batSprite.naturalWidth,
        height: batSprite.naturalHeight,
        frameWidth: batSprite.naturalWidth / TOTAL_FRAMES,
      });
  
      resizeCanvas();
  
      frameIndex = 0;
      lastFrameTime = 0;
  
      animationId = requestAnimationFrame(animate);
    }
  
    function handleImageError() {
      console.error('Failed to load walking_sprite.png');
    }

    function handleNavScroll() {
      if (!rootHder) {
        console.log('no header found!');
      }
      if (window.scrollY >= 80) {
        setIsScrollYForNav(true);
      };
      if (window.scrollY <= 80) {
        setIsScrollYForNav(false);
      };
      
    }
  
    // resizeCanvas();
  
    batSprite.onload = handleImageLoad;
    batSprite.onerror = handleImageError;
    batSprite.src = '/walking_sprite.png';
  
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleNavScroll);
  
    return () => {
      isRunning = false;
  
      cancelAnimationFrame(animationId);
  
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleNavScroll);
  
      batSprite.onload = null;
      batSprite.onerror = null;

    };
  }, []);