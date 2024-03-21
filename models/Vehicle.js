const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const statisticSchema = new Schema({
  label: {
    type: String,
    required: false,
  },
  value: {
    type: String,
    required: false,
  },
});

const specSchema = new Schema({
  label: {
    type: String,
    required: false,
  },
  value: {
    type: String,
    required: false,
  },
});

const specsSchema = new Schema({
  title: {
    type: String,
    required: false,
  },
  desc: {
    type: String,
    required: false,
  },
});

const exteriorDetailSchema = new Schema({
  title: {
    type: String,
    required: false,
  },
  desc: {
    type: String,
    required: false,
  },
  img: String,
  img1: String,
  img2: String,
  spec1: specsSchema,
  spec2: specsSchema,
  spec3: specsSchema,
});

const interiorDetailSchema = new Schema({
  title: {
    type: String,
    required: false,
  },
  desc: {
    type: String,
    required: false,
  },
  img1: String,
  img2: String,
  img3: String,
  spec1: specsSchema,
  spec2: specsSchema,
});

const specWithImgSchema = new Schema({
  title: {
    type: String,
    required: false,
  },
  desc: {
    type: String,
    required: false,
  },
  img: {
    type: String,
    required: false,
  },
});

const extrasDetailSchema = new Schema({
  title: {
    type: String,
    required: false,
  },
  desc: {
    type: String,
    required: false,
  },
  spec1: specWithImgSchema,
  spec2: specWithImgSchema,
});

const colorDetailSchema = new Schema({
  color: {
    type: String,
    required: false,
  },
  colorImg: {
    type: String,
    required: false,
  },
});

const colorsSchema = new Schema({
  title: {
    type: String,
    required: false,
  },
  desc: {
    type: String,
    required: false,
  },
  colors: [colorDetailSchema],
});

const techDetailSchema = new Schema({
  title: {
    type: String,
    required: false,
  },
  desc: {
    type: String,
    required: false,
  },
  img1: String,
  img2: String,
  img3: String,
  spec1: specsSchema,
  spec2: specsSchema,
  spec3: specsSchema,
  // You can add more specs here if needed
});

const versionPricingSchema = new Schema({
  name: {
    type: String,
    required: false,
  },
  price: {
    type: String,
    required: false,
  },
  warranty: {
    type: String,
    required: false,
  },
  wheels: {
    type: String,
    required: false,
  },
  title: {
    type: String,
    required: false,
  },
  initialPrice: {
    type: Number,
    required: false,
  },
  interest: {
    type: Number,
    required: false,
  },
  term: {
    type: String,
    required: false,
  },
});

const pricingSchema = new Schema({
  option: {
    type: String,
    enum: ["cash", "lease", "loan"],
    required: true,
  },
  versions: [versionPricingSchema],
});

const vehicleSchema = new Schema({
  identification: String,
  category: String,
  brand: String,
  title: String,
  type: String,
  logo: String,
  price: String,
  concept: String,
  insight: String,
  shortDescription: String,
  img: String,
  statistics: [statisticSchema],
  features: [String],
  specs: [specSchema],
  exterior: [exteriorDetailSchema],
  interior: [interiorDetailSchema],
  extras: [extrasDetailSchema],
  colors: [colorsSchema],
  tech: [techDetailSchema],
  pricing: [pricingSchema],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

module.exports = Vehicle;
