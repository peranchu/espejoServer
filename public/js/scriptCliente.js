/////////////// MQTT ///////////////////////////////
var client = mqtt.connect('ws://localhost:9001', {clientId: 'navegador'});

function Conectar(){
    console.log('conectado')
    client.subscribe('Test', function(err){
        if(!err){
            client.publish('Test', 'Hola desde el navegador');
        }
    });
}

function Mensajes(topic, message){
    if(topic == 'Test'){
        console.log(topic, message.toString());
    }
    client.end();
}

//var timestamp = new Date().getTime();
//document.getElementById("captura").src = "captura.jpeg?t=" + timestamp; //timestamp para no usar cache Navegador

///////////// FIN MQTT ////////

client.on('connect', Conectar);
client.on('message', Mensajes);

//// GAUGES ///////
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
        {strokeStyle: "#30B32D", min: 0, max: 1200}, // Green
        {strokeStyle: "#FFDD00", min: 1200, max: 2000}, // Yellow
        {strokeStyle: "#F03E3E", min: 2000, max: 3000}  // Red
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
gaugeAngry.maxValue = 3000; // set max gauge value
gaugeAngry.setMinValue(0);  // Prefer setter over gauge.minValue = 0
gaugeAngry.animationSpeed = 32; // set animation speed (32 is default value)
gaugeAngry.set(1250); 

 //DISGUSTED
var targetDisgusted = document.getElementById('disgusted'); 
var gaugeDisgusted = new Gauge(targetDisgusted).setOptions(opts);
gaugeDisgusted.maxValue = 3000; // set max gauge value
gaugeDisgusted.setMinValue(0);  // Prefer setter over gauge.minValue = 0
gaugeDisgusted.animationSpeed = 32; // set animation speed (32 is default value)
gaugeDisgusted.set(300);

//FEARFUL
var targetFearful = document.getElementById('fearful'); 
var gaugeFearful = new Gauge(targetFearful).setOptions(opts);
gaugeFearful.maxValue = 3000; // set max gauge value
gaugeFearful.setMinValue(0);  // Prefer setter over gauge.minValue = 0
gaugeFearful.animationSpeed = 32; // set animation speed (32 is default value)
gaugeFearful.set(500);
 
//HAPPY
var targetHappy = document.getElementById('happy'); 
var gaugeHappy = new Gauge(targetHappy).setOptions(opts);
gaugeHappy.maxValue = 3000; // set max gauge value
gaugeHappy.setMinValue(0);  // Prefer setter over gauge.minValue = 0
gaugeHappy.animationSpeed = 32; // set animation speed (32 is default value)
gaugeHappy.set(500);

//NEUTRAL
var targetNeutral = document.getElementById('neutral'); 
var gaugeNeutral = new Gauge(targetNeutral).setOptions(opts);
gaugeNeutral.maxValue = 3000; // set max gauge value
gaugeNeutral.setMinValue(0);  // Prefer setter over gauge.minValue = 0
gaugeNeutral.animationSpeed = 32; // set animation speed (32 is default value)
gaugeNeutral.set(2000);

//SAD
var targetSad = document.getElementById('sad'); 
var gaugeSad = new Gauge(targetSad).setOptions(opts);
gaugeSad.maxValue = 3000; // set max gauge value
gaugeSad.setMinValue(0);  // Prefer setter over gauge.minValue = 0
gaugeSad.animationSpeed = 32; // set animation speed (32 is default value)
gaugeSad.set(2000);

//SURPRISED
var targetSurprised = document.getElementById('surprised'); 
var gaugeSurprised = new Gauge(targetSurprised).setOptions(opts);
gaugeSurprised.maxValue = 3000; // set max gauge value
gaugeSurprised.setMinValue(0);  // Prefer setter over gauge.minValue = 0
gaugeSurprised.animationSpeed = 32; // set animation speed (32 is default value)
gaugeSurprised.set(2000);

////////////////////////  FIN GAUGES ///////////////////////////////////////

