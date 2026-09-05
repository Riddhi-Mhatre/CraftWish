require('dotenv').config();

const env = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};

// Fail fast if critical environment variables are missing
if (!env.mongoUri) {
  console.error('Fatal Error: MONGODB_URI is not defined in .env file.');
  process.exit(1);
}

if (!env.jwtSecret) {
  console.error('Fatal Error: JWT_SECRET is not defined in .env file.');
  process.exit(1);
}

module.exports = env;