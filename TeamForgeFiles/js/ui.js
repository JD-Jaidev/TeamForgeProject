// TeamForge Shared UI Components & Layout Builder
// Injects responsive navigation, active user switcher, notification count, and footer.

class TeamForgeUI {
  static renderNavbar(activePage = '') {
    const user = window.TF_AUTH.getCurrentUser();
    const students = window.TF_STORE.getStudents();
    const notifs = user ? window.TF_STORE.getNotifications(user.id) : [];
    const unreadCount = notifs.filter(n => !n.isRead).length;

    const navHtml = `
      <header class="glass-panel sticky top-0 z-40 border-b border-white/10 px-4 lg:px-8 py-3.5 flex items-center justify-between">
        <!-- Logo -->
        <a href="index.html" class="flex items-center gap-2.5 group">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
          <div>
            <span class="font-heading font-black text-xl tracking-tight text-white flex items-center gap-1.5">
              TeamForge <span class="text-xs px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono font-medium border border-indigo-500/30">AI</span>
            </span>
          </div>
        </a>

        <!-- Desktop Navigation Links -->
        <nav class="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-white/5 text-sm font-medium">
          <a href="dashboard.html" class="top-nav-link px-3.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors ${activePage === 'dashboard' ? 'active bg-indigo-600/20 text-indigo-300 border-none' : ''}">Dashboard</a>
          <a href="discover.html" class="top-nav-link px-3.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors ${activePage === 'discover' ? 'active bg-indigo-600/20 text-indigo-300 border-none' : ''}">Discover Peers</a>
          <a href="ai-match.html" class="top-nav-link px-3.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1.5 ${activePage === 'ai-match' ? 'active bg-indigo-600/20 text-indigo-300 border-none' : ''}">
            <span class="text-cyan-400 text-xs">✨</span> AI Match
          </a>
          <a href="teams.html" class="top-nav-link px-3.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors ${activePage === 'teams' ? 'active bg-indigo-600/20 text-indigo-300 border-none' : ''}">Teams</a>
          <a href="opportunities.html" class="top-nav-link px-3.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors ${activePage === 'opportunities' ? 'active bg-indigo-600/20 text-indigo-300 border-none' : ''}">Opportunities</a>
          <a href="events.html" class="top-nav-link px-3.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors ${activePage === 'events' ? 'active bg-indigo-600/20 text-indigo-300 border-none' : ''}">Hackathons</a>
        </nav>

        <!-- Right Side Actions & User Profile -->
        <div class="flex items-center gap-3">
          ${user ? `
            <!-- Notifications Bell -->
            <a href="notifications.html" class="relative w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white flex items-center justify-center border border-white/5 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              ${unreadCount > 0 ? `<span class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-500 text-white text-[10px] font-bold flex items-center justify-center">${unreadCount}</span>` : ''}
            </a>

            <!-- Persona Switcher & Profile Dropdown -->
            <div class="relative group">
              <button class="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
                <img src="${user.avatar}" alt="${user.name}" class="w-7 h-7 rounded-lg object-cover ring-1 ring-indigo-500/50">
                <div class="text-left hidden sm:block">
                  <div class="text-xs font-semibold text-white leading-tight">${user.name}</div>
                  <div class="text-[10px] text-indigo-300 font-mono flex items-center gap-1">
                    <span>⚡ ${user.credits || 0} cr</span>
                    <span class="text-amber-400 font-bold">★ ${user.rating}</span>
                  </div>
                </div>
                <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
              </button>

              <!-- Dropdown Menu -->
              <div class="absolute right-0 mt-2 w-64 glass-panel rounded-xl p-2 border border-white/10 shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-150 z-50">
                <div class="px-3 py-2 border-b border-white/5">
                  <p class="text-xs text-slate-400">Signed in as</p>
                  <p class="text-sm font-semibold text-white truncate">${user.name}</p>
                  <p class="text-xs text-indigo-400 font-mono truncate">${user.email}</p>
                </div>
                
                <div class="py-1">
                  <a href="profile.html?id=${user.id}" class="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5">
                    👤 My Profile & Reviews
                  </a>
                  <a href="chat.html" class="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5">
                    💬 Team Chats & AI Bot
                  </a>
                  <a href="settings.html" class="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5">
                    ⚙️ Settings & API Keys
                  </a>
                </div>

                <div class="border-t border-white/5 pt-1">
                  <button onclick="window.TF_AUTH.logout(); window.location.href='index.html';" class="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-500/10">
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          ` : `
            <a href="login.html" class="text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5">Sign In</a>
            <a href="signup.html" class="btn-gradient text-sm font-medium px-4 py-1.5 rounded-xl">Get Started</a>
          `}
        </div>
      </header>
    `;

    const target = document.getElementById('teamforge-navbar');
    if (target) {
      target.innerHTML = navHtml;
    }
  }

  static renderSidebar(activePage = '') {
    const user = window.TF_AUTH.getCurrentUser();
    const teams = window.TF_STORE.getTeams();
    const userTeams = user ? teams.filter(t => t.members.some(m => m.userId === user.id) || (t.guests && t.guests.some(g => g.userId === user.id))) : [];

    const sidebarHtml = `
      <aside class="w-64 shrink-0 glass-panel border-r border-white/5 p-4 flex flex-col justify-between hidden lg:flex min-h-[calc(100vh-65px)]">
        <div class="space-y-6">
          <!-- Main Nav -->
          <div>
            <div class="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-3 mb-2 font-mono">Platform</div>
            <div class="space-y-1">
              <a href="dashboard.html" class="nav-link flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all ${activePage === 'dashboard' ? 'active' : ''}">
                <svg class="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                Dashboard
              </a>
              <a href="discover.html" class="nav-link flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all ${activePage === 'discover' ? 'active' : ''}">
                <svg class="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                Discover Peers
              </a>
              <a href="ai-match.html" class="nav-link flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all ${activePage === 'ai-match' ? 'active' : ''}">
                <span class="text-amber-400 text-sm">✨</span>
                AI Matching Studio
              </a>
              <a href="teams.html" class="nav-link flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all ${activePage === 'teams' ? 'active' : ''}">
                <svg class="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                Teams & Hubs
              </a>
              <a href="chat.html" class="nav-link flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all ${activePage === 'chat' ? 'active' : ''}">
                <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                Team Chat & AI Bot
              </a>
              <a href="opportunities.html" class="nav-link flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all ${activePage === 'opportunities' ? 'active' : ''}">
                <svg class="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                Opportunities & Hiring
              </a>
              <a href="events.html" class="nav-link flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all ${activePage === 'events' ? 'active' : ''}">
                <svg class="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                Hackathons & Events
              </a>
            </div>
          </div>

