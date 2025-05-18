import express from 'express';
import { envConfigs } from './config/envConfig';
import swagger from 'swagger-ui-express';
import mainRouter from './router';
import { connectToDatabase } from './database/db';
import cors from 'cors';
import apiDocs from './config/swagger';
import cookieParser from 'cookie-parser';
import authMiddleware from './middleware/authMiddleware';

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: ['http://localhost:3000', 'https://shiksha-tech-web.vercel.app'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    // allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.get('/', (req, res) => {
  res.send('Welcome to our School Management Api');
});

app.use(
  '/api-docs',
  swagger.serve,
  swagger.setup(apiDocs, {
    swaggerOptions: {
      plugins: [],
    },
  }),
);

app.use('/api/v1', mainRouter);

const port = envConfigs.port || 3000;
app.listen(port, '0.0.0.0', async () => {
  connectToDatabase();
  console.log(`Server is running on http://localhost:${port}`);
  console.log(
    `API Documentation available at http://localhost:${port}/api-docs`,
  );
});
