// Supabase Client Wrapper & Responsive Local Store
// Handles real Supabase Postgres/Auth/Realtime when configured, and falls back to rich reactive store for 100% functional live experience.

const INITIAL_STUDENTS = [
  {
    id: "usr_jaidev_01",
    name: "Jaidev S",
    email: "jaidev@example.com",
    avatar: "https://ui-avatars.com/api/?name=Jaidev+S&background=6366f1&color=fff&bold=true&size=128",
    college: "Sri Sairam college of Engineering",
    role: "Full Stack Developer & AI Lead",
    bio: "Passionate developer building scalable web applications, real-time collaboration platforms, and AI agents.",
    experience: "Intermediate (2 yrs)",
    availability: "20 hrs/week",
    skills: ["Python", "React", "Node.js", "FastAPI", "PyTorch", "UI/UX Design"],
    domains: ["Full Stack & Web", "Artificial Intelligence", "UI/UX & Frontend"],
    rating: 5.0,
    credits: 200,
    reviewCount: 0,
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    portfolio: "",
    preferredRoles: ["Full Stack Developer", "AI Engineer"],
    projects: [],
    verifiedBadge: true
  },
  {
    id: "usr_bhagavth_01",
    name: "Bhagavth Kumar G",
    email: "bhagavth@example.com",
    avatar: "https://ui-avatars.com/api/?name=Bhagavth+Kumar+G&background=4f46e5&color=fff&bold=true&size=128",
    college: "Sri Sairam college of Engineering",
    role: "Full Stack Developer",
    bio: "Ambition student developer ready to collaborate on innovative projects.",
    experience: "Intermediate (2 yrs)",
    availability: "15-20 hrs/week",
    skills: ["Full Stack", "JavaScript", "Python", "React", "Tailwind", "Node.js", "Docker"],
    domains: ["Full Stack & Web", "Artificial Intelligence", "Cloud Infrastructure"],
    rating: 5.0,
    credits: 200,
    reviewCount: 0,
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    portfolio: "",
    preferredRoles: ["Full Stack Developer"],
    projects: [],
    verifiedBadge: true
  }
];

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
      email: s.email || `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}@example.com`,
      avatar: avatar,
      college: s.college || "Sri Sairam college of Engineering",
      role: s.role || "Full Stack Developer",
      bio: s.bio || "Ambition student developer ready to collaborate on innovative projects.",
      experience: s.experience || "Intermediate (2 yrs)",
      availability: s.availability || "15-20 hrs/week",
      skills: (Array.isArray(s.skills) && s.skills.length > 0) ? s.skills : ["JavaScript", "Python", "React", "Node.js"],
      domains: (Array.isArray(s.domains) && s.domains.length > 0) ? s.domains : ["Full Stack & Web", "Artificial Intelligence"],
      rating: (s.rating !== undefined && s.rating !== null && !isNaN(Number(s.rating))) ? Number(s.rating) : 5.0,
      credits: (s.credits !== undefined && s.credits !== null && !isNaN(Number(s.credits))) ? Number(s.credits) : 200,
      reviewCount: (s.reviewCount !== undefined && s.reviewCount !== null && !isNaN(Number(s.reviewCount))) ? Number(s.reviewCount) : 0,
      github: s.github || "https://github.com",
      linkedin: s.linkedin || "https://linkedin.com",
      portfolio: s.portfolio || "",
      preferredRoles: s.preferredRoles || [s.role || "Developer"],
      projects: s.projects || [],
      verifiedBadge: s.verifiedBadge !== undefined ? Boolean(s.verifiedBadge) : true
    };
  }

  init() {
    let existingStudents = [];
    try {
      existingStudents = JSON.parse(localStorage.getItem('tf_students') || '[]');
    } catch(e) {
      existingStudents = [];
    }

    // Clean up old mock users
    existingStudents = existingStudents.filter(s => s && s.id !== 'usr_alex_01');

    // Normalize existing students and repair any broken avatar/rating
    let mergedStudents = existingStudents.map(s => this.normalizeStudent(s)).filter(Boolean);

    // Ensure INITIAL_STUDENTS exist in the list
    INITIAL_STUDENTS.forEach(initStudent => {
      const idx = mergedStudents.findIndex(s => 
        (s.id && s.id === initStudent.id) || 
        (s.email && initStudent.email && s.email.toLowerCase() === initStudent.email.toLowerCase()) ||
        (s.name && initStudent.name && s.name.toLowerCase() === initStudent.name.toLowerCase())
      );
      if (idx >= 0) {
        mergedStudents[idx] = this.normalizeStudent({ ...initStudent, ...mergedStudents[idx] });
      } else {
        mergedStudents.push(this.normalizeStudent(initStudent));
      }
    });

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
  }

  getStudents() {
    const raw = JSON.parse(localStorage.getItem('tf_students') || '[]');
    return raw.map(s => this.normalizeStudent(s)).filter(Boolean);
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

  GLOBAL_REGISTRY_ID = 'ff808181a09d98f701a0ba86f516487b';

  async broadcastStudentToCloud(student) {
    const normalized = this.normalizeStudent(student);
    if (!normalized) return;

    try {
      // 1. Supabase (if configured)
      if (window.TF_CONFIG && window.TF_CONFIG.isSupabaseConfigured()) {
        await this.saveStudentRemote(normalized);
      }

      // 2. Global Universal Cloud Peer Relay (for zero-config cross-device visibility)
      const res = await fetch(`https://api.restful-api.dev/objects/${this.GLOBAL_REGISTRY_ID}`, { cache: 'no-store' });
      let currentStudents = [];
      if (res.ok) {
        const doc = await res.json();
        if (doc && doc.data && Array.isArray(doc.data.students)) {
          currentStudents = doc.data.students.map(s => this.normalizeStudent(s)).filter(Boolean);
        }
      }

      // Merge current student
      const idx = currentStudents.findIndex(s => s.id === normalized.id || (s.email && normalized.email && s.email.toLowerCase() === normalized.email.toLowerCase()) || (s.name && normalized.name && s.name.toLowerCase() === normalized.name.toLowerCase()));
      if (idx >= 0) {
        currentStudents[idx] = { ...currentStudents[idx], ...normalized };
      } else {
        currentStudents.push(normalized);
      }

      // Update registry
      await fetch(`https://api.restful-api.dev/objects/${this.GLOBAL_REGISTRY_ID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'teamforge_global_peer_registry',
          data: {
            students: currentStudents,
            updatedAt: new Date().toISOString()
          }
        })
      });
    } catch (err) {
      console.warn("Cloud peer broadcast warning:", err);
    }
  }

  async saveStudentRemote(student) {
    if (!window.TF_CONFIG || !window.TF_CONFIG.isSupabaseConfigured()) return;
    try {
      const url = `${window.TF_CONFIG.SUPABASE_URL}/rest/v1/profiles`;
      await fetch(url, {
        method: 'POST',
        headers: {
          'apikey': window.TF_CONFIG.SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${window.TF_CONFIG.SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify({
          email: student.email,
          name: student.name,
          avatar_url: student.avatar,
          college: student.college,
          bio: student.bio,
          role: student.role,
          experience: student.experience,
          availability: student.availability,
          rating: student.rating,
          credits: student.credits,
          review_count: student.reviewCount,
          github_url: student.github,
          linkedin_url: student.linkedin,
          portfolio_url: student.portfolio
        })
      });
    } catch (e) {
      console.warn("Remote profile save warning:", e);
    }
  }

  async syncCloudPeers() {
    let syncedCount = 0;

    // 1. Supabase Sync (if configured)
    if (window.TF_CONFIG && window.TF_CONFIG.isSupabaseConfigured()) {
      await this.syncFromSupabase();
    }

    // 2. Dedicated Global Cloud Peer Registry Sync
    try {
      const res = await fetch(`https://api.restful-api.dev/objects/${this.GLOBAL_REGISTRY_ID}`, { cache: 'no-store' });
      if (res.ok) {
        const doc = await res.json();
        if (doc && doc.data && Array.isArray(doc.data.students)) {
          const cloudStudents = doc.data.students.map(s => this.normalizeStudent(s)).filter(Boolean);
          if (cloudStudents.length > 0) {
            const localStudents = this.getStudents();
            cloudStudents.forEach(cs => {
              if (!cs) return;
              const idx = localStudents.findIndex(s => s.id === cs.id || (s.email && cs.email && s.email.toLowerCase() === cs.email.toLowerCase()) || (s.name && cs.name && s.name.toLowerCase() === cs.name.toLowerCase()));
              if (idx >= 0) {
                localStudents[idx] = this.normalizeStudent({ ...localStudents[idx], ...cs });
              } else {
                localStudents.push(cs);
                syncedCount++;
              }
            });
            localStorage.setItem('tf_students', JSON.stringify(localStudents));
          }
        }
      }
    } catch (err) {
      console.warn("Universal cloud sync error:", err);
    }

    // Also ensure current logged-in user is published to registry
    const currentUser = window.TF_AUTH ? window.TF_AUTH.getCurrentUser() : null;
    if (currentUser) {
      this.broadcastStudentToCloud(currentUser);
    }

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
