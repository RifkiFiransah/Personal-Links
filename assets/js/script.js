(() => {
  const root = document.documentElement;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  const store = {
    get(key, fallback) {
      try {
        const value = localStorage.getItem(key);
        return value === null ? fallback : value;
      } catch {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, value);
      } catch {
        return;
      }
    }
  };

  const mark = (selector, attribute, value) => {
    document.querySelectorAll(selector).forEach((button) => {
      const active = button.dataset[attribute] === value;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  };

  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");
  const settingsOpen = document.getElementById("settings-open");
  const settingsClose = document.getElementById("settings-close");
  const settingsPanel = document.getElementById("settings-panel");
  const settingsOverlay = document.getElementById("settings-overlay");

  const effectiveTheme = () =>
    root.dataset.theme === "auto"
      ? window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"
      : root.dataset.theme;

  const applyTheme = (theme, persist = true) => {
    root.dataset.theme = theme;
    if (persist) store.set("theme", theme);
    const light = effectiveTheme() === "light";
    themeIcon.className = light ? "fa-solid fa-sun" : "fa-regular fa-moon";
    themeToggle.setAttribute("aria-label", light ? "Switch to dark mode" : "Switch to light mode");
    mark(".theme-option", "theme", theme);
  };

  const setPanel = (open) => {
    settingsPanel.classList.toggle("open", open);
    settingsOverlay.classList.toggle("open", open);
    settingsPanel.setAttribute("aria-hidden", String(!open));
    settingsOpen.setAttribute("aria-expanded", String(open));
    (open ? settingsClose : settingsOpen).focus();
  };

  let soundOn = store.get("sound", "on") === "on";
  let audioContext;

  const ping = () => {
    if (!soundOn) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      audioContext = audioContext || new AudioContextClass();
      if (audioContext.state === "suspended") audioContext.resume();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(660, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.08);
      gain.gain.setValueAtTime(0.035, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.14);
      oscillator.connect(gain).connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.15);
    } catch {
      return;
    }
  };

  const applySound = (state, persist = true) => {
    soundOn = state === "on";
    if (persist) store.set("sound", state);
    mark(".sound-option", "sound", state);
  };

  const initClock = () => {
    const timeEl = document.getElementById("clock-time");
    const dateEl = document.getElementById("clock-date");
    const timeFormat = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Jakarta",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    });
    const dateFormat = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Jakarta",
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });
    let previous = "";

    const tick = () => {
      const now = new Date();
      const time = timeFormat.format(now);
      if (time !== previous) {
        timeEl.textContent = time;
        if (!reduced && timeEl.animate) {
          timeEl.animate(
            [{ opacity: 0.35, transform: "translateY(-3px)" }, { opacity: 1, transform: "none" }],
            { duration: 220, easing: "ease-out" }
          );
        }
        previous = time;
      }
      dateEl.textContent = dateFormat.format(now);
    };

    tick();
    setInterval(tick, 1000);
  };

  const initRole = () => {
    if (reduced) return;
    const roleEl = document.getElementById("role-text");
    const roles = ["Freelance Web Developer", "Frontend Focused", "Building for the Web"];
    let index = 0;
    setInterval(() => {
      roleEl.style.opacity = "0";
      setTimeout(() => {
        index = (index + 1) % roles.length;
        roleEl.textContent = roles[index];
        roleEl.style.opacity = "1";
      }, 250);
    }, 3400);
  };

  const initParticles = () => {
    if (reduced || root.dataset.motion === "off" || root.dataset.bg === "off") return;
    const container = document.getElementById("particles");
    container.replaceChildren();
    for (let i = 0; i < 18; i += 1) {
      const particle = document.createElement("span");
      particle.className = "particle";
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${-Math.random() * 9}s`;
      particle.style.animationDuration = `${7 + Math.random() * 5}s`;
      container.append(particle);
    }
  };

  const initPointer = () => {
    if (!finePointer || reduced) return;

    const dot = document.createElement("span");
    dot.className = "cursor-dot";
    const ring = document.createElement("span");
    ring.className = "cursor-ring";
    const spotlight = document.getElementById("spotlight");
    document.body.append(dot, ring);
    document.body.classList.add("has-cursor");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    const render = () => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      spotlight.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);

    document.addEventListener("mousemove", (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    });

    document.querySelectorAll("a, button").forEach((element) => {
      element.addEventListener("mouseenter", () => ring.classList.add("hovering"));
      element.addEventListener("mouseleave", () => ring.classList.remove("hovering"));
    });
  };

  const initLinks = () => {
    document.querySelectorAll(".link-card").forEach((card) => {
      card.addEventListener("mousemove", (event) => {
        if (!finePointer || reduced || root.dataset.motion === "off") return;
        const bounds = card.getBoundingClientRect();
        const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 10;
        const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 10;
        card.style.setProperty("--mx", `${x}px`);
        card.style.setProperty("--my", `${y}px`);
      });

      card.addEventListener("mouseleave", () => {
        card.style.setProperty("--mx", "0px");
        card.style.setProperty("--my", "0px");
      });

      card.addEventListener("click", (event) => {
        ping();
        if (reduced || root.dataset.motion === "off") return;
        const bounds = card.getBoundingClientRect();
        const size = Math.max(bounds.width, bounds.height) * 2;
        const ripple = document.createElement("span");
        ripple.className = "ripple";
        ripple.style.width = `${size}px`;
        ripple.style.height = `${size}px`;
        ripple.style.left = `${event.clientX - bounds.left - size / 2}px`;
        ripple.style.top = `${event.clientY - bounds.top - size / 2}px`;
        card.append(ripple);
        ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
      });
    });
  };

  document.addEventListener("DOMContentLoaded", () => {
    applyTheme(store.get("theme", "dark"), false);

    document.getElementById("year").textContent = new Date().getFullYear();

    themeToggle.addEventListener("click", () => {
      applyTheme(effectiveTheme() === "dark" ? "light" : "dark");
      ping();
    });
    settingsOpen.addEventListener("click", () => {
      setPanel(true);
      ping();
    });
    settingsClose.addEventListener("click", () => setPanel(false));
    settingsOverlay.addEventListener("click", () => setPanel(false));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && settingsPanel.classList.contains("open")) setPanel(false);
    });
    window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", () => {
      if (root.dataset.theme === "auto") applyTheme("auto", false);
    });

    document.querySelectorAll(".theme-option").forEach((button) => {
      button.addEventListener("click", () => {
        applyTheme(button.dataset.theme);
        ping();
      });
    });

    document.querySelectorAll(".motion-option").forEach((button) => {
      button.addEventListener("click", () => {
        root.dataset.motion = button.dataset.motion;
        store.set("motion", button.dataset.motion);
        mark(".motion-option", "motion", button.dataset.motion);
        if (button.dataset.motion === "on") initParticles();
        ping();
      });
    });

    document.querySelectorAll(".bg-option").forEach((button) => {
      button.addEventListener("click", () => {
        root.dataset.bg = button.dataset.bg;
        store.set("bg", button.dataset.bg);
        mark(".bg-option", "bg", button.dataset.bg);
        if (button.dataset.bg === "on") initParticles();
        ping();
      });
    });

    document.querySelectorAll(".sound-option").forEach((button) => {
      button.addEventListener("click", () => {
        applySound(button.dataset.sound);
        ping();
      });
    });

    document.getElementById("contact-btn").addEventListener("click", () => {
      ping();
      window.location.href = "mailto:muhammadrifkifiransah@gmail.com";
    });

    const savedMotion = store.get("motion", "on");
    const savedBackground = store.get("bg", "on");
    root.dataset.motion = savedMotion;
    root.dataset.bg = savedBackground;
    mark(".motion-option", "motion", savedMotion);
    mark(".bg-option", "bg", savedBackground);
    applySound(store.get("sound", "on"), false);

    initClock();
    initRole();
    initParticles();
    initPointer();
    initLinks();
  });
})();
