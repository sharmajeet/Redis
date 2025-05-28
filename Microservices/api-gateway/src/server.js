const express = require('express');
require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const Redis = require('ioredis');
const {rateLimit} = require('express-rate-limit');
const {RedisStore} = require('rate-limit-redis');
const logger = require("../src/utils/logger");
const proxy = require('express-http-proxy');
const errorHandler = require('../../identity-service/src/middlewares/errorHandler');
const { authenticateRequest } = require('./middlewares/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

const redisClient = new Redis(process.env.REDIS_URL);

app.use(helmet());
app.use(cors());
app.use(express.json());

const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minute
    max: 100, // limit each IP to 5 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    handler : (req,res) =>{
    logger.warn(`Rate limit exceeded for sensitive endpoint: ${req.method} ${req.url}`, { ip: req.ip });
    res.status(429).json({
        success: false,
        message: 'Too many requests, please try again later.'});
    },
    store : new RedisStore({
        sendCommand: (...args) => redisClient.call(...args),
    }),
});

app.use(rateLimiter);

app.use((req,res,next)  => {
    logger.info(`Received: ${req.method} request to ${req.url}`);
    logger.info(`Request Body: ${JSON.stringify(req.body)}`);
    next();
});

const proxyOptions = {
    proxyReqPathResolver: (req) => {
        return req.originalUrl.replace(/^\/v1/, '/api');
    },
    proxyErrorHandler: (err, res, next) => {
        logger.error(`Proxy error: ${err.message}`, { stack: err.stack });
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }   
}

//setting up proxy for each service
app.use('/v1/auth', proxy(process.env.IDENTITY_SERVICE_URL,{
    ...proxyOptions,
    proxyReqOptDecorator : (proxyReqOpts, srcReq) => {
        proxyReqOpts.headers['Content-Type'] = 'application/json';
        return proxyReqOpts;
    },
    userResDecorator : (proxyRes, proxyResData, userReq, userRes) => {
        logger.info(`Response from identity service: ${proxyRes.statusCode}`, { ip: userReq.ip });
        
        return proxyResData;
    }
} ));

//setting up proxy for post service
app.use('/v1/posts', authenticateRequest, proxy(process.env.POST_SERVICE_URL, {
    ...proxyOptions,
    proxyReqOptDecorator : (proxyReqOpts, srcReq) => {
        proxyReqOpts.headers['Content-Type'] = 'application/json';
        proxyReqOpts.headers['x-user-id'] = srcReq.user.userId;
        return proxyReqOpts;
    },
    userResDecorator : (proxyRes, proxyResData, userReq, userRes) => {
        logger.info(`Response from post service: ${proxyRes.statusCode}`, { ip: userReq.ip });
        
        return proxyResData;
    }
}));

app.use(errorHandler);

app.listen(PORT, () => {
    logger.info(`API Gateway is running on port ${PORT}`);
    logger.info(`Identity Service URL: ${process.env.IDENTITY_SERVICE_URL}`);
    logger.info(`Post Service URL: ${process.env.POST_SERVICE_URL}`);
    logger.info(`Redis URL: ${process.env.REDIS_URL}`);
});