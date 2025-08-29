import express from 'express';
import cors from 'cors';
import auth from './routes/auth';

const app = express();
const PORT = 3001;

const allowedOrigins = [
  'http://localhost:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use('/login', auth);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
