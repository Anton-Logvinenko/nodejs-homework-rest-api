const express = require('express');
const router= express.Router()
const User= require('../../models/user')



router.post('/register', async (req, res, next)=>{
 
const newUser = await User.create(req.body)
res.status(201).json(newUser);
})

module.exports = router