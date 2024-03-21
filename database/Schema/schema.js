const { gql } = require("apollo-server-express");

//Schema
const typeDefs = gql`
  # Types
  # Scalars
  scalar Date

  # Types

  # New Vehicles
  type Statistic {
    label: String
    value: String
  }

  type Spec {
    label: String
    value: String
  }

  type Specs {
    title: String
    desc: String
  }

  type ExteriorDetail {
    title: String
    desc: String
    img: String
    img1: String
    img2: String
    spec1: Specs
    spec2: Specs
    spec3: Specs
  }

  type InteriorDetail {
    title: String
    desc: String
    img1: String
    img2: String
    img3: String
    spec1: Specs
    spec2: Specs
  }

  type SpecWithImg {
    title: String
    desc: String
    img: String
  }

  type ExtrasDetail {
    title: String
    desc: String
    spec1: SpecWithImg
    spec2: SpecWithImg
  }

  type ColorDetail {
    color: String
    colorImg: String
  }

  type Colors {
    title: String
    desc: String
    colors: [ColorDetail]
  }

  type TechDetail {
    title: String
    desc: String
    img1: String
    img2: String
    img3: String
    spec1: Specs
    spec2: Specs
    spec3: Specs
  }

  type VersionPricing {
    name: String
    title: String
    warranty: String
    price: String
    wheels: String
    initialPrice: Float
    interest: Float
    term: String
  }

  type Pricing {
    option: String
    versions: [VersionPricing]
  }

  type Vehicle {
    identification: String
    category: String
    brand: String
    title: String
    logo: String
    type: String
    price: String
    concept: String
    insight: String
    shortDescription: String
    img: String
    statistics: [Statistic]
    features: [String]
    specs: [Spec]
    exterior: [ExteriorDetail]
    interior: [InteriorDetail]
    extras: [ExtrasDetail]
    colors: [Colors]
    tech: [TechDetail]
    pricing: [Pricing]
  }

  # Inputs
  input StatisticInput {
    label: String
    value: String
  }

  input SpecInput {
    label: String
    value: String
  }

  input SpecsInput {
    title: String
    desc: String
  }

  input ExteriorDetailInput {
    title: String
    desc: String
    img: String
    img1: String
    img2: String
    spec1: SpecsInput
    spec2: SpecsInput
    spec3: SpecsInput
  }

  input InteriorDetailInput {
    title: String
    desc: String
    img1: String
    img2: String
    img3: String
    spec1: SpecsInput
    spec2: SpecsInput
  }

  input SpecWithImgInput {
    title: String
    desc: String
    img: String
  }

  input ExtrasDetailInput {
    title: String
    desc: String
    spec1: SpecWithImgInput
    spec2: SpecWithImgInput
  }

  input ColorDetailInput {
    color: String
    colorImg: String
  }

  input ColorsInput {
    title: String
    desc: String
    colors: [ColorDetailInput]
  }

  input TechDetailInput {
    title: String
    desc: String
    img1: String
    img2: String
    img3: String
    spec1: SpecsInput
    spec2: SpecsInput
    spec3: SpecsInput
  }

  input VersionPricingInput {
    name: String
    title: String
    warranty: String
    price: String
    wheels: String
    initialPrice: Float
    interest: Float
    term: String
  }

  input PricingInput {
    option: String!
    versions: [VersionPricingInput]
  }

  input VehicleInput {
    identification: String
    category: String
    brand: String
    type: String
    title: String
    logo: String
    price: String
    concept: String
    insight: String
    shortDescription: String
    img: String
    statistics: [StatisticInput]
    features: [String]
    specs: [SpecInput]
    exterior: [ExteriorDetailInput]
    interior: [InteriorDetailInput]
    extras: [ExtrasDetailInput]
    colors: [ColorsInput]
    tech: [TechDetailInput]
    pricing: [PricingInput]
  }

  # Used Vehicles
  type UsedVehicle {
    id: ID
    img: String
    images: [String]
    identification: String
    category: String
    brand: String
    logo: String
    price: String
    title: String
    concept: String
    insight: String
    shortDescription: String
    type: String
    interior: [String]
    exterior: [String]
    security: [String]
    comfort: [String]
    multimedia: [String]
    year: Int
    fuelType: String
    engine: String
    transmission: String
    traction: String
    mileage: String
    passengers: Int
    doors: Int
    exteriorColor: String
    interiorColor: String
    dimensions: Dimensions
  }

  type Dimensions {
    length: Float
    width: Float
    height: Float
  }

  input UsedVehicleInput {
    identification: String
    category: String
    img: String
    images: [String]
    brand: String
    logo: String
    price: String
    title: String
    concept: String
    insight: String
    shortDescription: String
    type: String
    interior: [String]
    exterior: [String]
    security: [String]
    comfort: [String]
    multimedia: [String]
    year: Int
    fuelType: String
    engine: String
    transmission: String
    traction: String
    mileage: String
    passengers: Int
    doors: Int
    exteriorColor: String
    interiorColor: String
    dimensions: DimensionsInput
  }

  input DimensionsInput {
    length: Float
    width: Float
    height: Float
  }

  # Query and Mutation Types

  type Query {
    getCarById(identification: String!): Vehicle
    getCars: [Vehicle]

    getUsedCarById(identification: String!): UsedVehicle
    getUsedCars: [UsedVehicle]
  }

  type Mutation {
    # New Car
    createCar(input: VehicleInput!): Vehicle
    updateCar(id: ID!, input: VehicleInput!): Vehicle
    deleteCar(id: ID!): Boolean

    # Used Car

    createUsedCar(input: UsedVehicleInput): UsedVehicle
    updateUsedCar(id: ID!, input: UsedVehicleInput!): UsedVehicle
    deleteUsedCar(id: ID!): Boolean!
  }
`;

module.exports = typeDefs;
