// TeamForge Opportunities, Hiring, and Hackathons Directory

class TeamForgeEvents {
  constructor() {
    this.store = window.TF_STORE;
    this.auth = window.TF_AUTH;
    this.state = window.TF_STATE;
  }

  postOpportunity(data) {
    const user = this.auth.getCurrentUser();
    if (!user) {
      this.state.toast("Authentication required", "Please sign in to publish opportunities.", "error");
      return null;
    }

    const newOpp = {
      id: "opp_" + Date.now(),
      teamId: data.teamId || "team_personal",
      teamName: data.teamName || "Independent Project Squad",
      title: data.title,
      description: data.description,
      type: data.type || "Specialist / Guest Contributor",
      domain: data.domain || "Artificial Intelligence",
      requiredSkills: Array.isArray(data.requiredSkills) ? data.requiredSkills : data.requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
      creditsReward: Number(data.creditsReward) || 300,
      authorName: user.name,
      authorAvatar: user.avatar,
      applicantCount: 0,
      postedAt: new Date().toISOString().split('T')[0],
      deadline: data.deadline || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
    };

    this.store.saveOpportunity(newOpp);
    this.state.toast("Opportunity Published! 📢", "Your opening is now live in the global feed.", "success");
    return newOpp;
  }

  applyToOpportunity(opportunityId, pitchNote = "") {
    const user = this.auth.getCurrentUser();
    if (!user) {
      this.state.toast("Sign in required", "Please sign in to apply for roles.", "error");
      return false;
    }

    const opps = this.store.getOpportunities();
    const opp = opps.find(o => o.id === opportunityId);
    if (!opp) return false;

    opp.applicantCount = (opp.applicantCount || 0) + 1;
    this.store.saveOpportunity(opp);

    // If linked to team, notify owner
    if (opp.teamId) {
      const team = this.store.getTeamById(opp.teamId);
      if (team) {
        this.store.addNotification({
          userId: team.ownerId,
          type: "application",
          title: "New Specialist Application! 📄",
          message: `${user.name} applied for "${opp.title}": "${pitchNote || 'Interested in contributing'}"`,
          relatedId: opp.id,
          actionUrl: `team.html?id=${team.id}`
        });
      }
    }

    this.state.toast("Application Submitted! 🌟", `You expressed interest in "${opp.title}". The lead has been notified.`, "success");
    return true;
  }

  createEvent(data) {
    const user = this.auth.getCurrentUser();
    if (!user) {
      this.state.toast("Authentication required", "Please sign in to publish hackathon events.", "error");
      return null;
    }

    const newEvent = {
      id: "evt_" + Date.now(),
      title: data.title,
      organizer: data.organizer || user.college || user.name,
      description: data.description,
      dates: data.dates || "Upcoming 2026",
      deadline: data.deadline || "TBA",
      prize: data.prize || "Cash Prizes & Certificates",
      tags: Array.isArray(data.tags) ? data.tags : data.tags.split(',').map(t => t.trim()).filter(Boolean),
      location: data.location || "Virtual / Online",
      mode: data.mode || "Online",
      registrationLink: data.registrationLink || "#",
      authorId: user.id,
      authorName: user.name,
      activeTeamsCount: 1,
      createdAt: new Date().toISOString()
    };

    this.store.saveEvent(newEvent);
    this.state.toast("Hackathon Published! 🏆", `"${newEvent.title}" is now live for all students.`, "success");
    return newEvent;
  }
}

window.TF_EVENTS = new TeamForgeEvents();

