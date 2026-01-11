// require('dotenv').config();
// const express = require("express");
// //importing essential routes below
// const userRoutes = require("./routes/userRoutes");
// const storeRoutes = require("./routes/storeRoutes"); 
// const ratingRoutes = require("./routes/ratingRoutes"); 
// const adminRoutes = require("./routes/adminRoutes");
// const { sequelize } = require("./models");
// const app = express();
// const PORT = 3001;

// //middleware to pass the json data kyunki express can't read jso data itself
// app.use(express.json());
// app.use('/api/users', userRoutes);
// app.use('/api/stores', storeRoutes); 
// app.use('/api/ratings', ratingRoutes); 
// app.use('/api/admin', adminRoutes);
// //test routes
// app.get('/',(req, res) => {
//   res.send("Server is running");
// });
// app.listen(PORT, async () => {
//   console.log(`Server is running on http://localhost:${PORT}`);

// try {
//   await sequelize.authenticate();
//   console.log("Connection has been established successfully.");
// } catch (error) {
//   console.error("Unable to connect to the database:", error);
// }
// });
require('dotenv').config();
const express = require("express");
const cors = require("cors");
//importing essential routes below
const userRoutes = require("./routes/userRoutes");
const storeRoutes = require("./routes/storeRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const adminRoutes = require("./routes/adminRoutes");
const { sequelize } = require("./models");
const app = express();
const PORT = 3001;

//middleware for CORS
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

//middleware to pass the json data kyunki express can't read jso data itself
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/stores', storeRoutes); 
app.use('/api/ratings', ratingRoutes); 
app.use('/api/admin', adminRoutes);
//test routes
app.get('/',(req, res) => {
  res.send("Server is running");
});
app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);

try {
  await sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}
});