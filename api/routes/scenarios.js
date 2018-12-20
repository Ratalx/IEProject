const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Scenario = require('../models/scenario');

router.get('/',(req,res,next)=>{
    Scenario.find()
    .exec()
    .then(docs => {
        console.log(docs);
        res.status(200).json(docs);
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
        console.log(result);
        res.status(201).json({
            message: 'Hangling POST request to /scenarios',
            createdScenario : result
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
    .exec()
    .then(doc => {
        console.log(doc);
        if(doc){
        res.status(200).json(doc);
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
        updateOps[ops.propName] = ops.value;
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
        res.status(200).json(result);
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
        res.status(200).json(result);
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

module.exports= router;