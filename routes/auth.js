const express = require('express');
const {User} = require('../models'); // user 테이블 가져옴
const passport = require('passport');
const {isLoggedIn,isNotLoggedIn} = require('./middleware');

const router = express.Router();

router.post('/join', isNotLoggedIn, async (req, res, next) => {
    const { email, name, nick, pass } = req.body;
    try {
        const exUser = await User.findOne({ where: { email } });
        if (exUser) {
            req.flash('joinError', '이미 가입된 이메일입니다.');
            return res.redirect('/join');
        }
        await User.create({
            email : email,
            name : name,
            nick : nick,
            password : pass
        });
        return res.redirect('/login');
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            console.error(authError);
            return next(authError);
        }
        if (!user) {
            req.flash('loginError', info.message);
            return res.redirect('/login');
        }
        return req.login(user, (loginError) => {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    })(req, res, next);
});


router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/login');
});


module.exports = router;