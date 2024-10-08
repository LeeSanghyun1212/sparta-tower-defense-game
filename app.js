import express from 'express';
import { createServer } from 'http';
import initSocket from './src/init/socket.js';

const app = express();
const server = createServer(app);

const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
initSocket(server);

app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>');
});

server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
});
