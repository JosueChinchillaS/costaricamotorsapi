const UsedVehicle = require("../../models/UsedVehicle");
const Vehicle = require("../../models/Vehicle");

// Abstract out the common find logic
const findVehicles = async (model) => {
  try {
    return await model.find();
  } catch (error) {
    console.error("Error retrieving vehicles:", error);
    throw new Error("Failed to retrieve vehicles.");
  }
};

// Abstract out the common find by ID logic
const findVehicleById = async (model, identification) => {
  try {
    const vehicle = await model.findOne({ identification });

    if (!vehicle) {
      throw new Error("Vehicle not found");
    }

    return vehicle;
  } catch (error) {
    console.error(`Error retrieving vehicle with ID ${identification}:`, error);
    throw new Error(`Failed to retrieve vehicle with ID ${identification}.`);
  }
};

// Abstract out the common create logic
const createVehicle = async (model, input) => {
  try {
    const newVehicle = new model(input);
    return await newVehicle.save();
  } catch (error) {
    console.error("Error adding the vehicle:", error);
    throw new Error("Failed to create the vehicle");
  }
};

const resolvers = {
  Query: {
    getCars: () => findVehicles(Vehicle),
    getCarById: (_, { identification }) =>
      findVehicleById(Vehicle, identification),

    getUsedCars: () => findVehicles(UsedVehicle),
    getUsedCarById: (_, { identification }) =>
      findVehicleById(UsedVehicle, identification),
  },
  Mutation: {
    createCar: (_, { input }) => createVehicle(Vehicle, input),
    createUsedCar: (_, { input }) => createVehicle(UsedVehicle, input),
  },
};

module.exports = resolvers;

// const UsedVehicle = require("../../models/UsedVehicle");
// const Vehicle = require("../../models/Vehicle");

// // Helper to handle async operations
// const handleAsync = async (operation) => {
//   try {
//     return await operation();
//   } catch (error) {
//     console.error("Error:", error);
//     throw new Error(error.message || "Operation failed.");
//   }
// };

// const resolvers = {
//   Query: {
//     //NEW Cars
//     getCars: async () => {
//       try {
//         const vehicles = await Vehicle.find();
//         return vehicles;
//       } catch (error) {
//         console.error("Error retrieving vehicles:", error);
//         throw new Error("Failed to retrieve vehicles.");
//       }
//     },

//     getCarById: async (_, { identification }) => {
//       try {
//         const vehicle = await Vehicle.findOne({ identification });

//         if (!vehicle) {
//           throw new Error("Vehicle not found");
//         }

//         return vehicle;
//       } catch (error) {
//         console.error(
//           `Error retrieving vehicle with name ${identification}:`,
//           error
//         );
//         throw new Error(
//           `Failed to retrieve vehicle with name ${identification}.`
//         );
//       }
//     },

//     //USED Cars

//     //NEW Cars
//     getUsedCars: async () => {
//       try {
//         const vehicles = await UsedVehicle.find();
//         return vehicles;
//       } catch (error) {
//         console.error("Error retrieving vehicles:", error);
//         throw new Error("Failed to retrieve vehicles.");
//       }
//     },
//     getUsedCarById: async (_, { identification }) => {
//       try {
//         const vehicle = await UsedVehicle.findOne({ identification });

//         if (!vehicle) {
//           throw new Error("Vehicle not found");
//         }

//         return vehicle;
//       } catch (error) {
//         console.error(
//           `Error retrieving vehicle with name ${identification}:`,
//           error
//         );
//         throw new Error(
//           `Failed to retrieve vehicle with name ${identification}.`
//         );
//       }
//     },
//   },
//   Mutation: {
//     //Create NEW Car
//     createCar: async (_, { input }) => {
//       try {
//         const newCar = new Vehicle(input);
//         const result = await newCar.save();
//         return result;
//       } catch (error) {
//         console.error("Error al añadir el vehículo:", error);
//         throw new Error("Fallo al crear el vehículo");
//       }
//     },

//     //Create USED Car
//     createUsedCar: async (_, { input }) => {
//       try {
//         const newUsedCar = new UsedVehicle(input);
//         const result = await newUsedCar.save();
//         return result;
//       } catch (error) {
//         console.error("Error al añadir el vehículo:", error);
//         throw new Error("Fallo al crear el vehículo");
//       }
//     },
//   },
// };

// module.exports = resolvers;
