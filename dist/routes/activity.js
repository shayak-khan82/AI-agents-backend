"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const activityController_1 = require("../controllers/activityController");
const Activity_1 = require("../models/Activity");
const router = express_1.default.Router();
router.use(auth_1.auth);
/* ✅ Create Activity */
router.post("/", activityController_1.logActivity);
/* ✅ Get all activities */
router.get("/", async (req, res) => {
    const activities = await Activity_1.Activity.find({ userId: req.user._id }).sort({
        timestamp: -1,
    });
    res.json(activities);
});
//✅ Get all user activities
router.get("/", activityController_1.getActivities);
/* ✅ Get today records */
router.get("/today", async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const activities = await Activity_1.Activity.find({
        userId: req.user._id,
        timestamp: { $gte: today, $lt: tomorrow },
    });
    res.json(activities);
});
router.patch("/:id", auth_1.auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { completed } = req.body;
        const activity = await Activity_1.Activity.findOneAndUpdate({ _id: id, userId: req.user._id }, { completed }, { new: true });
        if (!activity)
            return res.status(404).json({ message: "Activity not found" });
        res.json(activity);
    }
    catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
});
exports.default = router;
