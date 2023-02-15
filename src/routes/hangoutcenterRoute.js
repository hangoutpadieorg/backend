const express = require('express');
const {req, res, next} = require('express')
const { HangoutCenterController } = require('../constroller/hangoutCenter.js');
const { upload } = require('../services/util')
const bodyParser = require('body-parser')
let urlencoded= bodyParser.urlencoded({extended:false})
const router = express.Router();
const center= new HangoutCenterController()
router.post('/hangoutcenter/register',urlencoded, async (req, res, next) => {upload.array("images", 3), center.register(req, res, next) });
router.post('/hangoutcenter/getOne', async(req, res, next)=>{center.getOne(req, res, next)})

module.exports = router;