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