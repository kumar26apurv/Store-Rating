const adminService = require("../services/adminService");
const adminController = {
  async getDashboardStats(req, res) {
    try {
      const stats = await adminService.getDashboardStats();
      res.status(200).json({
        message: "Dashboard stats fetched successfully",
        stats: stats,
      });
    } catch (error) {
      console.error("Error in adminController.getDashboardStats:", error);
      res.status(500).json({
        error: "Failed to fetch dashboard Stats",
      });
    }
  },
  //fn for admin to create a user
  async createUser(req, res) {
    try {
      const { name, email, password, address, role } = req.body;
      const validRoles = ["system_admin", "store_owner", "normal_user"];
      if (role && !validRoles.includes(role)) {
        return res.status(400).json({ error: "Invalid role specified" });
      }
      const userData = { name, email, password, address, role };
      const newUser = await adminService.createUser(userData);
      res.status(201).json({
        message: "User created successfully",
        user: newUser,
      });
    } catch (error) {
      console.error("Error in adminController.createUser:", error);
      if (error.message === "Email already exists") {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: "Failed to create user" });
    }
  },
  async getAllUsers(req, res) {
    try {
      const { search, orderBy, role } = req.query;
      const filterParams = { search, orderBy, role };
      const users = await adminService.getAllUsers(filterParams);
      res.status(200).json({
        message: "Users fetched successfully",
        users: users,
      });
    } catch (error) {
      console.error("Error in adminController.getAllUsers:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  },
};
module.exports = adminController;
