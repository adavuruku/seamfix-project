require('dotenv').config();
const {Sequelize,Op} = require('sequelize');
const { Validator } = require('node-input-validator')
const random = require('random')
const bcrypt = require('bcrypt')
const db = require('../../models');
const Nexmo = require('nexmo');

//day js date
const dayjs = require('dayjs')
var timezone = require('dayjs/plugin/timezone')
dayjs.extend(timezone)
dayjs.tz.setDefault("Africa/Lagos") 

const {UsersInformation,WalletTransaction,NINPhoneRecord} = require('../../models/index');

let  is_phone_verified = async (phoneNumber)=>{
    //verify the phone is not yet link
    let phoneExist = await NINPhoneRecord.findOne({ 
        where:{phoneNumber: phoneNumber.trim()}
    })
    // console.log('NA AM', (phoneExist ? (phoneExist.status? true:phoneExist):false))
    return (phoneExist ? (phoneExist.status? true:phoneExist):false)
}

let sendCodeToUserPhone = async (phoneNumber)=>{
    const nexmo = new Nexmo({
        apiKey: process.env.API_KEY,
        apiSecret: process.env.API_SECRET,
    }); 
    let phoneNumberUser =  phoneNumber.substring(1,phoneNumber.length)
    const from = 'FGN-NIN';
    const to = '234'+phoneNumberUser;
    const text = 'Link NIN - Phone Code ' + verificationCode;
    nexmo.message.sendSms(from, to, text);
}
exports.add_new_phone_to_nin = async (req,res,next)=>{
    try {
        const v = new Validator(req.body, {
            phoneNumber: "required|string|minLength:11|maxLength:11",
            nin: "required|string|minLength:11|maxLength:11"
        })

        const matched = await v.check()
        if(!matched){
            return res.status(412).json({
                message:'Invalid Data Input'
            });
        }else{
            //Check if phone is already link to bvn
            let ninRecordExist = await is_phone_verified(req.body.phoneNumber)
            if(ninRecordExist==true){
                return res.status(422).json({
                    message:'Phone Number Already Linked'
                });
            }else{
                //generate another verification credential

                //generate a random code
                let verificationCode = random.int(min = 100000, max = 999999)
                //hash the code
                let hashVerificationCode = await bcrypt.hash(verificationCode.toString(),10)
                //generate expiry time
                let expiryTime = dayjs().add(1,'hour').add(10,'minute').toString()
                
                
                let ninPhoneRecord = null;
                if(ninRecordExist == false){
                    //save to DB since no previous record
                    ninPhoneRecord = await NINPhoneRecord.create({
                        NIN:req.userInfo.NIN,
                        phoneNumber:req.body.phoneNumber,
                        token:hashVerificationCode,
                        tokenExpiredDate:expiryTime
                    })
                }else{
                    //update previous Record
                    ninPhoneRecord = await NINPhoneRecord.update({
                        token:hashVerificationCode,
                        tokenExpiredDate:expiryTime
                    },{ 
                        where:{
                            [Op.and]: [
                                { phoneNumber: ninRecordExist.phoneNumber.trim() },
                                { NIN: ninRecordExist.NIN }
                              ]
                        }
                    })
                }
                
                if(ninPhoneRecord){
                    // send mobile message to the user
                    // sendCodeToUserPhone(ninRecordExist.phoneNumber.trim())

                    return res.status(200).json({
                        message:'Created',
                        'VerificationInfo':{
                            method:'POST',
                            url:'http://localhost:3000/api/user/verify/code',
                            body:{
                                NIN:req.userInfo.NIN,verificationCode
                            }
                        }
                    });
                }else{
                    return res.status(422).json({
                        message:'Fail To Link NIN to Phone. Retry',
                        walletTransaction
                    });
                }
            }
        }
    } catch (error) {
        return res.status(500).json({
            message:'Fail',
            error:error
        });
    }
}


exports.verify_phone_link_code = async (req,res,next)=>{
    const t = await db.sequelize.transaction();
    try {
        const v = new Validator(req.body, {
            phoneNumber: "required|string|minLength:11|maxLength:11",
            code: "required|string"
        })
        const matched = await v.check()

        if(!matched){
            return res.status(412).json({
                message:'Invalid Data Input'
            });
        }else{
            let ninRecordExist = await is_phone_verified(req.body.phoneNumber)
            // console.log('Yuppy',ninRecordExist)
            if(ninRecordExist==true){
                return res.status(422).json({
                    message:'Phone Number Already Linked'
                });
            }else{
                if(ninRecordExist != false){
                    //check the code is valid
                    const hash = await bcrypt.compare(req.body.code,ninRecordExist.token)
                    if(hash){
                        //check the time is valid not expired
                        let expectedExpiry = dayjs(ninRecordExist.tokenExpiredDate).toString()
                        let currentTime = dayjs().add(1,'hour').toString()
                        if(expectedExpiry >= currentTime ){
                            // console.log('Time Passed', currentTime, expectedExpiry)
                            //debit from user wallet
                            let userExist = await UsersInformation.findOne({ 
                                where: {NIN: ninRecordExist.NIN},
                                attributes: ['NIN', 'walletAmount']})
                            
                            let previousWalletAmount = Number(userExist.walletAmount)
                            let creditAmount = 500
                            let balance_Amount = previousWalletAmount - creditAmount

                            if(previousWalletAmount>=500){
                                //update the user wallet
                                await UsersInformation.update(
                                    {walletAmount:balance_Amount},
                                    {where:{NIN: ninRecordExist.NIN }},
                                    { transaction: t }
                                )

                                //insert trans history
                                await WalletTransaction.create({
                                    NIN:ninRecordExist.NIN,
                                    previousAmount:previousWalletAmount,
                                    currentAmount:balance_Amount,
                                    amountPaid:creditAmount,
                                    transactionType:'Debit'
                                },{ transaction: t })
                
                                //finally link the bvn
                                await NINPhoneRecord.update(
                                    {status:true},
                                    {where: { [Op.and]: [{ phoneNumber: ninRecordExist.phoneNumber },{ NIN: ninRecordExist.NIN }]}
                                    },{ transaction: t }
                                )
                                await t.commit();

                                return res.status(200).json({
                                    message:'Phone Link to NIN Successfully'
                                });

                            }
                        }
                    }
                }

                return res.status(422).json({
                    message:'Fail To Link NIN To Phone'
                });
            } 
        }
    } catch (error) {
        await t.rollback();
        return res.status(500).json({
            message:'Fail',
            error:error
        });
    }
}