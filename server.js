import 'dotenv/config';
import express  from 'express';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
import knex from 'knex';
import bodyParser from 'body-parser';
import { handleRegister } from './controllers/register.js';
import { handleSignin } from './controllers/signin.js';
import { handleProfileGet } from './controllers/profile.js';
import { handleApiCall, handleImage } from './controllers/image.js';

const PORT = process.env.PORT;

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    host : process.env.DATABASE_HOST,
    port: 5432,
    user : process.env.DATABASE_USER,
    password : process.env.DATABASE_PW,
    database : process.env.DATABASE_DB
  }
});  

const app = express();
app.use(bodyParser.json());
app.use(cors());

//Testing
// app.get('/', (req, res) => {
//   res.send('success');
// });

app.post('/signin', (req, res) => { handleSignin(req, res, db, bcrypt) })

app.post('/register', (req, res) => { handleRegister(req, res, db, bcrypt) })

app.get('/profile/:id', (req, res) => { handleProfileGet(req, res, db) })

app.put('/image', (req, res) => { handleImage(req, res, db) })

app.post('/imageurl', (req, res) => { handleApiCall(req, res) })
 
app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});