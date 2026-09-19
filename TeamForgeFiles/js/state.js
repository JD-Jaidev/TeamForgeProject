// TeamForge Global State & Toast Notification Manager

class TeamForgeState {
  constructor() {
    this.ensureToastContainer();
  }

  ensureToastContainer() {
    if (!document.getElementById('toast-container')) {
      const container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }
  }

  toast(title, message, type = 'info', duration = 4000) {
    this.ensureToastContainer();
    const container = document.getElementById('toast-container');
    
    const colors = {
      success: { bg: 'bg-emerald-950/90', border: 'border-emerald-500/40', text: 'text-emerald-400', icon: '✓' },
      error: { bg: 'bg-rose-950/90', border: 'border-rose-500/40', text: 'text-rose-400', icon: '✕' },
      info: { bg: 'bg-indigo-950/90', border: 'border-indigo-500/40', text: 'text-indigo-400', icon: 'ℹ' },
      ai: { bg: 'bg-purple-950/90', border: 'border-purple-500/40', text: 'text-purple-300', icon: '✨' },
      warning: { bg: 'bg-amber-950/90', border: 'border-amber-500/40', text: 'text-amber-400', icon: '⚠' }
    };

    const scheme = colors[type] || colors.info;

    const toastEl = document.createElement('div');
    toastEl.className = `toast ${scheme.bg} ${scheme.border} border backdrop-blur-xl p-4 rounded-xl shadow-2xl flex items-start gap-3 text-sm text-slate-100`;
    
    toastEl.innerHTML = `
      <div class="w-6 h-6 rounded-full flex items-center justify-center font-bold shrink-0 ${scheme.text} bg-white/10">
        ${scheme.icon}
      </div>
      <div class="flex-1 min-w-0">
        <div class="font-semibold ${scheme.text}">${title}</div>
        <div class="text-xs text-slate-300 mt-0.5">${message}</div>
      </div>
      <button class="text-slate-400 hover:text-white text-xs ml-2" onclick="this.parentElement.remove()">✕</button>
    `;

    container.appendChild(toastEl);

    setTimeout(() => {
      if (toastEl.parentElement) {
        toastEl.style.opacity = '0';
        toastEl.style.transform = 'translateY(10px)';
        toastEl.style.transition = 'all 0.3s ease';
        setTimeout(() => toastEl.remove(), 300);
      }
    }, duration);
  }

  showModal(htmlContent) {
    let backdrop = document.getElementById('global-modal-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'global-modal-backdrop';
      backdrop.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity';
      document.body.appendChild(backdrop);
    }
    backdrop.innerHTML = `
      <div class="glass-panel w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 border border-white/10 relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <button class="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center" onclick="window.TF_STATE.closeModal()">✕</button>
        ${htmlContent}
      </div>
    `;
    backdrop.style.display = 'flex';
  }

  closeModal() {
    const backdrop = document.getElementById('global-modal-backdrop');
    if (backdrop) {
      backdrop.style.display = 'none';
      backdrop.innerHTML = '';
    }
  }
}

window.TF_STATE = new TeamForgeState();
