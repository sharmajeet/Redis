const client = require("./client");

async function getDataFromRedis() {
    const result = await client.mget('user:1' , 'user:2', 'user:3');
    console.log("Result from redis : " ,result);

    // await client.quit();
}

async function setDataToRedis(msg){
    await client.set(msg.key, msg.value);
    //to set the expiry time to 10 seconds
    await client.expire(msg.key, 10);

    console.log("Data set to redis : " ,msg);

    // await client.quit();
} 

async function getAllData() {

    const keys = await client.keys('*');
    const result = {};

    for (const key of keys) {
        result[key] = await client.get(key); 
    }

    console.log("All keys in Redis:", result);

    await client.quit();
}

getDataFromRedis();

//msg with the key and the value -- this data is auto delete after 10 seconds
setDataToRedis({key: 'msg:44', value: 'Expired_data'});

getAllData();

