/////////////// MQTT ///////////////////////////////
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

var escalado = 0;

var datosTotales = [];
const EstadosEmociones = ['Enfadado', 'Digustado', 'Temeroso', 'Feliz', 'Neutral', 'Triste', 'Sorprendido'];
var NumeroMayor = 0;
var PosicionMayor = 0;

const TxtEmocion = document.getElementById('emocion');

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
function Mensajes(topic, message){
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

//Escucha de la conexión y recepción de mensajes MQTT
client.on('connect', Conectar);
client.on('message', Mensajes);


////////////// PETICIÓN ARCHIVO JSON ///////////////////
async function traerDatos(){
    datosTotales = []; //limpia array de datos totales

    const xhttp = new XMLHttpRequest();
    xhttp.open('GET', 'emocionesData.json', true);
    xhttp.send();
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            DatosJson = JSON.parse(this.responseText);

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
        }
    }
}
////////////////////// FIN PETICION JSON ENVIO GAUGES ///////


//Conversion Escala GAUGES
function Conversion(number, inMin, inMax, outMin, outMax){
    var converDatos = (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;

    datosTotales.push(Math.trunc(converDatos));
    NumeroMayor = Math.max.apply(null, datosTotales);  //busca el Valor Máximo
    PosicionMayor = datosTotales.indexOf(NumeroMayor); //Posicion del Valor máximo
    TxtEmocion = EstadosEmociones[PosicionMayor];

    return converDatos;
}
///////////////////////////////


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


