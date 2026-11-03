import { useEffect, useState } from 'react';
import './styles/global_style.css';
import './styles/hhr_style.css';
import menuAsset from './assets/scroll.png';
import pumpkinMan from './assets/pumpkin_man.png';

function App() {
  const [selectedNav, setSelectedNav] = useState('hero');
  const [navWidth, setNavWidth] = useState(0);
  // check is window scroll pass the top so nav displays absolute 0 at the top
  const [isScrollYForNav, setIsScrollYForNav] = useState(false);
  const [heroContent, setHeroContent] = useState({
    cWidth: 0,
    cHeight: 0
  });
  // mobile buger state
  const [bugerClick, setBugerClick] = useState(false);

  // the ua this line get the divice type (mobile, desktop or tablet) to help fit size
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';

  // basic navigation data
  const navData = [
    {styleName: '', name: 'Home', target: 'hero', icon: ''},
    {styleName: '', name: 'Technology', target: 'tech', icon: ''},
    {styleName: '', name: 'Spells', target: 'spells', icon: ''},
    {styleName: '', name: 'Brew', target: 'brew', icon: ''},
    {styleName: '', name: 'Summon', target: 'summon', icon: ''},
    {styleName: '', name: 'About', target: 'about', icon: ''},
  ];

  const siteTech = [
    {dependencies: 'vite', icon: 'vite.png', version: '8.3.4' },
    {dependencies: 'react', icon: 'react.svg', version: '19.3.1' },
    {dependencies: 'eslint', icon: 'eslint.svg', version: '10' }
  ];

  const techTable = [
    {tech: 'ReactJS', description: 'javaScript library for building modular, interactive user interfaces.'},
    {tech: 'CSS', description: 'Use CSS for custom styling layout and theme design.'},
    {tech: 'Vite', description: 'Fast frontend build tool.'}
  ];

  // this function compare between "tablet" | "mobile" | "desktop"
  function diviceType() {
    if (/iPad|Tablet|PlayBook|Silk/i.test(ua)) {
      return 'tablet';
    }
    else if (/Mobi|Android|iPhone|iPod|blackberry|opera mini/i.test(ua)) {
      return 'mobile';
    }
    else {
      return 'desktop'
    }
  };

  const whatDivice = diviceType();

  useEffect(() => {
    const hhHeader = document.getElementById('hhHeader');
    const main = document.querySelector('main');

    function updateLayout() {
      if (!main || !hhHeader) return;

      setNavWidth(window.innerWidth);
      setHeroContent({
        cWidth: main.clientWidth,
        cHeight: hhHeader.clientHeight
      });
    }

    function handleNavScroll() {
      setIsScrollYForNav(window.scrollY >= 80);
    }

    updateLayout();
    window.addEventListener('resize', updateLayout);
    window.addEventListener('scroll', handleNavScroll);
  
    return () => {
      window.removeEventListener('resize', updateLayout);
      window.removeEventListener('scroll', handleNavScroll);
    };
  }, []);

  // HALLOWEEN BACKGROUND
  useEffect(() => {
    const hauntedHouse = document.getElementById('hauntedHouse');
    if (!hauntedHouse) return;

    const ctx = hauntedHouse.getContext('2d');
    if (!ctx) return;

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
    let width, height;
    let frame = 0;
    let lightningFlash = 0;
    let lightningPath = [];
    let animationId;

    function resizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
    
      width = Math.max(1, window.innerWidth);
      height = Math.max(1, window.innerHeight);

      // Keep CSS dimensions separate from the high-DPI drawing buffer.
      hauntedHouse.style.width = `${width}px`;
      hauntedHouse.style.height = `${height}px`;
      hauntedHouse.width = Math.round(width * dpr);
      hauntedHouse.height = Math.round(height * dpr);
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
    
      // Dark overlay creates a crescent without erasing the canvas background.
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#24162b';
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
    
    }
    
    // ------------------------------------
    // ANIMATION LOOP
    // ------------------------------------
    
    function animate() {
      if (paused) return;
    
      frame++;

      // Trigger random lightning only while the animation loop is running.
      if (Math.random() < 0.0035 && lightningFlash === 0) {
        createLightning();
      }

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
        // Fade the flash even when reduced-motion has paused the storm.
        const renderFlash = () => {
          drawScene();
          if (lightningFlash > 0) {
            animationId = requestAnimationFrame(renderFlash);
          }
        };
        renderFlash();
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

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
      if (window.pauseStorm === pauseStorm) {
        delete window.pauseStorm;
      }
      if (window.triggerLightning === triggerLightning) {
        delete window.triggerLightning;
      }
    };
  }, []);

  useEffect(() => {
    const styleHtml = document.documentElement;
    const previousOverflow = styleHtml.style.overflow;

    styleHtml.style.overflow = bugerClick ? 'hidden' : '';

    return () => {
      styleHtml.style.overflow = previousOverflow;
    };
  }, [bugerClick]);

  return (
    <>
      <header className='_hh-header' id='hhHeader'>
        <nav className={`_hh-nav-container ${isScrollYForNav ? 'scroll' : 'noscroll'}`}>
          <div className='_hh-logo' aria-label='Haunting Hours'>
            <svg
              width="54px"
              height="14px"
              viewBox="0 0 82.241159 31.861609"
              version="1.1"
              
              className={`logo-svg ${whatDivice == 'desktop' ? 'desk' : whatDivice === 'tablet' ? 'tab' : whatDivice === 'mobile' ? 'mob' : 'desk'}`}
              xmlns="http://www.w3.org/2000/svg">
              <defs
                 />
              <g
                
                transform="translate(-1.9715029,-3.5271865)">
                <path
                  id="path10"
                  style={{
                    fontWeight: 900,
                    fontSize: "3.175px",
                    fontFamily: 'Lato',
                    whiteSpace: 'pre',
                    inlineSize: 24.9197,
                    display: 'inline',
                    fill: '#F5F0E8',
                    fillOpacity: 0.988235,
                    strokeWidth: 2.50002,
                    strokeLinecap: 'round',
                    strokeMiterlimit: 1.6
                  }}
                  d="m 41.55811,3.5271865 -6.828516,4.4944223 0.37171,0.2492722 1.61603,-0.8615308 0.979854,5.3137818 -1.907303,-0.131784 c -3.287214,-0.9172 -4.156717,-2.390116 -5.364824,-3.785016 -0.189944,1.361647 -0.860505,4.125754 -3.590364,4.746708 l 0.06093,0.576112 1.996272,-0.823125 1.394222,3.301534 -3.617176,-0.03013 -0.02802,1.112309 -1.032261,-3.589213 -6.52627,0.02485 -0.265681,1.314137 -6.967449,-0.103179 c 0.02958,-0.395707 0.05608,-0.783251 0.07922,-1.159002 l -9.4755172,0.05197 -0.4814639,15.111447 9.0270951,0.175469 0.388771,-5.029116 -0.06703,6.94497 8.890596,-0.02033 0.04022,-3.233003 3.434365,-0.04895 0.05972,1.65152 3.804857,-0.142336 c 0.190204,-3.256669 -0.694483,1.353935 7.060069,-1.055076 l -1.262596,6.127871 8.141079,-0.404407 0.822638,-4.130683 5.679259,-0.21915 0.204754,-1.618383 5.260015,-0.208605 -0.308336,1.681643 5.434293,0.240987 -0.977417,5.335623 7.510998,-0.590421 1.011542,-8.724513 0.219377,0.757607 -0.260806,3.544779 5.186893,-0.198061 0.583768,-3.750374 c 0.849619,1.963599 2.781137,2.236138 6.086311,2.15157 6.718082,-0.16452 5.546405,-3.16942 5.357512,-5.727982 l -6.216714,-0.10618 c 0.441316,2.729296 -1.504818,3.506918 0.02682,-2.842902 0.52229,-0.762998 0.371519,0.807025 0.753169,1.198914 l 6.116781,0.08435 0.224256,-3.116275 c 0.2942,0.147377 -6.774577,-3.624419 -11.388981,0.542976 l -0.119428,-0.669496 -5.522041,0.241742 -0.03656,2.532631 -1.006666,-1.494877 -5.147893,0.09038 0.196216,-1.737374 -2.588571,0.146101 -0.216923,-2.787176 -5.212484,-0.127267 0.87017,-1.95652 1.798836,0.804296 0.63252,-0.786222 C 53.134633,12.657999 51.950019,10.902748 50.116059,9.1806341 48.513604,11.372521 48.144995,11.61209 46.217361,12.871514 l -1.945086,0.678532 0.967669,-6.5217337 2.153483,1.4052594 0.08164,-0.4526041 -2.729945,-2.1026202 C 44.911247,5.5012968 45.44563,5.0394999 45.404453,4.7780877 l 0.285183,0.1024193 0.2023,-0.071542 c -0.511425,-0.2568822 -0.60723,-0.375692 -0.779982,-0.9428649 -0.544363,0.2360987 -0.81256,0.5459641 -1.55997,0.6762732 l 0.05118,0.1920379 0.324183,-0.029368 C 43.819948,4.9359288 43.747591,5.0312233 43.53004,5.1327965 Z" />
                <path
                  id="path17"
                  style={{
                    fontWeight: 900,
                    fontSize: '3.175px',
                    fontFamily: 'Lato',
                    whiteSpace: 'pre',
                    inlineSize: 24.9197,
                    display: 'inline',
                    fill: '#080808',
                    fillOpacity: 1,
                    strokeWidth: 2.50002,
                    strokeLinecap: 'round',
                    strokeMiterlimit: 1.6
                  }}
                  d="m 72.043577,24.548186 c 0.755019,1.76555 2.592573,3.168213 5.52974,3.092175 5.97007,-0.147927 5.171561,-2.05234 5.003705,-4.352844 l -4.643185,-7.52e-4 -0.241203,1.39999 c 0.899047,0.175867 1.906493,-0.01239 2.1362,0.185259 0.690515,0.594167 -1.095806,1.184207 -2.070762,1.155235 -4.379653,-1.668649 -2.468032,-6.05941 -1.009727,-7.103871 0.496304,-0.355463 2.562159,-0.427486 2.403064,-0.0038 l -0.617123,1.645496 4.576464,-0.05875 0.02692,-2.049903 c 0.0032,-0.226362 -7.172899,-3.45834 -10.550121,1.293804 -1.270437,1.388273 -0.563601,3.240145 -0.543983,4.797945 z m -6.73864,-4.390231 2.07352,3.250171 0.846257,-4.424316 3.600172,-0.137134 -1.159717,10.758981 -3.970751,0.23229 0.01628,-3.831802 -1.450131,-1.432434 -1.180202,9.455075 -5.198461,0.4774 3.260775,-14.347565 z m -5.719058,8.809048 -4.581854,-0.299849 V 18.476282 l 4.581854,0.299846 z m -2.775898,-13.348082 -0.09531,2.34769 -3.763571,-0.02166 -0.209848,9.189582 -4.458259,0.287302 0.933229,-9.835271 -2.089069,-0.109181 0.590217,-2.340448 z m -15.080186,4.073309 2.073519,3.250171 0.846256,-4.424316 3.600175,-0.137134 -1.159719,10.75898 -3.97075,0.23229 0.01628,-3.8318 -1.450129,-1.432436 -1.180203,9.455077 -5.19846,0.4774 3.260777,-14.347566 z m -7.871836,3.667549 0.197278,-7.446904 3.350525,0.0684 c -0.08651,2.599149 0.200014,5.230404 -0.200298,7.803396 -1.062903,4.341423 -8.678113,4.343934 -9.736668,0 -0.390157,-2.681604 -0.111817,-3.940697 -0.195745,-6.647247 l 3.706755,-0.03354 -0.01651,6.445905 c -0.0042,1.677505 2.841186,1.826651 2.894611,-0.190008 z m -6.878307,3.538168 -3.788414,0.01385 -0.07309,-3.109195 -1.693119,0.01224 -0.09525,2.260849 -3.452658,0.0862 0.12905,-4.925004 2.518708,-5.895995 4.181957,-0.02193 2.222405,4.308708 z m -5.506843,-5.784113 h 2.151766 l -1.041738,-3.947195 z m -3.785742,9.130181 -5.543381,0.01806 0.0566,-6.244485 -1.864945,-0.04948 -0.19327,4.648183 -5.8899094,-0.234774 0.3127676,-13.283815 6.0162758,-0.04668 -0.04831,6.356597 1.841256,0.119427 0.153246,-5.357967 5.482753,-0.0207 z" />
              </g>
            </svg>
          </div>
          <ul className='_nav-lists'>
            {navWidth >= 650 ? 
              (<>
                {navData.map((data, index) => (
                  <li 
                    key={index} 
                    style={{
                      color: selectedNav === data.target ? 
                        'var(--pumpkin-color)' : ''
                    }}
                    onClick={() => {
                      setSelectedNav(data.target);
                      document.getElementById(data.target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                  >
                    {data.name}
                  </li>
                ))}
              </>) 
                : 
              (<>
                <div className='buger-menu'>
                  <div 
                    className='manu-con' 
                    role='button'
                    tabIndex={0}
                    aria-label='Toggle navigation menu'
                    aria-expanded={bugerClick}
                    onClick={() => setBugerClick(prev => !prev)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setBugerClick(prev => !prev);
                      }
                    }}
                    style={{
                      width: "34px",
                      height: "35px" 
                    }}>

                    {[1, 2, 3].map((index) => (
                      <svg
                        key={index}
                        width="11px"
                        height="35px"
                        viewBox="0 0 80.289734 243.49239"
                        version="1.1"
                        
                        className={`bone-menu${index} ${bugerClick ? 'clicked' : ''}`}
                        xmlns="http://www.w3.org/2000/svg">
                        <defs
                           />
                        <g
                          
                          transform="translate(-63.951951,-25.991403)">
                          <path
                            
                            style={{
                              strokeWidth: 2.5,
                              strokeLinecap: "round",
                              strokeMiterlimit :1.6,
                              fill: "#fff"
                            }}
                            d="m 103.58941,34.645655 c 46.52387,-36.7843556 48.40334,56.867153 17.22547,36.517436 l -3.78508,-2.465464 c -5.49446,51.321683 -5.96262,102.643353 1.63907,153.965043 l 3.60245,-2.064 c 30.21419,-19.9181 31.84296,77.28145 -11.38544,40.48362 l -6.56131,-5.58526 -6.992099,5.29194 c -43.008967,36.4408 -41.15136,-54.75638 -13.195012,-41.71952 l 6.339352,2.75759 c 5.93785,-51.94544 7.78723,-103.19608 0.65563,-152.920505 l -4.29641,1.865002 C 61.185821,87.547088 51.398009,0.18330044 103.58941,34.645655 Z" />
                        </g>
                      </svg>
                    ))}
                  </div>
                </div>
              </>)
            }
          </ul>
        </nav>
      </header>
      
      <main>
        <section
          id='hero'
          className='hero-section'>
          <canvas id='hauntedHouse' className='haunted-house' aria-hidden='true'></canvas>
          <div 
            className={`hero-content ${heroContent.cWidth >= 900 ? 'desk': heroContent.cWidth <= 440 ? 'mob' : 'tab'}`} 
            style={{
              width: '100%',
              height: `calc(100vh - ${heroContent.cHeight}px)`
            }}>
            <h2>Welcome to the Haunting fest</h2>
            <p>Looking For Some Candy?</p>
          </div>
        </section>

        <section id='about' className={`about-section ${heroContent.cWidth >= 900 ? 'desk': heroContent.cWidth <= 440 ? 'mob' : 'tab'}`} aria-label='about'>
          <div className='about-discription'>
            <div className='about-content'>
              <div className='title'>About</div>
              <div className='discription'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur explicabo optio id! Perferendis ipsam obcaecati aperiam magnam commodi, repellendus tenetur esse nostrum sunt amet, impedit ipsa incidunt labore ad natus?</div>
              <div className='btn-container'>
                <button className='btnA gitbtn'>Check out technology used in GitHub</button>
              </div>
            </div>
          </div>
          <div className='about-image'>
            <img src={pumpkinMan} alt="pumpkin man" width={heroContent.cWidth / 2} height={heroContent.cWidth / 2}/>
          </div>
        </section>

        <section id='tech' className='tech-section'>
          <div className='tech-heading'>
            
            <table className='tech-table'>
              <thead>
                <tr>
                  <th>TECHNOLOGY</th>
                  <th>DESCRIPTION</th>
                </tr>
              </thead>
              <tbody>
                {techTable.map((d, i) => (
                  <tr key={i}>
                    <td>
                      <div className='content-topic'>
                        {d.tech}
                      </div>
                    </td>
                    <td>
                      <div className='_hh-dep'>
                        {d.description}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        
        <div style={{display: bugerClick ? 'block' : 'none'}}>
          <div className={`popup-menu ${bugerClick ? 'popin' : 'popout'}`}>
            <div 
              className='menu-scroll'
              style={{
                width: navWidth >= 440 ? '420px' : `${Math.max(240, navWidth - 20)}px`,
                height: window.innerHeight / 1.6
              }}>
              <img src={menuAsset} alt='menu'/>

              <div className='menu-option'>
                <ul>
                  {navData.map((data, index) => (
                    <li 
                      key={index} 
                      style={{
                        color: selectedNav === data.target ? 
                          'var(--pumpkin-color)' : ''
                      }}
                      onClick={() => {
                        setSelectedNav(data.target);
                        setBugerClick(false);
                        document.getElementById(data.target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                    >
                      {data.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>
      </main>
    </>
  )
}

export default App
