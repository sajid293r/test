require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const emailRoutes = require('./routes/emailRoutes');

const app = express();
const port = 5000;

mongoose.connect('mongodb+srv://user123:user123@cluster0.unkh6.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 30000, // Increase connection timeout
    socketTimeoutMS: 30000 // Increase socket timeout
});
app.get("/", (req,res)=>{
    res.send("Hello World")
})
app.use(bodyParser.json());
app.use(cors());
app.use('/api', emailRoutes);

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});
