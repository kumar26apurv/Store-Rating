const userRepository = require("../repositories/userRepository");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userService = {
  async registerUser(userData) {
    try {
      // email check for first time users
      const existingUser = await userRepository.findUserByEmail(userData.email);
      if (existingUser) {
        throw new Error("Email already exists");
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const safeUserData = {
        ...userData,
        password: hashedPassword,
        // client se jo bhi role aaye, use overwrite karke normal_user set kar dege
        role: "normal_user",
      };

      const newUser = await userRepository.createUser(safeUserData);
      delete newUser.dataValues.password;
      return newUser;
    } catch (error) {
      console.error("Error in userService.registerUser:", error);
      throw error;
    }
  },
  async userLogin(email, password) {
    try {
      const user = await userRepository.findUserByEmail(email);
      if (!user) {
        throw new Error("Invalid Credentials");
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error("Invalid Credentials");
      }
      const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      delete user.dataValues.password;
      return { token, user };
    } catch (error) {
      console.error("Error in userService.userLogin:", error);
      throw error;
    }
  },
async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await userRepository.findUserById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        throw new Error("Incorrect current password");
      }
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      await userRepository.updatePassword(userId, hashedNewPassword);
      return { message: "Password updated successfully" };
    } catch (error) {
      console.error("Error in userService.changePassword:", error);
      throw error;
    }
  },
};
module.exports = userService;
