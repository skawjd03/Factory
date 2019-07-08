// const local = require('./localStrategy');
// const kakao = require('./kakaoStrategy');
const { User } = require('../models');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user.email); // 유니크한 값
  });

  passport.deserializeUser((email, done) => {
    User.findOne({where: { email }})
      .then(user => done(null, user))
      .catch(err => done(err));
  });

  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'pass',
  }, async (email, pass, done) => {
    try {
      const exUser = await User.findOne({ where: { email } });
      if (exUser) {
        // await bcrypt.compare(password, exUser.password,function(err,isMatch){
            if (exUser.password===pass) {
                done(null, exUser);
              } else {
                done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
              }
        // });
      } else {
        done(null, false, { message: '가입되지 않은 회원입니다.' });
      }
    } catch (error) {
      console.error(error);
      done(error);
    }
  }));

};