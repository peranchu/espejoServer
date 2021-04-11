//Modulo que se encarga de la captura de la imagen de la cámara
//==============================================================

const Axios = require('axios');  //Libreria encarga de la petición GET al server de la cámara
const Path = require('path');
const Fs = require('fs');
const faceApiService = require("../src/faceapiService");

const path = Path.resolve(__dirname, '../Captura', 'captura.jpeg');
const nombre = 'captura.jpeg';


//Funcion de peticion y descarga a la cámara
async function descarga(){
    await EliminarFicheros(). then(console.log('Fichero Borrado'));  //Elimina los ficheros previos

    ///////////////////////////

    const URL = 'http://192.168.1.201/picture';  //URL Server Cámara
  
    try{
        const response = await Axios({
            method: 'GET',
            url: URL,
            responseType: 'stream'
        });
  
        await response.data.pipe(Fs.createWriteStream(path)); //Guarda en el disco la imagen capturada
        console.log("Imagen capturada");
    }catch (err){
        throw new Error(err);
    }
  }
  //////////// FIN FUNCIÓN DESCARGA ///////////////



////// Funcion de Limpieza de fichero anterior //////////
async function EliminarFicheros(){
  const carpeta = 'Captura';
  const Cout = 'out';

  //Lee el directorio /Captura
  Fs.readdirSync(carpeta, (err, files) =>{
    if(err) throw err;

      //Borra la imágenes del directorio /Captura
      for(const file of files){
        Fs.unlink(Path.join(carpeta, file), err =>{
          if(err) throw err;
        });
      }  
  });
  //Lee el directorio /out
  Fs.readdirSync(Cout, (err, files) =>{
    if(err) throw err;
  
      //Borra la imágenes del directorio /out
      for (const file of files){
        Fs.unlinkSync(path.join(Cout, file), err =>{
          if(err) throw err;
        });
      }
    });
  }
  //////////////// FIN FUNCIÓN LIMPIEZA ////////


/////////////////// FUNCIÓN ANÁLISIS IMAGEN ////////
async function analisis(){
  const result = await faceApiService.detect();
}
///////// FIN ANALISIS IMAGEN  ////////////


//Exportación módulos
module.exports = {
    descarga,
    analisis
}