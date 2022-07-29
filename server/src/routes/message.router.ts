import express from 'express';
import messageController from '../controllers/message.controller';

const router = express.Router();

router.post('/addmsg/', messageController.addMessage);
router.post('/getmsg/', messageController.getAllMessage);

export = router;
