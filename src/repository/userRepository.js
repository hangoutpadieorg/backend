const User = require('../models/userModel');

class UserDbQuery{
    static User = new User({});

    async findOneUser(email) {
        const data = await User.findOne({ email })
        return data
    }
    async creatOneUser(user) {
        const data = await User.create(user);
        return data;
    }
    async findUserByCode(code) {
        const convert = Number(code);
        console.log(code)
        const data = await User.findOne({ verificationCode: convert });
        console.log(data)
        if (data === null) {
            let isNotValid = "isNotValid";
            return isNotValid;
        }else{return data}
    }
    async updateIsEmailVerifiedToTrue(OTP) {
        const modify = await User.findOneAndUpdate(
          { verificationCode: OTP },
          { $set: { active: true } },
          { new: true }
        );
    }
    async isUserActive(email) {
    
    }
  
    async updateUserToken(email, newToken) {
        const data = await User.findOneAndUpdate({ email: email }, { $set: { tokens:{newToken, signedAt:Date.now()}  } }, { new: true })
        console.log(data)
        return data
    }
    async updateVerificationCode(email, otp) {
        const data = await User.findOneAndUpdate({ email: email }, { verificationCode: otp }, { new: true })
        return data
    }
    async updateUserPassword(email, hashedPassword) {
        const modify = await User.findOneAndUpdate({ email }, { $set: { password: hashedPassword } }, { new: true })
        console.log(modify)
        return modify
    }
}

module.exports = {UserDbQuery};