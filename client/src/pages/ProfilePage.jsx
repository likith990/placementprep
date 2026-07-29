

import { useEffect, useState } from "react";
import { getUserProfile, updateMyProfile } from "../services/userServices";
import "./ProfilePage.css";
import Loader from "../components/ui/Loader";

function StarDisplay({ value }) {
  if (value === null || value === undefined) {
    return <span className="profile-no-data">No ratings yet</span>;
  }
  return (
    <span className="profile-stars">
      {"★".repeat(Math.round(value))}
      {"☆".repeat(5 - Math.round(value))}
      <span className="profile-star-value"> {value.toFixed(1)}</span>
    </span>
  );
}

function FeedbackSummary({ feedback }) {
  return (
    <div className="profile-feedback-summary">
      <div className="profile-summary-row">
        <span>Communication</span>
        <StarDisplay value={feedback.averages.communication} />
      </div>
      <div className="profile-summary-row">
        <span>Technical</span>
        <StarDisplay value={feedback.averages.technical} />
      </div>
      <div className="profile-summary-row">
        <span>Problem Solving</span>
        <StarDisplay value={feedback.averages.problemSolving} />
      </div>
      <p className="profile-review-count">
        {feedback.count} review{feedback.count === 1 ? "" : "s"}
      </p>
    </div>
  );
}

function CommentsList({ feedback }) {
  const withComments = feedback.feedback.filter((f) => f.comment);
  return (
    <div className="profile-comments">
      {withComments.length === 0 && <p className="profile-status">No written feedback yet</p>}
      {withComments.map((f) => (
        <div key={f._id} className="profile-comment-item">
          <div className="profile-comment-header">
            <span>{f.fromUser?.username || "Anonymous"}</span>
            <span>{new Date(f.createdAt).toLocaleDateString()}</span>
          </div>
          <p className="profile-comment-text">{f.comment}</p>
        </div>
      ))}
    </div>
  );
}

function ProfileView({ data }) {
  const { user, feedback, sessionCount } = data;

  return (
    <div className="profile-card">
      <div className="profile-header">
        <div className="profile-avatar">{user.username?.[0]?.toUpperCase() || "?"}</div>
        <div>
          <h2 className="profile-username">{user.username}</h2>
          {user.targetRole && <p className="profile-target-role">{user.targetRole}</p>}
        </div>
      </div>

      {user.bio && <p className="profile-bio">{user.bio}</p>}

      <div className="profile-meta-row">
        {user.experienceLevel && <span className="profile-badge">{user.experienceLevel}</span>}
        <span className="profile-session-count">
          {sessionCount} session{sessionCount === 1 ? "" : "s"} completed
        </span>
      </div>

      {user.skills?.length > 0 && (
        <div className="profile-skills">
          {user.skills.map((skill) => (
            <span key={skill} className="profile-skill-chip">{skill}</span>
          ))}
        </div>
      )}

      {(user.links?.linkedin || user.links?.github || user.links?.portfolio) && (
        <div className="profile-links">
          {user.links.linkedin && <a href={user.links.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
          {user.links.github && <a href={user.links.github} target="_blank" rel="noreferrer">GitHub</a>}
          {user.links.portfolio && <a href={user.links.portfolio} target="_blank" rel="noreferrer">Portfolio</a>}
        </div>
      )}

      <FeedbackSummary feedback={feedback} />
      <CommentsList feedback={feedback} />
    </div>
  );
}

function ProfileEditForm({ data, onSaved }) {
  const { user, feedback, sessionCount } = data;

  const [bio, setBio] = useState(user.bio || "");
  const [skillsInput, setSkillsInput] = useState((user.skills || []).join(", "));
  const [experienceLevel, setExperienceLevel] = useState(user.experienceLevel || "");
  const [targetRole, setTargetRole] = useState(user.targetRole || "");
  const [linkedin, setLinkedin] = useState(user.links?.linkedin || "");
  const [github, setGithub] = useState(user.links?.github || "");
  const [portfolio, setPortfolio] = useState(user.links?.portfolio || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const skills = skillsInput.split(",").map((s) => s.trim()).filter(Boolean);

      const { user: updatedUser } = await updateMyProfile({
        bio,
        skills,
        experienceLevel: experienceLevel || undefined,
        targetRole,
        links: { linkedin, github, portfolio },
      });

      onSaved(updatedUser);
      setSaved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="profile-card">
      <h2 className="profile-username">My Profile</h2>
      <p className="profile-session-count">
        {sessionCount} session{sessionCount === 1 ? "" : "s"} completed
      </p>

      <form className="profile-form" onSubmit={handleSubmit}>
        <label>
          Bio
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} maxLength={300} rows={3} />
        </label>

        <label>
          Skills (comma separated)
          <input
            type="text"
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
            placeholder="DSA, System Design, Behavioral"
          />
        </label>

        <label>
          Experience Level
          <select value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)}>
            <option value="">Select...</option>
            <option value="student">Student</option>
            <option value="junior">Junior</option>
            <option value="mid">Mid</option>
            <option value="senior">Senior</option>
          </select>
        </label>

        <label>
          Target Role
          <input type="text" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} placeholder="SDE at FAANG" />
        </label>

        <label>
          LinkedIn
          <input type="url" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/..." />
        </label>

        <label>
          GitHub
          <input type="url" value={github} onChange={(e) => setGithub(e.target.value)} placeholder="https://github.com/..." />
        </label>

        <label>
          Portfolio
          <input type="url" value={portfolio} onChange={(e) => setPortfolio(e.target.value)} placeholder="https://..." />
        </label>

        {error && <p className="profile-error">{error}</p>}
        {saved && <p className="profile-saved">Saved!</p>}

        <button type="submit" className="profile-save-btn" disabled={saving}>
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>

      <FeedbackSummary feedback={feedback} />
    </div>
  );
}

export default function ProfilePage({ userId, currentUserId, onBack }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isOwnProfile = userId === currentUserId;

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const result = await getUserProfile(userId);
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  function handleSaved(updatedUser) {
    setData((prev) => ({ ...prev, user: updatedUser }));
  }

  return (
    <div className="profile-page">
      <button className="profile-back-btn" onClick={onBack}>← Back</button>

       {loading && <Loader label="Loading profile..." />}
      {!loading && error && <p className="profile-status profile-error">{error}</p>}

      {!loading && !error && data && (
        isOwnProfile ? (
          <ProfileEditForm data={data} onSaved={handleSaved} />
        ) : (
          <ProfileView data={data} />
        )
      )}
    </div>
  );
}