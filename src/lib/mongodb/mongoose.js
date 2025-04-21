import mongoose from "mongoose";

let intialized = false;

export const connect = async () => {
    mongoose.set("strictQuery", true);
  if (intialized) { 
    console.log("Already connected to MongoDB");
    return;
}
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'next-blog',
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
    intialized = true;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}