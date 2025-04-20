import express from "express"; 
import dotenv from "dotenv";

import authRoutes from "./routes/auth.route.js"; // Importing the auth routes
import { connectDB } from "./lib/db.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/" , (req,res) => {
    res.send("hello world!!");
    
})
app.listen(PORT,()=> {
    console.log(`Server is running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
    connectDB();
    
});