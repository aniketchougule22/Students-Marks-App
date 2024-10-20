const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
require('./config/db');

app.use(express.json());
app.use(cors());

const { students } = require('./src/');

app.use('/students', students);

app.use((req, res, next)=> {
    res.status(404).json({
        message: 'Ohh you are lost, read the API documentation to find your way back home :)'
    });
});

app.listen(process.env.PORT,() => {
    console.log(`Server running on port ${process.env.PORT}`);
})