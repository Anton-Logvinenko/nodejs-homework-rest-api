const express = require('express');
const router= express.Router()

const {validateBody, aunthenticate}= require('../../decorators')
const upload=require('../../middlewares/upload')
const {userJoiSchemas}=require('../../models/user')
const ctrl = require('../../controllers/auth-controller')


router.post('/register', validateBody(userJoiSchemas.registerSchema), ctrl.register )
router.post("/login", validateBody(userJoiSchemas.loginSchema), ctrl.login)
router.get('/current', aunthenticate, ctrl.getCurrent)
router.post('/logout', aunthenticate, ctrl.logout)
router.patch('/', aunthenticate, validateBody(userJoiSchemas.updateSubscriptionSchema), ctrl.updateSubscription);
// avatars
router.patch('/avatars',aunthenticate, upload.single('avatar'), ctrl.updateAvatar)



module.exports = router