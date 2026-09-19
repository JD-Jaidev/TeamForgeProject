// Supabase Client Wrapper & Responsive Local Store
// Handles real Supabase Postgres/Auth/Realtime when configured, and falls back to rich reactive store for 100% functional live experience.

const INITIAL_STUDENTS = [];

const INITIAL_TEAMS = [];

const INITIAL_TASKS = [];

const INITIAL_MESSAGES = [];

const INITIAL_REVIEWS = [];

const INITIAL_OPPORTUNITIES = [];

const INITIAL_EVENTS = [
  {
    id: "evt_01",
    title: "Global AI & Agentic Hackathon 2026",
    organizer: "DeepMind & OpenSource AI Foundation",
    description: "Build groundbreaking multi-agent systems, multimodal neural interfaces, and autonomous assistant workflows.",
    dates: "Oct 10 - Oct 12, 2026",
    deadline: "Oct 05, 2026",
    prize: "$100,000 in Prizes & GPU Grants",
    tags: ["Artificial Intelligence", "Autonomous Agents", "PyTorch", "NLP"],
    location: "Virtual / Global",
    mode: "Online",
    registrationLink: "https://hackathon.example.org/global-ai-2026",
    activeTeamsCount: 142
  },
  {
    id: "evt_02",
    title: "MIT Climate & Sustainable Tech Sprint",
    organizer: "MIT Energy Initiative",
    description: "Develop software solutions for carbon footprint auditing, decentralized energy grids, and circular economy tracking.",
    dates: "Nov 02 - Nov 06, 2026",
    deadline: "Oct 25, 2026",
    prize: "$50,000 + Venture Incubator Fast-Track",
    tags: ["Climate Tech", "Clean Energy", "Web3", "IoT"],
    location: "Cambridge, MA & Hybrid",
    mode: "Hybrid",
    registrationLink: "https://climate.mit.edu/sprint2026",
    activeTeamsCount: 68
  },
  {
    id: "evt_03",
    title: "RoboHack World 2026",
    organizer: "IEEE Robotics & Automation Society",
    description: "Autonomous drone navigation, computer vision challenges, and industrial robotics inspection algorithms.",
    dates: "Nov 18 - Nov 20, 2026",
    deadline: "Nov 10, 2026",
    prize: "$75,000 Robotics Hardware Grants",
    tags: ["Robotics", "Computer Vision", "ROS2", "C++", "Edge AI"],
    location: "San Francisco, CA & Online",
    mode: "Hybrid",
    registrationLink: "https://roboworld.example.com",
    activeTeamsCount: 94
  },
  {
    id: "evt_04",
    title: "Berkeley Blockchain & ZK Summit Hack",
    organizer: "Blockchain at Berkeley",
    description: "Zero-knowledge proofs, privacy-preserving decentralized finance, and modular rollups.",
    dates: "Dec 01 - Dec 03, 2026",
    deadline: "Nov 20, 2026",
    prize: "$60,000 Seed Bounty",
    tags: ["Web3", "Solidity", "ZK-Rollups", "Rust"],
    location: "Berkeley, CA",
    mode: "In-Person",
    registrationLink: "https://berkeleyblockchain.org/summit2026",
    activeTeamsCount: 51
  }
];

const INITIAL_NOTIFICATIONS = [];

class TeamForgeStore {
  constructor() {
    this.init();
  }

