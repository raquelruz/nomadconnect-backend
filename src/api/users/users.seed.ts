import mongoose from "mongoose";
import db from "../../config/db.js";
import { User } from "./users.model.js";

const userData =  [
    {
        username: "raquelruz",
        name: "Raquel",
        email: "raquel@vueltitapp.com",
        password: "123456",
        avatar: "https://cdn-icons-png.flaticon.com/512/9187/9187604.png",
        bio: "Usuario de prueba",
        languages: ["Español"],
        isPublic: true,
    },
    {
        username: "usuarioDePrueba",
        name: "Usuario de Prueba",
        email: "usuariodeprueba@vueltitapp.com",
        password: "123456",
        avatar: "https://cdn-icons-png.flaticon.com/512/9187/9187604.png",
        bio: "Otro usuario de prueba",
        languages: ["Español", "Inglés"],
        isPublic: true,
    },
    {
        username: "admin",
        name: "Admin",
        email: "admin@vueltitapp.com",
        password: "123456",
        avatar: "https://cdn-icons-png.flaticon.com/512/9187/9187604.png",
        bio: "Usuario Admin",
        languages: ["Español", "Italiano"],
        isPublic: false,
    }
];

mongoose
    .connect(db.DB_URL)
    .then(async () => {
        const allUsers = await User.find();

        if(allUsers.length) {
            console.log("Deleting users collection...");
            await User.collection.drop();
            console.log("Users collection deleted succesfully.");
        } else {
            console.log("No existing users found, preparing to seed...");
        };
    })
    .catch((error: unknown) => console.log("There was an error when deleting users.", error))
    .then(async () => {
        await User.insertMany(userData);
        console.log("Users added succesfully");
    })
    .catch((error: unknown) => console.log("Error adding users to database", error))
    .finally(() => {
        mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    });