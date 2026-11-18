/**
 * MULTI-PAGE NAVIGATION, PROGRESS TRACKING & ROUTE GUARD
 */
const ExperienceState = {
  STORAGE_KEY: "ultimate_birthday_experience_v1",

  pages: [
    "index.html",
    "welcome.html",
    "gift.html",
    "preparation.html",
    "celebration.html",
    "candles.html",
    "cake-cutting.html",
    "memories.html",
    "gifts.html",
    "gift1.html",
    "gift2.html",
    "gift3.html",
    "gift-booking.html",
    "garden.html",
    "letter.html",
    "finale.html"
  ],

  get() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return {
      visited: ["index.html"],
      completed: {},
      giftsOpened: { gift1: false, gift2: false, gift3: false },
      wishes: [],
      audio: { playing: false, muted: false, volume: 0.5 }
    };
  },

  save(state) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
    } catch (e) {}
  },

  markVisited(pageName) {
    const state = this.get();
    if (!state.visited.includes(pageName)) {
      state.visited.push(pageName);
    }
    this.save(state);
  },

  markCompleted(stepKey) {
    const state = this.get();
    state.completed[stepKey] = true;
    this.save(state);
  },

  isCompleted(stepKey) {
    return !!this.get().completed[stepKey];
  },

  markGiftOpened(giftId) {
    const state = this.get();
    state.giftsOpened[giftId] = true;
    this.save(state);
  },

  reset() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.navigateTo("index.html");
  },

  navigateTo(url) {
    if (window.BirthdayAudio) {
      window.BirthdayAudio.playClick();
    }
    document.body.classList.add("page-exit");
    setTimeout(() => {
      window.location.href = url;
    }, 320);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const currentFile = window.location.pathname.split("/").pop() || "index.html";
  ExperienceState.markVisited(currentFile);

  document.querySelectorAll("[data-friend-name]").forEach((el) => {
    el.textContent = BIRTHDAY_CONFIG.friendName;
  });
  document.querySelectorAll("[data-sender-name]").forEach((el) => {
    el.textContent = BIRTHDAY_CONFIG.senderName;
  });

  document.querySelectorAll("[data-nav]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const target = btn.getAttribute("data-nav");
      if (target) ExperienceState.navigateTo(target);
    });
  });

  const pageIndex = ExperienceState.pages.indexOf(currentFile);
  const progressEl = document.getElementById("experience-progress-fill");
  if (progressEl && pageIndex >= 0) {
    const pct = Math.round(((pageIndex + 1) / ExperienceState.pages.length) * 100);
    progressEl.style.width = `${pct}%`;
  }
});

