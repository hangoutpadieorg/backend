const { client } = require('../services/database/database');
const hangoutcenter = client.db("Hangoutpadie").collection("hangoutcenter");
const { UserDbQuery } = require('./userRepository');

class HangoutCenter extends UserDbQuery {
    async createOneCenter(center) {
        const create = await hangoutcenter.insertOne(center)
        return create
    }

    async findOneHangoutCenterByMail(email) {
         /**
         * To query  hangout center by mail
         */
        const data = await hangoutcenter.findOne({ email: email })
        if (data == null) {
            return "null"
        }
        return data
    }
    async findOneHangoutCenterByName(name) {
        /**
         * To query  hangout center by name
         */
        const data = await hangoutcenter.findOne({ name: name })
        if (data == null) {
            return "null"
        }
        return data
    }
    async findOneHangoutCenterByPhoneNumber(phoneNumber) {
         /**
         * To query  hangout center by phone number
         */
        const data = await hangoutcenter.findOne({ phoneNumber: phoneNumber })
        if (data == null) {
            return "null"
        }
        return data
    }
    async findOneHangoutCenterByCategory(category) {
        /**
        * To query  hangout center by phone number
        */
       const data = await hangoutcenter.findOne({ category:category })
       if (data == null) {
           return "null"
       }
       return data
    }
    async findOneHangoutCenterByBookingCategory(bookingCategory) {
        /**
        * To query  hangout center by phone number
        */
       const data = await hangoutcenter.findOne({ bookingCategory:bookingCategory})
       if (data == null) {
           return "null"
       }
       return data
   }
    async findHangoutCenter() {
        const data = await hangoutcenter.find().toArray()
        return data
    }
};

module.exports = {HangoutCenter};