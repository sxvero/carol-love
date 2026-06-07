
(function () {
  'use strict';
  const HEART_SVG = '<svg viewBox="0 0 24 24" width="30" height="30"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"/></svg>';
  const PLAY_SVG = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>';
  const PAUSE_SVG = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }
  function lerp(a, b, t) {
    return a + (b - a) * t;
  }
  function randomRange(min, max) {
    return Math.random() * (max - min) + min;
  }
  function getSectionProgress(el) {
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const winH = window.innerHeight;
    const raw = (winH - rect.top) / (rect.height + winH);
    return clamp(raw, 0, 1);
  }
  const loadingScreen = document.getElementById('loading-screen');
  const progressBar = document.getElementById('progress-bar');
  function initLoading() {
    let progress = 0;
    const interval = setInterval(() => {
      progress += randomRange(3, 8);
      if (progress > 100) progress = 100;
      if (progressBar) progressBar.style.width = progress + '%';
      if (progress >= 100) clearInterval(interval);
    }, 80);
    const minDelay = 2500;
    const start = Date.now();
    function finishLoading() {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, minDelay - elapsed);
      setTimeout(() => {
        if (progressBar) progressBar.style.width = '100%';
        setTimeout(() => {
          if (loadingScreen) {
            loadingScreen.classList.add('loading-done');
            setTimeout(() => {
              loadingScreen.style.display = 'none';
            }, 800);
          }
        }, 200);
      }, remaining);
    }
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(finishLoading);
    } else {
      setTimeout(finishLoading, minDelay);
    }
  }
  const particleCanvas = document.getElementById('particleCanvas');
  let pCtx = null;
  let particles = [];
  let birds = [];
  const MAX_PARTICLES = Math.min(150, Math.floor(window.innerWidth / 10));
  function resizeParticleCanvas() {
    if (!particleCanvas) return;
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
  }
  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = randomRange(0, window.innerWidth);
      this.isPetal = Math.random() < 0.6;
      if (this.isPetal) {
        this.y = randomRange(-50, -10);
        this.size = randomRange(4, 10);
        this.speedY = randomRange(0.3, 1.2);
        this.speedX = randomRange(-0.5, 0.5);
        this.rotation = randomRange(0, Math.PI * 2);
        this.rotationSpeed = randomRange(-0.02, 0.02);
        this.opacity = randomRange(0.3, 0.7);
        const colors = [
          'rgba(232,114,154,',
          'rgba(249,209,220,',
          'rgba(255,255,255,'
        ];
        this.colorBase = colors[Math.floor(Math.random() * colors.length)];
      } else {
        this.y = randomRange(0, window.innerHeight);
        this.size = randomRange(1, 3);
        this.speedY = randomRange(-0.2, -0.05);
        this.speedX = randomRange(-0.1, 0.1);
        this.opacity = randomRange(0.2, 0.8);
        this.twinkleSpeed = randomRange(0.01, 0.04);
        this.twinklePhase = randomRange(0, Math.PI * 2);
        this.colorBase = 'rgba(255,255,255,';
      }
    }
    update() {
      if (this.isPetal) {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.y * 0.01) * 0.3;
        this.rotation += this.rotationSpeed;
        if (this.y > window.innerHeight + 20) this.reset();
      } else {
        this.y += this.speedY;
        this.x += this.speedX;
        this.twinklePhase += this.twinkleSpeed;
        this.opacity = 0.2 + Math.abs(Math.sin(this.twinklePhase)) * 0.6;
        if (this.y < -10) {
          this.y = window.innerHeight + 10;
          this.x = randomRange(0, window.innerWidth);
        }
      }
    }
    draw(ctx) {
      ctx.save();
      if (this.isPetal) {
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size * 0.5, 0, 0, Math.PI * 2);
        ctx.fillStyle = this.colorBase + this.opacity + ')';
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.colorBase + this.opacity + ')';
        ctx.fill();
      }
      ctx.restore();
    }
  }
  class Bird {
    constructor(index) {
      this.x = randomRange(-100, -50);
      this.y = randomRange(50, window.innerHeight * 0.4);
      this.speedX = randomRange(1, 3);
      this.amplitude = randomRange(10, 20);
      this.frequency = randomRange(0.005, 0.02);
      this.wingPhase = randomRange(0, Math.PI * 2);
      this.wingSpeed = randomRange(0.08, 0.15);
      this.size = randomRange(8, 15);
      this.color = index % 2 === 0
        ? 'rgba(232,114,154,0.4)'
        : 'rgba(200,160,170,0.3)';
    }
    update() {
      this.x += this.speedX;
      this.y += Math.sin(this.x * this.frequency) * 0.5;
      this.wingPhase += this.wingSpeed;
      if (this.x > window.innerWidth + 100) {
        this.x = randomRange(-150, -50);
        this.y = randomRange(50, window.innerHeight * 0.4);
      }
    }
    draw(ctx) {
      const wingAngle = Math.sin(this.wingPhase) * 0.5;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(
        -this.size * 0.5, -this.size * (0.5 + wingAngle),
        -this.size, -this.size * (0.3 + wingAngle),
        -this.size * 1.2, -this.size * (0.1 + wingAngle * 0.5)
      );
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(
        this.size * 0.5, -this.size * (0.5 + wingAngle),
        this.size, -this.size * (0.3 + wingAngle),
        this.size * 1.2, -this.size * (0.1 + wingAngle * 0.5)
      );
      ctx.stroke();
      ctx.restore();
    }
  }
  function initParticles() {
    if (!particleCanvas) return;
    pCtx = particleCanvas.getContext('2d');
    resizeParticleCanvas();
    particles = [];
    for (let i = 0; i < MAX_PARTICLES; i++) {
      const p = new Particle();
      p.y = randomRange(0, window.innerHeight);
      particles.push(p);
    }
    birds = [];
    for (let i = 0; i < 4; i++) {
      birds.push(new Bird(i));
    }
    animateParticles();
  }
  function animateParticles() {
    if (!pCtx) return;
    pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw(pCtx);
    }
    for (let i = 0; i < birds.length; i++) {
      birds[i].update();
      birds[i].draw(pCtx);
    }
    requestAnimationFrame(animateParticles);
  }
  const tracks = [
    { id: 'audio-circles', color: '#A78BFA', title: 'Circles', msg: 'Hay pensamientos que vuelven en c\u00edrculos... y todos me llevan a ti.' },
    { id: 'audio-te-quiero', color: '#E8729A', title: 'Te Quiero', msg: 'No necesito grandes palabras. Solo saber que est\u00e1s ah\u00ed ya es suficiente.' },
    { id: 'audio-todo-cambio', color: '#F9D1DC', title: 'Todo Cambi\u00f3', msg: 'Algo cambi\u00f3 en m\u00ed desde que llegaste. Como si el mundo se hubiera acomodado.' },
    { id: 'audio-travis', color: '#D4A373', title: 'Goosebumps', msg: 'Hay personas que no se explican. Solo se sienten. Y t\u00fa eres exactamente eso.' }
  ];
  const finalVinylMsg = 'No s\u00e9 si esto es solo m\u00fasica... pero cada canci\u00f3n guarda un pedacito de lo que siento.';
  let currentTrack = 0;
  let isPlaying = false;
  const vinylController = document.getElementById('vinyl-controller');
  const vinylRecord = document.getElementById('vinyl-record');
  const vinylPlayBtn = document.getElementById('vinyl-play-btn');
  const vinylNextBtn = document.getElementById('vinyl-next-btn');
  const vinylLabel = document.getElementById('vinyl-label');
  const vinylArm = document.getElementById('vinyl-arm');
  const musicOverlay = document.getElementById('music-overlay');
  const musicOverlayTitle = document.getElementById('music-overlay-title');
  const musicOverlayMsg = document.getElementById('music-overlay-msg');
  const musicOverlayClose = document.getElementById('music-overlay-close');
  let overlayTimeout = null;
  function getPlayerBox() {
    if (!vinylRecord) return null;
    return vinylRecord.closest('.vinyl-player-box');
  }
  function showMusicOverlay(title, msg, duration) {
    if (typeof duration === 'undefined') duration = 6000;
    if (!musicOverlay) return;
    if (musicOverlayTitle) musicOverlayTitle.innerHTML = title;
    if (musicOverlayMsg) musicOverlayMsg.innerHTML = msg;
    musicOverlay.classList.add('show');
    if (overlayTimeout) clearTimeout(overlayTimeout);
    overlayTimeout = setTimeout(() => {
      musicOverlay.classList.remove('show');
    }, duration);
  }
  function pauseAllTracks() {
    tracks.forEach(t => {
      const audio = document.getElementById(t.id);
      if (audio) {
        audio.pause();
      }
    });
  }
  function playCurrentTrack() {
    pauseAllTracks();
    const track = tracks[currentTrack];
    const audio = document.getElementById(track.id);
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
    isPlaying = true;
    if (vinylRecord) vinylRecord.classList.add('playing');
    const box = getPlayerBox();
    if (box) box.classList.add('is-playing');
    if (vinylPlayBtn) vinylPlayBtn.innerHTML = PAUSE_SVG;
    if (vinylLabel) vinylLabel.style.background = track.color;
    showMusicOverlay(track.title, track.msg);
  }
  function togglePlay() {
    if (isPlaying) {
      const track = tracks[currentTrack];
      const audio = document.getElementById(track.id);
      if (audio) audio.pause();
      isPlaying = false;
      if (vinylRecord) vinylRecord.classList.remove('playing');
      const box = getPlayerBox();
      if (box) box.classList.remove('is-playing');
      if (vinylPlayBtn) vinylPlayBtn.innerHTML = PLAY_SVG;
    } else {
      playCurrentTrack();
    }
  }
  function nextTrack() {
    const wasPlaying = isPlaying;
    if (currentTrack >= tracks.length - 1) {
      pauseAllTracks();
      isPlaying = false;
      if (vinylRecord) vinylRecord.classList.remove('playing');
      const box = getPlayerBox();
      if (box) box.classList.remove('is-playing');
      if (vinylPlayBtn) vinylPlayBtn.innerHTML = PLAY_SVG;
      showMusicOverlay('Fin', finalVinylMsg, 8000);
      currentTrack = 0;
      return;
    }
    currentTrack++;
    if (wasPlaying) {
      playCurrentTrack();
    }
  }
  function initVinyl() {
    if (vinylPlayBtn) {
      vinylPlayBtn.innerHTML = PLAY_SVG;
      vinylPlayBtn.addEventListener('click', togglePlay);
    }
    if (vinylNextBtn) {
      vinylNextBtn.addEventListener('click', nextTrack);
    }
    if (musicOverlayClose) {
      musicOverlayClose.addEventListener('click', () => {
        if (musicOverlay) musicOverlay.classList.remove('show');
        if (overlayTimeout) clearTimeout(overlayTimeout);
      });
    }
    tracks.forEach((t, i) => {
      const audio = document.getElementById(t.id);
      if (audio) {
        audio.addEventListener('ended', () => {
          nextTrack();
        });
      }
    });
  }
  const introScreen = document.getElementById('intro-screen');
  const startBtn = document.getElementById('start-btn');
  const scrollHint = document.getElementById('scroll-hint');
  const mainContent = document.getElementById('main-content');
  const curtainContainer = document.getElementById('curtain-container');
  function initIntro() {
    if (!startBtn) return;
    startBtn.addEventListener('click', () => {
      if (vinylController) vinylController.classList.add('visible');
      togglePlay();
      startBtn.style.opacity = '0';
      startBtn.style.pointerEvents = 'none';
      if (scrollHint) {
        scrollHint.style.opacity = '1';
        scrollHint.style.visibility = 'visible';
      }
      if (curtainContainer) curtainContainer.style.display = 'block';
      if (mainContent) {
        mainContent.style.display = 'block';
        mainContent.style.opacity = '1';
        resizeThreadCanvas();
      }
      if (introScreen) {
        introScreen.style.opacity = '0';
        introScreen.style.pointerEvents = 'none';
        setTimeout(() => {
          introScreen.style.display = 'none';
        }, 1000);
      }
    });
  }
  const curtainLeft = document.getElementById('curtain-left');
  const curtainRight = document.getElementById('curtain-right');
  const scrollyCurtain = document.getElementById('scrolly-curtain');
  function updateCurtains() {
    if (!scrollyCurtain || !curtainLeft || !curtainRight) return;
    const progress = getSectionProgress(scrollyCurtain);
    const movePercent = clamp(progress * 100, 0, 100);
    curtainLeft.style.transform = 'translateX(-' + movePercent + '%)';
    curtainRight.style.transform = 'translateX(' + movePercent + '%)';
  }
  const secThread = document.getElementById('sec-thread');
  const threadCanvas = document.getElementById('threadCanvas');
  const threadTitle = document.getElementById('thread-title');
  const knotReveal = document.getElementById('knot-reveal');
  let tCtx = null;
  const knotMessages = [
    'Nuestro primer saludo',
    'La primera vez que nos quedamos hablando hasta tarde',
    'Esa risa que no se me olvida',
    'El momento en que supe que eras especial'
  ];
  function resizeThreadCanvas() {
    if (!threadCanvas || !secThread) return;
    const stickyView = threadCanvas.parentElement;
    threadCanvas.width = stickyView.clientWidth;
    threadCanvas.height = stickyView.clientHeight;
  }
  function drawThread(progress) {
    if (!tCtx || !threadCanvas) return;
    const w = threadCanvas.width;
    const h = threadCanvas.height;
    tCtx.clearRect(0, 0, w, h);
    tCtx.beginPath();
    tCtx.strokeStyle = '#E8729A';
    tCtx.lineWidth = 4;
    tCtx.lineCap = 'round';
    const totalLength = 3000;
    const dashLen = totalLength * progress * 1.5;
    tCtx.setLineDash([dashLen, totalLength]);
    tCtx.lineDashOffset = 0;
    const startX = w * 0.5;
    const startY = h * 0.05;
    const endX = w * 0.5;
    const endY = h * 0.95;
    tCtx.moveTo(startX, startY);
    tCtx.bezierCurveTo(w * 0.5, h * 0.15, w * 0.15, h * 0.15, w * 0.15, h * 0.25);
    tCtx.bezierCurveTo(w * 0.15, h * 0.35, w * 0.7, h * 0.3, w * 0.7, h * 0.4);
    tCtx.bezierCurveTo(w * 0.7, h * 0.5, w * 0.3, h * 0.5, w * 0.3, h * 0.6);
    tCtx.bezierCurveTo(w * 0.3, h * 0.7, w * 0.65, h * 0.7, w * 0.65, h * 0.78);
    tCtx.bezierCurveTo(w * 0.65, h * 0.85, w * 0.5, h * 0.85, endX, endY);
    tCtx.stroke();
    tCtx.setLineDash([]);
  }
  function updateThread() {
    if (!secThread) return;
    const progress = getSectionProgress(secThread);
    drawThread(progress);
    if (threadTitle) {
      threadTitle.style.opacity = progress > 0.05 ? '1' : '0';
    }
    const knots = document.querySelectorAll('.knot');
    const thresholds = [0.2, 0.4, 0.6, 0.8];
    knots.forEach((knot, i) => {
      if (i < thresholds.length && progress >= thresholds[i]) {
        knot.style.opacity = '1';
        knot.style.transform = 'scale(1)';
      } else {
        knot.style.opacity = '0';
        knot.style.transform = 'scale(0.5)';
      }
    });
  }
  function initThread() {
    if (!threadCanvas) return;
    tCtx = threadCanvas.getContext('2d');
    resizeThreadCanvas();
    const knots = document.querySelectorAll('.knot');
    knots.forEach((knot, i) => {
      knot.style.cursor = 'pointer';
      knot.addEventListener('click', () => {
        if (knot.classList.contains('opened')) return;
        knot.classList.add('opened');
        if (knotReveal && i < knotMessages.length) {
          knotReveal.textContent = knotMessages[i];
          knotReveal.style.opacity = '1';
          knotReveal.style.visibility = 'visible';
          setTimeout(() => {
            knotReveal.style.opacity = '0';
            setTimeout(() => {
              knotReveal.style.visibility = 'hidden';
            }, 500);
          }, 3000);
        }
      });
    });
  }
  const secBubbles = document.getElementById('sec-bubbles');
  const bubbleContainer = document.getElementById('bubble-container');
  let bubblesCreated = false;
  const bubbleMessages = [
    'Tu sonrisa', 'Tus ojos', 'Tu voz', 'Tu risa', 'Tu calma',
    'Tu manera de ser', 'Ese gesto que haces', 'Todo de ti',
    'Tu paciencia', 'Tu mirada'
  ];
  function createBubbleParticleBurst(x, y) {
    for (let i = 0; i < 6; i++) {
      const dot = document.createElement('div');
      dot.classList.add('cursor-trail');
      dot.style.position = 'absolute';
      dot.style.left = x + 'px';
      dot.style.top = y + 'px';
      dot.style.width = '6px';
      dot.style.height = '6px';
      dot.style.borderRadius = '50%';
      dot.style.background = '#E8729A';
      dot.style.pointerEvents = 'none';
      const angle = (Math.PI * 2 / 6) * i;
      const dist = randomRange(30, 60);
      dot.style.transition = 'all 0.6s ease-out';
      if (bubbleContainer) bubbleContainer.appendChild(dot);
      requestAnimationFrame(() => {
        dot.style.transform = 'translate(' + (Math.cos(angle) * dist) + 'px, ' + (Math.sin(angle) * dist) + 'px)';
        dot.style.opacity = '0';
      });
      setTimeout(() => {
        if (dot.parentNode) dot.parentNode.removeChild(dot);
      }, 800);
    }
  }
  function createBubbles() {
    if (bubblesCreated || !bubbleContainer) return;
    bubblesCreated = true;
    for (let i = 0; i < 10; i++) {
      const bubble = document.createElement('div');
      bubble.classList.add('bubble');
      const size = randomRange(60, 120);
      bubble.style.width = size + 'px';
      bubble.style.height = size + 'px';
      bubble.style.left = randomRange(5, 85) + '%';
      bubble.style.top = randomRange(10, 80) + '%';
      bubble.style.animationDelay = (i * 0.2) + 's';
      const msg = bubbleMessages[i];
      const handlePop = (e) => {
        e.stopPropagation();
        if (bubble.classList.contains('popped')) return;
        bubble.classList.add('popped');
        bubble.textContent = msg;
        const rect = bubble.getBoundingClientRect();
        const containerRect = bubbleContainer.getBoundingClientRect();
        createBubbleParticleBurst(
          rect.left - containerRect.left + rect.width / 2,
          rect.top - containerRect.top + rect.height / 2
        );
      };
      bubble.addEventListener('click', handlePop);
      bubble.addEventListener('touchstart', (e) => {
        e.preventDefault();
        handlePop(e);
      }, { passive: false });
      bubbleContainer.appendChild(bubble);
    }
  }
  function initScratchCards() {
    const scratchCanvases = document.querySelectorAll('.scratch-canvas');
    scratchCanvases.forEach(canvas => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      canvas.width = rect.width || 280;
      canvas.height = rect.height || 180;
      const ctx = canvas.getContext('2d');
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, '#E8729A');
      grad.addColorStop(0.5, '#F9D1DC');
      grad.addColorStop(1, '#D4A373');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = '22px "Dancing Script", cursive';
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Desliza aqu\u00ed', canvas.width / 2, canvas.height / 2);
      let isDrawing = false;
      function erase(x, y) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
      }
      function getPos(e) {
        const cRect = canvas.getBoundingClientRect();
        if (e.touches && e.touches.length > 0) {
          return {
            x: e.touches[0].clientX - cRect.left,
            y: e.touches[0].clientY - cRect.top
          };
        }
        return {
          x: e.clientX - cRect.left,
          y: e.clientY - cRect.top
        };
      }
      canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        const pos = getPos(e);
        erase(pos.x, pos.y);
      });
      canvas.addEventListener('mousemove', (e) => {
        if (!isDrawing) return;
        const pos = getPos(e);
        erase(pos.x, pos.y);
      });
      canvas.addEventListener('mouseup', () => { isDrawing = false; });
      canvas.addEventListener('mouseleave', () => { isDrawing = false; });
      canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        isDrawing = true;
        const pos = getPos(e);
        erase(pos.x, pos.y);
      }, { passive: false });
      canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (!isDrawing) return;
        const pos = getPos(e);
        erase(pos.x, pos.y);
      }, { passive: false });
      canvas.addEventListener('touchend', () => { isDrawing = false; });
    });
  }
  const secHearts = document.getElementById('sec-hearts');
  const heartsArena = document.getElementById('hearts-arena');
  const heartsScore = document.getElementById('hearts-score');
  const heartsReward = document.getElementById('hearts-reward');
  let heartsCaught = 0;
  let heartsInterval = null;
  let heartsActive = false;
  let heartsCompleted = false;
  function spawnHeart() {
    if (!heartsArena || heartsCompleted) return;
    const heart = document.createElement('div');
    heart.classList.add('flying-heart');
    heart.innerHTML = HEART_SVG;
    heart.style.color = '#E8729A';
    heart.style.position = 'absolute';
    heart.style.top = randomRange(15, 85) + '%';
    heart.style.left = '-50px';
    heart.style.animation = 'flyHeart ' + (randomRange(3, 5)).toFixed(1) + 's linear forwards';
    heart.style.cursor = 'pointer';
    const handleCatch = (e) => {
      e.stopPropagation();
      if (heart.classList.contains('caught')) return;
      heart.classList.add('caught');
      heartsCaught++;
      if (heartsScore) heartsScore.textContent = heartsCaught + ' / 5';
      if (heartsCaught >= 5) {
        heartsCompleted = true;
        if (heartsInterval) {
          clearInterval(heartsInterval);
          heartsInterval = null;
        }
        if (heartsReward) heartsReward.classList.add('show');
      }
    };
    heart.addEventListener('click', handleCatch);
    heart.addEventListener('touchstart', (e) => {
      e.preventDefault();
      handleCatch(e);
    }, { passive: false });
    heartsArena.appendChild(heart);
    setTimeout(() => {
      if (heart.parentNode && !heart.classList.contains('caught')) {
        heart.parentNode.removeChild(heart);
      }
    }, 6000);
  }
  function activateHearts() {
    if (heartsActive || heartsCompleted) return;
    heartsActive = true;
    heartsInterval = setInterval(spawnHeart, 1200);
  }
  function deactivateHearts() {
    if (!heartsActive) return;
    heartsActive = false;
    if (heartsInterval) {
      clearInterval(heartsInterval);
      heartsInterval = null;
    }
  }
  const typewriterText = document.getElementById('typewriter-text');
  const tapKey = document.getElementById('tap-key');
  const poem = 'A veces el mundo gira demasiado r\u00e1pido, pero cuando estoy contigo, todo se detiene.\n\nMe gusta todo de ti. Tu forma de mirar cuando algo te importa, esa manera en que te molestas y haces ese gesto que solo t\u00fa sabes hacer.\n\nIncluso cuando todo se complica, t\u00fa eres lo que tiene sentido.\n\nNo necesito palabras enormes. Solo necesito que sepas que eres todo, absolutamente todo para m\u00ed.';
  let typewriterIndex = 0;
  function typewriterAdd() {
    if (!typewriterText) return;
    if (typewriterIndex >= poem.length) return;
    const charsToAdd = Math.min(3, poem.length - typewriterIndex);
    typewriterIndex += charsToAdd;
    typewriterText.textContent = poem.substring(0, typewriterIndex);
  }
  function initTypewriter() {
    if (!tapKey) return;
    tapKey.addEventListener('click', typewriterAdd);
    tapKey.addEventListener('touchstart', (e) => {
      e.preventDefault();
      typewriterAdd();
    }, { passive: false });
  }
  const secTelephone = document.getElementById('sec-telephone');
  const cupLeft = document.getElementById('cup-left');
  const phoneString = document.getElementById('phone-string');
  const stringWave = document.getElementById('string-wave');
  const phoneMessage = document.getElementById('phone-message');
  let telephoneUsed = false;
  function initTelephone() {
    if (!cupLeft) return;
    const handleTap = (e) => {
      e.stopPropagation();
      if (telephoneUsed) return;
      telephoneUsed = true;
      cupLeft.classList.add('tapped');
      setTimeout(() => {
        cupLeft.classList.remove('tapped');
      }, 200);
      if (stringWave) stringWave.classList.add('active');
      setTimeout(() => {
        if (phoneMessage) phoneMessage.classList.add('show');
      }, 1500);
    };
    cupLeft.addEventListener('click', handleTap);
    cupLeft.addEventListener('touchstart', (e) => {
      e.preventDefault();
      handleTap(e);
    }, { passive: false });
  }
  const secStations = document.getElementById('sec-stations');
  const stationLine = document.getElementById('station-line');
  function updateStations() {
    if (!secStations || !stationLine) return;
    const progress = getSectionProgress(secStations);
    stationLine.style.height = (progress * 100) + '%';
  }
  function initStations() {
    const gifts = document.querySelectorAll('.station-gift');
    gifts.forEach(gift => {
      gift.addEventListener('click', () => {
        gift.classList.add('opened');
      });
      gift.addEventListener('touchstart', (e) => {
        e.preventDefault();
        gift.classList.add('opened');
      }, { passive: false });
    });
  }
  const treeContainer = document.getElementById('tree-container');
  const treeSvg = document.getElementById('tree-svg');
  const treeLeaves = document.getElementById('tree-leaves');
  const treeHoldRing = document.getElementById('tree-hold-ring');
  const treeFinalMsg = document.getElementById('tree-final-msg');
  const treeBranches = document.querySelectorAll('.tree-branch');
  let treeProgress = 0;
  let treeHolding = false;
  let treeInterval = null;
  let treeElementsCreated = false;
  let treeComplete = false;
  const leafColors = ['#E8729A', '#F9D1DC', '#FFC0CB', '#FBADC4', '#DDA0DD', '#98FB98', '#90EE90'];
  function createTreeElements() {
    if (treeElementsCreated || !treeLeaves) return;
    treeElementsCreated = true;
    for (let i = 0; i < 40; i++) {
      const leaf = document.createElement('div');
      leaf.classList.add('tree-leaf');
      leaf.style.left = randomRange(10, 90) + '%';
      leaf.style.top = randomRange(5, 70) + '%';
      leaf.style.background = leafColors[Math.floor(Math.random() * leafColors.length)];
      leaf.dataset.threshold = randomRange(0.1, 0.9).toFixed(2);
      treeLeaves.appendChild(leaf);
    }
    for (let i = 0; i < 12; i++) {
      const flower = document.createElement('div');
      flower.classList.add('tree-flower-css');
      flower.style.left = randomRange(15, 85) + '%';
      flower.style.top = randomRange(10, 65) + '%';
      flower.dataset.threshold = randomRange(0.1, 0.9).toFixed(2);
      treeLeaves.appendChild(flower);
    }
  }
  function updateTreeVisuals() {
    treeBranches.forEach(branch => {
      const totalLen = branch.getTotalLength ? branch.getTotalLength() : 200;
      branch.style.strokeDasharray = totalLen;
      branch.style.strokeDashoffset = totalLen * (1 - treeProgress);
    });
    if (!treeLeaves) return;
    const items = treeLeaves.children;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const threshold = parseFloat(item.dataset.threshold || '1');
      if (treeProgress >= threshold) {
        item.classList.add('bloom');
      }
    }
    if (treeProgress >= 1 && !treeComplete) {
      treeComplete = true;
      if (treeFinalMsg) treeFinalMsg.classList.add('show');
      if (treeHoldRing) treeHoldRing.style.display = 'none';
    }
  }
  function initTree() {
    if (!treeHoldRing) return;
    function startHold(e) {
      if (e.type === 'touchstart') e.preventDefault();
      if (treeComplete) return;
      treeHolding = true;
      createTreeElements();
      if (treeInterval) clearInterval(treeInterval);
      treeInterval = setInterval(() => {
        if (!treeHolding || treeComplete) {
          clearInterval(treeInterval);
          treeInterval = null;
          return;
        }
        treeProgress = Math.min(1, treeProgress + 0.015);
        if (treeHoldRing) {
          treeHoldRing.style.background = 'conic-gradient(#E8729A ' + (treeProgress * 360) + 'deg, rgba(232,114,154,0.2) 0deg)';
        }
        updateTreeVisuals();
      }, 50);
    }
    function stopHold() {
      treeHolding = false;
      if (treeInterval) {
        clearInterval(treeInterval);
        treeInterval = null;
      }
    }
    treeHoldRing.addEventListener('mousedown', startHold);
    treeHoldRing.addEventListener('touchstart', startHold, { passive: false });
    treeHoldRing.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
    });
    document.addEventListener('mouseup', stopHold);
    document.addEventListener('touchend', stopHold);
    document.addEventListener('touchcancel', stopHold);
  }
  const secStars = document.getElementById('sec-stars');
  const starsSky = document.getElementById('stars-sky');
  const shootingStar = document.getElementById('shooting-star');
  const starsMessage = document.getElementById('stars-message');
  let starsCreated = false;
  let shootingStarCaught = false;
  function createCSSStars() {
    if (starsCreated || !starsSky) return;
    starsCreated = true;
    for (let i = 0; i < 40; i++) {
      const star = document.createElement('div');
      star.classList.add('css-star');
      star.style.position = 'absolute';
      star.style.left = randomRange(0, 100) + '%';
      star.style.top = randomRange(0, 100) + '%';
      const size = randomRange(1, 3);
      star.style.width = size + 'px';
      star.style.height = size + 'px';
      star.style.borderRadius = '50%';
      star.style.background = '#FFFFFF';
      star.style.opacity = randomRange(0.3, 1).toFixed(2);
      star.style.animationDelay = randomRange(0, 3).toFixed(1) + 's';
      starsSky.appendChild(star);
    }
  }
  function activateStars() {
    createCSSStars();
    if (shootingStar && !shootingStarCaught) {
      shootingStar.classList.add('active');
    }
  }
  function initStars() {
    if (!shootingStar) return;
    const handleCatch = (e) => {
      e.stopPropagation();
      if (shootingStarCaught) return;
      shootingStarCaught = true;
      shootingStar.classList.add('caught');
      if (starsMessage) starsMessage.classList.add('show');
    };
    shootingStar.addEventListener('click', handleCatch);
    shootingStar.addEventListener('touchstart', (e) => {
      e.preventDefault();
      handleCatch(e);
    }, { passive: false });
  }
  const secSwing = document.getElementById('sec-swing');
  const swingSeatWrapper = document.getElementById('swing-seat-wrapper');
  const swingWords = document.getElementById('swing-words');
  const swingPushBtn = document.getElementById('swing-push-btn');
  const swingWordsList = ['Contigo', 'cada', 'd\u00eda', 'es', 'mejor'];
  let swingCount = 0;
  function initSwing() {
    if (!swingPushBtn) return;
    swingPushBtn.addEventListener('click', () => {
      if (swingCount >= 5) return;
      if (swingSeatWrapper) {
        swingSeatWrapper.classList.add('swinging');
        setTimeout(() => {
          swingSeatWrapper.classList.remove('swinging');
        }, 1000);
      }
      if (swingWords && swingCount < swingWordsList.length) {
        const span = document.createElement('span');
        span.classList.add('swing-word');
        span.textContent = swingWordsList[swingCount];
        swingWords.appendChild(span);
        setTimeout(() => {
          span.classList.add('show');
        }, 100);
      }
      swingCount++;
      if (swingCount >= 5) {
        swingPushBtn.textContent = 'Listo';
        swingPushBtn.disabled = true;
        swingPushBtn.style.opacity = '0.5';
      }
    });
  }
  const secBottle = document.getElementById('sec-bottle');
  const bottle = document.getElementById('bottle');
  const parchment = document.getElementById('parchment');
  let bottleOpened = false;
  function initBottle() {
    if (!bottle) return;
    const handleOpen = (e) => {
      e.stopPropagation();
      if (bottleOpened) return;
      bottleOpened = true;
      bottle.classList.add('opened');
      setTimeout(() => {
        if (parchment) parchment.classList.add('show');
      }, 1000);
    };
    bottle.addEventListener('click', handleOpen);
    bottle.addEventListener('touchstart', (e) => {
      e.preventDefault();
      handleOpen(e);
    }, { passive: false });
  }
  const secGarden = document.getElementById('sec-garden');
  const gardenGround = document.getElementById('garden-ground');
  const gardenTitle = document.getElementById('garden-title');
  const gardenFinalMsg = document.getElementById('garden-final-msg');
  function updateGarden() {
    if (!secGarden) return;
    const progress = getSectionProgress(secGarden);
    const stems = document.querySelectorAll('.garden-stem');
    stems.forEach(stem => {
      const threshold = parseFloat(stem.dataset.threshold || '0.5');
      if (progress >= threshold) {
        stem.classList.add('grow');
      }
    });
    const butterflies = document.querySelectorAll('.garden-butterfly');
    butterflies.forEach(bf => {
      const threshold = parseFloat(bf.dataset.threshold || '0.5');
      if (progress >= threshold) {
        bf.classList.add('show');
      }
    });
    if (progress >= 0.9 && gardenFinalMsg) {
      gardenFinalMsg.classList.add('show');
    }
  }
  function initGarden() {
    if (!gardenGround) return;
    gardenGround.innerHTML = ''; // clear initial html
    const numFlowers = 40;
    const flowerTypes = ['flower-pink', 'flower-white', 'flower-rose'];
    for (let i = 0; i < numFlowers; i++) {
      const stem = document.createElement('div');
      stem.className = 'garden-stem';
      const left = randomRange(2, 98);
      const bottom = randomRange(0, 30); // 0 to 30% from bottom of ground
      const zIndex = Math.floor(100 - bottom);
      const scale = lerp(1.2, 0.5, bottom / 30); // closer (bottom=0) -> larger
      stem.style.left = left + '%';
      stem.style.bottom = bottom + '%';
      stem.style.zIndex = zIndex;
      stem.style.transform = `scale(${scale})`;
      stem.dataset.threshold = (0.1 + Math.random() * 0.7).toFixed(2);
      const h = Math.floor(randomRange(50, 150));
      stem.style.setProperty('--target-height', h + 'px');
      const flowerHead = document.createElement('div');
      const fType = flowerTypes[Math.floor(Math.random() * flowerTypes.length)];
      flowerHead.className = 'garden-flower-css ' + fType;
      stem.appendChild(flowerHead);
      gardenGround.appendChild(stem);
    }
    for (let i = 1; i <= 2; i++) {
      const bf = document.createElement('div');
      bf.className = 'garden-butterfly';
      bf.id = 'butterfly-' + i;
      bf.dataset.threshold = i === 1 ? '0.4' : '0.7';
      gardenGround.appendChild(bf);
    }
  }
  const secPolaroid = document.getElementById('sec-polaroid');
  const polaroidCamera = document.getElementById('polaroid-camera');
  const cameraBtn = document.getElementById('camera-btn');
  const polaroidFrame = document.getElementById('polaroid-frame');
  const polaroidPhoto = document.getElementById('polaroid-photo');
  let polaroidTaken = false;
  function initPolaroid() {
    if (!cameraBtn) return;
    cameraBtn.addEventListener('click', () => {
      if (polaroidTaken) return;
      polaroidTaken = true;
      const cameraBody = document.querySelector('.camera-body-css');
      if (cameraBody) {
        cameraBody.classList.add('flash');
        setTimeout(() => {
          cameraBody.classList.remove('flash');
        }, 500);
      }
      setTimeout(() => {
        if (polaroidFrame) polaroidFrame.classList.add('show');
      }, 800);
      setTimeout(() => {
        if (polaroidPhoto) polaroidPhoto.classList.add('developing');
      }, 1500);
    });
  }
  function handleScroll() {
    const scrollTop = window.scrollY || window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const totalProgress = docHeight > 0 ? clamp(scrollTop / docHeight, 0, 1) : 0;
    if (progressBar) {
      progressBar.style.width = (totalProgress * 100) + '%';
    }
    updateCurtains();
    updateThread();
    if (secBubbles) {
      const bProgress = getSectionProgress(secBubbles);
      if (bProgress > 0.1 && bProgress < 0.95) {
        createBubbles();
      }
    }
    if (secHearts) {
      const hProgress = getSectionProgress(secHearts);
      if (hProgress > 0.15 && hProgress < 0.85) {
        activateHearts();
      } else {
        deactivateHearts();
      }
    }
    if (secStars) {
      const sProgress = getSectionProgress(secStars);
      if (sProgress > 0.1 && sProgress < 0.9) {
        activateStars();
      }
    }
    updateStations();
    updateGarden();
    const body = document.body;
    if (totalProgress < 0.4) {
      body.style.backgroundColor = '#FFF0F5';
    } else if (totalProgress < 0.7) {
      const t = (totalProgress - 0.4) / 0.3;
      const r = Math.round(lerp(255, 45, t));
      const g = Math.round(lerp(240, 30, t));
      const b = Math.round(lerp(245, 60, t));
      body.style.backgroundColor = 'rgb(' + r + ',' + g + ',' + b + ')';
    } else {
      const t = (totalProgress - 0.7) / 0.3;
      const r = Math.round(lerp(45, 15, t));
      const g = Math.round(lerp(30, 10, t));
      const b = Math.round(lerp(60, 35, t));
      body.style.backgroundColor = 'rgb(' + r + ',' + g + ',' + b + ')';
    }
    if (totalProgress > 0.6) {
      body.style.color = '#FFFFFF';
      document.querySelectorAll('h2, h3, p, span:not(.swing-word)').forEach(el => {
        el.style.color = '#FFFFFF';
      });
    } else if (totalProgress <= 0.6) {
      body.style.color = '';
      document.querySelectorAll('h2, h3, p, span:not(.swing-word)').forEach(el => {
        el.style.color = '';
      });
    }
  }
  function initCursorTrail() {
    document.addEventListener('mousemove', (e) => {
      if (Math.random() > 0.5) return;
      const trail = document.createElement('div');
      trail.classList.add('cursor-trail');
      trail.style.left = e.clientX + 'px';
      trail.style.top = e.clientY + 'px';
      document.body.appendChild(trail);
      setTimeout(() => {
        if (trail.parentNode) trail.parentNode.removeChild(trail);
      }, 800);
    });
  }
  function initRipple() {
    document.addEventListener('click', (e) => {
      const tag = e.target.tagName.toLowerCase();
      if (tag === 'button' || tag === 'a' || tag === 'canvas' ||
          e.target.closest('button') || e.target.closest('.knot') ||
          e.target.closest('.bubble') || e.target.closest('.flying-heart') ||
          e.target.closest('.station-gift') || e.target.closest('#vinyl-controller') ||
          e.target.closest('#bottle') || e.target.closest('#camera-btn') ||
          e.target.closest('#swing-push-btn') || e.target.closest('#cup-left') ||
          e.target.closest('#tree-hold-ring') || e.target.closest('#shooting-star') ||
          e.target.closest('#music-overlay')) return;
      const ripple = document.createElement('div');
      ripple.classList.add('ripple');
      ripple.style.left = e.clientX + 'px';
      ripple.style.top = e.clientY + 'px';
      document.body.appendChild(ripple);
      setTimeout(() => {
        if (ripple.parentNode) ripple.parentNode.removeChild(ripple);
      }, 1000);
    });
  }
  document.addEventListener('DOMContentLoaded', () => {
    initLoading();
    initParticles();
    initVinyl();
    initIntro();
    initThread();
    initScratchCards();
    initTypewriter();
    initTelephone();
    initStations();
    initTree();
    initStars();
    initSwing();
    initBottle();
    initPolaroid();
    initCursorTrail();
    initRipple();
    initGarden();
    let scrollTicking = false;
    window.addEventListener('scroll', () => {
      if (!scrollTicking) {
        requestAnimationFrame(() => {
          handleScroll();
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    }, { passive: true });
    window.addEventListener('resize', () => {
      resizeParticleCanvas();
      resizeThreadCanvas();
    });
    handleScroll();
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    };
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
        }
      });
    }, observerOptions);
    const revealElements = document.querySelectorAll('.section-title, .typewriter-paper, .scratch-card, .camera-body-css, .swing-frame');
    revealElements.forEach(el => {
      el.classList.add('reveal-on-scroll');
      observer.observe(el);
    });
  });
})();
