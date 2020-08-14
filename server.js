const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const app = express();

const register = require('./controllers/register');
const image = require('./controllers/image');


const db = require('knex')({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : '08122001f',
      database : 'smartbraindb'
    }
  });


app.use(express.json());
app.use(cors());

app.listen(3001, () => {
});

app.post('/signin', (req, res) => {
   db.select('email', 'hash').from('login')
   .where('email', '=', req.body.email)
   .then(data => {
       const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
       if(isValid){
           return db.select('*').from('users')
           .where('email', '=', req.body.email)
           .then(user=>{
               res.json(user[0])
           })
           .catch(err=> res.status(400).json('error'))
       }else{
           res.status(400).json('invalid user');
       }
   })
   .catch(err=> res.status(400).json('no email'))
});

app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)})


app.get('/profile/:id', (req, res) =>{
    const { id } = req.params;
    db
    .select('*')
    .from('users')
    .where({id: id})
    .then(user=>{
        if(user.length){
            res.json(user[0])
            } else {
                res.status(400).json('not found')
            }
        })
    .catch(err => res.status(400).json('not found'));
})

app.put('/image' , (req, res) => {image.handleImage(req, res, db)});
app.post('/imageurl' , (req, res) => {image.handleApiRequest(req, res)});



