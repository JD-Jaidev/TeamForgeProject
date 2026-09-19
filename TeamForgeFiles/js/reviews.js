// TeamForge Ratings, Reviews & Reputation Credits Engine

class TeamForgeReviews {
  constructor() {
    this.store = window.TF_STORE;
    this.auth = window.TF_AUTH;
    this.state = window.TF_STATE;
  }

  submitReview({ targetUserId, rating, comment, teamName, creditsAwarded = 100 }) {
    const user = this.auth.getCurrentUser();
    if (!user) {
      this.state.toast("Sign in required", "Please sign in to submit a peer review.", "error");
      return null;
    }

    if (user.id === targetUserId) {
      this.state.toast("Invalid Action", "You cannot review your own profile.", "warning");
      return null;
    }

    const review = {
      targetUserId: targetUserId,
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatar,
      teamName: teamName || "TeamForge Collaboration",
      rating: Number(rating) || 5.0,
      creditsAwarded: Number(creditsAwarded) || 100,
      comment: comment || "Great collaboration experience!"
    };

    const saved = this.store.addReview(review);

    // Notify the recipient
    this.store.addNotification({
      userId: targetUserId,
      type: "review",
      title: "New Peer Review Received! ⭐",
      message: `${user.name} gave you a ${review.rating}★ rating and awarded ${review.creditsAwarded} reputation credits!`,
      relatedId: targetUserId,
      actionUrl: `profile.html?id=${targetUserId}`
    });

    this.state.toast("Review Published! ⭐", `Added review and awarded ${creditsAwarded} credits!`, "success");
    return saved;
  }
}

window.TF_REVIEWS = new TeamForgeReviews();
