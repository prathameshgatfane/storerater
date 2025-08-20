const router = require("express").Router();
const { signup, login, updatePassword, me } = require("../controllers/authController");
const { signupRules, loginRules } = require("../validators");
const { requireAuth } = require("../middleware/auth");

router.post("/signup", signupRules, signup);
router.post("/login",  loginRules,  login);
router.post("/password", requireAuth, updatePassword);
router.get("/me", requireAuth, me);

module.exports = router;
