import { Box, Button, Container, Grid, Stack, Typography, Paper } from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import GroupsIcon from "@mui/icons-material/Groups";
import RateReviewIcon from "@mui/icons-material/RateReview";
import GoogleIcon from "@mui/icons-material/Google";
import heroImg from "../assets/hero.png";

const ACCENT = "#4f46e5";

const features = [
  {
    icon: <EventAvailableIcon sx={{ fontSize: 28, color: ACCENT }} />,
    title: "Post a slot",
    desc: "Open a time slot for a mock interview and let peers request it.",
  },
  {
    icon: <GroupsIcon sx={{ fontSize: 28, color: ACCENT }} />,
    title: "Connect with peers",
    desc: "Match with someone preparing for the same role or track.",
  },
  {
    icon: <RateReviewIcon sx={{ fontSize: 28, color: ACCENT }} />,
    title: "Give & get feedback",
    desc: "Leave structured feedback after every session to track progress.",
  },
];

export default function LandingPage({ login }) {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#0a0a0a", color: "#f5f5f5" }}>
      {/* Nav */}
      <Container maxWidth="lg">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ py: 3, borderBottom: "1px solid #222" }}
        >
          <Typography variant="h6" fontWeight={700}>
            Placement Prep
          </Typography>
          <Button
            onClick={login}
            variant="outlined"
            startIcon={<GoogleIcon sx={{ fontSize: 18 }} />}
            sx={{
              color: "#f5f5f5",
              borderColor: "#444",
              textTransform: "none",
              "&:hover": { borderColor: ACCENT, bgcolor: "rgba(79,70,229,0.08)" },
            }}
          >
            Log in
          </Button>
        </Stack>
      </Container>

      {/* Hero */}
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center" sx={{ py: { xs: 8, md: 12 } }}>
          <Grid item xs={12} md={6}>
            <Typography
              variant="h2"
              fontWeight={700}
              sx={{ fontSize: { xs: 34, md: 48 }, lineHeight: 1.15, mb: 3 }}
            >
              Practice interviews with people who get it.
            </Typography>
            <Typography sx={{ color: "#9a9a9a", fontSize: 18, mb: 4, maxWidth: 480 }}>
              Placement Prep matches you with peers for mock interviews.
              Schedule a slot, connect, and get honest feedback — no
              recruiters, no pressure, just practice.
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                onClick={login}
                variant="contained"
                size="large"
                startIcon={<GoogleIcon />}
                sx={{
                  bgcolor: ACCENT,
                  textTransform: "none",
                  fontWeight: 600,
                  px: 3,
                  "&:hover": { bgcolor: "#4338ca" },
                }}
              >
                Get started with Google
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: "center" }}>
            <Box
              component="img"
              src={heroImg}
              alt="Placement Prep"
              sx={{ maxWidth: "100%", width: 340 }}
            />
          </Grid>
        </Grid>
      </Container>

      {/* Features */}
      <Container maxWidth="lg" sx={{ pb: { xs: 10, md: 14 } }}>
        <Grid container spacing={3}>
          {features.map((f) => (
            <Grid item xs={12} md={4} key={f.title}>
              <Paper
                elevation={0}
                sx={{
                  bgcolor: "#141414",
                  border: "1px solid #2a2a2a",
                  borderRadius: 2,
                  p: 3,
                  height: "100%",
                }}
              >
                <Box sx={{ mb: 2 }}>{f.icon}</Box>
                <Typography fontWeight={600} sx={{ mb: 1 }}>
                  {f.title}
                </Typography>
                <Typography sx={{ color: "#9a9a9a", fontSize: 14.5 }}>
                  {f.desc}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Footer */}
      <Box sx={{ borderTop: "1px solid #222", py: 3 }}>
        <Container maxWidth="lg">
          <Typography sx={{ color: "#666", fontSize: 13 }}>
            © {new Date().getFullYear()} Placement Prep
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
