const { body } = require("express-validator");

// Name 20–60, Address ≤400, Email valid, Password 8–16 (1 uppercase + 1 special)
const pwdRe = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

exports.signupRules = [
  body("name").isLength({ min: 20, max: 60 }),
  body("email").isEmail(),
  body("address").optional({ nullable: true }).isLength({ max: 400 }),
  body("password").matches(pwdRe),
];

exports.loginRules = [
  body("email").isEmail(),
  body("password").notEmpty(),
];

exports.storeRules = [
  body("name").isLength({ min: 2, max: 100 }),
  body("email").optional({ nullable: true }).isEmail(),
  body("address").optional({ nullable: true }).isLength({ max: 400 }),
];

exports.adminAddUserRules = [
  body("name").isLength({ min: 20, max: 60 }),
  body("email").isEmail(),
  body("address").optional({ nullable: true }).isLength({ max: 400 }),
  body("password").matches(pwdRe),
  body("role").isIn(["ADMIN", "USER", "OWNER"]),
  body("store_id").optional({ nullable: true }).isInt().toInt(),
];
