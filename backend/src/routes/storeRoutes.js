const express = require("express");
const { requireAuth } = require("../middleware/auth");
const { body, validationResult } = require("express-validator");
const { createStore, listStores, rateStore } = require("../controllers/storeController");
const { getStoreOwnerDashboard } = require("../controllers/storeController");


const router = express.Router();

const storeRules = [
  body("name")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters"),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email"),
  body("address")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Address must be at least 3 characters"),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

router.get("/", requireAuth, listStores);

router.post("/", requireAuth, storeRules, validate, createStore);

router.post("/:id/rate", requireAuth, rateStore);

router.get("/owner/dashboard", requireAuth, getStoreOwnerDashboard);


module.exports = router;
