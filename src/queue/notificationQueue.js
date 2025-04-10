import { Queue } from 'bullmq';
import redisClient from "../config/redis.js"


const notificationQueue = new Queue('notifications', {
  connection: redisClient,
});

export default notificationQueue;
