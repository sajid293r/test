if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({
        path: "config/.env",
    });
}

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const emailRoutes = require('./routes/emailRoutes');
const connectDatabase = require("./db/DataBase");

const app = express();
const port = 5000;

connectDatabase();

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.use(bodyParser.json());
<<<<<<< HEAD
app.use(cors());
=======
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
>>>>>>> dcc1f05ce550a4c63aeffa7073ec896534f68168
app.use('/api', emailRoutes);

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});
