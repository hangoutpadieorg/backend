const express = require('express');
const {req, res, next} = require('express')
const { HangoutCenterController } = require('../constroller/hangoutCenter.js');
const { upload,multipleUpload } = require('../services/util')
// const bodyParser = require('body-parser')
// let urlencoded= bodyParser.urlencoded({extended:true})
const router = express.Router();
const center= new HangoutCenterController()
router.post('/hangoutcenter/register',upload.array("images", 3), async (req, res, next) => { center.register(req, res, next) });
router.post('/hangoutcenter/getHangoutCenterByEmail', async (req, res, next) => { center.getOne(req, res, next) });
router.post('/hangoutcenter/getAll', async(req, res, next)=>{center.getAllHangoutCenters(req, res, next)})
router.post('/hangoutcenter/getHangoutCenterByName', async(req, res, next)=>{center.getCenterByName(req, res, next)})
router.post('/hangoutcenter/getHangoutCenterByCategory', async(req, res, next)=>{center.getCenterByCategory(req, res, next)})
router.post('/hangoutcenter/getHangoutCenterByBookingCategory', async(req, res, next)=>{center.getCenterByBookingCategory(req, res, next)})
router.post('/hangoutcenter/getHangoutCenterByPhoneNumber', async(req, res, next)=>{center.getCenterByPhoneNumber(req, res, next)})
router.post('/test',upload.array('images', 2), async(req, res, next)=>{center.test(req, res, next)})

module.exports = router;