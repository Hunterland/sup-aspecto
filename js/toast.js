/* =========================================================
   TOAST NOTIFICATION SYSTEM - SUP ASPECTO ENHANCED
   ========================================================= */

/**
 * Config tipos com emoji/cores (purple theme)
 */
const TOAST_TYPES = {
  success: { emoji: "✅", bg: "rgba(34, 197, 94, 0.12)", border: "rgba(34, 197, 94, 0.4)" },
  error: { emoji: "❌", bg: "rgba(239, 68, 68, 0.12)", border: "rgba(239, 68, 68, 0.6)" }, // 👈 VERMELHO validação
  warning: { emoji: "⚠️", bg: "rgba(251, 191, 36, 0.12)", border: "rgba(251, 191, 36, 0.4)" },
  info: { emoji: "ℹ️", bg: "rgba(59, 130, 246, 0.12)", border: "rgba(59, 130, 246, 0.4)" }
};

/**
 * Toast principal (compatível com uso atual)
 * @param {string} message 
 * @param {string} type - success|error|warning|info
 */
function showToast(message, type = 'success') {
  // Remove anterior
  document.querySelector('.toast')?.remove();

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `
    <div class="toast__inner">
      <span class="toast__emoji">${TOAST_TYPES[type].emoji}</span>
      <span class="toast__text">${message}</span>
      <button class="toast__dismiss" aria-label="Fechar">×</button>
    </div>
  `;

  document.body.appendChild(toast);

  // Animação entrada (mantém requestAnimationFrame)
  requestAnimationFrame(() => toast.classList.add('show'));

  // Auto-remove 3s (mantém timeout original)
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

/**
 * Toast ERRO Validação (Reutilizável obrigatório)
 * @param {string} action - "selecione o tamanho", "preencha o nome", etc.
 */
function showToastError(action) {
  const message = `${action.charAt(0).toUpperCase() + action.slice(1)} para continuar`;
  showToast(message, 'error');
}

/* =========================================================
   CSS EMBEDDED (Purple theme + mobile)
   ========================================================= */
const toastCSS = `
<style id="sup-toast-styles">
.toast {
  position: fixed;
  top: clamp(16px, 4vh, 24px);
  right: clamp(16px, 4vw, 24px);
  min-width: 300px;
  max-width: min(90vw, 380px);
  background: var(--purple);
  border-radius: 16px;
  box-shadow: 0 20px 40px -8px rgba(91,45,139,0.25), 0 0 0 1px rgba(255,255,255,0.8);
  backdrop-filter: blur(16px);
  transform: translateX(calc(100% + 20px));
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 10001;
  font-family: "Inter", sans-serif;
  overflow: hidden;
  border-left: 4px solid transparent;
}

.toast.show {
  transform: translateX(0);
  opacity: 1;
}

.toast__inner {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
}

.toast--error {
  border-left-color: ${TOAST_TYPES.error.border};
  box-shadow: 0 20px 40px -8px rgba(239,68,68,0.2);
}

.toast__emoji {
  font-size: 22px;
  flex-shrink: 0;
  line-height: 1;
}

.toast--error .toast__emoji {
  color: #dc2626; /* Vermelho vivo */
}

.toast__text {
  flex: 1;
  font-size: 15px;
  font-weight: 500;
  color: var(--white);
  line-height: 1.4;
}

.toast__dismiss {
  background: none;
  border: none;
  color: #ffffff;
  font-size: 20px;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s ease;
  opacity: 0.7;
}

.toast__dismiss:hover {
  background: rgba(91,45,139,0.08);
  color: var(--purple);
  opacity: 1;
  transform: scale(1.05);
}

@media (max-width: 480px) {
  .toast {
    top: 12px;
    right: 12px;
    left: 12px;
    min-width: auto;
    max-width: none;
  }
}
</style>`;

// Injeta CSS uma vez
if (!document.getElementById("sup-toast-styles")) {
  document.head.insertAdjacentHTML("beforeend", toastCSS);
}

// Event delegation global para dismiss (compatível)
document.addEventListener("click", (e) => {
  if (e.target.matches(".toast__dismiss")) {
    e.target.closest(".toast").remove();
  }
});
