
import "./Navbar.css";
import NotificationBell from "./NotificationBell";
import { useUser } from "../../hooks/useUsers";

export default function Navbar({ session, logout, onViewProfile }) {
  const { name, image } = session.user;
  const { user } = useUser();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={image} alt={name} className="navbar-avatar" referrerPolicy="no-referrer" />
        <span className="navbar-name">{name}</span>
      </div>

      <div className="navbar-right">
        {user?._id && (
          <button className="navbar-reviews-btn" onClick={() => onViewProfile(user._id)}>
            My Profile
          </button>
        )}
        <NotificationBell />
        <button className="navbar-logout" onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
}