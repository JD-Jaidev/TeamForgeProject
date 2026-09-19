// TeamForge Team Management, Requests, and Guest Contributors

class TeamForgeTeams {
  constructor() {
    this.store = window.TF_STORE;
    this.auth = window.TF_AUTH;
    this.state = window.TF_STATE;
  }

  createTeam(data) {
    const user = this.auth.getCurrentUser();
    if (!user) {
      this.state.toast("Authentication required", "Please sign in to create a team", "error");
      return null;
    }

    const newTeam = {
      id: "team_" + Date.now(),
      name: data.name,
      tagline: data.tagline || "",
      description: data.description,
      domain: data.domain || "Artificial Intelligence",
      hackathonTarget: data.hackathonTarget || "General Project",
      ownerId: user.id,
      maxMembers: Number(data.maxMembers) || 4,
      visibility: data.visibility || "public",
      requiredSkills: Array.isArray(data.requiredSkills) ? data.requiredSkills : data.requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
      requiredRoles: Array.isArray(data.requiredRoles) ? data.requiredRoles : data.requiredRoles.split(',').map(r => r.trim()).filter(Boolean),
      members: [
        { userId: user.id, role: data.myRole || "Team Lead & Creator", type: "core", joinedAt: new Date().toISOString().split('T')[0] }
      ],
      guests: [],
      joinRequests: [],
      invitations: [],
      createdAt: new Date().toISOString().split('T')[0]
    };

    this.store.saveTeam(newTeam);
    this.state.toast("Team Created! 🎉", `Successfully launched ${newTeam.name}`, "success");
    return newTeam;
  }

  sendJoinRequest(teamId, message = "") {
    const user = this.auth.getCurrentUser();
    if (!user) {
      this.state.toast("Sign in required", "Please sign in to request joining teams", "error");
      return false;
    }

    const team = this.store.getTeamById(teamId);
    if (!team) return false;

    // Check if already a member or guest
    const isMember = team.members.some(m => m.userId === user.id) || (team.guests && team.guests.some(g => g.userId === user.id));
    if (isMember) {
      this.state.toast("Already in team", "You are already a member or guest in this team.", "info");
      return false;
    }

    // Check if pending request exists
    if (team.joinRequests && team.joinRequests.some(r => r.userId === user.id && r.status === 'pending')) {
      this.state.toast("Request Pending", "You have already submitted a join request for this team.", "warning");
      return false;
    }

    const request = {
      id: "req_" + Date.now(),
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      userAvatar: user.avatar,
      message: message || "I would love to collaborate on this project!",
      status: "pending",
      requestedAt: new Date().toISOString()
    };

    team.joinRequests = team.joinRequests || [];
    team.joinRequests.unshift(request);
    this.store.saveTeam(team);

    // Notify team owner
    this.store.addNotification({
      userId: team.ownerId,
      type: "join_request",
      title: "New Team Join Request",
      message: `${user.name} wants to join **${team.name}**.`,
      relatedId: team.id,
      actionUrl: `team.html?id=${team.id}`
    });

    this.state.toast("Request Sent! 🚀", `Your request to join ${team.name} has been sent to the team lead.`, "success");
    return true;
  }

  handleJoinRequest(teamId, requestId, action) { // action: 'accept' or 'reject'
    const team = this.store.getTeamById(teamId);
    if (!team) return;

    const req = team.joinRequests?.find(r => r.id === requestId);
    if (!req) return;

    req.status = action === 'accept' ? 'accepted' : 'rejected';

    if (action === 'accept') {
      const applicant = this.store.getStudentById(req.userId);
      team.members.push({
        userId: req.userId,
        role: applicant ? applicant.role : "Member",
        type: "core",
        joinedAt: new Date().toISOString().split('T')[0]
      });

      this.store.addNotification({
        userId: req.userId,
        type: "invite_accepted",
        title: "Join Request Accepted! 🎉",
        message: `You are now a member of **${team.name}**!`,
        relatedId: team.id,
        actionUrl: `team.html?id=${team.id}`
      });

      this.state.toast("Member Added!", `${req.userName || 'Applicant'} is now part of the team!`, "success");
    } else {
      this.state.toast("Request Declined", "The join request was rejected.", "info");
    }

    this.store.saveTeam(team);
  }

  inviteStudent(teamId, studentId, isGuest = false, customRole = "") {
    const user = this.auth.getCurrentUser();
    const team = this.store.getTeamById(teamId);
    const student = this.store.getStudentById(studentId);

    if (!team || !student) return;

    if (isGuest) {
      team.guests = team.guests || [];
      if (team.guests.some(g => g.userId === studentId)) {
        this.state.toast("Already Guest", `${student.name} is already a guest contributor.`, "info");
        return;
      }

      team.guests.push({
        userId: studentId,
        role: customRole || "Guest Specialist",
        type: "guest",
        invitedBy: user ? user.id : team.ownerId,
        joinedAt: new Date().toISOString().split('T')[0],
        notes: `Invited as specialist for ${team.name}`
      });

      this.store.addNotification({
        userId: studentId,
        type: "guest_invite",
        title: "Guest Contributor Invitation 🌟",
        message: `You were added as a Guest Specialist in **${team.name}**.`,
        relatedId: team.id,
        actionUrl: `team.html?id=${team.id}`
      });

      this.store.saveTeam(team);
      this.state.toast("Guest Added!", `${student.name} was added as a guest contributor.`, "success");
    } else {
      team.members.push({
        userId: studentId,
        role: customRole || student.role,
        type: "core",
        joinedAt: new Date().toISOString().split('T')[0]
      });

      this.store.addNotification({
        userId: studentId,
        type: "team_invite",
        title: "Team Invitation! 🚀",
        message: `You have been added to **${team.name}**.`,
        relatedId: team.id,
        actionUrl: `team.html?id=${team.id}`
      });

      this.store.saveTeam(team);
      this.state.toast("Member Invited!", `${student.name} has joined ${team.name}.`, "success");
    }
  }

  removeMember(teamId, userId) {
    const team = this.store.getTeamById(teamId);
    if (!team) return;

    team.members = team.members.filter(m => m.userId !== userId);
    if (team.guests) {
      team.guests = team.guests.filter(g => g.userId !== userId);
    }

    this.store.saveTeam(team);
    this.state.toast("Member Removed", "Roster updated successfully.", "info");
  }
}

window.TF_TEAMS = new TeamForgeTeams();
