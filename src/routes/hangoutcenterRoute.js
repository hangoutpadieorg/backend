const express = require('express');
const {req, res, next} = require('express')
const { HangoutCenterController } = require('../constroller/hangoutCenter.js');
const { upload,multipleUpload } = require('../services/util')
const {isAuthenticated,isAuthorized,vendorAuthorizer} = require('../middleware/isAuth')

// const bodyParser = require('body-parser')
// let urlencoded= bodyParser.urlencoded({extended:true})
const router = express.Router();
const center= new HangoutCenterController()
router.post('/hangoutcenter/register',isAuthenticated, isAuthorized,vendorAuthorizer,upload.array("images", 3), async (req, res, next) => { center.register(req, res, next) });
router.post('/hangoutcenter/getHangoutCenterByEmail',isAuthenticated, isAuthorized,vendorAuthorizer, async (req, res, next) => { center.getOneCenterByMail(req, res, next) });
router.post('/hangoutcenter/getAllHangoutCenter',isAuthenticated, isAuthorized,vendorAuthorizer, async(req, res, next)=>{center.getAllHangoutCenters(req, res, next)})
router.post('/hangoutcenter/getHangoutCenterByName',isAuthenticated, isAuthorized,vendorAuthorizer, async(req, res, next)=>{center.getCenterByName(req, res, next)})
router.post('/hangoutcenter/getHangoutCenterByCategory',isAuthenticated, isAuthorized,vendorAuthorizer, async(req, res, next)=>{center.getCenterByCategory(req, res, next)})
router.post('/hangoutcenter/getHangoutCenterByBookingCategory',isAuthenticated, isAuthorized,vendorAuthorizer, async(req, res, next)=>{center.getCenterByBookingCategory(req, res, next)})
router.post('/hangoutcenter/getHangoutCenterByPhoneNumber',isAuthenticated, isAuthorized,vendorAuthorizer, async(req, res, next)=>{center.getCenterByPhoneNumber(req, res, next)})
router.post('/test',upload.array('images', 2), async(req, res, next)=>{center.test(req, res, next)})

module.exports = router;