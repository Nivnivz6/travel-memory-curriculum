import express from "express";
import { connectDB } from "./config/db.js";
import cors from "cors";
import authRouter from "./routes/auth.js";

const app = express();
const PORT = process.env.PORT || 3000;

// app.get('/', (req, res) => {
//   res.send('Server is running!');
// });
(async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
})();

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/auth", authRouter)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
