import dotenv from 'dotenv';

dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV,
  protocol: process.env.PROTOCOL,
  domain: process.env.DOMAIN,
  port: process.env.PORT,
  protocol: process.env.PROTOCOL,
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    key: process.env.DB_KEY,
  },
  jwt: {
    secretKey: process.env.JWT_SECRET,
    expiresInSec: process.env.JWT_EXPIRES_SEC,
  },
  bcrypt: {
    saltRounds: process.env.BCRYPT_SALT_ROUNDS,
  },
  solapi: {
    key: process.env.SOLAPI_KEY,
    secret: process.env.SOLAPI_SECRET,
  },
  ssl : {
    path: process.env.SSL_PATH,
    key: process.env.SSL_KEY,
    cert: process.env.SSL_CERT,
    ca: process.env.SSL_CA,
  },
  moduSign: {
    key: process.env.MODU_SIGN_KEY,
  },
  erpDomain: process.env.ERP_DOMAIN,
  email: {
    smtpService: process.env.SMTP_SERVICE,
    smtpAddr: process.env.SMTP_ADDR,
    smtpPort: process.env.SMTP_PORT,
    smtpUser: process.env.SMTP_USER,
    smtpPassword: process.env.SMTP_PASSWORD,
    smtpEmail: process.env.SMTP_EMAIL
  },
  kakao: {
    apiKey: process.env.KAKAO_API_KEY,
    secretKey: process.env.KAKAO_CLIENT_SECRET,
    rediretUri: process.env.KAKAO_REDIRECT_URI
  },
  naver: {
    apiKey: process.env.NAVER_API_KEY,
    secretKey: process.env.NAVER_CLIENT_SECRET,
    rediretUri: process.env.NAVER_REDIRECT_URI
  }
}
