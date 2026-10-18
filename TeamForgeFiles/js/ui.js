// TeamForge Shared UI Components & Layout Builder
// Injects responsive navigation, mobile sidebar drawer, active user switcher, notification count, and footer.

class TeamForgeUI {
  static renderNavbar(activePage = '') {
    const user = window.TF_AUTH ? window.TF_AUTH.getCurrentUser() : null;
    const notifs = (user && window.TF_STORE) ? window.TF_STORE.getNotifications(user.id) : [];
    const unreadCount = notifs.filter(n => !n.isRead).length;
    const teams = (window.TF_STORE) ? window.TF_STORE.getTeams() : [];
    const userTeams = user ? teams.filter(t => t.members.some(m => m.userId === user.id) || (t.guests && t.guests.some(g => g.userId === user.id))) : [];

    const navHtml = `
      <header class="glass-panel sticky top-0 z-40 border-b border-white/10 px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between w-full">
        <!-- Left: Mobile Toggle & Logo -->
        <div class="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <!-- Mobile Sidebar Drawer Toggle Button (Android & iPhone) -->
          <button id="mobile-sidebar-toggle" type="button" aria-label="Open Navigation Menu" class="lg:hidden p-1.5 sm:p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all focus:outline-none border border-white/5 cursor-pointer shrink-0">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>

          <!-- Brand Logo -->
          <a href="index.html" class="flex items-center gap-1.5 sm:gap-2.5 group shrink-0">
            <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform shrink-0">
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <div>
              <span class="font-heading font-black text-base sm:text-xl tracking-tight text-white flex items-center gap-1 sm:gap-1.5">
                TeamForge <span class="text-[9px] sm:text-xs px-1 sm:px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono font-medium border border-indigo-500/30">AI</span>
              </span>
            </div>
          </a>
        </div>

        <!-- Desktop Navigation Links (Large Screens) -->
        <nav class="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-white/5 text-sm font-medium">
          <a href="dashboard.html" class="top-nav-link px-3.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors ${activePage === 'dashboard' ? 'active bg-indigo-600/20 text-indigo-300 border-none' : ''}">Dashboard</a>
          <a href="discover.html" class="top-nav-link px-3.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors ${activePage === 'discover' ? 'active bg-indigo-600/20 text-indigo-300 border-none' : ''}">Discover Peers</a>
          <a href="ai-match.html" class="top-nav-link px-3.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1.5 ${activePage === 'ai-match' ? 'active bg-indigo-600/20 text-indigo-300 border-none' : ''}">
            <span class="text-cyan-400 text-xs">✨</span> AI Match
          </a>
          <a href="teams.html" class="top-nav-link px-3.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors ${activePage === 'teams' ? 'active bg-indigo-600/20 text-indigo-300 border-none' : ''}">Teams</a>
          <a href="chat.html" class="top-nav-link px-3.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors ${activePage === 'chat' ? 'active bg-indigo-600/20 text-indigo-300 border-none' : ''}">Chat</a>
          <a href="opportunities.html" class="top-nav-link px-3.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors ${activePage === 'opportunities' ? 'active bg-indigo-600/20 text-indigo-300 border-none' : ''}">Opportunities</a>
          <a href="events.html" class="top-nav-link px-3.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors ${activePage === 'events' ? 'active bg-indigo-600/20 text-indigo-300 border-none' : ''}">Hackathons</a>
        </nav>

        <!-- Right Side Actions & User Profile -->
        <div class="flex items-center gap-1.5 sm:gap-3 shrink-0">
          ${user ? `
            <!-- Notifications Bell -->
            <a href="notifications.html" aria-label="Notifications" class="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white flex items-center justify-center border border-white/5 transition-colors">
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              ${unreadCount > 0 ? `<span class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-500 text-white text-[10px] font-bold flex items-center justify-center">${unreadCount}</span>` : ''}
            </a>

            <!-- Persona Switcher & Profile Dropdown -->
            <div class="relative" id="user-profile-menu-container">
              <button id="user-profile-menu-btn" type="button" class="flex items-center gap-2 p-1.5 pr-2 sm:pr-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer active:scale-95">
                <img src="${user.avatar || ('https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name) + '&background=6366f1&color=fff&bold=true&size=128')}" 
                     alt="${user.name}" 
                     onerror="this.onerror=null; this.src='https://ui-avatars.com/api/?name=' + encodeURIComponent('${user.name}') + '&background=6366f1&color=fff&bold=true&size=128';"
                     class="w-6 h-6 sm:w-7 sm:h-7 rounded-lg object-cover ring-1 ring-indigo-500/50">
                <div class="text-left hidden sm:block">
                  <div class="text-xs font-semibold text-white leading-tight">${user.name}</div>
                  <div class="text-[10px] text-indigo-300 font-mono flex items-center gap-1">
                    <span>⚡ ${user.credits || 200} cr</span>
                    <span class="text-amber-400 font-bold">★ ${(user.rating !== undefined && user.rating !== null && !isNaN(Number(user.rating))) ? Number(user.rating).toFixed(1) : '5.0'}</span>
                  </div>
                </div>
                <svg id="user-profile-chevron" class="w-3.5 h-3.5 text-slate-400 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
              </button>

              <!-- Dropdown Menu -->
              <div id="user-profile-dropdown" class="hidden absolute right-0 top-full mt-2 w-64 glass-panel rounded-2xl p-2 border border-white/10 shadow-2xl z-50 bg-slate-900/95 backdrop-blur-xl transition-all">
                <div class="px-3 py-2 border-b border-white/5">
                  <p class="text-[10px] uppercase font-mono tracking-wider text-slate-400">Signed in as</p>
                  <p class="text-sm font-semibold text-white truncate">${user.name}</p>
                  <p class="text-xs text-indigo-400 font-mono truncate">${user.email}</p>
                </div>
                
                <div class="py-1">
                  <a href="profile.html?id=${user.id}" class="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-indigo-600/20 transition-colors">
                    <span>👤</span> My Profile & Reviews
                  </a>
                  <a href="chat.html" class="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-indigo-600/20 transition-colors">
                    <span>💬</span> Team Chats & AI Bot
                  </a>
                  <a href="settings.html" class="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-indigo-600/20 transition-colors">
                    <span>⚙️</span> Settings & Account
                  </a>
                </div>

                ${(window.TF_AUTH && window.TF_AUTH.getSignedInAccounts().filter(a => a.id !== user.id).length > 0) ? `
                  <div class="border-t border-white/5 py-1">
                    <p class="px-3 py-1 text-[10px] uppercase font-mono tracking-wider text-slate-400">Switch Account</p>
                    ${window.TF_AUTH.getSignedInAccounts().filter(a => a.id !== user.id).map(a => `
                      <button onclick="window.TF_AUTH.switchPersona('${a.id}'); window.location.reload();" class="w-full text-left flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
                        <img src="${a.avatar || ('https://ui-avatars.com/api/?name=' + encodeURIComponent(a.name) + '&background=6366f1&color=fff&bold=true&size=128')}" 
                             onerror="this.onerror=null; this.src='https://ui-avatars.com/api/?name=' + encodeURIComponent('${a.name}') + '&background=6366f1&color=fff&bold=true&size=128';"
                        class="w-5 h-5 rounded-md object-cover ring-1 ring-white/10 shrink-0">
                        <span class="truncate">${a.name}</span>
                      </button>
                    `).join('')}
                  </div>
                ` : ''}

                <div class="border-t border-white/5 pt-1">
                  <button onclick="window.TF_AUTH.logout(); window.location.href='index.html';" class="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center gap-2">
                    <span>🚪</span>
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          ` : `
            <a href="login.html" class="text-xs sm:text-sm font-medium text-slate-300 hover:text-white px-2 sm:px-3 py-1.5 whitespace-nowrap">Sign In</a>
            <a href="signup.html" class="btn-gradient text-xs sm:text-sm font-bold px-3 sm:px-4 py-1.5 rounded-xl whitespace-nowrap shadow-md">Get Started</a>
          `}
        </div>
      </header>

      <!-- ==========================================================================
           MOBILE NAVIGATION DRAWER (ACCESSIBLE ACROSS ALL PHONES)
           ========================================================================== -->
      <div id="mobile-nav-backdrop"></div>
      <aside id="mobile-nav-drawer" aria-label="Mobile Navigation Drawer">
        <div class="space-y-5">
          <!-- Drawer Top: Brand & Close -->
          <div class="flex items-center justify-between pb-3 border-b border-white/10">
            <a href="index.html" class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center text-white font-bold shadow-md">
                ⚡
              </div>
              <span class="font-heading font-black text-lg text-white">
                TeamForge <span class="text-[10px] px-1 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono">AI</span>
              </span>
            </a>
            <button id="mobile-nav-close-btn" type="button" aria-label="Close Navigation" class="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer">
              ✕
            </button>
          </div>

          <!-- User Info Banner (Mobile) -->
          ${user ? `
            <div class="glass-card p-3 rounded-2xl border border-indigo-500/30 bg-indigo-950/20 flex items-center gap-3">
              <img src="${user.avatar || ('https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name) + '&background=6366f1&color=fff&bold=true&size=128')}" 
                   onerror="this.onerror=null; this.src='https://ui-avatars.com/api/?name=' + encodeURIComponent('${user.name}') + '&background=6366f1&color=fff&bold=true&size=128';"
                   class="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500/40 shrink-0">
              <div class="min-w-0 flex-1">
                <div class="text-xs font-bold text-white truncate">${user.name}</div>
                <div class="text-[11px] text-indigo-300 font-mono flex items-center gap-2 mt-0.5">
                  <span>⚡ ${user.credits || 200} cr</span>
                  <span class="text-amber-400">★ ${(user.rating !== undefined && user.rating !== null && !isNaN(Number(user.rating))) ? Number(user.rating).toFixed(1) : '5.0'}</span>
                </div>
              </div>
              <a href="profile.html?id=${user.id}" class="text-xs text-indigo-400 hover:text-indigo-300 p-1.5 rounded-lg hover:bg-white/5" title="View Profile">
                →
              </a>
            </div>
          ` : `
            <div class="glass-card p-3 rounded-2xl border border-white/10 text-center space-y-2">
              <div class="text-xs text-slate-300 font-medium">Join Student Collaboration Hub</div>
              <div class="grid grid-cols-2 gap-2">
                <a href="login.html" class="glass-card py-1.5 rounded-lg text-xs font-medium text-slate-200 text-center">Sign In</a>
                <a href="signup.html" class="btn-gradient py-1.5 rounded-lg text-xs font-bold text-center">Sign Up</a>
              </div>
            </div>
          `}

          <!-- Main Navigation Tabs -->
          <div>
            <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2 font-mono">Platform Navigation</div>
            <nav class="space-y-1">
              <a href="dashboard.html" class="mobile-nav-item ${activePage === 'dashboard' ? 'active' : ''}">
                <svg class="w-4 h-4 text-indigo-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                <span>Dashboard</span>
              </a>
              <a href="discover.html" class="mobile-nav-item ${activePage === 'discover' ? 'active' : ''}">
                <svg class="w-4 h-4 text-cyan-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                <span>Discover Peers</span>
              </a>
              <a href="ai-match.html" class="mobile-nav-item ${activePage === 'ai-match' ? 'active' : ''}">
                <span class="text-amber-400 text-sm shrink-0">✨</span>
                <span>AI Matching Studio</span>
              </a>
              <a href="teams.html" class="mobile-nav-item ${activePage === 'teams' ? 'active' : ''}">
                <svg class="w-4 h-4 text-purple-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                <span>Teams & Hubs</span>
              </a>
              <a href="chat.html" class="mobile-nav-item ${activePage === 'chat' ? 'active' : ''}">
                <svg class="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                <span>Team Chat & AI Bot</span>
              </a>
              <a href="opportunities.html" class="mobile-nav-item ${activePage === 'opportunities' ? 'active' : ''}">
                <svg class="w-4 h-4 text-rose-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                <span>Opportunities & Hiring</span>
              </a>
              <a href="events.html" class="mobile-nav-item ${activePage === 'events' ? 'active' : ''}">
                <svg class="w-4 h-4 text-yellow-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                <span>Hackathons & Events</span>
              </a>
              <a href="notifications.html" class="mobile-nav-item ${activePage === 'notifications' ? 'active' : ''}">
                <svg class="w-4 h-4 text-cyan-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                <span class="flex-1">Notifications</span>
                ${unreadCount > 0 ? `<span class="px-1.5 py-0.2 rounded-full bg-indigo-500 text-white text-[10px] font-bold">${unreadCount}</span>` : ''}
              </a>
              <a href="settings.html" class="mobile-nav-item ${activePage === 'settings' ? 'active' : ''}">
                <svg class="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                <span>Settings</span>
              </a>
            </nav>
          </div>

          <!-- My Teams List (if logged in) -->
          ${user ? `
            <div class="pt-2 border-t border-white/5">
              <div class="flex items-center justify-between px-3 mb-2">
                <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">My Teams</span>
                <a href="create-team.html" class="text-indigo-400 hover:text-indigo-300 text-xs font-bold">+ New</a>
              </div>
              <div class="space-y-1">
                ${userTeams.length > 0 ? userTeams.slice(0, 5).map(t => `
                  <a href="team.html?id=${t.id}" class="mobile-nav-item py-1.5 text-xs truncate">
                    <span class="w-2 h-2 rounded-full bg-indigo-500 shrink-0"></span>
                    <span class="truncate">${t.name}</span>
                  </a>
                `).join('') : `
                  <div class="px-3 py-1.5 text-xs text-slate-500 italic">No teams joined yet</div>
                `}
              </div>
            </div>
          ` : ''}

          <!-- Quick Action CTA Card -->
          <div class="glass-card p-3 rounded-xl border border-indigo-500/20 bg-indigo-950/20 text-center">
            <div class="text-xs font-semibold text-indigo-200">Have a project idea?</div>
            <p class="text-[11px] text-slate-400 mt-0.5 mb-2">Recruit students & specialists.</p>
            <a href="create-team.html" class="btn-gradient block w-full py-2 rounded-lg text-xs font-bold text-center">
              + Create Team
            </a>
          </div>
        </div>

        <!-- Drawer Footer: Logout & Copyright -->
        <div class="pt-4 border-t border-white/10 space-y-3">
          ${user ? `
            <button onclick="window.TF_AUTH.logout(); window.location.href='index.html';" class="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center gap-2 cursor-pointer">
              <span>🚪</span>
              <span>Sign Out</span>
            </button>
          ` : ''}
          <div class="text-[11px] text-slate-500 text-center">
            TeamForge AI • Built for Students
          </div>
        </div>
      </aside>
    `;

    const target = document.getElementById('teamforge-navbar');
    if (target) {
      target.innerHTML = navHtml;

      // Bind Mobile Drawer open/close events
      const toggleBtn = document.getElementById('mobile-sidebar-toggle');
      const closeBtn = document.getElementById('mobile-nav-close-btn');
      const backdrop = document.getElementById('mobile-nav-backdrop');
      const drawer = document.getElementById('mobile-nav-drawer');

      const openDrawer = () => {
        if (drawer && backdrop) {
          drawer.classList.add('open');
          backdrop.classList.add('open');
          document.body.classList.add('drawer-open');
        }
      };

      const closeDrawer = () => {
        if (drawer && backdrop) {
          drawer.classList.remove('open');
          backdrop.classList.remove('open');
          document.body.classList.remove('drawer-open');
        }
      };

      if (toggleBtn) {
        toggleBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          openDrawer();
        });
      }

