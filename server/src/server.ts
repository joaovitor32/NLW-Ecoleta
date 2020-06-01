import express from 'express';

const app=express();

app.get('/users',(req,res)=>{
    console.log('Listageasdadm de usuarios');
    res.json('Hello')
})

app.listen(3333);