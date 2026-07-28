import Notification from "../models/notificationSchema.js";

export async function getNotifications(req, res) {
  try {
    const notifications = await Notification.find({ user: req.currentUser._id })
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      user: req.currentUser._id,
      read: false,
    });

    res.status(200).json({ notifications, unreadCount });
  } catch (err) {
    req.log.error(err);
    res
      .status(500)
      .json({ message: "Failed to fetch notifications", error: err.message });
  }
}

export async function markAsRead(req, res) {
  try {
    const { id } = req.params;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, user: req.currentUser._id },
      { read: true },
      { new: true },
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json(notification);
  } catch (err) {
    req.log.error(err);
    res
      .status(500)
      .json({ message: "Failed to mark as read", error: err.message });
  }
}

export async function markAllAsRead(req, res) {
  try {
    await Notification.updateMany(
      { user: req.currentUser._id, read: false },
      { read: true },
    );
    res.status(200).json({ message: "All marked as read" });
  } catch (err) {
    req.log.error(err);
    res
      .status(500)
      .json({ message: "Failed to mark all as read", error: err.message });
  }
}
