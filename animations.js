/* ПОТЁМКИН.DEV — GSAP animation layer
   Requires: gsap.min.js + ScrollTrigger.min.js (loaded before this file) */

gsap.registerPlugin(ScrollTrigger);
gsap.defaults({ ease: "power3.out", duration: 0.8 });

const mm = gsap.matchMedia();

mm.add(
  {
    motionOK: "(prefers-reduced-motion: no-preference)",
    reduceMotion: "(prefers-reduced-motion: reduce)"
  },
  (ctx) => {
    const { reduceMotion } = ctx.conditions;
    if (reduceMotion) return; // никаких анимаций для тех, кто их отключил

    /* ---------- 0. Прогресс-бар чтения ---------- */
    const bar = document.createElement("div");
    bar.className = "scroll-progress";
    bar.setAttribute("aria-hidden", "true");
    document.body.appendChild(bar);
    gsap.set(bar, { scaleX: 0, transformOrigin: "left center" });
    gsap.to(bar, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { start: 0, end: "max", scrub: 0.3 }
    });

    /* ---------- 1. Hero: оркестрованный вход ---------- */
    const heroText = document.querySelector(".hero .wrap > div:first-child");
    const heroDemo = document.querySelector(".hero .phone, .hero .browser, .hero .pipeline");
    const h1 = document.querySelector(".hero h1");

    // разбиваем заголовок на слова для каскадного появления
    if (h1 && !h1.dataset.split) {
      h1.dataset.split = "1";
      h1.innerHTML = h1.textContent
        .split(" ")
        .map((w) => `<span class="w"><span class="wi">${w}</span></span>`)
        .join(" ");
    }

    const intro = gsap.timeline();
    intro
      .from(".hero .eyebrow", { autoAlpha: 0, y: 16, duration: 0.5 })
      .from(
        ".hero h1 .wi",
        { yPercent: 110, duration: 0.7, stagger: 0.045, ease: "power4.out" },
        "-=0.2"
      )
      .from(".hero .lead", { autoAlpha: 0, y: 20, duration: 0.6 }, "-=0.35")
      .from(
        ".hero .cta-row > *",
        { autoAlpha: 0, y: 14, stagger: 0.08, duration: 0.45 },
        "-=0.3"
      )
      .from(".hero .note", { autoAlpha: 0, duration: 0.4 }, "-=0.2");

    // перспектива для 3D-наклонов демо-блоков
    gsap.utils.toArray(".hero .wrap").forEach((w) => gsap.set(w, { perspective: 1000 }));

    if (heroDemo) {
      intro.from(
        heroDemo,
        {
          autoAlpha: 0,
          y: 40,
          scale: 0.92,
          rotation: 2,
          duration: 0.9,
          ease: "back.out(1.4)"
        },
        0.35
      );
      // параллакс демо-устройства при скролле
      gsap.to(heroDemo, {
        y: -70,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 0.6
        }
      });
    }

    /* ---------- 1b. Живые демо: движение при скролле ---------- */

    // Чат-пузыри: покачивание глубины по мере скролла + постоянное «дыхание»
    gsap.utils.toArray(".chat .msg").forEach((msg, i) => {
      gsap.to(msg, {
        xPercent: i % 2 ? 4 : -4,
        ease: "none",
        scrollTrigger: {
          trigger: msg.closest(".phone"),
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });
    });

    // Телефон слегка кренится при прокрутке — как в руке
    gsap.utils.toArray(".phone").forEach((ph) => {
      gsap.fromTo(
        ph,
        { rotation: -2.5 },
        {
          rotation: 2.5,
          ease: "none",
          scrollTrigger: { trigger: ph, start: "top bottom", end: "bottom top", scrub: 1.2 }
        }
      );
      // блик, пробегающий по экрану
      const glare = document.createElement("div");
      glare.className = "demo-glare";
      ph.appendChild(glare);
      gsap.fromTo(
        glare,
        { yPercent: -120, xPercent: -30 },
        {
          yPercent: 120,
          ease: "none",
          scrollTrigger: { trigger: ph, start: "top bottom", end: "bottom top", scrub: 1.5 }
        }
      );
    });

    // Мини-сайт в браузере: контент параллаксит на разной глубине
    const miniLayers = [
      [".m-eyebrow", -14],
      [".m-h", -26],
      [".m-p", -18],
      [".m-btn", -34],
      [".m-cards", -46],
      [".m-lead", -58]
    ];
    if (document.querySelector(".browser")) {
      miniLayers.forEach(([sel, dist]) => {
        gsap.to(sel, {
          y: dist,
          ease: "none",
          scrollTrigger: { trigger: ".browser", start: "top bottom", end: "bottom top", scrub: 1 }
        });
      });
      gsap.fromTo(
        ".browser",
        { rotationY: 8, rotationX: 3 },
        {
          rotationY: -8,
          rotationX: -3,
          ease: "none",
          scrollTrigger: { trigger: ".browser", start: "top bottom", end: "bottom top", scrub: 1.2 }
        }
      );
    }

    // Конвейер: линия энергии протекает по узлам в такт скроллу
    const pnodes = gsap.utils.toArray(".p-node");
    if (pnodes.length) {
      pnodes.forEach((n) => gsap.set(n, { transformOrigin: "left center" }));
      gsap.to(pnodes, {
        x: 10,
        ease: "none",
        stagger: { each: 0.15, yoyo: true, repeat: 1 },
        scrollTrigger: { trigger: ".pipeline", start: "top 75%", end: "bottom 40%", scrub: 1 }
      });
      gsap.from(".pipeline .p-result", {
        scale: 0.8,
        autoAlpha: 0,
        ease: "back.out(2)",
        scrollTrigger: { trigger: ".pipeline", start: "top 55%", once: true }
      });
    }

    /* ---------- 2. Заголовки секций ---------- */
    gsap.utils.toArray("section h2").forEach((el) => {
      gsap.from(el, {
        autoAlpha: 0,
        y: 26,
        duration: 0.6,
        scrollTrigger: { trigger: el, start: "top 85%", once: true }
      });
    });

    /* ---------- 3. Карточки, шаги, боли — батч-ревилы ---------- */
    const batchReveal = (selector, vars = {}) => {
      const items = gsap.utils.toArray(selector);
      if (!items.length) return;
      gsap.set(items, { autoAlpha: 0, y: 34 });
      ScrollTrigger.batch(items, {
        start: "top 88%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.09,
            overwrite: true,
            ...vars
          })
      });
    };

    batchReveal(".grid4 .card, .grid3 .card");
    batchReveal(".steps .step", { ease: "back.out(1.3)" });
    batchReveal(".pain .item", { stagger: 0.12 });

    /* ---------- 4. Кейсы — выезд слева ---------- */
    gsap.utils.toArray(".case").forEach((el) => {
      gsap.from(el, {
        autoAlpha: 0,
        x: -40,
        duration: 0.7,
        scrollTrigger: { trigger: el, start: "top 85%", once: true }
      });
    });

    /* ---------- 5. Таблица сравнения — строки поочерёдно ---------- */
    const rows = gsap.utils.toArray(".compare tr");
    if (rows.length) {
      gsap.set(rows.slice(1), { autoAlpha: 0, x: (i) => (i % 2 ? 30 : -30) });
      ScrollTrigger.create({
        trigger: ".compare",
        start: "top 82%",
        once: true,
        onEnter: () =>
          gsap.to(rows.slice(1), {
            autoAlpha: 1,
            x: 0,
            duration: 0.5,
            stagger: 0.1,
            overwrite: true
          })
      });
    }

    /* ---------- 6. Чек-лист аудита — пункты по одному ---------- */
    const auditItems = gsap.utils.toArray(".audit li");
    if (auditItems.length) {
      gsap.set(auditItems, { autoAlpha: 0, x: -20 });
      ScrollTrigger.create({
        trigger: ".audit",
        start: "top 80%",
        once: true,
        onEnter: () =>
          gsap.to(auditItems, {
            autoAlpha: 1,
            x: 0,
            duration: 0.45,
            stagger: 0.12,
            overwrite: true
          })
      });
    }

    /* ---------- 7. Тёмный контакт-блок — приближение ---------- */
    gsap.utils.toArray(".contact").forEach((el) => {
      gsap.from(el, {
        autoAlpha: 0,
        scale: 0.95,
        y: 30,
        duration: 0.8,
        ease: "back.out(1.2)",
        scrollTrigger: { trigger: el, start: "top 85%", once: true }
      });
    });

    /* ---------- 8. Магнитные кнопки (лёгкие) ---------- */
    document.querySelectorAll(".btn").forEach((btn) => {
      const strength = 5;
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        gsap.to(btn, {
          x: ((e.clientX - r.left) / r.width - 0.5) * strength,
          y: ((e.clientY - r.top) / r.height - 0.5) * strength,
          duration: 0.4,
          ease: "power2.out"
        });
      });
      btn.addEventListener("mouseleave", () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.4, ease: "power2.out" });
      });
    });

    /* ---------- 9. Лёгкий hover на информационных карточках ---------- */
    gsap.utils.toArray(".card, .step, .pain .item, .audit").forEach((el) => {
      el.addEventListener("mouseenter", () => {
        gsap.to(el, { y: -6, duration: 0.35, ease: "power2.out" });
      });
      el.addEventListener("mouseleave", () => {
        gsap.to(el, { y: 0, duration: 0.45, ease: "power2.out" });
      });
    });

    return () => {}; // matchMedia сам откатит всё созданное здесь
  }
);
