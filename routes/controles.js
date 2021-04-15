//PETICIONES PÁGINA DE CONTROL
const express = require('express');
const router = express.Router();



router.get('/', (req, res)=>{
    res.render('controles', {
        arrayControles:[
            {id: 'jdfjdj', nombre: 'tactil', descripcion:'descripcion tactil'},
            {id: 'jdfaaj', nombre: 'ServCam', descripcion:'descripcion ServCam'},
        ]
    })
});


module.exports = router;