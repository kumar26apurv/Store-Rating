const { User } = require("../models");
const { Op } = require("sequelize");
const userRepository = {
  async createUser(userData) {
    try {
      const newUser = await User.create(userData);
      return newUser;
    } catch (error) {
      console.log("Error in userRepository.createUser:", error);
      throw error;
    }
  },

  async findUserByEmail(email) {
    try {
      const user = await User.findOne({ where: { email } });
      return user;
    } catch (error) {
      console.log("Error in userRepository.findUserByEmail:", error);
      throw error;
    }
  },
  async findUserById(id) {
    try {
      const user = await User.findByPk(id);
      return user;
    } catch (error) {
      console.error("Error in userRepository.findUserById:", error);
      throw error;
    }
  },
  async findOwnerById(ownerId) {
    try {
      const owner = await User.findOne({
        where: {
          id: ownerId,
        },
      });
      return owner;
    } catch (error) {
      console.log("Error in userRepository.findOwnerById:", error);
      throw error;
    }
  },
  async countAll() {
    try {
      const countUsers = await User.count();
      return countUsers;
    } catch (error) {
      console.log("Error in userRepository.countAll:", error);
      throw error;
    }
  },
  async findAllUsers(filterParams = {}) {
    try {
      // password excluded(security measure)
      const queryOptions = {
        attributes: { exclude: ["password"] },
        where: {},
      };

      // generic search logic (name, email, address)
      if (filterParams.search) {
        queryOptions.where[Op.or] = [
          { name: { [Op.iLike]: `%${filterParams.search}%` } },
          { email: { [Op.iLike]: `%${filterParams.search}%` } },
          { address: { [Op.iLike]: `%${filterParams.search}%` } },
        ];
      }

      // specific role filter (if admin asks for store_owners only)
      if (filterParams.role) {
        // Jo pehle se where condition hai, usme role bhi jod do (AND logic)
        queryOptions.where.role = filterParams.role;
      }
      // sorting (optional-so we can show the newest first)
      if (filterParams.orderBy) {
        queryOptions.order = [[filterParams.orderBy, "ASC"]];
      } else {
        queryOptions.order = [["createdAt", "DESC"]];
      }
      const users = await User.findAll(queryOptions);
      return users;
    } catch (error) {
      console.error("Error in userRepository.findAllUsers:", error);
      throw error;
    }
  },
  async updatePassword(userId, newHashedPassword) {
    try {
      const newPassword = await User.update(
        {
          password: newHashedPassword,
        },
        {
          where: {
            id: userId,
          },
        }
      );
      return newPassword;
    } catch (error) {
      console.error("Error in userRepository.updatePassword:", error);
      throw error;
    }
  },
};
module.exports = userRepository;