          <!-- My Teams List -->
          <div>
            <div class="flex items-center justify-between px-3 mb-2">
              <span class="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">My Teams</span>
              <a href="create-team.html" class="text-indigo-400 hover:text-indigo-300 text-xs font-bold">+ New</a>
            </div>
            <div class="space-y-1">
              ${userTeams.length > 0 ? userTeams.map(t => `
                <a href="team.html?id=${t.id}" class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 truncate">
                  <div class="w-2 h-2 rounded-full bg-indigo-500"></div>
                  <span class="truncate">${t.name}</span>
                </a>
              `).join('') : `
                <div class="px-3 py-2 text-xs text-slate-500 italic">No teams joined yet</div>
              `}
            </div>
          </div>
        </div>

        <!-- Create Team Card CTA -->
        <div class="glass-card p-3.5 rounded-xl border border-indigo-500/20 bg-indigo-950/20 text-center">
          <div class="text-xs font-semibold text-indigo-200">Have a project idea?</div>
          <p class="text-[11px] text-slate-400 mt-0.5 mb-2.5">Find complementary teammates with AI.</p>
          <a href="create-team.html" class="btn-gradient block w-full py-1.5 rounded-lg text-xs font-bold text-center">
            + Create Team
          </a>
        </div>
      </aside>
    `;

    const target = document.getElementById('teamforge-sidebar');
    if (target) {
      target.innerHTML = sidebarHtml;
    }
  }

  static renderFooter() {
    const footerHtml = `
      <footer class="border-t border-white/5 py-8 mt-16 bg-slate-950/40 text-center text-xs text-slate-500">
        <div class="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-2">
            <span class="font-heading font-bold text-slate-300">TeamForge</span>
            <span>— “Build the right team. Build the right idea.”</span>
          </div>
          <div class="flex items-center gap-4 text-slate-400">
            <a href="discover.html" class="hover:text-indigo-400">Students</a>
            <a href="teams.html" class="hover:text-indigo-400">Teams</a>
            <a href="ai-match.html" class="hover:text-cyan-400">AI Matching</a>
            <a href="events.html" class="hover:text-indigo-400">Hackathons</a>
            <a href="settings.html" class="hover:text-indigo-400">Settings</a>
          </div>
          <div>Powered by Supabase & OpenRouter AI</div>
        </div>
      </footer>
    `;

    const target = document.getElementById('teamforge-footer');
    if (target) {
      target.innerHTML = footerHtml;
    }
  }

  static initPage(activePage = '') {
    this.renderNavbar(activePage);
    this.renderSidebar(activePage);
    this.renderFooter();
  }
}

window.TF_UI = TeamForgeUI;
