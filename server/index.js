import app from './server.js';

export default async function handler(req, res) {
  await app(req, res);
}
