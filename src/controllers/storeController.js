const storeService = require("../services/storeService");
const storeController ={
    async createStore(req,res){
        try{
            // const newStore = req.body;
            const{name, email, address, ownerId}=req.body;
            const newStore = await storeService.createStore({name, email, address, ownerId});
            res.status(201).json({
                message:"Store created successfully",
                store:newStore
            })
        }catch(error){
            res.status(400).json({
                error:error.message
            });
        }
    },
    //method to get all stores with filters(search & sort)
    async getAllStores(req,res){
        try{
            const {search, sortBy, sortOrder} = req.query;
            const filterParams ={search, sortBy, sortOrder};
            const stores = await storeService.getAllStores(filterParams); 
            res.status(200).json({
                message:"Stores fetched successfully",
                stores:stores
            })
        }catch(error){
            console.error("Error in storeController.getAllStores:", error);
            // Use 500 for internal server errors
            res.status(500).json({ error: "Failed to fetch stores" });
        }
    },
    async getOwnerDashboard(req, res) {
    try {
      const ownerId = req.user.id;
      if (req.user.role !== 'store_owner') {
          return res.status(403).json({ error: "Access denied. Only Store Owners can view this dashboard." });
      }

      const dashboardData = await storeService.getOwnerDashboard(ownerId);
      res.status(200).json({
        message: "Store Owner dashboard data fetched successfully",
        data: dashboardData
      });
    } catch (error) {
      console.error("Error in storeController.getOwnerDashboard:", error);
      if (error.message === "Store not found for this owner.") {
          return res.status(404).json({ error: error.message });
      }    
      res.status(500).json({ error: "Failed to fetch dashboard data" });
    }
  },
};
module.exports = storeController;