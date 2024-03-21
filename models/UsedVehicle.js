const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const usedVehicleSchema = new Schema({
  identification: String,
  category: String,
  brand: String,
  logo: String,
  price: String,
  title: String,
  type: String,
  year: Number,
  concept: String,
  insight: String,
  shortDescription: String,
  img: String,
  fuelType: String,
  engine: String,
  transmission: String,
  traction: String,
  mileage: String,
  passengers: Number,
  doors: Number,
  exteriorColor: String,
  interiorColor: String,
  interior: [String],
  exterior: [String],
  security: [String],
  comfort: [String],
  multimedia: [String],
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
  },
  images: [String],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const UsedVehicle = mongoose.model("UsedVehicle", usedVehicleSchema);

module.exports = UsedVehicle;
