const { Worker } = require("bullmq");

const connection = {
    host: '127.0.0.1',
    port: 6379,
};

const worker = new Worker("email-queue", async (job) => {
    console.log("Job Received : ", job.id);
    console.log("Job Data : ", job.data);

    // Delay before email logic starts
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log("Starting email send after 3-second initial delay...");

    await SendEmail(5000); // Simulate email sending duration
    console.log("Email Sent : ", job.id);
}, { connection });

const SendEmail = async (ms) => {
    console.log(`Simulating sending email for ${ms}ms...`);
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("Email Sent");
            resolve();
        }, ms);
    });
};
