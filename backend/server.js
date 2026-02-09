require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB=require("./config/db");
const authRoutes=require("./routes/authRoutes");
const incomeRoutes=require("./routes/incomeRoutes");
const expenseRoutes=require("./routes/expenseRoutes");
const dashboardRoutes=require("./routes/dashboardRoutes");
const app = express();

// Middleware to handle CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
//app.use(express.urlencoded({ extended: true }));
connectDB();

app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/income",incomeRoutes);
app.use("/api/v1/expense",expenseRoutes);
app.use("/api/v1/dashboard",dashboardRoutes);
app.use("/uploads",express.static(path.join(__dirname,"uploads")));
<<<<<<< HEAD
=======
app.get("/", (req, res) => {
  res.send("Expense Tracker API is running 🚀");
});

>>>>>>> 9df84abc12171b6cd2acf9f4baf7d2e8802c0875

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
