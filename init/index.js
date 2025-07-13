const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

// Connect to MongoDB
const MONOGO_URL = "mongodb://127.0.0.1:27017/mystay";

main().then(() => console.log("Connected to MongoDB")).catch(error => console.error(error));
async function main(){
    await mongoose.connect(MONOGO_URL);
}

const intiDB = async()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "6857961103463d8e1c791f2f"}));
    await Listing.insertMany(initData.data);
    console.log("Data has been added to the database");

}
intiDB();