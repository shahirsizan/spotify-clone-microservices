import redis from "redis";
import doetnv from "dotenv";
doetnv.config();

export const redisClient = redis.createClient({
	username: "default",
	password: process.env.REDIS_PASS as string,
	socket: {
		host: "redis-16431.crce179.ap-south-1-1.ec2.redns.redis-cloud.com",
		port: 16431,
	},
});
