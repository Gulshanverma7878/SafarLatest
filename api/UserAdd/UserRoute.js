const express = require('express');
const router = express.Router();
const UserController=require('./UserController');
const Login=require('./UserLogin/UserLogin');



router.get('/',UserController.get);
router.post('/',UserController.post);
router.delete('/:id',UserController.delete);
router.put('/:id',UserController.put);



router.put('/:id', UserController._updatePassword);

router.post('/login', Login.login);




module.exports=router;