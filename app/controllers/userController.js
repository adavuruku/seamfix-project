const {Sequelize,Op} = require('sequelize');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../../.env' });
const { Validator } = require('node-input-validator')


const {UsersInformation,WalletTransaction} = require('../../models/index');

/**
 * @add_new_user function handles user account creation
 * @req.body must contain the user first AND Last Name, NIN number and
 * some credit to his/her wallet
 * */
exports.add_new_user = async (req,res,next)=>{
    try {
        const v = new Validator(req.body, {
            firstName: "required|string|minLength:1",
            lastName: "required|string|minLength:1",
            nin: "required|string|minLength:11|maxLength:11",
            walletAmount: "decimal"
        })

        const matched = await v.check()
        if(!matched){
            return res.status(412).json({
                message:'Invalid Data Input'
            });
        }else{
            //create new user
            console.log("I dey here")
            let userInformation = await UsersInformation.create(
            {
                firstName : req.body.firstName.trim(),
                lastName : req.body.lastName.trim(),
                NIN : req.body.nin.trim(),
                walletAmount : req.body.walletAmount
            });
            return res.status(200).json({
                message:'Created',
                userInformation
            });
        }
    } catch (error) {
        return res.status(500).json({
            message:'Fail',
            error:error
        });
    }
}


exports.credit_user_wallet = async (req,res,next)=>{
    try {
        const v = new Validator(req.body, {
            nin: "required|string|minLength:11|maxLength:11",
            walletAmount: "required|decimal"
        })
        const matched = await v.check()

        if(!matched){
            return res.status(412).json({
                message:'Invalid Data Input'
            });
        }else{
            let previousWalletAmount = Number(req.userInfo.walletAmount)
            let creditAmount = Number(req.body.walletAmount)
            let tot_Amount = previousWalletAmount + creditAmount
            //update UserInformation
            const updatedUserWallet = await UsersInformation.update(
                {
                    walletAmount:tot_Amount
                },
                {
                    where:{NIN: req.userInfo.NIN }
                }
            )

            
            //if u can update it log it
            if(updatedUserWallet){
                let walletTransaction = await WalletTransaction.create({
                    NIN:req.userInfo.NIN,
                    previousAmount:previousWalletAmount,
                    currentAmount:tot_Amount,
                    amountPaid:creditAmount
                })

                return res.status(200).json({
                    message:'Created',
                    walletTransaction
                });
            }
            return res.status(422).json({
                message:'Fail Transaction'
            });
            
            
        }
    } catch (error) {
        return res.status(500).json({
            message:'Fail',
            error:error
        });
    }
}