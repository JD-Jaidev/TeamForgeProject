// TeamForge Authentication & Session Management
// Supports both Supabase Auth and Instant Persona Switching for seamless exploration.

class TeamForgeAuth {
  constructor() {
    this.sessionKey = 'tf_current_user_id';
    this.init();
  }

  init() {
    // Start strictly unauthenticated unless user has explicitly logged in
  }

  getCurrentUser() {
    const userId = localStorage.getItem(this.sessionKey);
    if (!userId) return null;
    return window.TF_STORE.getStudentById(userId) || null;
  }

  isLoggedIn() {
    return Boolean(this.getCurrentUser());
  }

  login(email, password) {
    const students = window.TF_STORE.getStudents();
    const user = students.find(s => s.email.toLowerCase() === email.toLowerCase());
    if (user) {
      localStorage.setItem(this.sessionKey, user.id);
      return { success: true, user };
    }
    return { success: false, message: "Invalid email or password. Try one of the quick test profiles or create a new account." };
  }

  signup(profileData) {
    const newId = "usr_" + Date.now();
    const newStudent = {
      id: newId,
      email: profileData.email,
      name: profileData.name,
      avatar: profileData.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(profileData.name)}`,
      college: profileData.college || "Tech University",
      bio: profileData.bio || "Student developer & builder.",
      role: profileData.role || "Full Stack Developer",
      experience: profileData.experience || "Intermediate (2 yrs)",
      availability: profileData.availability || "15-20 hrs/week",
      skills: Array.isArray(profileData.skills) ? profileData.skills : (profileData.skills ? profileData.skills.split(',').map(s => s.trim()) : ["JavaScript", "Python"]),
      domains: profileData.domains || ["Web Development", "AI/ML"],
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
    return { success: true, user: newStudent };
  }

  switchPersona(userId) {
    const user = window.TF_STORE.getStudentById(userId);
    if (user) {
      localStorage.setItem(this.sessionKey, userId);
      return user;
    }
    return null;
  }

  logout() {
    localStorage.removeItem(this.sessionKey);
  }

  requireAuth(redirectUrl = 'login.html') {
    if (!this.isLoggedIn()) {
      window.location.href = redirectUrl + '?redirect=' + encodeURIComponent(window.location.pathname + window.location.search);
    }
  }
}

window.TF_AUTH = new TeamForgeAuth();
