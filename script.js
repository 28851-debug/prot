/**
 * ==========================================================================
 * PORTFÓLIO PESSOAL — ALLYSON DE SANTANA ALMEIDA
 * Narrativa Cinematográfica: Interações, IntersectionObserver e Progresso
 * ==========================================================================
 */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const readingProgressBar = document.getElementById("reading-progress");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id]");
  const parallaxElements = document.querySelectorAll('[data-parallax="true"]');

  // Detecção de preferência por redução de movimento
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let isReducedMotion = motionQuery.matches;

  motionQuery.addEventListener("change", (e) => {
    isReducedMotion = e.matches;
    if (isReducedMotion) {
      root.classList.add("reduced-motion");
      resetParallax();
    } else {
      root.classList.remove("reduced-motion");
    }
  });

  if (isReducedMotion) {
    root.classList.add("reduced-motion");
  }

  // Ativação do modo JS (progressive enhancement: revela animações apenas com JS habilitado)
  root.classList.add("js-ready");

  /* --------------------------------------------------------------------------
     1. IntersectionObserver para Revelação de Elementos, Linha e Marcadores
     -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll(
    ".reveal-item, .timeline__line, .timeline__marker"
  );

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            // Elemento revelado não precisa ser observado novamente
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.1,
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));

    // Observer para atualizar estado ativo na navegação
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const currentId = entry.target.getAttribute("id");
            navLinks.forEach((link) => {
              if (link.getAttribute("href") === `#${currentId}`) {
                link.classList.add("is-active");
              } else {
                link.classList.remove("is-active");
              }
            });
          }
        });
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0,
      }
    );

    sections.forEach((sec) => navObserver.observe(sec));
  } else {
    // Fallback gracioso caso IntersectionObserver não exista no navegador
    revealElements.forEach((el) => el.classList.add("is-revealed"));
  }

  /* --------------------------------------------------------------------------
     2. Único Listener Global de Scroll { passive: true } com requestAnimationFrame
     -------------------------------------------------------------------------- */
  let ticking = false;

  function updateScrollState() {
    const scrollTop = window.scrollY || root.scrollTop || document.body.scrollTop || 0;
    const docHeight = (root.scrollHeight || document.body.scrollHeight) - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(Math.max(scrollTop / docHeight, 0), 1) : 0;

    // Atualiza barra de progresso com scaleX e aria-valuenow
    if (readingProgressBar) {
      readingProgressBar.style.transform = `scaleX(${progress})`;
      readingProgressBar.setAttribute(
        "aria-valuenow",
        Math.round(progress * 100).toString()
      );
    }

    // Parallax suave estritamente limitado a elementos decorativos (sem deslocar textos)
    if (!isReducedMotion && parallaxElements.length > 0) {
      parallaxElements.forEach((el) => {
        const speed = parseFloat(el.getAttribute("data-parallax-speed")) || 0.05;
        const translateY = scrollTop * speed;
        el.style.transform = `translate3d(0, ${translateY}px, 0)`;
      });
    }

    ticking = false;
  }

  function resetParallax() {
    parallaxElements.forEach((el) => {
      el.style.transform = "none";
    });
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollState);
      ticking = true;
    }
  }

  // Apenas um listener global passivo
  window.addEventListener("scroll", onScroll, { passive: true });

  // Executa uma vez no carregamento para posicionamento correto
  updateScrollState();
});
