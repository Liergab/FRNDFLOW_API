import express from 'express';
import 'dotenv/config';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors'
import dbConnection from './config/database.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js'
import { pageNotFound } from './middleware/errrorValidation.js';
import { error } from './middleware/errrorValidation.js';

const app = express();
app.use(cors())
app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// app.use(morgan())
app.use('/v1/api',userRoutes )
app.use('/v1/api',postRoutes)
app.use(pageNotFound)
app.use(error)


const Port = 8001 || process.env.PORT
dbConnection()
app.listen(Port, () => {
    console.log(`Connected to port: http://localhost:${Port}`)
})