import dotenv from "dotenv";
import app from "./src/app.js";
import connectDB from "./src/database/db.js";


dotenv.config();

const startServer = async () => {
  await connectDB();

  app.listen(process.env.PORT || 5000, () => {
    console.log(
      `Server running on port ${process.env.PORT || 5000}`
    );
  });
};
console.log(process.env.CLOUDINARY_API_KEY);
startServer();