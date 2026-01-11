const userService = require("../services/userService");
const { validateSignup } = require("../utils/validator");

const userController = {
  async register(req, res) {
    try {
      const userData = req.body;

      const validationErrors = validateSignup(userData);
      if (validationErrors.length > 0) {
        return res
          .status(400)
          .json({ error: "Validation Failed", details: validationErrors });
      }

      const newUser = await userService.registerUser(userData);
      res.status(201).json(newUser);
    } catch (error) {
      console.error("Error registering user:", error);

      // email already exists check
      if (error.message === "Email already exists") {
        return res.status(409).json({
          error: "Conflict",
          details: "Email already registered",
        });
      }

      //generic error for other type of errors
      res.status(500).json({
        error: "Registration failed",
        details: error.message,
      });
    }
  },
  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email and password are required" });
      }
      const { token, user } = await userService.userLogin(email, password);

      res
        .status(200)
        .json({ message: "Login successful", token: token, user: user });
    } catch (error) {
      if (error.message === "Invalid Credentials") {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      console.error("Error logging in:", error); //for debugging purpose, might remove this later
      res.status(500).json({ error: "Login failed", details: error.message });
    }
  },
  async changePassword(req, res) {
    try {
      const userId = req.user.id;
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return res
          .status(400)
          .json({ error: "Both current and new passwords are required" });
      }
      const updatedPassword = await userService.changePassword(
        userId,
        currentPassword,
        newPassword
      );
      res.status(200).json({
        message: "Password updated successfully",
        updatedPassword: updatedPassword,
      });
    } catch (error) {
      console.error("Error updating password:", error);
      if (error.message === "Incorrect current password") {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({
        error: "Password update failed",
      });
    }
  },
};
module.exports = userController;
