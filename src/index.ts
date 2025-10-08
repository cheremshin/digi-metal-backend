import { config } from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

config();

async function startServer() {
    const app = express();
    const port = process.env.PORT;

    app.use(helmet());
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.get('/', (req, res) => {
        res.send('Hello World');
    });
    
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

startServer().catch(error => {
    console.error('Error starting server:', error);
    process.exit(1);
});
