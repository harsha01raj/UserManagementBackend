const mongoose=require("mongoose");
require("dotenv").config();
// Connection stablished here
const connection=mongoose.connect(process.env.MONGO_URL);

module.exports=connection