const fs = require("fs");
const path = require("path");

const baseDir = path.resolve(__dirname, "../out");

//Guarda la imagen procesada y analizada en el directorio /out
function saveFile(fileName, buf) {
  if (!fs.existsSync(baseDir)) {  //Comprueba si existe imagen con ese nombre
    fs.mkdirSync(baseDir);
  }

  fs.writeFileSync(path.resolve(baseDir, fileName), buf);
}

//Guarda el archivo JSON
function saveJSON(datos){
  fs.writeFileSync('public/emocionesData.json', datos, 'utf-8');
  console.log('archivo escrito');
}

//Exportación módulo
module.exports = {
  saveFile,
  saveJSON
};
