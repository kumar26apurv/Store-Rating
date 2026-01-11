const storeRepository = require("../repositories/storeRepository");
const userRepository = require("../repositories/userRepository");
const ratingRepository = require("../repositories/ratingRepository");

const storeService = {
  async createStore(storeData) {
    try {
      const existingStore = await storeRepository.findStoreByEmail(
        storeData.email
      );
      if (existingStore) {
        throw new Error("Email already exists");
      }

      // ✅ owner must exist + must be store_owner
      const ownerCheck = await userRepository.findUserById(storeData.ownerId);
      if (!ownerCheck) {
        throw new Error("Owner not found(doesnt exist in user table)");
      }
      if (ownerCheck.role !== "store_owner") {
        throw new Error("Owner must have store_owner role");
      }

      const newStore = await storeRepository.createStore(storeData);
      return newStore;
    } catch (error) {
      console.error("Error in storeService.createStore:", error);
      throw error;
    }
  },

  async getAllStores(filterParams) {
    try {
      const stores = await storeRepository.findAllStores(filterParams);
      return stores;
    } catch (error) {
      console.error("Error in storeService.getAllStores:", error);
      throw error;
    }
  },

  async getOwnerDashboard(ownerId) {
    try {
      const store = await storeRepository.findStoreByOwnerId(ownerId);

      if (!store) {
        throw new Error("Store not found for this owner.");
      }

      const storeId = store.id;
      const ratings = await ratingRepository.getRatingsByStoreId(storeId);

      const dashboardData = {
        storeName: store.name,
        currentAverageRating: store.rating || 0,
        totalRatingsCount: ratings.length,
        ratingsReceived: ratings.map((rating) => ({
          ratingId: rating.id,
          value: rating.rating, // ✅ FIX (model field is rating)
          comment: rating.comment || null,
          ratedBy: {
            name: rating.User?.name,
            email: rating.User?.email,
          },
          ratedOn: rating.createdAt,
        })),
      };

      return dashboardData;
    } catch (error) {
      console.error("Error in storeService.getOwnerDashboard:", error);
      throw error;
    }
  },
};

module.exports = storeService;
