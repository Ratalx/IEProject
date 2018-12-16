const express = require('express');

const router = express.Router();

router.get('/',(req,res,next)=> {
    
    res.status(201).json({
        message: 'Character is open'
    });
});

router.post('/',(req,res,next)=> {
    const character = {
        characterId:req.body.characterId,
        name:req.body.name,  
    }
    res.status(201).json({
        message: 'Character is created',
        createdCharacter:character
    });
});

router.get('/:characterId',(req,res,next)=> {
    res.status(200).json({
        message: 'Character details',
        characterId: req.params.characterId
    });
});

router.delete('/:characterId',(req,res,next)=> {
    res.status(200).json({
        message: 'Character deleted',
        characterId: req.params.characterId
    });
});

module.exports = router;