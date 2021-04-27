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

function Conectar(){
    console.log('conectado')
    client.subscribe('Refresh', function(err){
        if(!err){
            client.publish('Test', 'Hola desde el navegador');
        }
    });
}

function Mensajes(topic, message){
    if(topic == 'Refresh'){
        console.log(topic, message.toString());
        if(message == "REFRESH"){
            var timestamp = new Date().getTime();
            document.getElementById("captura").src = "captura.jpeg?t=" + timestamp; //timestamp para no usar cache Navegador
            traerDatos();
        }
    }
}

///////////////////// FIN MQTT ///////////////////////////

//Escucha de la conexión y recepción de mensajes MQTT
client.on('connect', Conectar);
client.on('message', Mensajes);

////////////// PETICIÓN ARCHIVO JSON ///////////////////
async function traerDatos(){
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
            gaugeAngry.set(DtAng);

            //Disgusted
            DtDis = Conversion(DatosJson.disgusted, 0 ,1, 0, 100);
            DtDis = parseInt(Math.trunc(DtDis));
            gaugeDisgusted.set(DtDis);

            //Fearful
            DtFear = Conversion(DatosJson.fearful, 0 ,1, 0, 100);
            DtFear = parseInt(Math.trunc(DtFear));
            gaugeFearful.set(DtFear);

            //Happy
            DtHap = Conversion(DatosJson.happy, 0 ,1, 0, 100);
            DtHap = parseInt(Math.trunc(DtHap));
            gaugeHappy.set(DtHap);

            //Neutral
            DtNeu = Conversion(DatosJson.neutral, 0 ,1, 0, 100);
            DtNeu = parseInt(Math.trunc(DtNeu));
            gaugeNeutral.set(DtNeu);

            //Sad
            DtSad = Conversion(DatosJson.sad, 0 ,1, 0, 100);
            DtSad = parseInt(Math.trunc(DtSad));
            gaugeSad.set(DtSad);

            //Surprised
            DtSurp = Conversion(DatosJson.surprised, 0 ,1, 0, 100);
            DtSurp = parseInt(Math.trunc(DtSurp));
            gaugeSurprised.set(DtSurp);
        }
    }
}
////////////////////// FIN PETICION JSON ENVIO GAUGES ///////


//Conversion Escala GAUGES
function Conversion(number, inMin, inMax, outMin, outMax){
    return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}
///////////////////////////////


///////////////////////// GAUGES ///////////////////////////////
//Configuración para los Gauges
var opts = {
    angle: -0.24, // The span of the gauge arc
    lineWidth: 0.2, // The line thickness
    radiusScale: 0.94, // Relative radius
    pointer: {
      length: 0.6, // // Relative to gauge radius
      strokeWidth: 0.035, // The thickness
      color: '#000000' // Fill color
    },
    staticZones: [   //colores gauges
        {strokeStyle: "#30B32D", min: 0, max: 55}, // Green
        {strokeStyle: "#FFDD00", min: 55, max: 75}, // Yellow
        {strokeStyle: "#F03E3E", min: 75, max: 100}  // Red
    ],
    limitMax: false,     // If false, max value increases automatically if value > maxValue
    limitMin: false,     // If true, the min value of the gauge will be fixed
    colorStart: '#6FADCF',   // Colors
    colorStop: '#8FC0DA',    // just experiment with them
    strokeColor: '#E0E0E0',  // to see which ones work best for you
    generateGradient: true,
    highDpiSupport: true,     // High resolution support
};



//ANGRY
var targetAngry = document.getElementById('angry'); 
var gaugeAngry = new Gauge(targetAngry).setOptions(opts);
gaugeAngry.maxValue = 100; // set max gauge value
gaugeAngry.setMinValue(0);  // Prefer setter over gauge.minValue = 0
gaugeAngry.animationSpeed = 32; // set animation speed (32 is default value)
gaugeAngry.set(0); 


 //DISGUSTED
var targetDisgusted = document.getElementById('disgusted'); 
var gaugeDisgusted = new Gauge(targetDisgusted).setOptions(opts);
gaugeDisgusted.maxValue = 100; // set max gauge value
gaugeDisgusted.setMinValue(0);  // Prefer setter over gauge.minValue = 0
gaugeDisgusted.animationSpeed = 32; // set animation speed (32 is default value)
gaugeDisgusted.set(0);

//FEARFUL
var targetFearful = document.getElementById('fearful'); 
var gaugeFearful = new Gauge(targetFearful).setOptions(opts);
gaugeFearful.maxValue = 100; // set max gauge value
gaugeFearful.setMinValue(0);  // Prefer setter over gauge.minValue = 0
gaugeFearful.animationSpeed = 32; // set animation speed (32 is default value)
gaugeFearful.set(0);
 
//HAPPY
var targetHappy = document.getElementById('happy'); 
var gaugeHappy = new Gauge(targetHappy).setOptions(opts);
gaugeHappy.maxValue = 100; // set max gauge value
gaugeHappy.setMinValue(0);  // Prefer setter over gauge.minValue = 0
gaugeHappy.animationSpeed = 32; // set animation speed (32 is default value)
gaugeHappy.set(0);

//NEUTRAL
var targetNeutral = document.getElementById('neutral'); 
var gaugeNeutral = new Gauge(targetNeutral).setOptions(opts);
gaugeNeutral.maxValue = 100; // set max gauge value
gaugeNeutral.setMinValue(0);  // Prefer setter over gauge.minValue = 0
gaugeNeutral.animationSpeed = 32; // set animation speed (32 is default value)
gaugeNeutral.set(0);

//SAD
var targetSad = document.getElementById('sad'); 
var gaugeSad = new Gauge(targetSad).setOptions(opts);
gaugeSad.maxValue = 100; // set max gauge value
gaugeSad.setMinValue(0);  // Prefer setter over gauge.minValue = 0
gaugeSad.animationSpeed = 32; // set animation speed (32 is default value)
gaugeSad.set(0);

//SURPRISED
var targetSurprised = document.getElementById('surprised'); 
var gaugeSurprised = new Gauge(targetSurprised).setOptions(opts);
gaugeSurprised.maxValue = 100; // set max gauge value
gaugeSurprised.setMinValue(0);  // Prefer setter over gauge.minValue = 0
gaugeSurprised.animationSpeed = 32; // set animation speed (32 is default value)
gaugeSurprised.set(0);

////////////////////////  FIN GAUGES ///////////////////////////////////////

