// const random = require('random')
// const bcrypt = require('bcrypt')
// const dayjs = require('dayjs')
// // var utc = require('dayjs/plugin/utc') // dependent on utc plugin
// var timezone = require('dayjs/plugin/timezone')
// // dayjs.extend(utc)
// dayjs.extend(timezone)
// // dayjs().utcOffset(1)
// dayjs.tz.setDefault("Africa/Lagos") //default time zone

//  async function conver(){
//     let verificationCode = random.int(min = 100000, max = 999999)
//     //hash the code
//     let hashVerificationCode = await bcrypt.hash(verificationCode.toString(),10)

//     // console.log(verificationCode,verificationCode.toString(),hashVerificationCode)
//  }

//  conver()
// //  dayjs.extend(utc)
// //  console.log("Date ",dayjs.utc().utcOffset(1).tz("Africa/Lagos"))

//  console.log("Date ",dayjs().add(1,'hour').add(10,'minute').toString())

//  let j = dayjs('Fri, 12 Feb 2021 21:49:02 GMT').toString()
//  let k = dayjs().add(1,'hour').toString()

//  console.log(k,k>j)

//  console.log(dayjs.tz.guess()) //guessing timezone

//  console.log('234'.concat('08164377187'[0]))

//  let gor = '08164377187'.substring(1, '08164377187'.length);
//  console.log(gor)

 var validator = require('validator');
 console.log(validator.isMobilePhone('0902332123100009000000000'), validator.isNumeric('09023321231'))

