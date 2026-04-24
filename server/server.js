const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api", require("./routes/tableRoutes"));

app.listen(5000, () => {
    console.log("Server running on 5000 ✅");
});