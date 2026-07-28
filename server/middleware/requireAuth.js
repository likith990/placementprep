
import auth from "../auth.js";
import User from "../models/User.js";

export default async function requireAuth(req, res, next) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const currentUser = await User.findOne({ authUserId: session.user.id });

    if (!currentUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    req.currentUser = currentUser;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Auth check failed" });
  }
}