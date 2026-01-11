const express = require("express");
const router = express.Router();
const ratingController = require("../controllers/ratingController");
const { verifyToken } = require("../middleware/authMiddleware");
const { validateRating, handleValidationErrors } = require('../middleware/validationMiddleware'); // <-- NEW IMPORT

router.post(
  '/', 
  verifyToken, 
  validateRating,             
  handleValidationErrors,    
  ratingController.addRating
);
router.put(
  '/', 
  verifyToken, 
  validateRating,             
  handleValidationErrors,    
  ratingController.modifyRating 
);
module.exports = router;