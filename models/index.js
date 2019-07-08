const Sequelize = require('sequelize'); //mysql 모듈
const env = process.env.NODE_ENV || 'development';  // 개발환경 디펠로퍼로 설정
const config = require('../config/config')[env];    // config 폴더에 config 파일에서 development 객체 얻기
const db = {};  // 모듈로 만들 객체들을 담을 객체

// Sequelize 생성자 호출 반환값 커넥션
const sequelize = new Sequelize(
    config.database, config.username,config.password,config,
);

// 커넥션과 Sequelize 를 db에 저장
db.sequelize = sequelize;
db.Sequelize = Sequelize;
// user 모델(테이블)을 db에 저장
db.User = require('./user')(sequelize,Sequelize);
db.Userfollow = require('./userfollow')(sequelize,Sequelize);
db.Post = require('./post')(sequelize,Sequelize);
db.Comment = require('./comment')(sequelize,Sequelize);
db.Hashtag = require('./hashtag')(sequelize,Sequelize);
db.Heart = require('./heart')(sequelize,Sequelize);

db.User.hasMany(db.Post,{foreignKey:'maker',sourceKey:'nick'});
db.Post.belongsTo(db.User,{foreignKey:'maker',targetKey:'nick'});

db.Post.belongsToMany(db.Hashtag,{through:'PostHashtag'});
db.Hashtag.belongsToMany(db.Post,{through:'PostHashtag'});

db.Post.hasMany(db.Heart);
db.Heart.belongsTo(db.Post);

db.Post.hasMany(db.Comment);
db.Comment.belongsTo(db.Post);

// db를 모듈로
module.exports = db;