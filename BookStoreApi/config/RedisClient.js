const Redis = require('ioredis');

const client = new Redis(); // Automatically starts connecting

async function connectRedis() {
    return new Promise((resolve, reject) => {
        client.on('ready', () => {
            console.log('Connected to Redis');
            resolve();
        });

        client.on('error', (error) => {
            console.error('Error connecting to Redis:', error);
            client.quit();
            reject(error);
        });
    });
}

connectRedis();

module.exports = client;
