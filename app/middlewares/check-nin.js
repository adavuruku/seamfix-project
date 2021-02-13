const {UsersInformation} = require('../../models/index');

module.exports.check_nin_exist = async (req, res, next)=>{
    try{
        let userExist = await UsersInformation.findOne({ where: {NIN: req.body.nin.trim()}})
        if(userExist){
            req.userInfo = userExist
            next();
        }else{
            res.status(422).json({
                message:'Invalid NIN - Check !!!'
            });
        }
    }catch(error){
        res.status(422).json({
            message:'Invalid NIN - Check !!!'
        });
    }
}

module.exports.check_nin_not_exist = async (req, res, next)=>{
    try{
        let userExist = await UsersInformation.findOne({ where: {NIN: req.body.nin.trim()}})
        if(!userExist){
            next();
        }else{
            res.status(422).json({
                message:'User With Same NIN Already Exist'
            });
        }
    }catch(error){
        res.status(422).json({
            message:'User With Same NIN Already Exist'
        });
    }
}


module.exports.check_nin_exist_wallet_ballance = async (req, res, next)=>{
    try{
        let userExist = await UsersInformation.findOne({ where: {NIN: req.body.nin.trim()}})
        if(userExist){
            let balance = Number(userExist.walletAmount);
            //check balance user wallet balance
            if(balance >= 500 ){
                req.userInfo = userExist
                next();
            }else{
                return res.status(422).json({
                    message:'Insufficient Wallet Balance'
                });
            }
        }else{
            res.status(422).json({
                message:'Invalid NIN - Check !!!'
            });
        }
    }catch(error){
        res.status(422).json({
            message:'Invalid NIN - Check !!!'
        });
    }
}