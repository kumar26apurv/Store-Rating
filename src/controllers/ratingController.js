const ratingService = require("../services/ratingService");

const ratingController = {
  async addRating(req, res) {
    try {
      const userId = req.user.id;
      const { storeId, rating } = req.body;
      const ratingData = { userId, storeId, rating };
      const newRating = await ratingService.addRating(ratingData);
      res.status(201).json({
        message: "Rating submitted successfully",
        rating: newRating,
      });
    } catch (error) {
      console.error("Error in ratingController.addRating:", error);
      res
        .status(500)
        .json({ error: error.message || "Failed to submit rating" });
    }
  },
  async modifyRating(req, res) {
    try {
      const userId = req.user.id;
      const { storeId, rating, comment } = req.body;
      if (!storeId || !rating) {
          return res.status(400).json({ error: "storeId and value are required" });
      }
      const result = await ratingService.modifyRating(storeId, userId, rating, comment);
      res.status(200).json({
        message: result.message,
        data: {
            storeId: result.storeId,
            newAverage: result.newAverage,
            comment: result.comment || null
        }
      });    
    } catch (error) {
      console.error("Error in ratingController.modifyRating:", error);
      if (error.message.includes("No existing rating found")) {
          return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: "Failed to modify rating" });
    }
  }
};

module.exports = ratingController;
