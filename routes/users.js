import express from 'express';
import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword } from '../lib/utility.js';
import PasswordValidator from 'password-validator';

const router = express.Router();

const prisma = new PrismaClient();

router.post('/signup', async (req,res) => {

  //get user 
  const { email, password, first_name, last_name } = req.body;

  //validate the inputs
  if(!email || !password || !first_name || !last_name) {
    return res.status(400).send('Missing required fields');
  }
 
  //check if user already 
  const existingUser = await prisma.customer.findUnique({
    where: {
      email: email,
    }
  });
  if (existingUser) {
    return res.status(400).send('User already exists');
  }

  let validatorSchema = new PasswordValidator();

  validatorSchema
  .is().min(8)
  .has().uppercase()
  .has().lowercase()
  .has().digits(1)

  if(!validatorSchema.validate(password)){
    return res.status(400).send('Invalid password');
  }


  //hash password
  const hashedPassword = await hashPassword(password);

  //add user to database
  const user = await prisma.customer.create({
    data: {
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: hashedPassword
    },
  });

  //send response
  res.json({'user' : email});
});

router.post('/login', async (req,res) => {

  //get user inputs
  const { email, password } = req.body;
 
  //validate input
  if(!email || !password) {
    return res.status(400).send('Missing required fields');
  }

  //Find user in databse
  const existingUser = await prisma.customer.findUnique({
    where: {
      email: email,
    }
  });
  if (!existingUser) {
    return res.status(404).send('User not found');
  }

  // compare/verify password
  const passwordMatch = await comparePassword(password, existingUser.password);
  if (!passwordMatch) {
    return res.status(401).send('Invalid password');
  }

  //setup user session
  req.session.user = {
    customer_id : existingUser.customer_id,
    email : existingUser.email,
    first_name : existingUser.first_name,
    last_name : existingUser.last_name}
 

  //send response
  res.send('Login route');
});

router.post('/logout', (req,res) => {
  req.session.destroy();
  res.send('Logout route');
});

router.get('/getsession', (req,res) => {
  if(req.session.user){
    res.json({'user' : req.session.user});
  }
  else{
    return res.status(401).send('Not logged in');
  }
});

export default router;