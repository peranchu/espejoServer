
//Objeto que exporta las funcionalidades de index
const controller = {};
const title = 'INDEX DESDE EL SERVIDOR CON PUG VARIABLE'


//Función que retorna la petición
controller.index = (req, res)=>{
    res.render('index', {title});  //renderiza el index de la carpeta views
};


//Exportación módulo
module.exports = controller;