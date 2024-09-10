const express = require('express');
const cors = require('cors');
const proxy = require('express-http-proxy');
const expressWinston = require('express-winston');
const winston = require('winston'); // Add this line to import winston
const logger = require('./logger'); // Import the custom logger if you're using it

const app = express();

app.use(cors());
app.use(express.json());

// Log all requests with express-winston
app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'requests.log' })
  ],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.prettyPrint()
  ),
  meta: true,
  msg: "{{req.method}} {{req.url}}",
  expressFormat: true,
  colorize: false
}));

// app.use('/', (req, res, next) => {
//   return res.status(200).json({ message: 'Gateway is working' });
// });

// app.use('/customer', proxy('http://localhost:8002', {
//   proxyErrorHandler(err, res, next) {
//     logger.error('Error on customer proxy:', err);
//     res.status(500).send('Error on customer proxy');
//   }
// }));

app.use('/', proxy('http://localhost:8004', {
  proxyErrorHandler(err, res, next) {
    logger.error('Error on root proxy:', err);
    res.status(500).send('Error on root proxy');
  }
}));

// app.use('/shopping', proxy('http://localhost:8003', {
//   proxyErrorHandler(err, res, next) {
//     logger.error('Error on shopping proxy:', err);
//     res.status(500).send('Error on shopping proxy');
//   }
// }));

app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'errors.log' })
  ],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.prettyPrint()
  )
}));

app.listen(9000, () => {
  winston.info('Gateway is listening on Port 9000'); // Use winston for logging
});
