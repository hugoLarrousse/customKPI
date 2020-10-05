const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('config');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const server = require('http').createServer(app);

const mongo = require('./src/database');
const logger = require('./src/utils/logger');
const errorManager = require('./src/utils/errors');

const env = config.get('env');
const { port } = process.env || { port: 3009 };

/* Middleware */
app.use(helmet());
app.use(bodyParser.json({ limit: '4mb' }));
app.use(bodyParser.urlencoded({ limit: '4mb', extended: true }));
app.use(cors({ origin: '*' /* , credentials: true */ }));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  next();
});

app.use('*', (req, res, next) => {
  res.set('Server', 'CallMeJohnny');
  next();
});

app.use('/status', (req, res) => {
  res.status(200).send({ success: true, error: false, message: 'OK' });
});

app.get('/favicon.ico', (req, res) => res.status(204));
app.get('/sw.js', (req, res) => res.status(204));

app.use('/kpi', require('./src/controllers/kpi'));

app.all('*', (req, res, next) => {
  next(`${__filename}| ${req.method} ${req.originalUrl} | wrong path | No kpi here`);
});

app.use(errorManager);

logger.info('Creating connection with MongoDB...');
mongo.createConnection().then((code) => {
  if (code) {
    logger.info('Connected');
    server.listen(port, () => {
      try {
        logger.info(`[${env}] Just A Beer API is running on ${port}`);
      } catch (e) {
        logger.error(`${e.message}`);
      }
    });
  } else {
    logger.error({ filename: __filename, methodName: 'createConnection', message: 'error createConnection' });
  }
});

const signals = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
signals.forEach(sig => {
  process.on(sig, () => {
    server.close((error) => {
      if (error) {
        logger.error({ filename: __filename, methodName: 'signals', message: error.message });
        process.exit(1);
      } else {
        mongo.closeConnection();
        process.exit(0);
      }
    });
  });
});
