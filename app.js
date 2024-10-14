import express from 'express';
import fs from 'fs';
import { createServer } from 'http';
import { loadServerGameAssets } from './src/init/asset.js';
import initSocket from './src/init/socket.js';

const app = express();
const server = createServer(app);

const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
initSocket(server);

server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  try {
    const assets = await loadServerGameAssets();
    console.log('Assets loaded successfully');
  } catch (err) {
    console.error('Failed to load game assets: ', err.message);
  }
});
