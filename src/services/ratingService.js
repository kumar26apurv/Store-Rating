const ratingRepository = require("../repositories/ratingRepository");
const storeRepository = require("../repositories/storeRepository");
const db = require("../models/index.js");
const ratingService = {
  async addRating(ratingData) {
    const transaction = await db.sequelize.transaction();
    try {
      const newRating = await ratingRepository.createRating(
        ratingData,
        transaction
      );
      const averageRating = await ratingRepository.getAverageRatings(
        ratingData.storeId,
        transaction
      );
      await storeRepository.updateStoreRating(
        ratingData.storeId,
        averageRating,
        transaction
      );
      await transaction.commit();
      return newRating;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
  async modifyRating(storeId, userId, value, comment) {
    const transaction = await db.sequelize.transaction();
    try {
      const existingRating = await ratingRepository.findRatingByStoreAndUser(
        storeId,
        userId
      );
      if (!existingRating) {
        throw new Error(
          "No existing rating found to modify. Please submit a new rating instead."
        );
      }
      const ratingId = existingRating.id;
      await ratingRepository.updateRating(
        ratingId,
        value,
        comment,
        transaction
      );
      const newAverage = await ratingRepository.getAverageRatings(
        storeId,
        transaction
      );
      await storeRepository.updateStoreRating(storeId, newAverage, transaction);
      await transaction.commit();
      return { storeId, newAverage,comment:comment, message: "Rating modified successfully" };
    } catch (error) {
      await transaction.rollback();
      console.error("Error in ratingService.modifyRating:", error);
      throw error;
    }
  },
};
module.exports = ratingService;
