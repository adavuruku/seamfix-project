const express = require('express');
const router = express.Router();


const {check_nin_exist_wallet_ballance} = require ('../middlewares/check-nin');
const ninController = require('../controllers/ninController');

//route to add phone to NIN
router.post('/add/phone',check_nin_exist_wallet_ballance, ninController.add_new_phone_to_nin);
//route to verify the NIN Phone
router.post('/verify/code', ninController.verify_phone_link_code);
module.exports = router;