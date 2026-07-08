import mongoose from "mongoose";
import { TripType } from "./trips.types.js";
import { Trip } from "./trips.model.js";
import db from "../../config/db.js";

const ownerId1 = new mongoose.Types.ObjectId("6a0ad3ffa92d41f9a173f3a8");
const ownerId2 = new mongoose.Types.ObjectId("6a0ad3ffa92d41f9a173f3a9");

const tripData: Partial<TripType>[] = [
    {
        title: "Viajar a Roma",
        country: "Italia",
        city: "Roma",
        owner: ownerId1,
        startDate: new Date("2024-02-13"),
        endDate: new Date("2024-02-18"),
        description: "Visitar el Vaticano",
        visibility: "public",
        status: "pending",
    },
    {
        title: "Escapada a París",
        country: "Francia",
        city: "París",
        owner: ownerId2,
        startDate: new Date("2024-03-10"),
        endDate: new Date("2024-03-15"),
        description: "Subir a la Torre Eiffel y pasear por el Sena",
        visibility: "public",
        status: "completed",
    },
    {
        title: "Viaje a Viena",
        country: "Austria",
        city: "Viena",
        owner: ownerId1,
        startDate: new Date("2024-04-15"),
        endDate: new Date("2024-04-17"),
        description: "Descubrir los museos de Viena",
        visibility: "private",
        status: "pending",
    }
];

mongoose
    .connect(db.DB_URL)
    .then(async () => {
        const allTrips = await Trip.find();

        if (allTrips.length) {
            console.log("Deleting trips collection...");
            await Trip.collection.drop();
        } else {
            console.log("No existing trips found, creating trips...");
        }
    })
    .catch((error: unknown) => console.log("There was an error when deleting trips.", error))
    .then(async () => {
        await Trip.insertMany(tripData);
        console.log("Trips added successfully!");
    })
    .catch((error: unknown) => console.log("Error adding trips to database", error))
    .finally(() => mongoose.disconnect());
