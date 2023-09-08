import mongoose from "mongoose";

import app from "./app.js";

const DB_HOST =
  "mongodb+srv://Irina:VBO06VadYoD2BZdH@cluster0.l0odltx.mongodb.net/ContactsData?retryWrites=true&w=majority";

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(3000, () => {
      console.log("Server running. Use our API on port: 3000");
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
