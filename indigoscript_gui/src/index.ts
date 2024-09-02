import { indigoClientGUI } from "./indigoClientGUI.js"; 
//import { indigoClient } from "./indigoClient.es.js"


function copyToClipboard() {
  // Get the text field
  const propertyDisplayBox = <HTMLInputElement>document.getElementById("propertyDisplayBox");

  if(propertyDisplayBox != null) {
    // Copy the text inside the text field
    navigator.clipboard.writeText(propertyDisplayBox.innerHTML);
  }
} 
function clientSend () : void {
  var messageValue = (<HTMLInputElement>document.getElementById("messageBox")).value;
  socketPrueba.sendCustomMessage(messageValue);
}

function connectionOnDebug() {
  socketPrueba.sendCustomMessage( '{\"newSwitchVector\":{\"device\":"CCD Imager Simulator\",\"name\":\"CONNECTION\",\"items\": [{\"name\":\"CONNECTED\",\"value\":true}]}}' );
  //socketPrueba.send('{ \"setSwitchVector\": { \"device\": "CCD Imager Simulator\", \"name\": \"CONNECTION\", \"state\": \"Ok\", \"items\": [  { \"name\": \"CONNECTED\", \"value\": true }, { \"name\": \"DISCONNECTED\", \"value\": false } ] } }' );
}

function contadorPrueba() {
  socketPrueba.contadorPrueba();
}

function crearTabla() {
  let parentElement = document.querySelector(".indigoscriptgui");
  if (parentElement?.hasChildNodes()) {
    parentElement.innerHTML = '';
  }
  socketPrueba.createBaseTable();
}

const myHost = '127.0.0.1';
const myPort = 7624;

console.log('PRUEBA DE CONEXIÓN');
var socketPrueba = new indigoClientGUI(myHost, myPort);

document.getElementById("buttonSendMessage")!.addEventListener ("click", clientSend);
document.getElementById("buttonConnectionOn")!.addEventListener ("click", connectionOnDebug);
document.getElementById("buttonContador")!.addEventListener("click", contadorPrueba);
document.getElementById("buttonCrearTabla")!.addEventListener("click", crearTabla);