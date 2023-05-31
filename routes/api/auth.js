const express = require('express');
const router= express.Router()

const {validateBody, aunthenticate}= require('../../decorators')
const {userJoiSchemas}=require('../../models/user')
const ctrl = require('../../controllers/auth-controller')


router.post('/register', validateBody(userJoiSchemas.registerSchema), ctrl.register )
router.post("/login", validateBody(userJoiSchemas.loginSchema), ctrl.login)
router.get('/current', aunthenticate, ctrl.getCurrent)
router.post('/logout', aunthenticate, ctrl.logout)
router.patch('/', aunthenticate, validateBody(userJoiSchemas.updateSubscriptionSchema), ctrl.updateSubscription);



module.exports = router