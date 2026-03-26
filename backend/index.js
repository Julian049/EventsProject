const express = require("express");
const app = express();
const port = 3250;
const cors = require('cors');

const db = require('./database');
db.one('SELECT $1 AS value', 123)
    .then(data => console.log('DB conectada:', data.value))
    .catch(error => console.log('DB error:', error));

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use('/event', require("./routes/eventRoute"));
app.use('/category', require("./routes/categoryRoute"));
app.use('/users', require("./routes/userRoute"));
app.use('/auth', require("./routes/authRoute"));
app.use('/purchase', require("./routes/purchaseRoute"));
app.use('/ticketType', require("./routes/ticketTypeRoute"));
app.use('/eventTicketType', require("./routes/eventTicketTypeRoute"));
app.use('/ticket', require('./routes/ticketRoute'));

app.listen(port, () => console.log("Server running on port " + port));