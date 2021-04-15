//////////////////////// MANEJO DE LAS RUTAS WEB //////////

const express = require ('express');
const router = express.Router();

//PETICIONES RUTAS
//Página /
router.get('/', (req, res)=>{
    res.render('index', {titulo: 'index dinámico'});
});



module.exports = router;