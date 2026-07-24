const app = require('./app');
const { PORT } = require('./config/googleConfig');

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(` FlashBasket Full-Stack Backend Server`);
  console.log(` Running on port: ${PORT}`);
  console.log(` URL: http://localhost:${PORT}`);
  console.log(` Health check: http://localhost:${PORT}/api/health`);
  console.log(`==================================================`);
});
