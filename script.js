/**
 * ==========================================================================
 * PORTFÓLIO PESSOAL — ALLYSON DE SANTANA ALMEIDA
 * Comportamento Interativo e Acessibilidade da Seção Hero (Etapa 01)
 * ==========================================================================
 */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // Elementos do CTA e Modal Informativo
  const ctaButton = document.getElementById("cta-explore");
  const drawerOverlay = document.getElementById("trajectory-drawer");
  const drawerBackdrop = document.getElementById("drawer-backdrop");
  const drawerCloseBtn = document.getElementById("drawer-close-btn");
  const drawerOkBtn = document.getElementById("drawer-ok-btn");
  const ambientGlow = document.getElementById("ambient-glow");

  // Elementos focalizáveis dentro do modal para gerenciamento de foco (Focus Trap)
  const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

  /**
   * Abre o painel informativo com acessibilidade e foco controlado
   */
  function openTrajectoryDrawer() {
    if (!drawerOverlay) return;

    drawerOverlay.removeAttribute("hidden");
    // Força reflow para garantir a animação de entrada
    void drawerOverlay.offsetWidth;
    drawerOverlay.setAttribute("aria-hidden", "false");

    if (ctaButton) {
      ctaButton.setAttribute("aria-expanded", "true");
    }

    // Trava rolagem do corpo de fundo
    document.body.style.overflow = "hidden";

    // Direciona o foco para o botão de confirmação ou fechamento
    if (drawerCloseBtn) {
      drawerCloseBtn.focus();
    }
  }

  /**
   * Fecha o painel informativo e devolve o foco ao botão de origem
   */
  function closeTrajectoryDrawer() {
    if (!drawerOverlay) return;

    drawerOverlay.setAttribute("aria-hidden", "true");

    if (ctaButton) {
      ctaButton.setAttribute("aria-expanded", "false");
    }

    // Restaura rolagem
    document.body.style.overflow = "";

    // Aguarda término da transição antes de aplicar hidden
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const delay = reduceMotion ? 0 : 250;

    setTimeout(() => {
      drawerOverlay.setAttribute("hidden", "");
      // Devolve o foco ao botão que iniciou a ação
      if (ctaButton) {
        ctaButton.focus();
      }
    }, delay);
  }

  /**
   * Gerenciamento de teclado dentro do modal (Escape para fechar + Trap de Tab)
   */
  function handleDrawerKeyDown(event) {
    if (event.key === "Escape" || event.key === "Esc") {
      event.preventDefault();
      closeTrajectoryDrawer();
      return;
    }

    if (event.key === "Tab") {
      const focusableElements = drawerOverlay.querySelectorAll(focusableSelectors);
      if (!focusableElements.length) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        // Se Shift + Tab e está no primeiro elemento, volta ao último
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Se Tab e está no último elemento, volta ao primeiro
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  }

  // Event Listeners do CTA e do Modal
  if (ctaButton) {
    ctaButton.addEventListener("click", openTrajectoryDrawer);
  }

  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener("click", closeTrajectoryDrawer);
  }

  if (drawerOkBtn) {
    drawerOkBtn.addEventListener("click", closeTrajectoryDrawer);
  }

  if (drawerBackdrop) {
    drawerBackdrop.addEventListener("click", closeTrajectoryDrawer);
  }

  if (drawerOverlay) {
    drawerOverlay.addEventListener("keydown", handleDrawerKeyDown);
  }

  /**
   * Microinteração Sutil de Movimento no Fundo (Glow Ambiental)
   * Inspirada na elegância e controle da referência Glitch and Grit
   * Desativada automaticamente se prefers-reduced-motion estiver ativo
   */
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (ambientGlow && !prefersReducedMotion.matches) {
    let ticking = false;

    window.addEventListener("pointermove", (e) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const moveX = (e.clientX / window.innerWidth - 0.5) * 60;
          const moveY = (e.clientY / window.innerHeight - 0.5) * 60;
          ambientGlow.style.transform = `translate(${moveX}px, ${moveY}px)`;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }
});
