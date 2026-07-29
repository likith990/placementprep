
import { useState, lazy, Suspense } from "react";
import "./Dashboard.css";
import { useUser } from "../hooks/useUsers";
import Navbar from "../components/layout/Navbar";
import SlotGrid from "../components/slots/slotgrid";
const PostedSlots = lazy(() => import("../components/slots/PostedSlots"));
const RequestedSlots = lazy(() => import("../components/slots/RequestedSlots"));
const FeedbackModal = lazy(() => import("../components/feedback/FeedbackModal"));
const ProfilePage = lazy(() => import("./ProfilePage"));
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
  <Suspense fallback={null}>
    <FeedbackModal
      pending={pendingFeedback}
      onDone={() => {
        removeFirst();
        refreshFeedback();
      }}
    />
  </Suspense>
)}
      <Navbar session={session} logout={logout} onViewProfile={setViewingUserId} />
      <div className="dashboard-content">
        {viewingUserId ? (
            <Suspense fallback={<p style={{ padding: "2rem" }}>Loading profile...</p>}>

          <ProfilePage
            userId={viewingUserId}
            currentUserId={user?._id}
            onBack={() => setViewingUserId(null)}
          />
          </Suspense>

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
                <Suspense fallback={<p style={{ padding: "1rem" }}>Loading...</p>}>
  {mySlotsTab === "posted" ? <PostedSlots /> : <RequestedSlots />}
</Suspense>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}