require('dotenv').config();
const mailserver = require('nodemailer');
const secretKey = process.env.SECRET_KEY;
const dbURI = process.env.DB_URI;
const username = process.env.MAIL_USER;
const password = process.env.MAIL_PASS;

const transporter = mailserver.createTransport(
  {
    host:'smtp.mailgun.org',
    port:587,
    auth:{
      user: username,
      pass: password
    }
  }
);

module.exports = {
  secretKey : secretKey,
  mongoURI :  dbURI,
  transporter : transporter,
  sender : username,
  dbName : "Cluster0"
}