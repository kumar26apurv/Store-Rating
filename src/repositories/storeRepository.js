const { Store, User } = require("../models");
const { Op, Model } = require("sequelize");
const storeRepository = {
  async createStore(storeData) {
    try {
      console.log("storeData:", storeData);
      const newStore = await Store.create(storeData);
      return newStore;
    } catch (error) {
      console.log("Error in storeRepository.createStore:", error);
      throw error;
    }
  },
  async findStoreByEmail(email) {
    try {
      const store = await Store.findOne({ where: { email } });
      return store;
    } catch (error) {
      console.log("Error in storeRepository.findStoreByEmail:", error);
      throw error;
    }
  },
  async findAllStores(filterParams = {}) {
    try {
      const queryOptions = {
        include: {
          model: User,
          attributes: ["id", "name", "email"],
        },
      };
      //searching logic below
      if (filterParams.search) {
        queryOptions.where = {
          [Op.or]: [
            //(Case Insensitive due to iLike)
            { name: { [Op.iLike]: `%${filterParams.search}%` } },
            // YA FIR Address mein dhoondhege
            { address: { [Op.iLike]: `%${filterParams.search}%` } },
          ],
        };
      }
      //sorting logic below
      if (filterParams.sortBy) {
        const direction =
          filterParams.sortOrder &&
          filterParams.sortOrder.toUpperCase() === "DESC"
            ? "DESC"
            : "ASC";
        queryOptions.order = [[filterParams.sortBy, direction]];
      } else {
        queryOptions.order = [["id", "ASC"]];
      }
      const stores = await Store.findAll(queryOptions);
      return stores;
    } catch (error) {
      console.log("Error in storeRepository.findAllStores:", error);
      throw error;
    }
  },
  async updateStoreRating(storeId, newAverage, transaction) {
    try {
      const result = await Store.update(
        {
          rating: newAverage,
        },
        {
          where: { id: storeId },
          transaction: transaction,
        }
      );
      return result;
    } catch (error) {
      console.log("Error in storeRepository.updateStoreRating:", error);
      throw error;
    }
  },
  //method to count total stores
  async countAll() {
    try {
      const countStores = await Store.count();
      return countStores;
    } catch (error) {
      console.log("Error in storeRepository.countAll:", error);
      throw error;
    }
  },
  async findStoreByOwnerId(ownerId) {
    try {
      const store = await Store.findOne({ where: { ownerId } });
      return store;
    } catch (error) {
      console.error("Error in storeRepository.findStoreByOwnerId:", error);
      throw error;
    }
  },
};

module.exports = storeRepository;
