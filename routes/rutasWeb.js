//////////////////////// MANEJO DE LAS RUTAS WEB //////////

const express = require ('express');
const router = express.Router();

//PETICIONES RUTAS
//Página /
router.get('/', (req, res)=>{
    res.render('index', {titulo: 'index dinámico'});
});


//Página Controles
router.get('/controles', (req, res)=>{
    res.render('controles', {titulo: 'controles dinámicos'});
});


module.exports = router;