const express = require('express');
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require('./middleware');
const { User,Post,Userfollow } = require('../models');


router.get('/home', isLoggedIn,async (req, res, next) => {
        try{
            const post = await Post.findAll({ where: { maker: req.user.nick } });
            const follow = await Userfollow.findAll({where:{follownick: req.user.nick}});
            const follower = await Userfollow.findAll({where:{nick: req.user.nick}});

            res.render('userhome',{
                title: 'instagram',
                users: req.user,
                posts: post,
                check: 0,
                postsize:post.length,
                follow: follow.length,
                follower: follower.length,
            });
        } catch(error){
            console.log(error);
            next(error);
        };
});

router.get('/:nick/home', isLoggedIn, async (req, res, next) => {
    try{
        const post = await Post.findAll({ where: { maker: req.params.nick } });
        const follow = await Userfollow.findAll({where:{follownick: req.params.nick}});
        const follower = await Userfollow.findAll({where:{nick: req.params.nick}});
        const user = await User.findOne({where:{nick: req.params.nick}});

        res.render('userhome',{
            title: 'instagram',
            users: user,
            posts: post,
            check: 1,
            postsize:post.length,
            follow: follow.length,
            follower: follower.length,
        });
    } catch(error){
        console.log(error);
        next(error);
    };
});

router.get('/:id/follow',isLoggedIn,async(req,res,next)=>{
    try{
        const follow = await Userfollow.findOne({where:{nick:req.user.nick,follownick:req.params.id}});
        if(follow){
            await Userfollow.destroy({where:{nick:req.user.nick,follownick:req.params.id}})
                res.send('<script>alert("팔로우 취소");history.back();</script>');
        } else{
            await Userfollow.create({
                nick:req.user.nick,
                follownick:req.params.id
            })
            res.send('<script>alert("팔로우 성공");history.back();</script>');
        }
    } catch(error){
        console.log(error);
        next(error);
    }
});
module.exports = router;