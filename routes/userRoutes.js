const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const imageController = require('../controllers/imageController');

const router = express.Router();

// authentication
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// user
router.use(authController.protect);
router.get('/me', userController.getMe, userController.getUser);
router.patch('/updateMyPassword', authController.updatePassword);
router.patch(
  '/updateMe',
  imageController.uploadPhoto,
  imageController.resizePhoto,
  userController.updateMe,
);
// router.delete('/deleteMe', userController.deleteMe);

// user admin
router.use(authController.restrictTo('admin'));
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
