import express from 'express';
import cors from 'cors';
import auth from './routes/auth';
import restaurante from './routes/restaurante'
import pagamento from './routes/pagamento'
import pedidos from './routes/pedidos'
import swagger from './swagger/router'
import usuario from './routes/usuario'
import cliente from './routes/cliente'

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
app.use('/pedidos', pedidos);
app.use('/usuario', usuario);
app.use('/cliente', cliente);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
