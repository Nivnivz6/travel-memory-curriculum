import express from "express";
import { connectDB } from "./config/db.js";
import cors from "cors";
import authRouter from "./routes/auth.js";

const app = express();
const PORT = process.env.PORT || 3000;

// app.get('/', (req, res) => {
//   res.send('Server is running!');
// });

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB(); 
app.use("/api/auth", authRouter)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
