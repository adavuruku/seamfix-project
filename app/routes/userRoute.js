const express = require('express');
const router = express.Router();


const {check_nin_exist, check_nin_not_exist} = require ('../middlewares/check-nin');
const userController = require('../controllers/userController');

//route to add new user and NIN
router.post('/add', check_nin_not_exist, userController.add_new_user);
// router.post('/add/phone', check_admin, dataControlllers.add_new_user);

//route to top up user wallet
router.post('/wallet/credit', check_nin_exist, userController.credit_user_wallet);
// router.post('/test', userController.testvalidation);
module.exports = router;