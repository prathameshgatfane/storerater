const router = require("express").Router();
const { dashboard, addUser } = require("../controllers/adminController");
const { storeRules, adminAddUserRules } = require("../validators");
const { createStore } = require("../controllers/storeController");
const { requireAuth, allowRoles } = require("../middleware/auth");

router.get("/dashboard", requireAuth, allowRoles("ADMIN"), dashboard);
router.post("/stores",    requireAuth, allowRoles("ADMIN"), storeRules, createStore);
router.post("/users",     requireAuth, allowRoles("ADMIN"), adminAddUserRules, addUser);

module.exports = router;
