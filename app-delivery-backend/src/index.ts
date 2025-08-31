import express from 'express';
import cors from 'cors';
import auth from './routes/auth';
import restaurante from './routes/restaurante'
import pagamento from './routes/pagamento'
import pedidos from './routes/pedidos'
import swagger from './swagger/router'

const app = express();
const PORT = 3001;

app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(express.json());
app.use('/', swagger)
app.use('/auth', auth);
app.use('/restaurante', restaurante);
app.use('/pagamento', pagamento);
app.use('/pedido', pedidos);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
