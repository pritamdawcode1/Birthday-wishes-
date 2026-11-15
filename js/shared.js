/**
 * SHARED ENGINE: WEB AUDIO SYNTHESIZER, MUSIC BOX, AMBIENT PARTICLES & CONFETTI
 */
class MagicalAudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.isMuted = false;
    this.volume = 0.45;
    this.musicTimer = null;
    this.noteIndex = 0;
    this.htmlAudio = null;

    // Gentle Happy Birthday Music Box Melody (Frequency in Hz, Duration in ms)
    this.melody = [
      [261.63, 380], [261.63, 220], [293.66, 600], [261.63, 600], [349.23, 600], [329.63, 1100],
      [261.63, 380], [261.63, 220], [293.66, 600], [261.63, 600], [392.00, 600], [349.23, 1100],
      [261.63, 380], [261.63, 220], [523.25, 600], [440.00, 600], [349.23, 500], [329.63, 500], [293.66, 1000],
      [466.16, 380], [466.16, 220], [440.00, 600], [349.23, 600], [392.00, 600], [349.23, 1200]
    ];

    const saved = ExperienceState.get().audio;
    if (saved) {
      this.isMuted = !!saved.muted;
      this.volume = typeof saved.volume === "number" ? saved.volume : 0.45;
    }
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  saveAudioState() {
    const state = ExperienceState.get();
    state.audio = { playing: this.isPlaying, muted: this.isMuted, volume: this.volume };
    ExperienceState.save(state);
  }

  startMusic() {
    this.ensureContext();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.saveAudioState();
    this.updateUI();

    if (BIRTHDAY_CONFIG.backgroundMusic) {
      if (!this.htmlAudio) {
        this.htmlAudio = new Audio(BIRTHDAY_CONFIG.backgroundMusic);
        this.htmlAudio.loop = true;
      }
      this.htmlAudio.volume = this.isMuted ? 0 : this.volume;
      this.htmlAudio.play().catch(() => {});
      return;
    }

    const playNextNote = () => {
      if (!this.isPlaying) return;
      const [freq, dur] = this.melody[this.noteIndex % this.melody.length];
      if (!this.isMuted && this.ctx) {
        this.playBellTone(freq, dur / 1000, this.volume * 0.25);
      }
      this.noteIndex++;
      this.musicTimer = setTimeout(playNextNote, dur + 80);
    };
    playNextNote();
  }

  stopMusic() {
    this.isPlaying = false;
    clearTimeout(this.musicTimer);
    if (this.htmlAudio) this.htmlAudio.pause();
    this.saveAudioState();
    this.updateUI();
  }

  togglePlay() {
    if (this.isPlaying) this.stopMusic();
    else this.startMusic();
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.htmlAudio) this.htmlAudio.volume = this.isMuted ? 0 : this.volume;
    this.saveAudioState();
    this.updateUI();
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, parseFloat(val)));
    if (this.htmlAudio) this.htmlAudio.volume = this.isMuted ? 0 : this.volume;
    this.saveAudioState();
  }

  playBellTone(freq, duration, gainLevel) {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.002, gainLevel), now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration + 0.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.45);
  }

  playClick() {
    this.ensureContext();
    this.playBellTone(680, 0.08, this.volume * 0.2);
  }

  playSparkle() {
    this.ensureContext();
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((f, idx) => {
      setTimeout(() => this.playBellTone(f, 0.25, this.volume * 0.22), idx * 65);
    });
  }

  playGiftOpen() {
    this.ensureContext();
    const chord = [392.0, 493.88, 587.33, 783.99, 987.77];
    chord.forEach((f, idx) => {
      setTimeout(() => this.playBellTone(f, 0.5, this.volume * 0.28), idx * 80);
    });
  }

  playBlowSound() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;
    const bufferSize = this.ctx.sampleRate * 0.7;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.25));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 420;

    const gain = this.ctx.createGain();
    gain.gain.value = this.volume * 0.5;

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start();
  }

  playSliceSound() {
    this.ensureContext();
    this.playBellTone(880, 0.12, this.volume * 0.2);
    setTimeout(() => this.playSparkle(), 140);
  }

  playCelebration() {
    this.ensureContext();
    const fanfare = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5];
    fanfare.forEach((f, idx) => {
      setTimeout(() => this.playBellTone(f, 0.35, this.volume * 0.3), idx * 110);
    });
  }

  updateUI() {
    const playBtn = document.getElementById("audio-play-btn");
    const muteBtn = document.getElementById("audio-mute-btn");
    const volSlider = document.getElementById("audio-volume-slider");
    if (playBtn) playBtn.textContent = this.isPlaying ? "Pause Music" : "Play Music";
    if (muteBtn) muteBtn.textContent = this.isMuted ? "Unmute" : "Mute";
    if (volSlider) volSlider.value = this.volume;
  }
}

