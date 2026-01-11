const { verifyToken } = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/authorizeRole");
const adminController = require("../controllers/adminController");
const express = require("express");
const { validateUserFields, handleValidationErrors } = require('../middleware/validationMiddleware'); 
const router = express.Router();
// admin dashboard stats route
router.get(
  "/dashboard-stats",
  verifyToken,
  authorizeRole(["system_admin"]),
  adminController.getDashboardStats
);

// admin create new user route
router.post(
  "/users",
  verifyToken,
  authorizeRole(["system_admin"]),
  validateUserFields,          
  handleValidationErrors,       
  adminController.createUser
);
//admin get all users route
router.get(
  "/users",
  verifyToken,
  authorizeRole(["system_admin"]),
  adminController.getAllUsers
);
module.exports = router;