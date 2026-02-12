/* =========================================================
   TOAST NOTIFICATION SYSTEM
   ========================================================= */

/**
 * Mostra toast com mensagem
 * @param {string} message 
 * @param {string} type - 'success', 'error', 'info'
 */
function showToast(message, type = 'success') {
  // Remove toast anterior se existir
  const oldToast = document.querySelector('.toast');
  oldToast?.remove();

  // Cria novo toast
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;

  document.body.appendChild(toast);

  // Animação entrada
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  // Remove após 3s
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}
