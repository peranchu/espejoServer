/*
--ARCHIVO jS DE LA PARTE DEL CLIENTE EN EL NAVEGADOR--
    Controla las conexiones cliente MQTT del navegador
    Dibuja en el Navegador y los GAUGES las expresiones
    Calcula la expresión Dominante en el análisis
*/

//////////////// MQTT ///////////////////////////////
var client = mqtt.connect('ws://localhost:9001', {clientId: 'navegador'});

//Variables de GAuges
var DatosJson;

var DtAng = 0;
var DtDis = 0;
var DtFear = 0;
var DtHap = 0;
var DtNeu = 0;
var DtSad = 0;
var DtSurp = 0;
////////////////////////////////////

//Escalado y almacenamiento de Emoción Predominante
var escalado = 0;
var datosTotales = [];
const EstadosEmociones = ['Enfadado', 'Digustado', 'Temeroso', 'Feliz', 'Neutral', 'Triste', 'Sorprendido'];
///////////////////////////////

///////////////////// MQTT //////////////////////
//Conexión MQTT
function Conectar(){
    console.log('conectado')
    client.subscribe('Refresh', function(err){
        if(!err){
            client.publish('Test', 'Hola desde el navegador');
        }
    });
}

//Recepción MQTT
async function Mensajes(topic, message){
    if(topic == 'Refresh'){
        console.log(topic, message.toString());
        if(message == "REFRESH"){
            var timestamp = new Date().getTime();
            document.getElementById("captura").src = "captura.jpeg?t=" + timestamp; //timestamp para no usar cache Navegador
            traerDatos(); //petición del archivo de datos con las emociones detectadas
        }
    }
}
///////////////////// FIN MQTT ///////////////////////////

//Inicia, escucha y conexión de mensajes MQTT
client.on('connect', Conectar);
client.on('message', Mensajes);
///////////////////////////////////////

////////// Configuración peticion JSON //////////////////////
var init = {
    method: 'GET',
    headers: {
        'content-Type': 'application/json'
    },
    mode: 'cors',
    cache: 'default'
};

let myRequest = new Request("./emocionesData.json", init);  //creación de la Petición JSON
////////////// FIN CONFIGURACIÓN PETICIÓN JSON ///////////////////


////////////// PETICIÓN ARCHIVO JSON ///////////////////
async function traerDatos(){
    //console.log('traer')
    datosTotales = []; //limpia array de datos totales

    fetch(myRequest)
        .then(function(resp){    //recibe el JSON
            return resp.json();
        })
        .then(function(data){    //Pinta los datos en los GAUGES
            DatosJson = data;

            //Datos a los GAUGES
            //Angry
            DtAng = Conversion(DatosJson.angry, 0, 1, 0, 100);
            DtAng = parseInt(Math.trunc(DtAng));
            gaugeAngry.setValueAnimated(DtAng, 1);

            //Disgusted
            DtDis = Conversion(DatosJson.disgusted, 0 ,1, 0, 100);
            DtDis = parseInt(Math.trunc(DtDis));
            gaugeDisgusted.setValueAnimated(DtDis, 1);

            //Fearful
            DtFear = Conversion(DatosJson.fearful, 0 ,1, 0, 100);
            DtFear = parseInt(Math.trunc(DtFear));
            gaugeFearful.setValueAnimated(DtFear, 1);

            //Happy
            DtHap = Conversion(DatosJson.happy, 0 ,1, 0, 100);
            DtHap = parseInt(Math.trunc(DtHap));
            gaugeHappy.setValueAnimated(DtHap, 1);

            //Neutral
            DtNeu = Conversion(DatosJson.neutral, 0 ,1, 0, 100);
            DtNeu = parseInt(Math.trunc(DtNeu));
            gaugeNeutral.setValueAnimated(DtNeu, 1);

            //Sad
            DtSad = Conversion(DatosJson.sad, 0 ,1, 0, 100);
            DtSad = parseInt(Math.trunc(DtSad));
            gaugeSad.setValueAnimated(DtSad, 1);

            //Surprised
            DtSurp = Conversion(DatosJson.surprised, 0 ,1, 0, 100);
            DtSurp = parseInt(Math.trunc(DtSurp));
            gaugeSurprised.setValueAnimated(DtSurp, 1);
        })
        .then(function(){       //Busca la emoción predominante
            TotalesEmociones();
        })
        .then(function(){
            setTimeout(PantallaInicio, 5000);  //vuele a pintar la pnatalla inicio
        })    
        .catch(function(error){
            console.log('no se puedo leer el archivo JSON');
        });
}
////////////////////// FIN PETICION JSON ENVIO GAUGES ///////


