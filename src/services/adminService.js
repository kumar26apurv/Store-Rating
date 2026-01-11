const ratingRepository = require("../repositories/ratingRepository");
const storeRepository = require("../repositories/storeRepository");
const userRepository = require("../repositories/userRepository");
const bcrypt = require("bcryptjs");
const adminService = {
  async getDashboardStats() {
    // try {
    //   const storesCount = await storeRepository.countAll();
    //   const ratingsCount = await ratingRepository.countAll();
    //   const usersCount = await userRepository.countAll();
    //   const allCounts = {
    //     storesCount,
    //     ratingsCount,
    //     usersCount,
    //   };

    //   return {
    //     allCounts,
    //   };
    // } catch (error) {
    //   throw error;
    // }
    //promise way(more efficient)
    try {
      const [storesCount, ratingsCount, usersCount] = await Promise.all([
        storeRepository.countAll(),
        ratingRepository.countAll(),
        userRepository.countAll(),
      ]);
      return {
        storesCount,
        ratingsCount,
        usersCount,
      };
    } catch (error) {
      console.error("Error in adminService.getDashboardStats:", error);
      throw error;
    }
  },
  async createUser(userData) {
    try {
      const existingUser = await userRepository.findUserByEmail(userData.email);
      if (existingUser) {
        throw new Error("Email already exists");
      }
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const safeUserData = {
        ...userData,
        password: hashedPassword,
        // agar admin role deta hai to uska given role nahi to normal_user set kar dege
        role: userData.role || "normal_user",
      };
      const newUser = await userRepository.createUser(safeUserData);
      delete newUser.dataValues.password;
      return newUser;
    } catch (error) {
      console.error("Error in adminService.createUser:", error);
      throw error;
    }
  },
  async getAllUsers(filterParams={}){
    try{
      const users = await userRepository.findAllUsers(filterParams);
      return users;
    }catch(error){
      console.error("Error in adminService.getAllUsers:", error);
      throw error;
    }
  },
};
module.exports = adminService;
