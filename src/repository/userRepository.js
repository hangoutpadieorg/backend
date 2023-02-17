const User = require('../models/userModel');
const { client } = require('../services/database/database');
const user=client.db("Hangoutpadie").collection("user")
class UserDbQuery{
     //User = new User({});
     
    
    async findOneUser(email) {
        //User = new User({email})
        const data = await user.findOne({email:email})
        return data
    }
    async creatOneUser(users) {
        const db=client.db("Hangoutpadie").collection("user")
       const Users = new User({
            name: users.name,
            email: users.email,
            verificationCode: users.verificationCode,
            password: users.password,
            role:users.role
       })
        const data = await user.insertOne(Users);
        return data;
    }
    async findUserByCode(code) {
        const convert = Number(code);
        const data = await user.findOne({ verificationCode: convert });
        if (data === null) {
            let isNotValid = "isNotValid";
            return isNotValid;
        }else{return data}
    }
    async updateIsEmailVerifiedToTrue(OTP) {
        const modify = await user.findOneAndUpdate(
          { verificationCode: OTP },
          { $set: { active: true } },
          { new: true }
        );
    }
  
    async updateUserToken(email, newToken) {
        const data = await user.findOneAndUpdate({ email: email }, { $set: { tokens:{newToken, signedAt:Date.now()}  } }, { new: true })
        return data
    }
    async updateVerificationCode(email, otp) {
        const data = await user.findOneAndUpdate({ email: email }, { verificationCode: otp }, { new: true })
        return data
    }
    async updateUserPassword(email, hashedPassword) {
        const modify = await user.findOneAndUpdate({ email }, { $set: { password: hashedPassword } }, { new: true })
        return modify
    }
    async getAllUsers(){
        const data= await user.find({}).toArray()
        return data
    }
}

module.exports = {UserDbQuery};