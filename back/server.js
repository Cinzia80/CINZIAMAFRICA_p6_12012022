//-----------------//
// Import packages //
//-----------------//
const http = require('http');
const app = require('./app');
//---------------//
// Import dotenv //
//---------------//
const dotenv = require('dotenv');
dotenv.config();
//----------------------------------------------//
// Returns a valid port as a number or a string //
//----------------------------------------------//
const normalizePort = (val) => {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || "3000");
app.set('port', port);
//----------------------------------------------------------//
// Find the various errors and deal with them appropriately //
// It is then saved in the server                           //
//----------------------------------------------------------//
const errorHandler = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind =
    typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};
//----------------------------------------------------------------------------------------//
// Event listener, logging the port or named pipe the server is running on in the console //
//----------------------------------------------------------------------------------------//
const server = http.createServer(app);
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});
server.listen(port, () => console.log('Server started.'));
