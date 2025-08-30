import express from 'express';
import cors from 'cors';
import auth from './routes/auth';
import restaurante from './routes/restaurante';
import pagamento from './routes/pagamento';
import pedidos from './routes/pedidos';
import swagger from './swagger/router';

const app = express();
const PORT = 3001;

// Lista de origens permitidas
const allowedOrigins = ['http://localhost:5173'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());

// Swagger docs
app.use('/', swagger);

// Rotas da API
app.use('/auth', auth);               // login em POST /auth/login
app.use('/restaurantes', restaurante);
app.use('/pagamentos', pagamento);
app.use('/pedidos', pedidos);

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`📖 Swagger docs: http://localhost:${PORT}/docs`);
});
