const express = require('express');
const router = express.Router();
const controller = require('../controllers/index.controllers');

//Petición '/'
router.get('/', controller.index); //petición que devuelve la función controller.index


//Exportación módulo
module.exports = router;