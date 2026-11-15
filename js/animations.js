/**
 * PAGE-SPECIFIC INTERACTIVE CONTROLLERS
 */
document.addEventListener("DOMContentLoaded", () => {
  const pageId = document.body.dataset.page;

  // PAGE 1: SECRET ENTRANCE
  if (pageId === "entrance") {
    const openBtn = document.getElementById("open-surprise-btn");
    const box = document.getElementById("entrance-gift-box");
    openBtn.addEventListener("click", () => {
      window.BirthdayAudio.startMusic();
      window.BirthdayAudio.playGiftOpen();
      box.classList.add("is-opening");
      launchPastelConfetti(85);
      ExperienceState.markCompleted("entrance");
      setTimeout(() => ExperienceState.navigateTo("welcome.html"), 1150);
    });
  }

  // PAGE 2: WELCOME
  if (pageId === "welcome") {
    document.getElementById("welcome-headline").textContent = BIRTHDAY_CONFIG.welcomeHeadline;
    document.getElementById("welcome-body").textContent = BIRTHDAY_CONFIG.welcomeMessage;
  }

  // PAGE 3: MAGICAL 3D GIFT BOX
  if (pageId === "magical-gift") {
    const ribbonBtn = document.getElementById("untie-ribbon-btn");
    const giftStage = document.getElementById("magic-box-stage");
    const secretPanel = document.getElementById("magic-secret-panel");
    const continueBtn = document.getElementById("magic-continue-btn");

    const unlockGift = () => {
      if (giftStage.classList.contains("opened")) return;
      window.BirthdayAudio.playGiftOpen();
      giftStage.classList.add("ribbon-untied");
      setTimeout(() => {
        giftStage.classList.add("opened");
        launchPastelConfetti(90);
        secretPanel.classList.add("revealed");
        continueBtn.disabled = false;
        ExperienceState.markCompleted("magicalGift");
      }, 650);
    };

    ribbonBtn.addEventListener("click", unlockGift);
    giftStage.addEventListener("click", unlockGift);
  }

  // PAGE 4: BIRTHDAY PREPARATION
  if (pageId === "preparation") {
    const messages = [
      "Sifting clouds of vanilla sugar...",
      "Whisking stardust and pastel frosting...",
      "Adding extra layers of sweetness and joy...",
      "Piping buttercream roses onto the cake...",
      "Almost ready for the grand reveal!"
    ];
    const msgEl = document.getElementById("prep-status-text");
    const barEl = document.getElementById("prep-progress-bar");
    const pctEl = document.getElementById("prep-percent");
    let progress = 0;

    const timer = setInterval(() => {
      progress += 2;
      barEl.style.width = `${progress}%`;
      pctEl.textContent = `${progress}%`;
      const stepIdx = Math.min(messages.length - 1, Math.floor(progress / 21));
      msgEl.textContent = messages[stepIdx];

      if (progress >= 100) {
        clearInterval(timer);
        window.BirthdayAudio.playSparkle();
        ExperienceState.markCompleted("preparation");
        setTimeout(() => ExperienceState.navigateTo("celebration.html"), 700);
      }
    }, 85);
  }

  // PAGE 5: GRAND BIRTHDAY REVEAL
  if (pageId === "celebration") {
    document.getElementById("grand-subtitle").textContent =
      BIRTHDAY_CONFIG.birthdayMessages.grandSubtitle;
    window.BirthdayAudio.playCelebration();
    launchPastelConfetti(110);
    setInterval(() => launchPastelConfetti(35), 3500);
  }

  // PAGE 6: CANDLE BLOWING (MIC + BUTTON FALLBACK)
  if (pageId === "candles") {
    const blowBtn = document.getElementById("blow-candles-btn");
    const micBtn = document.getElementById("enable-mic-btn");
    const micStatus = document.getElementById("mic-status");
    const wishCard = document.getElementById("candle-wish-reveal");
    const wishText = document.getElementById("candle-wish-text");
    const nextBtn = document.getElementById("candles-next-btn");
    let blown = false;
    let micStream = null;

    wishText.textContent = BIRTHDAY_CONFIG.birthdayMessages.candleWishReveal;

    const extinguishCandles = () => {
      if (blown) return;
      blown = true;
      if (micStream) {
        micStream.getTracks().forEach((t) => t.stop());
      }
      window.BirthdayAudio.playBlowSound();
      document.querySelectorAll(".candle-flame").forEach((flame) => {
        flame.classList.add("extinguished");
      });
      document.querySelectorAll(".candle-smoke").forEach((smoke) => {
        smoke.classList.add("rising");
      });
      setTimeout(() => {
        launchPastelConfetti(95);
        window.BirthdayAudio.playSparkle();
        wishCard.classList.add("revealed");
        nextBtn.disabled = false;
        blowBtn.textContent = "Wish Made!";
        blowBtn.disabled = true;
        ExperienceState.markCompleted("candles");
      }, 650);
    };

    blowBtn.addEventListener("click", extinguishCandles);

    micBtn.addEventListener("click", async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        micStatus.textContent = "Microphone unavailable on this browser—use the button below!";
        return;
      }
      try {
        micStatus.textContent = "Listening... Blow gently toward your microphone!";
        micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioCtx.createMediaStreamSource(micStream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const detectBlow = () => {
          if (blown) return;
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
          const avg = sum / dataArray.length;
          if (avg > 52) {
            micStatus.textContent = "Woosh! Candles blown out!";
            extinguishCandles();
            return;
          }
          requestAnimationFrame(detectBlow);
        };
        detectBlow();
      } catch (err) {
        micStatus.textContent = "Mic permission skipped—tap 'BLOW THE CANDLES' anytime!";
      }
    });
  }

  // PAGE 7: INTERACTIVE CAKE CUTTING
  if (pageId === "cake-cutting") {
    const cutBtn = document.getElementById("cut-cake-btn");
    const cakeStage = document.getElementById("cuttable-cake-stage");
    const knife = document.getElementById("cake-knife");
    const messageBox = document.getElementById("cake-secret-reveal");
    const messageText = document.getElementById("cake-secret-text");
    const nextBtn = document.getElementById("cake-next-btn");
    let isCut = false;

    messageText.textContent = BIRTHDAY_CONFIG.cakeHiddenMessage;

    const performCut = () => {
      if (isCut) return;
      isCut = true;
      window.BirthdayAudio.playSliceSound();
      knife.classList.add("slicing");
      setTimeout(() => {
        cakeStage.classList.add("sliced");
        launchPastelConfetti(80);
        messageBox.classList.add("revealed");
        nextBtn.disabled = false;
        cutBtn.textContent = "Cake Sliced!";
        cutBtn.disabled = true;
        ExperienceState.markCompleted("cakeCut");
      }, 600);
    };

    cutBtn.addEventListener("click", performCut);
    cakeStage.addEventListener("click", performCut);
  }

  // PAGE 8: MEMORY GALLERY & LIGHTBOX MODAL
  if (pageId === "memories") {
    const grid = document.getElementById("polaroid-grid");
    const modal = document.getElementById("memory-modal");
    const modalVisual = document.getElementById("modal-visual");
    const modalCaption = document.getElementById("modal-caption");
    const modalDate = document.getElementById("modal-date");
    let currentIdx = 0;

    const getPlaceholderArt = (theme) => {
      const themes = {
        sunset: `<svg viewBox="0 0 300 220" class="polaroid-svg"><defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ffd1dc"/><stop offset="100%" stop-color="#ffdab9"/></linearGradient></defs><rect width="300" height="220" fill="url(#g1)"/><circle cx="150" cy="115" r="42" fill="#fff3b0"/><path d="M0 155 Q90 130 180 155 T300 150 L300 220 L0 220 Z" fill="#e0bbf9" opacity="0.7"/></svg>`,
        coffee: `<svg viewBox="0 0 300 220" class="polaroid-svg"><rect width="300" height="220" fill="#fff5f7"/><rect x="105" y="85" width="90" height="75" rx="18" fill="#ffb6c1"/><path d="M195 100 Q222 100 222 122 Q222 145 195 145" fill="none" stroke="#ffb6c1" stroke-width="10"/><path d="M130 65 Q125 50 135 40 M155 65 Q150 50 160 40" fill="none" stroke="#e0bbf9" stroke-width="4" stroke-linecap="round"/></svg>`,
        adventure: `<svg viewBox="0 0 300 220" class="polaroid-svg"><rect width="300" height="220" fill="#e8f4fd"/><polygon points="50,180 130,75 210,180" fill="#bde0fe"/><polygon points="120,180 190,95 260,180" fill="#e0bbf9"/><circle cx="230" cy="55" r="22" fill="#ffdab9"/></svg>`,
        stargazing: `<svg viewBox="0 0 300 220" class="polaroid-svg"><rect width="300" height="220" fill="#ece4f9"/><circle cx="85" cy="65" r="26" fill="#fff3b0"/><circle cx="190" cy="55" r="4" fill="#ffffff"/><circle cx="230" cy="95" r="5" fill="#ffffff"/><circle cx="145" cy="110" r="3" fill="#ffffff"/><path d="M0 175 Q150 140 300 175 L300 220 L0 220 Z" fill="#ffb6c1" opacity="0.6"/></svg>`
      };
      return themes[theme] || themes.sunset;
    };

    BIRTHDAY_CONFIG.memoryPhotos.forEach((item, index) => {
      const card = document.createElement("article");
      card.className = "polaroid-card";
      card.style.setProperty("--tilt", `${index % 2 === 0 ? -2.2 : 2.2}deg`);
      const visualMarkup = item.image
        ? `<img src="${item.image}" alt="${item.caption}" loading="lazy" />`
        : getPlaceholderArt(item.svgTheme);

      card.innerHTML = `
        <div class="polaroid-sticker" aria-hidden="true"></div>
        <div class="polaroid-frame">${visualMarkup}</div>
        <p class="polaroid-date">${item.date}</p>
        <p class="polaroid-caption">${item.caption}</p>
      `;
      card.addEventListener("click", () => openModal(index));
      grid.appendChild(card);
    });

    const openModal = (idx) => {
      currentIdx = (idx + BIRTHDAY_CONFIG.memoryPhotos.length) % BIRTHDAY_CONFIG.memoryPhotos.length;
      const item = BIRTHDAY_CONFIG.memoryPhotos[currentIdx];
      modalVisual.innerHTML = item.image
        ? `<img src="${item.image}" alt="${item.caption}" />`
        : getPlaceholderArt(item.svgTheme);
      modalDate.textContent = item.date;
      modalCaption.textContent = item.caption;
      modal.classList.add("open");
      window.BirthdayAudio.playClick();
    };

    document.getElementById("modal-prev").addEventListener("click", () => openModal(currentIdx - 1));
    document.getElementById("modal-next").addEventListener("click", () => openModal(currentIdx + 1));
    document.getElementById("modal-close").addEventListener("click", () => {
      modal.classList.remove("open");
    });
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.remove("open");
    });
  }

  // PAGE 9: THREE SPECIAL GIFTS HUB
  if (pageId === "gifts-hub") {
    const opened = ExperienceState.get().giftsOpened;
    ["gift1", "gift2", "gift3"].forEach((key) => {
      const badge = document.getElementById(`${key}-status`);
      if (badge && opened[key]) {
        badge.textContent = "Opened";
        badge.classList.add("is-opened");
      }
    });
  }

  // PAGE 10: GIFT 1 (BOUQUET)
  if (pageId === "gift1") {
    ExperienceState.markGiftOpened("gift1");
    document.getElementById("gift1-message").textContent = BIRTHDAY_CONFIG.gift1Message;
    window.BirthdayAudio.playSparkle();
  }

  // PAGE 11: GIFT 2 (SPECIAL MEMORY CARD)
  if (pageId === "gift2") {
    ExperienceState.markGiftOpened("gift2");
    document.getElementById("gift2-title").textContent = BIRTHDAY_CONFIG.gift2Title;
    document.getElementById("gift2-message").textContent = BIRTHDAY_CONFIG.gift2Message;
    const imgContainer = document.getElementById("gift2-visual");
    if (BIRTHDAY_CONFIG.gift2Image) {
      imgContainer.innerHTML = `<img src="${BIRTHDAY_CONFIG.gift2Image}" alt="${BIRTHDAY_CONFIG.gift2Title}" />`;
    }
    window.BirthdayAudio.playSparkle();
  }

  // PAGE 12: GIFT 3 (WAX SEAL ENVELOPE)
  if (pageId === "gift3") {
    const envelope = document.getElementById("wax-envelope");
    const sealBtn = document.getElementById("wax-seal-btn");
    const returnBtn = document.getElementById("gift3-return-btn");
    document.getElementById("gift3-message").textContent = BIRTHDAY_CONFIG.gift3Message;

    sealBtn.addEventListener("click", () => {
      if (envelope.classList.contains("unsealed")) return;
      window.BirthdayAudio.playGiftOpen();
      envelope.classList.add("unsealed");
      launchPastelConfetti(60);
      ExperienceState.markGiftOpened("gift3");
      setTimeout(() => {
        returnBtn.disabled = false;
      }, 700);
    });
  }

  // PAGE 13: FRIENDSHIP QUIZ
  if (pageId === "quiz") {
    const questions = BIRTHDAY_CONFIG.quizQuestions;
    let qIndex = 0;
    let score = 0;
    let answered = false;

    const qCounter = document.getElementById("quiz-counter");
    const scoreBadge = document.getElementById("quiz-score-badge");
    const qText = document.getElementById("quiz-question-text");
    const optionsBox = document.getElementById("quiz-options");
    const feedbackEl = document.getElementById("quiz-feedback");
    const nextQBtn = document.getElementById("quiz-next-btn");
    const quizCard = document.getElementById("quiz-active-card");
    const resultCard = document.getElementById("quiz-result-card");

    const renderQuestion = () => {
      answered = false;
      nextQBtn.disabled = true;
      feedbackEl.textContent = "";
      feedbackEl.className = "quiz-feedback";
      const current = questions[qIndex];
      qCounter.textContent = `Question ${qIndex + 1} of ${questions.length}`;
      scoreBadge.textContent = `Score: ${score}`;
      qText.textContent = current.question;
      optionsBox.innerHTML = "";

      current.options.forEach((opt, idx) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "quiz-option-btn";
        btn.textContent = opt;
        btn.addEventListener("click", () => {
          if (answered) return;
          answered = true;
          const isRight = idx === current.correctIndex;
          if (isRight) {
            score++;
            btn.classList.add("correct");
            window.BirthdayAudio.playSparkle();
          } else {
            btn.classList.add("wrong");
            optionsBox.children[current.correctIndex].classList.add("correct");
            window.BirthdayAudio.playClick();
          }
          scoreBadge.textContent = `Score: ${score}`;
          feedbackEl.textContent = current.funnyFeedback;
          feedbackEl.classList.add("visible");
          nextQBtn.disabled = false;
        });
        optionsBox.appendChild(btn);
      });
    };

    nextQBtn.addEventListener("click", () => {
      qIndex++;
      if (qIndex < questions.length) {
        renderQuestion();
      } else {
        quizCard.hidden = true;
        resultCard.hidden = false;
        document.getElementById("final-quiz-score").textContent = `${score} / ${questions.length}`;
        launchPastelConfetti(90);
        window.BirthdayAudio.playCelebration();
        const st = ExperienceState.get();
        st.quizScore = score;
        ExperienceState.save(st);
      }
    });

    renderQuestion();
  }

  // PAGE 14: MAGICAL WISH GARDEN
  if (pageId === "garden") {
    const form = document.getElementById("wish-form");
    const input = document.getElementById("wish-input");
    const sky = document.getElementById("wish-star-sky");
    const counter = document.getElementById("wish-count");

    const spawnStar = (text, animate = true) => {
      const star = document.createElement("div");
      star.className = `wish-star-node ${animate ? "just-born" : ""}`;
      star.style.left = `${Math.random() * 80 + 10}%`;
      star.style.top = `${Math.random() * 55 + 10}%`;
      star.innerHTML = `
        <svg viewBox="0 0 24 24" width="28" height="28" fill="#fff3b0">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
        <span class="wish-tooltip">${text}</span>
      `;
      sky.appendChild(star);
    };

    const existingWishes = ExperienceState.get().wishes || [];
    existingWishes.forEach((w) => spawnStar(w, false));
    counter.textContent = `${existingWishes.length} glowing wish${existingWishes.length === 1 ? "" : "es"} in the sky`;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const val = input.value.trim();
      if (!val) return;
      spawnStar(val, true);
      window.BirthdayAudio.playSparkle();
      const st = ExperienceState.get();
      st.wishes = st.wishes || [];
      st.wishes.push(val);
      ExperienceState.save(st);
      counter.textContent = `${st.wishes.length} glowing wish${st.wishes.length === 1 ? "" : "es"} in the sky`;
      input.value = "";
    });
  }

  // PAGE 15: SECRET UNFOLDING LETTER
  if (pageId === "letter") {
    const envelope = document.getElementById("secret-letter-envelope");
    const openBtn = document.getElementById("open-letter-btn");
    const letterPaper = document.getElementById("unfolded-letter-paper");
    const bodyEl = document.getElementById("secret-letter-body");
    const continueBtn = document.getElementById("letter-continue-btn");

    const formatted = BIRTHDAY_CONFIG.finalLetter
      .replace(/\{friendName\}/g, BIRTHDAY_CONFIG.friendName)
      .replace(/\{senderName\}/g, BIRTHDAY_CONFIG.senderName);
    bodyEl.textContent = formatted;

    openBtn.addEventListener("click", () => {
      window.BirthdayAudio.playGiftOpen();
      envelope.classList.add("opened");
      setTimeout(() => {
        letterPaper.classList.add("unfolded");
        continueBtn.disabled = false;
      }, 500);
    });
  }

  // PAGE 16: GRAND FINALE
  if (pageId === "finale") {
    const finaleText = BIRTHDAY_CONFIG.finaleWish.replace(
      /\{friendName\}/g,
      BIRTHDAY_CONFIG.friendName
    );
    document.getElementById("finale-message").textContent = finaleText;
    window.BirthdayAudio.playCelebration();
    launchPastelConfetti(130);
    setInterval(() => launchPastelConfetti(45), 3200);

    document.getElementById("replay-experience-btn").addEventListener("click", () => {
      ExperienceState.reset();
    });
  }
});
  // PAGE 17: GIFT BOOKING / SHIPPING ADDRESS
  if (pageId === "gift-booking") {
    const form = document.getElementById("gift-booking-form");
    const successPanel = document.getElementById("booking-success-msg");
    const nextBtn = document.getElementById("booking-next-btn");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const addressData = {
        name: document.getElementById("book-name").value,
        address: document.getElementById("book-address").value,
        city: document.getElementById("book-city").value,
        pincode: document.getElementById("book-pincode").value,
        phone: document.getElementById("book-phone").value,
        timestamp: new Date().toISOString()
      };

      // Save delivery details to localStorage state
      const st = ExperienceState.get();
      st.shippingDetails = addressData;
      ExperienceState.save(st);
      ExperienceState.markCompleted("giftBooking");

      window.BirthdayAudio.playSparkle();
      launchPastelConfetti(90);

      // Lock form inputs after submission
      form.querySelectorAll("input, textarea, button").forEach((el) => (el.disabled = true));
      form.style.opacity = "0.75";

      successPanel.classList.add("revealed");
      nextBtn.disabled = false;
    });
  }
