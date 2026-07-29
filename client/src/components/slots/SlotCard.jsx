

import * as React from "react";
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

const buttonSx = {
  textTransform: "none",
  fontSize: 13,
  color: "#f5f5f5",
  backgroundColor: "#2a2a2a",
  "&:hover": { backgroundColor: "#333" },
  "&.Mui-disabled": { color: "#666" },
};

export default function SlotCard({ slot, onConnected,onCancel,onViewProfile   }) {
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
      const hasStarted = new Date(starttime).getTime() <= Date.now();

      if (hasStarted) {
        return (
          <Button
            fullWidth
            startIcon={<VideocamIcon sx={{ fontSize: 16 }} />}
            href={meetinglink}
            target="_blank"
            sx={buttonSx}
          >
            Join
          </Button>
        );
      }

      return <Button fullWidth disabled sx={buttonSx}>Your slot</Button>;
    }
    
    if (myRequest?.status === "booked") {
      const hasStarted = new Date(starttime).getTime() <= Date.now();

      if (hasStarted) {
        return (
          <Button
            fullWidth
            startIcon={<VideocamIcon sx={{ fontSize: 16 }} />}
            href={meetinglink}
            target="_blank"
            sx={buttonSx}
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
      <Button fullWidth onClick={() => setShowConnect(true)} sx={buttonSx}>
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
          onClick={() => interviewer?._id && onViewProfile?.(interviewer._id)}

          sx={{ cursor: interviewer?._id ? "pointer" : "default" }}
        >
          <Avatar
            src={interviewer?.image}
            sx={{ bgcolor: "#4f46e5", width: 34, height: 34, fontSize: 14 }}
          >
            {initials}
          </Avatar>
          <Stack spacing={0}>
            <Typography sx={{ fontSize: 15, fontWeight: 600 }}>{title}</Typography>
            <Typography sx={{ fontSize: 12.5, color: "#9a9a9a" }}>
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