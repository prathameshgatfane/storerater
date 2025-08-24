const router = require("express").Router();
const { requireAuth } = require("../middleware/auth");
const { createStore, listStores } = require("../controllers/storeController");
const { body } = require("express-validator");

const storeRules = [
  body("name").isLength({ min: 3 }).withMessage("Name must be at least 3 characters"),
  body("email").optional().isEmail().withMessage("Invalid email"),
  body("address").optional().isLength({ min: 3 }).withMessage("Address must be at least 3 characters"),
];

// Note paths are '/' because parent mounts on '/api/stores'
router.get("/", requireAuth, listStores);

router.post("/", requireAuth, storeRules, (req, res, next) => {
  console.log("Store creation payload:", req.body);
  next();
}, createStore);

module.exports = router;
