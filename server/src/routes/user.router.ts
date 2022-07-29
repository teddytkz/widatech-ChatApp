import express from 'express';
import userController from '../controllers/user.controller';

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/allUsers/:id', userController.allUsers);
router.get('/userById/:id', userController.userById);

export = router;
