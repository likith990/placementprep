
import auth from "../auth.js"
import User from "../models/User.js";

export async function getCurrUser(req, res) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session) {
    return res.status(401).json({
        success: false,
        message: "Unauthorized",
    });
  }

  const curruser=await User.findOne({authUserId:session.user.id})
  
  return res.status(200).json({
    success: true,
    user: curruser,
  });
}

