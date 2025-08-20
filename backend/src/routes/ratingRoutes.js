const router = require("express").Router();
const { upsertRating, ownerRatings } = require("../controllers/ratingController");
const { requireAuth, allowRoles } = require("../middleware/auth");

router.post("/", requireAuth, upsertRating);
router.get("/owner", requireAuth, allowRoles("OWNER"), ownerRatings);

module.exports = router;
