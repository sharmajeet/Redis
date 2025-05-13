const {Queue, delay} = require('bullmq');

const notificationQueue = new Queue("email-queue",
    {
        connection : {
            host : '127.0.0.1',
            port : 6379
        }
    }
);

async function sendEmail()
{
    const res = await notificationQueue.add("Email To Jeet Sharma", {
        jobId  : 1,
        Email : "jeetsharma2003.dev@gmail.com",
        Subject : "Hello Jeet",
        Body : "This is a test email",
        From : "BullMQ",
        delay : 5000,
    });

    console.log("Job Added To Queue : " , res.id);
}

sendEmail();