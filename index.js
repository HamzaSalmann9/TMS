require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const routes = require('./routes/userRoutes');
const intersectionRouter = require('./routes/intersectionRoutes');
const mongoString = process.env.DATABASE_URL;
const cookieParser = require('cookie-parser');
//swagger necessities
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use('/user', routes);
app.use('/intersection', intersectionRouter);
//swagger necessities
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
})