      if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          closeDrawer();
        });
      }

      if (backdrop) {
        backdrop.addEventListener('click', closeDrawer);
      }

      // Close on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeDrawer();
      });

      // Bind profile menu toggle
      const profileBtn = document.getElementById('user-profile-menu-btn');
      const profileDropdown = document.getElementById('user-profile-dropdown');
      const profileChevron = document.getElementById('user-profile-chevron');

      if (profileBtn && profileDropdown) {
        profileBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const isHidden = profileDropdown.classList.contains('hidden');
          if (isHidden) {
            profileDropdown.classList.remove('hidden');
            if (profileChevron) profileChevron.classList.add('rotate-180');
          } else {
            profileDropdown.classList.add('hidden');
            if (profileChevron) profileChevron.classList.remove('rotate-180');
          }
        });
      }

      if (!window._tf_profile_click_bound) {
        document.addEventListener('click', (e) => {
          const container = document.getElementById('user-profile-menu-container');
          const dropdown = document.getElementById('user-profile-dropdown');
          const chevron = document.getElementById('user-profile-chevron');
          if (container && dropdown && !container.contains(e.target)) {
            dropdown.classList.add('hidden');
            if (chevron) chevron.classList.remove('rotate-180');
          }
        });
        window._tf_profile_click_bound = true;
      }
    }
  }

  static renderSidebar(activePage = '') {
    const user = window.TF_AUTH ? window.TF_AUTH.getCurrentUser() : null;
    const teams = window.TF_STORE ? window.TF_STORE.getTeams() : [];
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
                  <div class="w-2 h-2 rounded-full bg-indigo-500 shrink-0"></div>
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
          <div class="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-slate-400">
            <a href="discover.html" class="hover:text-indigo-400 py-1">Students</a>
            <a href="teams.html" class="hover:text-indigo-400 py-1">Teams</a>
            <a href="ai-match.html" class="hover:text-cyan-400 py-1">AI Matching</a>
            <a href="events.html" class="hover:text-indigo-400 py-1">Hackathons</a>
            <a href="settings.html" class="hover:text-indigo-400 py-1">Settings</a>
          </div>
          <div>Powered by Jaidev & Bhagavath with ❤️</div>
        </div>
      </footer>
    `;

    const target = document.getElementById('teamforge-footer');
    if (target) {
      target.innerHTML = footerHtml;
    }
  }

  static ensureFavicon() {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚡</text></svg>';
  }

  static initPage(activePage = '') {
    this.ensureFavicon();
    this.renderNavbar(activePage);
    this.renderSidebar(activePage);
    this.renderFooter();
  }
}

window.TF_UI = TeamForgeUI;
