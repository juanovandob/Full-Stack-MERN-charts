import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './mongodb/connect.js'; //Conexión a DB

//Import Routes
import userRouter from './routes/user.routes.js';
import propertyRouter from './routes/property.routes.js';

dotenv.config();  //initialize dotenv

const app = express();

//middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) =>{
    res.send({ message: 'Hello project 3' });
})

//Se hace el llamado a los routes como middlewares
app.use('/api/v1/users', userRouter);
app.use('/api/v1/properties', propertyRouter);

const startServer = async () => {
    try {
        //connect database
        connectDB(process.env.MONGODB_URL);

        app.listen(4000, () => console.log('started on port 4000'));
    } catch (error) {
        console.log(error);
    }
}

startServer();


