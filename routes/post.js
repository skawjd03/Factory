const express = require('express');
const path = require('path');
const fs = require('fs');
const dateformat = require('dateformat');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const{ Post, Hashtag, Heart, Comment,User} = require('../models');
const {isLoggedIn} = require('./middleware');

const router = express.Router();

router.post('/img',isLoggedIn,(req,res)=>{
    const img = req.body.upimg;
    const dataArray = img.split(';');
    const data = dataArray[1].split(',');
    let path = dateformat(new Date(),'yyyymmddhhmiss');

    path = './public/img/'+path.toString()+'.png';
    const buf = Buffer.from(data[1],'base64');
    fs.writeFile(path,buf,function(err){
        if(err){
            return next(err);
        }
        res.send(path);
    });
});

router.post('/',isLoggedIn,async(req,res)=>{
    const nick = req.user.nick;
    const img = req.body.img;
    const hashtag = req.body.hashtags;
    const imgPath = img.substring(8);
    try{
        const post = await Post.create({
            text: hashtag,
            img:imgPath,
            maker:nick
        });
        const hashtags = hashtag.match(/#[^\s]*/g);
        if(hashtags){
            const hashtagTable = await Promise.all(hashtags.map(tag=> Hashtag.findOrCreate({
                where: { tagname:tag.slice(1).toLowerCase() },
            })));
            
            await post.addHashtags(hashtagTable.map(r => r[0]));
        }
        res.redirect('/');
    } catch(error){
        console.log(error);
        next(error);
    }
});

router.post('/:postid/thumbs',isLoggedIn,async(req,res,next)=>{
    const postidz = req.params.postid;
    try{
        const user = await Heart.findOne({where:{postnum:postidz,human:req.user.nick}});

        if(!user){
            await Post.update({thumbs:Sequelize.literal('thumbs + 1')},{where:{id:postidz}});
            await Heart.create({
                human:req.user.nick,
                postnum:req.params.postid,
            })
            const thumb = await Post.findOne({where:{id:postidz}});
            res.send(thumb.thumbs.toString()); 
        } else{
            await Post.update({thumbs:Sequelize.literal('thumbs - 1')},{where:{id:postidz}});
            await Heart.destroy({where:{postnum:postidz,human:req.user.nick}});
            const thumb = await Post.findOne({where:{id:postidz}});
            res.send(thumb.thumbs.toString()); 
        }
    } catch(error){
        console.log(error);
        next(error);
    }
})

router.post('/:id/comment',isLoggedIn,async(req,res,next)=>{
    
    try{
        await Comment.create({
            comment:req.body.text,
            thumbs: 0,
            maker:req.user.nick,
            pid: req.params.id,
        })
        const comment = await Comment.findAll({where:{pid:req.params.id}});
        if(comment.length<3){
        let sendData = [comment.length.toString(),req.body.text,req.user.nick];
        res.send(sendData);
        }else{
        res.send(comment.length.toString());
        }
    } catch(error){
        console.log(error);
        next(error);
    }

    
});

router.get('/:postid/commentHome',isLoggedIn,async(req,res,next)=>{
    try{
        const post = await Post.findOne({where:{id:req.params.postid},include:[User]});
        const commentInfo = await Comment.findAll({where:{pid:post.id}});
        console.log(commentInfo);
        
        res.render('comment',{
            title:'instagram',
            posts:post,
            comments:commentInfo,
        })

    } catch(error){
        console.log(error);
        next(error);
    }
})

router.get('/:sname/search',isLoggedIn,async(req,res,next)=>{
    try{
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',req.params.sname);
        const user5 = await User.findAll({where:{nick:{[Op.like]: "%" +req.params.sname+ "%"}}});
        const hashtag5 = await Hashtag.findAll({where:{tagname:{[Op.like]: "%" +req.params.sname+ "%"}}});
        const sendData = [user5,hashtag5];
        console.log(sendData);
        res.send(sendData);
    } catch(error){
        console.log(error);
        next(error);
    }
})

router.get('/:tagname/hashtagPost',isLoggedIn,async(req,res,next)=>{
    try{
        console.log('====================================',req.params.tagname);
        const hashtag = await Hashtag.findAll({where:{tagname:req.params.tagname},include:[Post]});
        console.log(hashtag);

        res.render('hashtagHome',{
            title : 'increpas',
            posts: hashtag[0].posts,
            tagname: hashtag[0].tagname,
        })
    } catch(error){
        console.log(error);
        next(error);
    }
})
module.exports = router ;