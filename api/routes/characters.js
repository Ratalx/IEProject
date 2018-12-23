const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');

const Character=require('../models/character');

router.get('/',(req,res,next)=>{
    Character.find()
    .select('name level class _id')
    .exec()
    .then(docs=>{
        const response ={
            count: docs.length,
            characters: docs.map(doc=>{
                return {
                    name: doc.name,
                    level: doc.level,
                    class: doc.class,
                    _id: doc._id,
                    reqest:{
                        type:"GET",
                        url:"http://localhost:3000/characters/"+ doc._id
                    }
                }
            })
        }
        res.status(200).json(response);
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
});

router.post('/',(req,res,next)=> {
    const character = new Character({
        _id: new mongoose.Types.ObjectId(),
        name:req.body.name,
        level:"1",
        class: req.body.class
    });

    character.save().then(result=>{
        res.status(201).json({
            message:'Character is created',
            createdCharacter:{
                name:result.name,
                _id: result._id,
                level: result.level,
                class: result.class,
                reqest: {
                    type: "GET",
                    url: "http://localhost:3000/characters/"+ result._id
                }
            }
        });
    }).catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    });
});

router.get('/:characterId',(req,res,next)=> {
    const id = req.params.characterId;
    Character.findById(id)
    .select('name level _id class')
    .exec()
    .then(doc=> {
        if(doc){
        res.status(200).json({
            character:{
                name: doc.name,
                level: doc.level,
                class: doc.class,
                _id: doc._id,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/characters"
                }
            }
        });
    }
    else
    {
        res.status(500).json({message:'No valid ID'});
    }
    }).catch(err=>{
        res.status(500).json({
            error:err
        });
    });
});

router.patch('/:characterId',(req,res,next)=>{
    const id = req.params.characterId;
    const updateOps={};
    for(const ops of req.body)
    {
        updateOps[ops.attrName]=ops.value;
    }
    Character.updateOne({
        _id: id
    },
    {
        $set: updateOps
    })
    .exec()
    .then(result=>{
        console.log(result);
        res.status(200).json({
            message: "Character Updated",
            reqest: {
                type: "GET",
                url: "http://localhost:3000/characters/"+ id
            }
        })
    })
})

router.delete('/:characterId',(req,res,next)=> {
    const id = req.params.characterId;
    Character.deleteOne({_id: id})
    .exec()
    .then(result=>{
        res.status(200).json({
            message: 'Character Deleted',
            request: {
                type: 'POST',
                url: "http://localhost:3000/characters",
                body: {
                    name: "String",
                    class: "String"
                }
            }
        });
    }).catch(err=>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;