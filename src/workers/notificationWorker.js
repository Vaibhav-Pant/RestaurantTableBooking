import { Worker } from 'bullmq';
import redisClient from "../config/redis.js"
import resend from "../utils/resendClient"


const emailWorker = new Worker('notifications', async job => {
  // console.log("Job received:", job.name, job.data);

  const { to, subject, body } = job.data;

  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to,
    subject,
    html: `<p>${body}</p>`,
  });

  // console.log(`Email sent to ${to}`);
}, {
  connection: redisClient
});

emailWorker.on('failed', (job, err) => {
  console.error(`Failed to send email to ${job?.data?.to}: ${err.message}`);
});
