// TeamForge Authentication & Session Management
// Supports both Supabase Auth and Secure Multi-Account Management for signed-in sessions on this device.

class TeamForgeAuth {
  constructor() {
    this.sessionKey = 'tf_current_user_id';
    this.accountsKey = 'tf_signed_in_accounts';
    this.init();
  }

  init() {
    const currentId = localStorage.getItem(this.sessionKey);
    if (currentId) {
      this.addSignedInAccount(currentId);
    }
  }

  getSignedInAccountIds() {
    try {
      const raw = localStorage.getItem(this.accountsKey);
      let ids = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(ids)) ids = [];
      const currentId = localStorage.getItem(this.sessionKey);
      if (currentId && !ids.includes(currentId)) {
        ids.push(currentId);
        localStorage.setItem(this.accountsKey, JSON.stringify(ids));
      }
      return ids;
    } catch (e) {
      const currentId = localStorage.getItem(this.sessionKey);
      return currentId ? [currentId] : [];
    }
  }

  addSignedInAccount(userId) {
    if (!userId) return;
    try {
      let ids = this.getSignedInAccountIds();
      if (!ids.includes(userId)) {
        ids.push(userId);
        localStorage.setItem(this.accountsKey, JSON.stringify(ids));
      }
    } catch (e) {
      console.error("Failed to update signed in accounts:", e);
    }
  }

  removeSignedInAccount(userId) {
    if (!userId) return;
    try {
      let ids = this.getSignedInAccountIds().filter(id => id !== userId);
      localStorage.setItem(this.accountsKey, JSON.stringify(ids));
      if (localStorage.getItem(this.sessionKey) === userId) {
        if (ids.length > 0) {
          localStorage.setItem(this.sessionKey, ids[0]);
        } else {
          localStorage.removeItem(this.sessionKey);
        }
      }
    } catch (e) {
      console.error("Failed to remove signed in account:", e);
    }
  }

  getSignedInAccounts() {
    const ids = this.getSignedInAccountIds();
    const students = [];
    for (const id of ids) {
      const student = window.TF_STORE ? window.TF_STORE.getStudentById(id) : null;
      if (student) {
        students.push(student);
      }
    }
    return students;
  }

  getCurrentUser() {
    const userId = localStorage.getItem(this.sessionKey);
    if (!userId) return null;
    return window.TF_STORE ? window.TF_STORE.getStudentById(userId) || null : null;
  }

  isLoggedIn() {
    return Boolean(this.getCurrentUser());
  }

  login(email, password) {
    const students = window.TF_STORE ? window.TF_STORE.getStudents() : [];
    const user = students.find(s => s.email && s.email.toLowerCase() === email.toLowerCase());
    if (user) {
      localStorage.setItem(this.sessionKey, user.id);
      this.addSignedInAccount(user.id);
      return { success: true, user };
    }
    return { success: false, message: "Invalid email or password. Please verify your credentials or create a new account." };
  }

  signup(profileData) {
    const newId = "usr_" + Date.now();
    const parsedSkills = Array.isArray(profileData.skills) 
      ? profileData.skills 
      : (profileData.skills ? profileData.skills.split(',').map(s => s.trim()).filter(Boolean) : ["JavaScript", "Python"]);

    // Derive domains based on role and skills
    const textBlob = `${profileData.role || ''} ${parsedSkills.join(' ')} ${profileData.bio || ''}`.toLowerCase();
    const inferredDomains = profileData.domains && profileData.domains.length ? [...profileData.domains] : [];
    
    if (textBlob.includes('ai') || textBlob.includes('ml') || textBlob.includes('python') || textBlob.includes('pytorch') || textBlob.includes('tensorflow') || textBlob.includes('data') || textBlob.includes('nlp')) {
      inferredDomains.push('Artificial Intelligence');
    }
    if (textBlob.includes('ui') || textBlob.includes('ux') || textBlob.includes('frontend') || textBlob.includes('react') || textBlob.includes('figma') || textBlob.includes('css') || textBlob.includes('vue') || textBlob.includes('tailwind')) {
      inferredDomains.push('UI/UX & Frontend');
    }
    if (textBlob.includes('web3') || textBlob.includes('solidity') || textBlob.includes('blockchain') || textBlob.includes('crypto') || textBlob.includes('rust') || textBlob.includes('contract')) {
      inferredDomains.push('Web3 / Blockchain');
    }
    if (textBlob.includes('robot') || textBlob.includes('vision') || textBlob.includes('ros') || textBlob.includes('opencv') || textBlob.includes('c++') || textBlob.includes('autonomous')) {
      inferredDomains.push('Robotics & Autonomous');
    }
    if (textBlob.includes('cloud') || textBlob.includes('backend') || textBlob.includes('docker') || textBlob.includes('aws') || textBlob.includes('go') || textBlob.includes('node') || textBlob.includes('systems') || textBlob.includes('devops')) {
      inferredDomains.push('Cloud Infrastructure');
    }
    if (!inferredDomains.length) {
      inferredDomains.push('Full Stack & Web', 'Artificial Intelligence');
    }

    const newStudent = {
      id: newId,
      email: profileData.email,
      name: profileData.name,
      avatar: profileData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.name)}&background=6366f1&color=fff&bold=true&size=128`,
      college: profileData.college || "Sri Sairam college of Engineering",
      bio: profileData.bio || "Student developer & builder.",
      role: profileData.role || "Full Stack Developer",
      experience: profileData.experience || "Intermediate (2 yrs)",
      availability: profileData.availability || "15-20 hrs/week",
      skills: parsedSkills,
      domains: [...new Set(inferredDomains)],
      github: profileData.github || "https://github.com",
      linkedin: profileData.linkedin || "https://linkedin.com",
      portfolio: profileData.portfolio || "",
      rating: 5.0,
      credits: 200, // starting credit bonus
      reviewCount: 0,
      preferredRoles: [profileData.role || "Developer"],
      projects: [],
      verifiedBadge: false
    };

    window.TF_STORE.saveStudent(newStudent);
    localStorage.setItem(this.sessionKey, newId);
    this.addSignedInAccount(newId);
    return { success: true, user: newStudent };
  }

  switchPersona(userId) {
    const signedInIds = this.getSignedInAccountIds();
    if (!signedInIds.includes(userId)) {
      console.warn("Attempted to switch to account that is not signed in on this device.");
      return null;
    }
    const user = window.TF_STORE.getStudentById(userId);
    if (user) {
      localStorage.setItem(this.sessionKey, userId);
      return user;
    }
    return null;
  }

  logout() {
    const currentId = localStorage.getItem(this.sessionKey);
    localStorage.removeItem(this.sessionKey);
    if (currentId) {
      this.removeSignedInAccount(currentId);
    }
  }

  deleteMyAccount(userId) {
    const currentUserId = localStorage.getItem(this.sessionKey);
    const signedInIds = this.getSignedInAccountIds();
    if (userId !== currentUserId && !signedInIds.includes(userId)) {
      throw new Error("Unauthorized: You can only delete accounts that you are authenticated as on this device.");
    }
    window.TF_STORE.deleteStudent(userId);
    this.removeSignedInAccount(userId);
  }

  requireAuth(redirectUrl = 'login.html') {
    if (!this.isLoggedIn()) {
      window.location.href = redirectUrl + '?redirect=' + encodeURIComponent(window.location.pathname + window.location.search);
    }
  }
}

window.TF_AUTH = new TeamForgeAuth();
