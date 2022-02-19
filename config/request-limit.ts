import rateLimit from 'express-rate-limit';


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100 // limit IPs to 100 requests per windowMs
});

export default limiter;
