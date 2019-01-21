const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User= require('../models/superUser');

router.post('/signup',(req,res,next)=>{
    User.find({email:req.body.email})
    .exec()
    .then(user=>{
        if(user.length>=1){
            return res.status(409).json({
                message: 'Account with this email exist'
            })
        }
        else{
            bcrypt.hash(req.body.password,10,(err, hash)=>{
                if(err){
                    return res.status(500).json({
                        error:err
                    });
                }
                else { 
                    const user = new User({
                        _id : new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
            });
            user.save()
            .then(result => {
                console.log(result);
                res.status(201).json({
                    message: "Super User Created"
                });
            })
            .catch(err=> {
                console.log(err);
                res.status(500).json({
                    error:err
                });
            });
        }
        });
        }
    }) 
});

router.post('/login',(req,res,next)=>{
    User.findOne({email: req.body.email})
    .exec()
    .then(user=>{
        if(user.length<1){
            return res.status(401).json({
                message: 'Auth failed'
            });
        }
        bcrypt.compare(req.body.password, user.password,(err,result)=>{
            if(err)
            {
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
            if(result){
               const token= jwt.sign({
                    email: user.email,
                    userId: user._id
                }, process.env.JWT_SUPER_KEY,
                {
                    expiresIn:"1h"
                }
                );
                return res.status(200).json({
                    message: 'Auth successful',
                    token: token
                });
            }
            res.status(401).json({
                message: 'Auth failed'
            });
        });

    })
    .catch(err=>{
        console.log(err);
        res.status(401).json({
            message: 'Auth failed'
        });
    });
})



module.exports = router;