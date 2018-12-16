const express = require('express');

const router = express.Router();

router.get('/',(req,res,next)=>{
    res.status(200).json({
        message: 'Hangling GET request to /scenarios'
    });
});

router.post('/',(req,res,next)=>{
    const scenario = {
        name: req.body.name,
        difcultyLevel : req.body.difcultyLevel
    }
    res.status(200).json({
        message: 'Hangling POST request to /scenarios',
        createdScenario : scenario
    });
});

router.get('/:scenarioId',(req,res,next)=>{
    const id = req.params.scenarioId;
    if(id == 'special'){
        res.status(200).json({
            message: 'You discovered the spceial id',
            id: id
        });
    }
    else{
        res.status(200).json({
            message:'You passed an ID'
        });
    }
});


router.patch('/:scenarioId',(req,res,next)=>{
    res.status(200).json({
        message: 'Updated scenario!'
    })
});

module.exports= router;