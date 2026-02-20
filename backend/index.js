const express = require("express");
const app = express();
const eventRoutes = require("./routes/eventRoute");
const port = 3250;

app.use(express.json());
app.use('/event', eventRoutes);

app.listen(port, () => {
    console.log("Server running on port " + port);
})

