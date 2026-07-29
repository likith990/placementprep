import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import GroupIcon from "@mui/icons-material/Group";
import VideocamIcon from "@mui/icons-material/Videocam";
import ConnectForm from "./ConnectForm";
import useNow from "../../hooks/useNow";


const buttonSx = {
  textTransform: "none",
  fontSize: 13,
  color: "#f5f5f5",
  backgroundColor: "#2a2a2a",
  "&:hover": { backgroundColor: "#333" },
  "&.Mui-disabled": { color: "#666" },
};

const primaryButtonSx = {
  textTransform: "none",
  fontSize: 13,
  fontWeight: 600,
  color: "#fff",
  backgroundColor: "#4f46e5",
  "&:hover": { backgroundColor: "#4338ca" },
};

export default function SlotCard({ slot, onConnected, onCancel, onViewProfile }) {
  const {
    _id,
    title,
    interviewer,
    starttime,
    duration,
    capacity,
    bookedCount = 0,
    meetinglink,
    isOwner,
    myRequest,
  } = slot;

  const [showConnect, setShowConnect] = useState(false);
  const now = useNow();


  const isFull = bookedCount >= capacity;
  const initials = interviewer?.username?.[0]?.toUpperCase() || "?";

  const formattedTime = new Date(starttime).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  function renderActionButton() {
    if (isOwner) {
      const hasStarted = new Date(starttime).getTime() <= now;

      if (hasStarted) {
        return (
          <Button
            fullWidth
            startIcon={<VideocamIcon sx={{ fontSize: 16 }} />}
            href={meetinglink}
            target="_blank"
            sx={primaryButtonSx}
          >
            Join
          </Button>
        );
      }

      return <Button fullWidth disabled sx={buttonSx}>Your slot</Button>;
    }

    if (myRequest?.status === "booked") {

      const hasStarted = new Date(starttime).getTime() <= now;
      if (hasStarted) {
        return (
          <Button
            fullWidth
            startIcon={<VideocamIcon sx={{ fontSize: 16 }} />}
            href={meetinglink}
            target="_blank"
            sx={primaryButtonSx}
          >
            Join
          </Button>
        );
      }

      return (
        <Stack direction="row" spacing={1} width="100%">
          <Button fullWidth disabled sx={buttonSx}>
            You're booked
          </Button>
          <Button
            fullWidth
            onClick={() => onCancel(_id)}
            sx={{ ...buttonSx, color: "#f28b82" }}
          >
            Cancel
          </Button>
        </Stack>
      );
    }
    if (myRequest?.status === "interested") {
      return <Button fullWidth disabled sx={buttonSx}>Pending</Button>;
    }
    return (
      <Button fullWidth onClick={() => setShowConnect(true)} sx={primaryButtonSx}>
        Connect
      </Button>
    );
  }

  return (
    <Card
      elevation={0}
      sx={{
        width: 300,
        borderRadius: "14px",
        border: "1px solid #2a2a2a",
        backgroundColor: "#141414",
        color: "#f5f5f5",
        p: 0.5,
      }}
    >
      <CardContent>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
          mb={1.5}
          className="pp-profile-row"
          onClick={() => interviewer?._id && onViewProfile?.(interviewer._id)}
          onKeyDown={(e) => {
            if (interviewer?._id && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault();
              onViewProfile?.(interviewer._id);
            }
          }}
          tabIndex={interviewer?._id ? 0 : -1}
          role={interviewer?._id ? "button" : undefined}
          aria-label={interviewer?._id ? `View ${interviewer.username}'s profile` : undefined}
          sx={{
            cursor: interviewer?._id ? "pointer" : "default",
            borderRadius: "8px",
            p: 0.5,
            m: -0.5,
            transition: "background-color 0.15s ease",
            "&:hover": interviewer?._id
              ? { backgroundColor: "rgba(79, 70, 229, 0.12)" }
              : {},
            "&:focus-visible": interviewer?._id
              ? { outline: "2px solid #4f46e5", outlineOffset: "2px" }
              : {},
          }}
        >
          <Avatar
            src={interviewer?.image}
            sx={{ bgcolor: "#4f46e5", width: 34, height: 34, fontSize: 14 }}
          >
            {initials}
          </Avatar>
          <Stack spacing={0}>
            <Typography sx={{ fontSize: 15, fontWeight: 600 }}>{title}</Typography>
            <Typography
              sx={{
                fontSize: 12.5,
                color: "#9a9a9a",
                ".pp-profile-row:hover &": interviewer?._id
                  ? { color: "#818cf8", textDecoration: "underline" }
                  : {},
              }}
            >
              with {interviewer?.username || "Unassigned"}
            </Typography>
          </Stack>
        </Stack>

        <Stack spacing={0.9} mb={2}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <AccessTimeIcon sx={{ fontSize: 16, color: "#9a9a9a" }} />
            <Typography sx={{ fontSize: 13, color: "#d4d4d4" }}>{formattedTime}</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <VideocamIcon sx={{ fontSize: 16, color: "#9a9a9a" }} />
            <Typography sx={{ fontSize: 13, color: "#d4d4d4" }}>{duration} min</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <GroupIcon sx={{ fontSize: 16, color: "#9a9a9a" }} />
            <Typography sx={{ fontSize: 13, color: "#d4d4d4" }}>
              {bookedCount}/{capacity} booked
            </Typography>
          </Stack>

        </Stack>

        <Chip
          size="small"
          label={isFull ? "Full" : "Open"}
          sx={{
            backgroundColor: isFull ? "#3a1f1f" : "#1f3a29",
            color: isFull ? "#f28b82" : "#81c995",
            fontWeight: 600,
            fontSize: 11.5,
            mb: 1.5,
          }}
        />

        {renderActionButton()}
      </CardContent>

      {showConnect && (
        <ConnectForm
          slotId={_id}
          onClose={() => setShowConnect(false)}
          onConnected={() => onConnected(_id, { status: "interested" })}
        />
      )}
    </Card>
  );
}