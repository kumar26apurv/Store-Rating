
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/authorizeRole");
const storeController = require("../controllers/storeController");
const { validateStoreFields, handleValidationErrors } = require('../middleware/validationMiddleware'); 

// admin create store route
router.post(
  "/",
  verifyToken,
  authorizeRole(["system_admin"]),
  validateStoreFields,         
  handleValidationErrors,      
  storeController.createStore
);
//store_owner get dashboard route
router.get(
  "/my-dashboard",
  verifyToken,
  authorizeRole(["store_owner"]),
  storeController.getOwnerDashboard
);
// public route to get all the stores
router.get("/", storeController.getAllStores);

module.exports = router;