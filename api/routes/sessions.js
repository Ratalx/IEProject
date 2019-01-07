const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth')

const Session = require('../models/session');
const Character = require('../models/character');
const Scenario = require('../models/scenario');

router.get('/',checkAuth,(req,res,next)=> {
    Session.find()
    .select('_id playerCharacter scenario')
    .populate('scenario','_id title')
    .populate('playerCharacter','_id name level class')
    .exec()
    .then(docs => {
        res.status(200).json({
            count:docs.length,
            sessions: docs.map(doc=>{
                if(!(doc.scenario && doc.playerCharacter)){
                    Session.deleteOne({_id: doc._id}).
                    exec().
                    then().
                    catch(err=>{
                        res.status(500).json({
                            error:err
                        });
                    });
                }
                else
                return {
                    _id: doc._id,
                    playerCharacter: doc.playerCharacter,
                    scenario: doc.scenario,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/sessions/" + doc._id
                    }
                }
            })
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
});

router.post('/',checkAuth,(req,res,next)=> {

    Character.findById(req.body.characterId)
    .exec()
    .then(result =>{
        if(!result){
            res.status(404).json({
                message:"Character with provided Id not found"
            });
        }
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        });
    });
    Scenario.findById(req.body.scenarioId)
    .exec()
    .then(result =>{
        if(!result){
            res.status(404).json({
                message:"Scenario with provided Id not found"
            });
        }
    })
    .catch(err=>{
        console.log(err);

        res.status(500).json({
            error:err
        });
    });
    

    const session = new Session({
        _id: mongoose.Types.ObjectId(),
        scenario: req.body.scenarioId,
        playerCharacter: req.body.characterId
    })
    session.save()
    .then(result=>{
        console.log(result);
        res.status(201).json({
            message: "New Session YEY",
            createdSession:
            {
                _id: result._id,
                scenario: result.scenario,
                playerCharacter: result.playerCharacter
            },
            request: {
                type: "GET",
                url: "http://localhost:3000/sessions/" + result._id
            }
        });
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({
            error:err
        })
    });
});

router.get('/:sessionId',checkAuth,(req,res,next)=> {
   Session.findById(req.body.sessionId)
   .select('_id playerCharacter scenario')
   .populate('scenario','_id title ')
   .exec()
   .then(doc=>{
       console.log(doc);
       if(doc)
       {
           res.status(200).json({
               _id: doc._id,
               scenario: doc.scenario,
               playerCharacter: doc.playerCharacter,
               request: {
                   type: 'GET',
                   url: "http://localhost:3000/sessions/"
                }
           });
       }
       res.status(404).json({
           message: 'session not found'
       })
   }).catch(err=>{
       res.status(500).json({
           error: err
       });
   });
});

router.delete('/:sessionId',checkAuth,(req,res,next)=> {
   Session.deleteOne({_id : req.params.sessionId})
   .exec()
   .then(result=>{
       res.status(200).json({
           message: "session deleted",
           request: {
               type:'GET',
               url: "http://localhost:3000/sessions/",
               body: {
                   playerCharacter: "ID",
                   scenario: "ID"
               }
           }
       })
       .catch(err=>{
           res.status(500).json({
               error:err
           });
       });
   })
});

module.exports = router;