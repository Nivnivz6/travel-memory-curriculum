const express = require("express");
const { connectDB } = require("./config/db");
const cors = require("cors");
const authRouter = require('./routes/auth')

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
app.use("/api/auth", authRouter)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
