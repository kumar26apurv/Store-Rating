const express = require("express");
const{verifyToken} = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");
const { validateUserFields, validateChangePassword, handleValidationErrors } = require('../middleware/validationMiddleware'); // <-- NEW IMPORT
const router = express.Router();

// public signup route
router.post(
  '/signup', 
  validateUserFields,         
  handleValidationErrors,      
  userController.register
); 

router.post('/login', userController.login);

// change password route
router.put(
  "/change-password", 
  verifyToken, 
  validateChangePassword,     
  handleValidationErrors,      
  userController.changePassword
);

// proctored route for token verification
router.get('/profile', verifyToken, (req, res) => {
    res.json({
        message:"Proctored route",
        user:req.user
    });
});
module.exports = router;