require('dotenv').config();

const secretKey = process.env.SECRET_KEY;
const dbURI = process.env.DB_URI;

module.exports = {
  secretKey : secretKey,
  mongoURI :  dbURI,
  dbName : "Cluster0"
}