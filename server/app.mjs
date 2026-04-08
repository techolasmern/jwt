import express from 'express';
import apiRouter from './routes/api.router.mjs';
import cors from 'cors';
import { createMongoDBConnection } from './config/mongoose.config.mjs';
import otpRouter from './routes/otp.route.mjs';

await createMongoDBConnection();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRouter);
app.use("/otp", otpRouter);

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});