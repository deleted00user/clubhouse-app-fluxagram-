const express = require('express');
const authRoute = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const passport = require('passport');


authRoute.get('/sign-up', authController.getSignUp);

authRoute.get('/join-club', authController.getJoinClub);

authRoute.get('/login', authController.getLogin);

authRoute.post('/sign-up', [
    body('firstName')
        .trim()
        .notEmpty().withMessage('First name field cannot be empty!'),
    body('lastName')
        .trim()
        .notEmpty().withMessage('Last name field cannot be empty!'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email field cannot be empty!')
        .isEmail().withMessage('Email field must contain an email address!'),
    body('password')
        .trim()
        .notEmpty().withMessage('Please write your password'),
    body('confirmPassword')
        .custom((value, { req }) => {
            return value === req.body.password;
        }).withMessage('Passwords must match')
    ], authController.postSignUp);

authRoute.post('/join-club', authController.postJoinClub);

authRoute.post('/login', authController.postLogin);

authRoute.get('/logout', authController.getLogout);

authRoute.get('/become-admin', authController.getBecomeAdmin);

authRoute.post('/become-admin', authController.postBecomeAdmin);

module.exports = authRoute