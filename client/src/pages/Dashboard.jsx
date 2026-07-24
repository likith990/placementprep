
import "./Dashboard.css"

export default function Dashboard({ logout, session }) {

    return (
        <div className="Dashboard">
            <h1>Welcome {session.user.name}</h1>
            <h1>this is the dashboard</h1>

            <button onClick={logout}>
                Logout
            </button>
        </div>
    );
}