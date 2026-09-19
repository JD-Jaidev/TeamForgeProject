// TeamForge AI-Powered Team-Member Matching & Reputation Search Engine
// Provides deterministic skill-gap scoring, NLP extraction, reputation weighting, and transparent explainability.

class TeamForgeMatcher {
  constructor() {
    this.store = window.TF_STORE;
    this.ai = window.TF_AI;
  }

  /**
   * Match candidates for a project prompt and/or existing team
   */
  async matchForProject({ prompt, existingTeamId = null, filterDomain = null, minRating = 0, prioritizeReputation = false }) {
    // Step 1: Extract project requirements & skills
    const analysis = await this.ai.analyzeProjectRequirements(prompt);
    const requiredSkills = analysis.skills || [];
    const requiredRoles = analysis.roles || [];

    // Step 2: Fetch existing team skills if applicable
    let teamSkills = new Set();
    let teamMemberIds = new Set();
    if (existingTeamId) {
      const team = this.store.getTeamById(existingTeamId);
      if (team) {
        team.members.forEach(m => {
          teamMemberIds.add(m.userId);
          const member = this.store.getStudentById(m.userId);
          if (member && member.skills) {
            member.skills.forEach(s => teamSkills.add(s.toLowerCase()));
          }
        });
        if (team.guests) {
          team.guests.forEach(g => teamMemberIds.add(g.userId));
        }
      }
    }

    // Step 3: Evaluate all students in database
    const allStudents = this.store.getStudents();
    const candidateResults = [];

    allStudents.forEach(student => {
      // Exclude students already on this team
      if (teamMemberIds.has(student.id)) return;

      // Filter by min rating if specified
      if (minRating > 0 && student.rating < minRating) return;

      // Calculate Skill Match Score (0 - 45 pts)
      const studentSkillsLower = (student.skills || []).map(s => s.toLowerCase());
      let matchedSkills = [];
      let gapFillingSkills = [];

      requiredSkills.forEach(reqSkill => {
        const reqSkillLower = reqSkill.toLowerCase();
        if (studentSkillsLower.includes(reqSkillLower)) {
          matchedSkills.push(reqSkill);
          // Check if this skill fills a gap that the existing team lacks
          if (!teamSkills.has(reqSkillLower)) {
            gapFillingSkills.push(reqSkill);
          }
        }
      });

      const skillMatchRatio = requiredSkills.length > 0 ? (matchedSkills.length / requiredSkills.length) : 0.5;
      const skillScore = Math.min(45, skillMatchRatio * 45);

      // Calculate Reputation & Review Score (0 - 25 pts)
      const ratingScore = ((student.rating || 4.0) / 5.0) * 15; // up to 15 pts
      const creditsScore = Math.min(10, ((student.credits || 0) / 2000) * 10); // up to 10 pts
      const reputationScore = ratingScore + creditsScore;

      // Calculate Experience & Role Compatibility (0 - 20 pts)
      let experienceScore = 10;
      if (student.experience && student.experience.includes('3+')) experienceScore = 18;
      else if (student.experience && student.experience.includes('2')) experienceScore = 14;

      // Domain Compatibility (0 - 10 pts)
      let domainScore = 5;
      if (filterDomain && student.domains && student.domains.some(d => d.toLowerCase().includes(filterDomain.toLowerCase()))) {
        domainScore = 10;
      }

      // Total Weighted Score calculation
      let totalScore = 0;
      if (prioritizeReputation) {
        // Reputation-Weighted Mode
        totalScore = (reputationScore * 1.5) + (skillScore * 0.8) + (experienceScore * 0.7) + domainScore;
      } else {
        // Standard Skill-Gap & Project Compatibility Mode
        const gapBonus = gapFillingSkills.length * 4;
        totalScore = skillScore + reputationScore + experienceScore + domainScore + gapBonus;
      }

      const matchPercentage = Math.min(99, Math.max(40, Math.round(totalScore)));

      // Generate Transparent Explainability Justification
      const reasons = [];
      if (matchedSkills.length > 0) {
        reasons.push(`Has ${matchedSkills.slice(0, 3).join(', ')} matching required project stack`);
      }
      if (gapFillingSkills.length > 0) {
        reasons.push(`Directly fills team's missing skill gap in ${gapFillingSkills.join(', ')}`);
      }
      if (student.rating >= 4.8) {
        reasons.push(`Top-tier ${student.rating}★ rating from ${student.reviewCount || 0} peer collaborations`);
      }
      if (student.credits >= 1200) {
        reasons.push(`High reputation standing with ${student.credits} credits`);
      }
      if (student.experience && student.experience.includes('3+')) {
        reasons.push(`Senior student with 3+ years hands-on project experience`);
      }

      candidateResults.push({
        student,
        matchPercentage,
        matchedSkills,
        gapFillingSkills,
        reputationScore: Math.round(reputationScore),
        primaryReason: reasons[0] || "Compatible general technical profile",
        allReasons: reasons,
        recommendedRole: student.preferredRoles?.[0] || student.role
      });
    });

    // Sort descending by match percentage
    candidateResults.sort((a, b) => b.matchPercentage - a.matchPercentage);

    return {
      analysis,
      requiredSkills,
      requiredRoles,
      candidates: candidateResults
    };
  }

  /**
   * Fast reputation-first search
   */
  searchByReputation({ query = '', minCredits = 0, minRating = 4.5, skillFilter = '' }) {
    const students = this.store.getStudents();
    const queryLower = query.toLowerCase();
    const skillLower = skillFilter.toLowerCase();

    return students.filter(s => {
      const matchesQuery = !query || 
        s.name.toLowerCase().includes(queryLower) ||
        s.bio.toLowerCase().includes(queryLower) ||
        (s.skills && s.skills.some(sk => sk.toLowerCase().includes(queryLower))) ||
        (s.role && s.role.toLowerCase().includes(queryLower));

      const matchesSkill = !skillFilter || (s.skills && s.skills.some(sk => sk.toLowerCase() === skillLower));
      const matchesCredits = (s.credits || 0) >= minCredits;
      const matchesRating = (s.rating || 0) >= minRating;

      return matchesQuery && matchesSkill && matchesCredits && matchesRating;
    }).sort((a, b) => {
      // Sort by rating first, then credits
      if (b.rating !== a.rating) return b.rating - a.rating;
      return (b.credits || 0) - (a.credits || 0);
    });
  }
}

window.TF_MATCHER = new TeamForgeMatcher();
