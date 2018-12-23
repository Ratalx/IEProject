const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Scenario = require('../models/scenario');

router.get('/',(req,res,next)=>{
    Scenario.find()
    .select('title dificultyLevel _id')
    .exec()
    .then(docs => {
        const response ={
            count: docs.length,
            scenarios: docs.map(doc=> {
                    return {
                        title:doc.title,
                        dificultyLevel: doc.dificultyLevel,
                        _id: doc._id,
                        request: {
                            type:"GET",
                            url:"http://localhost:3000/scenarios/"+ doc._id
                        }
                    }
                })
        }
        res.status(200).json(response);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(
            {
            error:err
        });
    });

});

router.post('/',(req,res,next)=>{
    const scenario = new Scenario({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        dificultyLevel : req.body.dificultyLevel
    });

    scenario.save()
    .then(result=> {
        res.status(201).json({
            message: 'Hangling POST request to /scenarios',
            createdScenario : {
                title: result.title,
                dificultyLevel: result.dificultyLevel,
                _id: result._id,
                request:{
                    type:"GET",
                    url: "http://localhost:3000/scenarios/"+ result._id
                }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(
            {
                error:err
            });
    });
    
    
});

router.get('/:scenarioId',(req,res,next)=>{
    const id = req.params.scenarioId;
    Scenario.findById(id)
    .select('title dificultyLevel _id')
    .exec()
    .then(doc => {
        console.log(doc);
        if(doc){
        res.status(200).json({
            scenario:{
            title: doc.title,
            dificultyLevel: doc.dificultyLevel,
            request: {
                type: 'GET',
                url: "http://localhost:3000/scenarios/"
            }}
        });
    }
else
{
    res.status(500).json({message:'No valid ID'});
}
})
    .catch(err=>{
        console.log(err);
        res.status(500).json(
            {
                error:err
            });
    });

});


router.patch('/:scenarioId',(req,res,next)=>{
    const id = req.params.scenarioId;
    const updateOps ={};
    for(const ops of req.body)
    {
        updateOps[ops.attrName] = ops.value;
    }
    Scenario.updateOne(
        {
            _id: id
        },
        {
            $set: updateOps
        }
    )
    .exec()
    .then(result =>{
        console.log(result);
        res.status(200).json({
            message: "Scenario updated",
            request: {
                type: 'GET',
                url: "http://localhost:3000/scenarios/"+ id
            }
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
});

router.delete('/:scenarioId',(req,res,next)=>{
    const id= req.params.scenarioId;
    Scenario.deleteOne({_id: id})
    .exec()
    .then(result=>{
        res.status(200).json({
            message: 'scenario Deleted',
            request: {
                type: 'POST',
                url: "http://localhost:3000/scenarios",
                body: {
                    title: "String",
                    dificultyLevel: "Number"
                }
            }
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

module.exports= router;