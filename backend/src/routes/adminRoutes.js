const router = require("express").Router();
const {
  getAdminStats,
  addUser,
  listUsers,
  getUserDetails,
  deleteUser,
  updateUser,
  listStores,
  getStoreDetails,
  updateStore,
  deleteStore,
} = require("../controllers/adminController");

const { storeRules, adminAddUserRules } = require("../validators");
const { createStore } = require("../controllers/storeController");
const { requireAuth, allowRoles } = require("../middleware/auth");

// Dashboard stats route - only accessible to Admins
router.get("/dashboard", requireAuth, allowRoles("ADMIN"), getAdminStats);

// Stores management - only accessible to Admins
router.post("/stores", requireAuth, allowRoles("ADMIN"), storeRules, createStore);
router.get("/stores", requireAuth, allowRoles("ADMIN"), listStores);
router.get("/stores/:id", requireAuth, allowRoles("ADMIN"), getStoreDetails);
router.put("/stores/:id", requireAuth, allowRoles("ADMIN"), updateStore);
router.delete("/stores/:id", requireAuth, allowRoles("ADMIN"), deleteStore);

// User management - adding users - only accessible to Admins
router.post("/users", requireAuth, allowRoles("ADMIN"), adminAddUserRules, addUser);

// User management - listing users - only accessible to Admins
router.get("/users", requireAuth, allowRoles("ADMIN"), listUsers);
router.get("/users/:id", requireAuth, allowRoles("ADMIN"), getUserDetails);
router.put("/users/:id", requireAuth, allowRoles("ADMIN"), updateUser);
router.delete("/users/:id", requireAuth, allowRoles("ADMIN"), deleteUser);

module.exports = router;
