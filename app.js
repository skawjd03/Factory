const express = require('express'); // express 프레임워크
const cookieParser = require('cookie-parser'); // 클라이언트 request 에서 쿠키값을 js객체로 파싱해줌
const morgan = require('morgan'); // 콘솔창에 클라이언트 요청로그를 기록함
const path = require('path'); // 경로를 편리하게 지정할 수 있는 모듈
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const bodyParser = require('body-parser');


// 만든 라우터(컨트롤러)
const mainRouter = require('./routes/main');
const authRouter = require('./routes/auth');
const {sequelize} = require('./models');
const passportConfig = require('./passport');
const userRouter = require('./routes/user');
const postRouter = require('./routes/post');

const app = express(); // express 프레임워크의 서버핵심
sequelize.sync();
passportConfig(passport);

app.set('views',path.join(__dirname,'views'));
app.set('port',process.env.PORT || 8001);
app.set('view engine','pug');

// 미들웨어들이 설정됨 (실질적인 서버의 동작들)
app.use(morgan('dev')); // 동작1 (로그찍기)
app.use(express.static(path.join(__dirname,'public'))); // 동작2 (정적파일 요청 경로)
app.use(bodyParser.json({limit: '50mb'}));  // request 로 온 데이터를 자바스크립트 객체로 파싱
app.use(bodyParser.urlencoded({limit: '50mb',extended:true}));  
app.use(cookieParser('node'));   // 요청에 쿠키값이 있다면 쿠키를 확인해보는 작업
app.use(session({
    resave: false,
    saveUninitialized : false,
    secret : 'node',
    cookie:{
        httpOnly:true,
        secure:false,
    },
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// / 경로 컨트롤러
app.use('/',mainRouter);
app.use('/auth',authRouter);
app.use('/user',userRouter);
app.use('/post',postRouter);

app.use((req,res,next)=>{
    const err = new Error('Not Found');
    err.status = 404;
    next (err);
});

app.use((err,req,res)=>{
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development'? err : {};
    res.status(err.status || 500);
    res.render('error');
});

app.listen(app.get('port'),()=>{
    console.log(app.get('port'),'번 포트가 열렸습니다.');
})