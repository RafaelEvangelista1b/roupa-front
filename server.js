const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const routes = require('./routes');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');
const { sendSuccess } = require('./utils/response');

const app = express();

app.use(cors({
    origin: env.frontendUrl === '*' ? true : env.frontendUrl,
    credentials: true
}));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => sendSuccess(res, 'B7 Admin API online.', {
    documentation: '/api/health'
}));

app.use('/api', routes);
app.use(notFoundHandler);
app.use(errorHandler);

if (require.main === module) {
    app.listen(env.port, () => {
        console.log(`B7 Admin API running on port ${env.port}`);
    });
}

module.exports = app;
