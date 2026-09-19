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

  init() {
    // If students contain old mock users from previous sessions, clear them so user starts from scratch
    const existingStudents = JSON.parse(localStorage.getItem('tf_students') || '[]');
    const hasMockStudents = existingStudents.some(s => s.id && s.id.startsWith('usr_alex_01'));
    if (hasMockStudents) {
      localStorage.removeItem('tf_students');
      localStorage.removeItem('tf_teams');
      localStorage.removeItem('tf_tasks');
      localStorage.removeItem('tf_messages');
      localStorage.removeItem('tf_reviews');
      localStorage.removeItem('tf_opportunities');
      localStorage.removeItem('tf_notifications');
      localStorage.removeItem('tf_current_user_id');
    }

    if (!localStorage.getItem('tf_students')) {
      localStorage.setItem('tf_students', JSON.stringify(INITIAL_STUDENTS));
    }
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
    return JSON.parse(localStorage.getItem('tf_students') || '[]');
  }

  getStudentById(id) {
    const list = this.getStudents();
    return list.find(s => s.id === id) || null;
  }

  saveStudent(student) {
    const list = this.getStudents();
    const index = list.findIndex(s => s.id === student.id || (s.email && student.email && s.email.toLowerCase() === student.email.toLowerCase()));
    if (index >= 0) {
      list[index] = { ...list[index], ...student };
    } else {
      list.push(student);
    }
    localStorage.setItem('tf_students', JSON.stringify(list));
    this.saveStudentRemote(student);
    return student;
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