//Conversion Escala GAUGES
function Conversion(number, inMin, inMax, outMin, outMax){
    var converDatos = (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    datosTotales.push(Math.trunc(converDatos)); //Almacena los datos
    //console.log('fin1')
    return converDatos;
}
///////////////////////////////

//Extrae el valor máximo y la posición de la emoción predominante
async function TotalesEmociones(){
    //console.log('fin2')
    var NumeroMayor = (Math.max.apply(null, datosTotales));
    //console.log(NumeroMayor);
    var PosicionMayor = datosTotales.indexOf(NumeroMayor); //Posición Valor máximo
    var posicionEmocion = EstadosEmociones[PosicionMayor];  //Correlación posición-Emoción
    document.getElementById('emocion').innerHTML = posicionEmocion;  //Pinta en la WEB la Emoción
}
//////////////////////////////

//Pantalla inicio
async function PantallaInicio(){
    document.getElementById('emocion').innerHTML = "";  //Borra emoción
    document.getElementById('captura').src = "photoimg.png";  //Imagen de inicio

    //Relojes a cero
    gaugeAngry.setValueAnimated(0, 1);
    gaugeDisgusted.setValueAnimated(0, 1);
    gaugeFearful.setValueAnimated(0, 1);
    gaugeHappy.setValueAnimated(0, 1);
    gaugeNeutral.setValueAnimated(0, 1);
    gaugeSad.setValueAnimated(0, 1);
    gaugeSurprised.setValueAnimated(0, 1);
}

///////////////////////// GAUGES ///////////////////////////////
//Configuración para los Gauges
//Angry
var gaugeAngry = Gauge(document.getElementById("angry"),
    {
        min: 0,
        max: 100,
        dialStartAngle: 180,
        value: 0,
        viewBox: "0 0 100 57",
        color: function (value){
            if(value < 20){
                return "#5ee432";  //verde
            }else if(value < 40){
                return "#fffa50";  //amarillo
            }else if(value < 60){
                return "#f7aa38";  //naranja
            }else{
                return "#ed4655";  //Rojo
            }
        }
    }
);

//Disgusted
var gaugeDisgusted = Gauge(document.getElementById("disgusted"),
    {
        min: 0,
        max: 100,
        dialStartAngle: 180,
        value: 0,
        viewBox: "0 0 100 57",
        color: function (value){
            if(value < 20){
                return "#5ee432";
            }else if(value < 40){
                return "#fffa50";
            }else if(value < 60){
                return "#f7aa38";
            }else{
                return "#ed4655";
            }
        }
    }
);

//FEARFUL
var gaugeFearful = Gauge(document.getElementById("fearful"),
    {
        min: 0,
        max: 100,
        dialStartAngle: 180,
        value: 0,
        viewBox: "0 0 100 57",
        color: function (value){
            if(value < 20){
                return "#5ee432";
            }else if(value < 40){
                return "#fffa50";
            }else if(value < 60){
                return "#f7aa38";
            }else{
                return "#ed4655";
            }
        }
    }
);

//HAPPY
var gaugeHappy = Gauge(document.getElementById("happy"),
    {
        min: 0,
        max: 100,
        dialStartAngle: 180,
        value: 0,
        viewBox: "0 0 100 57",
        color: function (value){
            if(value < 20){
                return "#5ee432";
            }else if(value < 40){
                return "#fffa50";
            }else if(value < 60){
                return "#f7aa38";
            }else{
                return "#ed4655";
            }
        }
    }
);
 
//NEUTRAL
var gaugeNeutral = Gauge(document.getElementById("neutral"),
    {
        min: 0,
        max: 100,
        dialStartAngle: 180,
        value: 0,
        viewBox: "0 0 100 57",
        color: function (value){
            if(value < 20){
                return "#5ee432";
            }else if(value < 40){
                return "#fffa50";
            }else if(value < 60){
                return "#f7aa38";
            }else{
                return "#ed4655";
            }
        }
    }
);

//SAD
var gaugeSad = Gauge(document.getElementById("sad"),
    {
        min: 0,
        max: 100,
        dialStartAngle: 180,
        value: 0,
        viewBox: "0 0 100 57",
        color: function (value){
            if(value < 20){
                return "#5ee432";
            }else if(value < 40){
                return "#fffa50";
            }else if(value < 60){
                return "#f7aa38";
            }else{
                return "#ed4655";
            }
        }
    }
);

//SURPRISED
var gaugeSurprised = Gauge(document.getElementById("surprised"),
    {
        min: 0,
        max: 100,
        dialStartAngle: 180,
        value: 0,
        viewBox: "0 0 100 57",
        color: function (value){
            if(value < 20){
                return "#5ee432";
            }else if(value < 40){
                return "#fffa50";
            }else if(value < 60){
                return "#f7aa38";
            }else{
                return "#ed4655";
            }
        }
    }
);
////////////////////////  FIN GAUGES ///////////////////////////////////////


