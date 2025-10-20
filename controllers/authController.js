const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { createUser, updateMembershipStatus, updateAdminStatus } = require('../models/userQueries');
const passport = require('passport');

function getSignUp (req, res) {
    res.render('sign-up', { errors: [] });
};

async function postSignUp (req, res) {
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.render('sign-up', {
            errors: errors.array()
        });
        }
    try {
        const { firstName, lastName, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        createUser(firstName, lastName, email, hashedPassword)
        res.redirect('/login')
    } catch (error) {
        console.error('Error creating user: ', error);
        res.status(500).send('Error creating user')
    }
};

function getJoinClub (req, res) {
    res.render('join-club', { errors: [] });
}

async function postJoinClub (req, res) {
    const passcode = req.body.secretCode;
    if(passcode === process.env.MEMBER_PASSCODE){
        try {
            await updateMembershipStatus(req.user.id);
            res.redirect('/')
        } catch (error) {
            console.error('Error updating membership status: ', error);
            res.status(500).send('Error updating membership status')
        };
    } else {
        res.render('join-club', { errors: [{ msg: 'Incorrect passcode!' }] })
    }
}

function getLogin (req, res) {
    res.render('login', { errors: [] })
}

function postLogin (req, res, next) {
    passport.authenticate('local', (err, user, info) => {
        if(err){
            return next(err);
        }
        if(!user){
            // Authentication failed
            return res.render('login', {
                errors: [{ msg: info.message || 'Login failed'}]
            });
        }
        req.logIn(user, (err) => {
            if(err){
                return next(err)
            }
            return res.redirect('/')
        });
    })(req, res, next)
}

function getLogout (req, res, next) {
    req.logout((err) => {
        if(err){
            return next(err)
        }
        res.redirect('/')
    });
}

function getBecomeAdmin (req, res) {
    res.render('become-admin', { errors: [] });
}

async function postBecomeAdmin (req, res) {
    const passcode = req.body.secretCode;
    if(passcode === process.env.ADMIN_PASSCODE){
        try {
            await updateAdminStatus(req.user.id);
            res.redirect('/')
        } catch (error) {
            console.error('Error updating admin status: ', error);
            res.status(500).send('Error updating admin status')
        };
    } else {
        res.render('become-admin', { errors: [{ msg: 'Incorrect passcode!' }] })
    }
}

module.exports = {
    getSignUp,
    postSignUp,
    getJoinClub,
    postJoinClub,
    getLogin,
    postLogin,
    getLogout,
    getBecomeAdmin,
    postBecomeAdmin
}