const save = require("../utils/saveFile");
const path = require("path");
const Fs = require('fs');
const tf = require("@tensorflow/tfjs-node-gpu");
const canvas = require("canvas");
const faceapi = require("@vladmandic/face-api/dist/face-api.node-gpu.js");

const modelPathRoot = "../models";  //Ruta con los modelos a importar de la RED

let optionsSSDMobileNet;

//importación del canvas
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

//(////// prepara la imagen para ser analizada  ///////////////
async function image(file) {
  const decoded = tf.node.decodeImage(file);
  const casted = decoded.toFloat();
  const result = casted.expandDims(0);
  decoded.dispose();
  casted.dispose();
  return result;
}
/////////// FIN PREPARACIÓN IMAGEN //////////////////

//////// Detecta las caras  //////////////////
async function detect(tensor) {
  const result = await faceapi.detectAllFaces(tensor, optionsSSDMobileNet).withFaceExpressions();
  return result;
}
///////////// FIN DETECCIÓN //////////////////


//inicializa la red neuronal y punto de entrada desde app
async function main() {
  filename = 'captura.jpeg';
  console.log("FaceAPI single-process test");

  //Configuración RED
  await faceapi.tf.setBackend("tensorflow");
  await faceapi.tf.enableProdMode();
  await faceapi.tf.ENV.set("DEBUG", false);
  await faceapi.tf.ready();

  console.log(
    `Version: TensorFlow/JS ${faceapi.tf?.version_core} FaceAPI ${
      faceapi.version.faceapi
    } Backend: ${faceapi.tf?.getBackend()}`
  );

  //Carga los modelos y configura las opciones de SSDMobileNet
  console.log("Loading FaceAPI models");
  const modelPath = path.join(__dirname, modelPathRoot);
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
  await faceapi.nets.faceExpressionNet.loadFromDisk(modelPath);

  //Opciones configuración RED
  optionsSSDMobileNet = new faceapi.SsdMobilenetv1Options({
    minConfidence: 0.5,
  });


  const file = Fs.readFileSync('./Captura/captura.jpeg'); //lee la imagen capturada

  const tensor = await image(file);    //Prepara la imagen para ser analizada
  const result = await detect(tensor); //Analiza la Imagen detección

  console.log("Detect Faces:", result.length);


  //Dibuja la imagen con la detección
  const canvasImg = await canvas.loadImage(file);
  const out = await faceapi.createCanvasFromMedia(canvasImg);
  faceapi.draw.drawDetections(out, result);
  faceapi.draw.drawFaceExpressions(out, result);

  save.saveFile(filename, out.toBuffer("image/jpeg"));  //Guarda la imagen con la detección "módulo saveFle.js"
  console.log(`done, saved results to ${filename}`);

  //console.log(result[0].detection._score); //devuelve el score de reconocimiento de la cara
  //Crea el archivo JSON con los datos de las expresiones capturadas
  if(result.length > 0){
    var expresiones = result[0].expressions;
    //console.log(expresiones);

    const jsonData = JSON.stringify(expresiones);

    save.saveJSON(jsonData);  //Salva los datos en el disco
  }
  
  
  tensor.dispose();  //limpia los buffer de memoria

  

  return result;
}

//Exportación del módulo detect usando como punto de entrada main
module.exports = {
  detect: main,
};
