
import { useState } from "react";
import "./Dashboard.css";
import { useUser } from "../hooks/useUsers";
import Navbar from "../components/layout/Navbar";
import SlotGrid from "../components/slots/slotgrid";
import PostedSlots from "../components/slots/PostedSlots";
import RequestedSlots from "../components/slots/RequestedSlots";
import FeedbackModal from "../components/feedback/FeedbackModal";
import ProfilePage from "./ProfilePage";
import usePendingFeedback from "../hooks/usePendingFeedback";

export default function Dashboard({ logout, session }) {
  const { user } = useUser();
  const [tab, setTab] = useState("available");
  const [mySlotsTab, setMySlotsTab] = useState("posted");
  const [viewingUserId, setViewingUserId] = useState(null);
  const { current: pendingFeedback, loading: feedbackLoading, refresh: refreshFeedback, removeFirst } = usePendingFeedback();

  return (
    <div className="Dashboard">
      {!feedbackLoading && pendingFeedback && (
        <FeedbackModal
          pending={pendingFeedback}
          onDone={() => {
            removeFirst();
            refreshFeedback();
          }}
        />
      )}
      <Navbar session={session} logout={logout} onViewProfile={setViewingUserId} />
      <div className="dashboard-content">
        {viewingUserId ? (
          <ProfilePage
            userId={viewingUserId}
            currentUserId={user?._id}
            onBack={() => setViewingUserId(null)}
          />
        ) : (
          <>
            <div className="dashboard-tabs">
              <button className={tab === "available" ? "tab-active" : "tab"} onClick={() => setTab("available")}>
                Available Slots
              </button>
              <button className={tab === "myslots" ? "tab-active" : "tab"} onClick={() => setTab("myslots")}>
                My Slots
              </button>
            </div>

            {tab === "available" && <SlotGrid onViewProfile={setViewingUserId} />}

            {tab === "myslots" && (
              <>
                <div className="dashboard-tabs">
                  <button
                    className={mySlotsTab === "posted" ? "tab-active" : "tab"}
                    onClick={() => setMySlotsTab("posted")}
                  >
                    Posted
                  </button>
                  <button
                    className={mySlotsTab === "requested" ? "tab-active" : "tab"}
                    onClick={() => setMySlotsTab("requested")}
                  >
                    Requested
                  </button>
                </div>
                {mySlotsTab === "posted" ? <PostedSlots /> : <RequestedSlots />}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}