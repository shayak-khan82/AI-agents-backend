
import express from "express";
import { auth } from "../middleware/auth";
import { logActivity ,getActivities} from "../controllers/activityController";
import { Activity } from "../models/Activity";

const router = express.Router();

router.use(auth);

/* ✅ Create Activity */
router.post("/", logActivity);

/* ✅ Get all activities */
router.get("/", async (req, res) => {
  const activities = await Activity.find({ userId: req.user._id }).sort({
    timestamp: -1,
  });

  res.json(activities);
});
 //✅ Get all user activities
router.get("/", getActivities);
/* ✅ Get today records */
router.get("/today", async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const activities = await Activity.find({
    userId: req.user._id,
    timestamp: { $gte: today, $lt: tomorrow },
  });

  res.json(activities);
});


router.patch("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    const activity = await Activity.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { completed },
      { new: true }
    );

    if (!activity)
      return res.status(404).json({ message: "Activity not found" });

    res.json(activity);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
