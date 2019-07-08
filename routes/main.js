const express = require('express');
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require('./middleware');
const { Post,User,Userfollow,Comment } = require('../models');
const Sequelize = require('sequelize');


router.get('/', isLoggedIn,async (req, res, next) => {
            try{
                const post = await Post.findAll({ order:[['id','desc']],include: [User]});
                const follows = await Userfollow.findAll({where:{nick:req.user.nick}});
                const followList = await Promise.all(follows.map((f)=> User.findOne({where:{nick:f.follownick}})));
                let com = [];
                await Promise.all(post.map(async(p)=>{
                   const con = await Comment.findAndCountAll({
                        where:{pid:p.id}
                    });
                    await com.push(con);
                }))
                
                res.render('main', {
                    title: 'instagram',
                    users: req.user,
                    posts: post,
                    followList:followList,
                    commentList:com,
                })
            } catch(error){
                console.log(error);
                next(error);
            }
});


router.get('/login', isNotLoggedIn, (req, res, next) => {
    res.render('login', {
        title: 'instagram',
    })
});

router.get('/join', isNotLoggedIn, (req, res, next) => {
    res.render('join', {
        title: 'instagram'
    });
});

module.exports = router;