const { client } = require('../services/database/database');
const hangoutcenter = client.db("Hangoutpadie").collection("hangoutcenter");
const { UserDbQuery } = require('./userRepository');

class HangoutCenter extends UserDbQuery {
    async createOneCenter(center) {
        const create = await hangoutcenter.insertOne(center)
        return create
    }

    async findOneHangoutCenterByMail(email) {
        const data = await hangoutcenter.findOne({ email: email })
        return data
    }
};

module.exports = {HangoutCenter};