  normalizeStudent(s) {
    if (!s || (!s.name && !s.email)) return null;
    const name = s.name || (s.email ? s.email.split('@')[0] : "Student Builder");
    const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&bold=true&size=128`;
    const avatar = (s.avatar && typeof s.avatar === 'string' && s.avatar.startsWith('http') && !s.avatar.includes('undefined'))
      ? s.avatar
      : fallbackAvatar;

    return {
      id: s.id || ('usr_' + Math.random().toString(36).substr(2, 9)),
      name: name,
      email: s.email || '',
      avatar: avatar,
      college: s.college || '',
      role: s.role || 'Full Stack Developer',
      bio: s.bio || '',
      experience: s.experience || 'Intermediate (2 yrs)',
      availability: s.availability || '15-20 hrs/week',
      skills: (Array.isArray(s.skills) && s.skills.length > 0) ? s.skills : ['JavaScript', 'Python'],
      domains: (Array.isArray(s.domains) && s.domains.length > 0) ? s.domains : ['Full Stack & Web'],
      rating: (s.rating !== undefined && s.rating !== null && !isNaN(Number(s.rating))) ? Number(s.rating) : 5.0,
      credits: (s.credits !== undefined && s.credits !== null && !isNaN(Number(s.credits))) ? Number(s.credits) : 200,
      reviewCount: (s.reviewCount !== undefined && s.reviewCount !== null && !isNaN(Number(s.reviewCount))) ? Number(s.reviewCount) : 0,
      github: s.github || '',
      linkedin: s.linkedin || '',
      portfolio: s.portfolio || '',
      preferredRoles: s.preferredRoles || [s.role || 'Developer'],
      projects: s.projects || [],
      verifiedBadge: Boolean(s.verifiedBadge)
    };
  }

  init() {
    let existingStudents = [];
    const stored = localStorage.getItem('tf_students');
    if (stored !== null) {
      try {
        existingStudents = JSON.parse(stored || '[]');
      } catch(e) {
        existingStudents = [];
      }
    }

    // Clean up any old mock/example profiles or example.com emails
    existingStudents = existingStudents.filter(s => 
      s && 
      s.id !== 'usr_alex_01' && 
      s.id !== 'usr_jaidev_01' && 
      s.id !== 'usr_bhagavth_01' && 
      (!s.email || !s.email.toLowerCase().includes('example.com'))
    );

    // Normalize existing real students
    let mergedStudents = existingStudents.map(s => this.normalizeStudent(s)).filter(Boolean);
    localStorage.setItem('tf_students', JSON.stringify(mergedStudents));

    if (!localStorage.getItem('tf_teams')) {
      localStorage.setItem('tf_teams', JSON.stringify(INITIAL_TEAMS));
    }
    if (!localStorage.getItem('tf_tasks')) {
      localStorage.setItem('tf_tasks', JSON.stringify(INITIAL_TASKS));
    }
    if (!localStorage.getItem('tf_messages')) {
      localStorage.setItem('tf_messages', JSON.stringify(INITIAL_MESSAGES));
    }
    if (!localStorage.getItem('tf_reviews')) {
      localStorage.setItem('tf_reviews', JSON.stringify(INITIAL_REVIEWS));
    }
    if (!localStorage.getItem('tf_opportunities')) {
      localStorage.setItem('tf_opportunities', JSON.stringify(INITIAL_OPPORTUNITIES));
    }
    if (!localStorage.getItem('tf_events')) {
      localStorage.setItem('tf_events', JSON.stringify(INITIAL_EVENTS));
    }
    if (!localStorage.getItem('tf_notifications')) {
      localStorage.setItem('tf_notifications', JSON.stringify(INITIAL_NOTIFICATIONS));
    }

    this.initRealtimePeerSync();
  }

  getStudents() {
    const raw = JSON.parse(localStorage.getItem('tf_students') || '[]');
    return raw.map(s => this.normalizeStudent(s)).filter(s => s && (!s.email || !s.email.toLowerCase().includes('example.com')));
  }

  getStudentById(id) {
    const list = this.getStudents();
    return list.find(s => s.id === id) || null;
  }

  saveStudent(student) {
    const normalized = this.normalizeStudent(student);
    if (!normalized) return student;

    const list = this.getStudents();
    const index = list.findIndex(s => s.id === normalized.id || (s.email && normalized.email && s.email.toLowerCase() === normalized.email.toLowerCase()) || (s.name && normalized.name && s.name.toLowerCase() === normalized.name.toLowerCase()));
    if (index >= 0) {
      list[index] = { ...list[index], ...normalized };
    } else {
      list.push(normalized);
    }
    localStorage.setItem('tf_students', JSON.stringify(list));
    this.broadcastStudentToCloud(normalized);
    return normalized;
  }

  deleteStudent(id) {
    let list = this.getStudents();
    const target = list.find(s => s.id === id);
    if (!target) return false;

    list = list.filter(s => s.id !== id);
    localStorage.setItem('tf_students', JSON.stringify(list));

    // If active session belongs to this student, sign out
    const currentUserId = localStorage.getItem('tf_current_user_id');
    if (currentUserId === id) {
      localStorage.removeItem('tf_current_user_id');
    }

    // Clean up from teams
    let teams = this.getTeams();
    teams = teams.map(t => ({
      ...t,
      members: (t.members || []).filter(m => m.userId !== id),
      guests: (t.guests || []).filter(g => g.userId !== id),
      joinRequests: (t.joinRequests || []).filter(r => r.userId !== id)
    })).filter(t => t.ownerId !== id);
    localStorage.setItem('tf_teams', JSON.stringify(teams));

    this.deleteStudentFromCloud(id);
    return true;
  }

  PEER_CHANNEL = 'teamforge_peers_sync_net_v1';

  initRealtimePeerSync() {
    if (this._realtimeInitialized) return;
    this._realtimeInitialized = true;

    // 1. Initial background fetch from peer channel
    this.syncCloudPeers();

    // 2. Realtime SSE stream for instant cross-device updates
    try {
      if (typeof EventSource !== 'undefined') {
        const es = new EventSource(`https://ntfy.sh/${this.PEER_CHANNEL}/sse`);
        es.onmessage = (event) => {
          try {
            const msg = JSON.parse(event.data);
            if (msg && msg.message) {
              const payload = JSON.parse(msg.message);
              if (payload.action === 'upsert_student' && payload.student) {
                this.ingestCloudStudent(payload.student);
              } else if (payload.action === 'delete_student' && payload.studentId) {
                let list = this.getStudents().filter(s => s.id !== payload.studentId);
                localStorage.setItem('tf_students', JSON.stringify(list));
                window.dispatchEvent(new CustomEvent('tf_students_updated'));
              }
            }
          } catch (e) {}
        };
      }
    } catch (err) {
      console.warn("SSE stream setup warning:", err);
    }
  }

  ingestCloudStudent(cloudStudent) {
    if (!cloudStudent || (!cloudStudent.name && !cloudStudent.email)) return;
    if (cloudStudent.email && cloudStudent.email.toLowerCase().includes('example.com')) return;

    const normalized = this.normalizeStudent(cloudStudent);
    if (!normalized) return;

    const localStudents = this.getStudents();
    const idx = localStudents.findIndex(s => 
      s.id === normalized.id || 
      (s.email && normalized.email && s.email.toLowerCase() === normalized.email.toLowerCase()) || 
      (s.name && normalized.name && s.name.toLowerCase() === normalized.name.toLowerCase())
    );

    if (idx >= 0) {
      localStudents[idx] = this.normalizeStudent({ ...localStudents[idx], ...normalized });
    } else {
      localStudents.push(normalized);
    }

    localStorage.setItem('tf_students', JSON.stringify(localStudents));
    window.dispatchEvent(new CustomEvent('tf_students_updated'));
  }

  async broadcastStudentToCloud(student) {
    const normalized = this.normalizeStudent(student);
    if (!normalized) return;
    if (normalized.email && normalized.email.toLowerCase().includes('example.com')) return;

    try {
      await fetch(`https://ntfy.sh/${this.PEER_CHANNEL}`, {
        method: 'POST',
        headers: { 'Title': 'Peer Sync', 'Tags': 'user' },
        body: JSON.stringify({
          action: 'upsert_student',
          student: normalized,
          timestamp: new Date().toISOString()
        })
      });
    } catch (err) {
      console.warn("Cloud peer broadcast error:", err);
    }
  }

  async deleteStudentFromCloud(id) {
    try {
      await fetch(`https://ntfy.sh/${this.PEER_CHANNEL}`, {
        method: 'POST',
        headers: { 'Title': 'Peer Delete', 'Tags': 'wastebasket' },
        body: JSON.stringify({
          action: 'delete_student',
          studentId: id,
          timestamp: new Date().toISOString()
        })
      });
    } catch (err) {
      console.warn("Cloud student delete error:", err);
    }
  }

  async syncCloudPeers() {
    let syncedCount = 0;
    try {
      const res = await fetch(`https://ntfy.sh/${this.PEER_CHANNEL}/json?poll=1&since=all`, { cache: 'no-store' });
      if (res.ok) {
        const text = await res.text();
        const lines = text.trim().split('\n').filter(Boolean);
        lines.forEach(line => {
          try {
            const data = JSON.parse(line);
            if (data && data.message) {
              const payload = JSON.parse(data.message);
              if (payload.action === 'upsert_student' && payload.student) {
                this.ingestCloudStudent(payload.student);
                syncedCount++;
              } else if (payload.action === 'delete_student' && payload.studentId) {
                let list = this.getStudents().filter(s => s.id !== payload.studentId);
                localStorage.setItem('tf_students', JSON.stringify(list));
              }
            }
          } catch (e) {}
        });
      }
    } catch (err) {
      console.warn("Sync cloud peers error:", err);
    }

    // Publish current logged-in user so peers discover it immediately
    const currentUser = window.TF_AUTH ? window.TF_AUTH.getCurrentUser() : null;
    if (currentUser && (!currentUser.email || !currentUser.email.toLowerCase().includes('example.com'))) {
      this.broadcastStudentToCloud(currentUser);
    }

    window.dispatchEvent(new CustomEvent('tf_students_updated'));
    return syncedCount;
  }

  async syncFromSupabase() {
    if (!window.TF_CONFIG || !window.TF_CONFIG.isSupabaseConfigured()) return;
    try {
      const url = `${window.TF_CONFIG.SUPABASE_URL}/rest/v1/profiles?select=*`;
      const res = await fetch(url, {
        headers: {
          'apikey': window.TF_CONFIG.SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${window.TF_CONFIG.SUPABASE_ANON_KEY}`
        }
      });
      if (res.ok) {
        const remoteProfiles = await res.json();
        if (Array.isArray(remoteProfiles) && remoteProfiles.length > 0) {
          const localStudents = this.getStudents();
          remoteProfiles.forEach(rp => {
            const mapped = {
              id: rp.id,
              name: rp.name,
              email: rp.email,
              avatar: rp.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(rp.name)}`,
              college: rp.college || "Tech University",
              bio: rp.bio || "",
              role: rp.role || "Full Stack Developer",
              experience: rp.experience || "Intermediate",
              availability: rp.availability || "15-20 hrs/week",
              skills: Array.isArray(rp.skills) ? rp.skills : (rp.skills ? rp.skills.split(',').map(s=>s.trim()) : ["Python", "JavaScript"]),
              domains: rp.domains || ["Artificial Intelligence", "Full Stack & Web"],
              rating: Number(rp.rating) || 5.0,
              credits: Number(rp.credits) || 200,
              reviewCount: Number(rp.review_count) || 0,
              github: rp.github_url || "",
              linkedin: rp.linkedin_url || "",
              portfolio: rp.portfolio_url || "",
              verifiedBadge: rp.verified || false
            };
            const idx = localStudents.findIndex(s => s.id === mapped.id || (s.email && mapped.email && s.email.toLowerCase() === mapped.email.toLowerCase()));
            if (idx >= 0) {
              localStudents[idx] = { ...localStudents[idx], ...mapped };
            } else {
              localStudents.push(mapped);
            }
          });
          localStorage.setItem('tf_students', JSON.stringify(localStudents));
        }
      }
    } catch (e) {
      console.warn("Supabase sync warning:", e);
    }
  }

  getTeams() {
    return JSON.parse(localStorage.getItem('tf_teams') || '[]');
  }

  getTeamById(id) {
    const list = this.getTeams();
    return list.find(t => t.id === id) || null;
  }

  saveTeam(team) {
    const list = this.getTeams();
    const index = list.findIndex(t => t.id === team.id);
    if (index >= 0) {
      list[index] = { ...list[index], ...team };
    } else {
      list.unshift(team);
    }
    localStorage.setItem('tf_teams', JSON.stringify(list));
    return team;
  }

  getTasks(teamId) {
    const list = JSON.parse(localStorage.getItem('tf_tasks') || '[]');
    return teamId ? list.filter(t => t.teamId === teamId) : list;
  }

  saveTask(task) {
    const list = JSON.parse(localStorage.getItem('tf_tasks') || '[]');
    const index = list.findIndex(t => t.id === task.id);
    if (index >= 0) {
      list[index] = { ...list[index], ...task };
    } else {
      list.push(task);
    }
    localStorage.setItem('tf_tasks', JSON.stringify(list));
    return task;
  }

  deleteTask(taskId) {
    let list = JSON.parse(localStorage.getItem('tf_tasks') || '[]');
    list = list.filter(t => t.id !== taskId);
    localStorage.setItem('tf_tasks', JSON.stringify(list));
  }

  getMessages(teamId) {
    const list = JSON.parse(localStorage.getItem('tf_messages') || '[]');
    return teamId ? list.filter(m => m.teamId === teamId) : list;
  }

  addMessage(msg) {
    const list = JSON.parse(localStorage.getItem('tf_messages') || '[]');
    const newMsg = {
      id: "msg_" + Date.now(),
      timestamp: new Date().toISOString(),
      ...msg
    };
    list.push(newMsg);
    localStorage.setItem('tf_messages', JSON.stringify(list));
    return newMsg;
  }

  getReviews(targetUserId) {
    const list = JSON.parse(localStorage.getItem('tf_reviews') || '[]');
    return targetUserId ? list.filter(r => r.targetUserId === targetUserId) : list;
  }

  addReview(review) {
    const list = JSON.parse(localStorage.getItem('tf_reviews') || '[]');
    const newRev = {
      id: "rev_" + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
      ...review
    };
    list.unshift(newRev);
    localStorage.setItem('tf_reviews', JSON.stringify(list));

    // Update target student ratings and credits
    const student = this.getStudentById(review.targetUserId);
    if (student) {
      const studentReviews = list.filter(r => r.targetUserId === review.targetUserId);
      const avg = studentReviews.reduce((acc, curr) => acc + curr.rating, 0) / studentReviews.length;
      student.rating = Number(avg.toFixed(2));
      student.credits = (student.credits || 0) + (review.creditsAwarded || 50);
      student.reviewCount = studentReviews.length;
      this.saveStudent(student);
    }
    return newRev;
  }

  getOpportunities() {
    return JSON.parse(localStorage.getItem('tf_opportunities') || '[]');
  }

  saveOpportunity(opp) {
    const list = this.getOpportunities();
    const index = list.findIndex(o => o.id === opp.id);
    if (index >= 0) {
      list[index] = { ...list[index], ...opp };
    } else {
      list.unshift(opp);
    }
    localStorage.setItem('tf_opportunities', JSON.stringify(list));
    return opp;
  }

  getEvents() {
    return JSON.parse(localStorage.getItem('tf_events') || '[]');
  }

  saveEvent(event) {
    const list = this.getEvents();
    const index = list.findIndex(e => e.id === event.id);
    if (index >= 0) {
      list[index] = { ...list[index], ...event };
    } else {
      list.unshift(event);
    }
    localStorage.setItem('tf_events', JSON.stringify(list));
    return event;
  }

  deleteEvent(eventId) {
    let list = this.getEvents();
    list = list.filter(e => e.id !== eventId);
    localStorage.setItem('tf_events', JSON.stringify(list));
  }

  getNotifications(userId) {
    const list = JSON.parse(localStorage.getItem('tf_notifications') || '[]');
    return userId ? list.filter(n => n.userId === userId) : list;
  }

  addNotification(notif) {
    const list = JSON.parse(localStorage.getItem('tf_notifications') || '[]');
    const newNotif = {
      id: "notif_" + Date.now(),
      timestamp: new Date().toISOString(),
      isRead: false,
      ...notif
    };
    list.unshift(newNotif);
    localStorage.setItem('tf_notifications', JSON.stringify(list));
    return newNotif;
  }

  markNotificationRead(id) {
    const list = JSON.parse(localStorage.getItem('tf_notifications') || '[]');
    const item = list.find(n => n.id === id);
    if (item) {
      item.isRead = true;
      localStorage.setItem('tf_notifications', JSON.stringify(list));
    }
  }

  resetDemoData() {
    localStorage.removeItem('tf_students');
    localStorage.removeItem('tf_teams');
    localStorage.removeItem('tf_tasks');
    localStorage.removeItem('tf_messages');
    localStorage.removeItem('tf_reviews');
    localStorage.removeItem('tf_opportunities');
    localStorage.removeItem('tf_events');
    localStorage.removeItem('tf_notifications');
    this.init();
  }
}

window.TF_STORE = new TeamForgeStore();