window.BirthdayAudio = new MagicalAudioEngine();

/**
 * PASTEL CONFETTI & PARTICLE BURST ENGINE
 */
function launchPastelConfetti(count = 75) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const colors = ["#ffb6c1", "#ffd1dc", "#e0bbf9", "#bde0fe", "#ffdab9", "#fff3b0"];
  const container = document.createElement("div");
  container.className = "confetti-layer";
  document.body.appendChild(container);

  for (let i = 0; i < count; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    const size = Math.random() * 9 + 6;
    piece.style.width = `${size}px`;
    piece.style.height = `${size * (Math.random() > 0.5 ? 0.6 : 1)}px`;
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.borderRadius = Math.random() > 0.5 ? "50%" : "3px";
    piece.style.animationDuration = `${Math.random() * 2.2 + 1.8}s`;
    piece.style.animationDelay = `${Math.random() * 0.4}s`;
    container.appendChild(piece);
  }

  setTimeout(() => container.remove(), 4500);
}

/**
 * AMBIENT FLOATING FAIRYTALE BACKDROP (HEARTS, STARS, SPARKLES)
 */
function initAmbientBackdrop() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const layer = document.createElement("div");
  layer.className = "ambient-backdrop";
  layer.setAttribute("aria-hidden", "true");

  const shapes = [
    `<svg viewBox="0 0 24 24" fill="#ffb6c1"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`,
    `<svg viewBox="0 0 24 24" fill="#e0bbf9"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    `<svg viewBox="0 0 24 24" fill="#bde0fe"><path d="M12 1L14.5 9.5L23 12L14.5 14.5L12 23L9.5 14.5L1 12L9.5 9.5L12 1Z"/></svg>`
  ];

  for (let i = 0; i < 16; i++) {
    const item = document.createElement("div");
    item.className = "ambient-particle";
    item.innerHTML = shapes[i % shapes.length];
    item.style.left = `${Math.random() * 96}%`;
    item.style.top = `${Math.random() * 96}%`;
    const size = Math.random() * 14 + 12;
    item.style.width = `${size}px`;
    item.style.height = `${size}px`;
    item.style.animationDuration = `${Math.random() * 6 + 6}s`;
    item.style.animationDelay = `${Math.random() * 4}s`;
    layer.appendChild(item);
  }
  document.body.prepend(layer);
}

/**
 * INJECT PERSISTENT TOP HEADER WITH AUDIO & RESTART CONTROLS
 */
function initSharedChrome() {
  const currentFile = window.location.pathname.split("/").pop() || "index.html";
  const pageIdx = ExperienceState.pages.indexOf(currentFile);
  const prevPage = pageIdx > 0 ? ExperienceState.pages[pageIdx - 1] : null;

  const header = document.createElement("header");
  header.className = "storybook-header";
  header.innerHTML = `
    <div class="header-left">
      ${prevPage ? `<button class="pill-btn pill-btn-ghost" data-nav="${prevPage}" aria-label="Go Back">&larr; Back</button>` : `<span class="brand-badge">Storybook Edition</span>`}
    </div>
    <div class="progress-track" title="Storybook Progress">
      <div id="experience-progress-fill" class="progress-fill"></div>
    </div>
    <div class="header-right audio-controls">
      <button id="audio-play-btn" class="pill-btn pill-btn-soft" type="button">Play Music</button>
      <button id="audio-mute-btn" class="pill-btn pill-btn-ghost" type="button">Mute</button>
      <input id="audio-volume-slider" class="volume-slider" type="range" min="0" max="1" step="0.05" value="0.45" aria-label="Music Volume" />
    </div>
  `;
  document.body.prepend(header);

  const playBtn = document.getElementById("audio-play-btn");
  const muteBtn = document.getElementById("audio-mute-btn");
  const volSlider = document.getElementById("audio-volume-slider");

  playBtn.addEventListener("click", () => window.BirthdayAudio.togglePlay());
  muteBtn.addEventListener("click", () => window.BirthdayAudio.toggleMute());
  volSlider.addEventListener("input", (e) => window.BirthdayAudio.setVolume(e.target.value));

  // Resume music automatically if user had it active on previous page
  const savedAudio = ExperienceState.get().audio;
  if (savedAudio && savedAudio.playing) {
    const resumeOnGesture = () => {
      window.BirthdayAudio.startMusic();
      document.removeEventListener("pointerdown", resumeOnGesture);
    };
    window.BirthdayAudio.startMusic();
    document.addEventListener("pointerdown", resumeOnGesture, { once: true });
  }
  window.BirthdayAudio.updateUI();
}

document.addEventListener("DOMContentLoaded", () => {
  initAmbientBackdrop();
  initSharedChrome();
});
