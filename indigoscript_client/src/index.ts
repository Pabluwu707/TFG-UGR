import { indigoClient } from "./indigoClient.js"; 
//import { indigoClient } from "./indigoClient.es.js"

function clientSend () : void {
  var messageValue = (<HTMLInputElement>document.getElementById("messageBox")).value;
  socketPrueba.send(messageValue);
}

function printIndigoData () : void {
  console.log("Console printing all stored Properties...");
  const propertyDisplayBox = <HTMLInputElement>document.getElementById("propertyDisplayBox");
  if (propertyDisplayBox != null) {
    propertyDisplayBox.textContent = JSON.stringify(socketPrueba.printIndigoData());
  }
}

function copyToClipboard() {
  // Get the text field
  const propertyDisplayBox = <HTMLInputElement>document.getElementById("propertyDisplayBox");

  if(propertyDisplayBox != null) {
    // Copy the text inside the text field
    navigator.clipboard.writeText(propertyDisplayBox.innerHTML);
  }
} 

function getPropertiesDebug() {
  socketPrueba.sendEnumeratePropertiesMessage(512, "CCD Guider Simulator", "CONNECTION");
}

function setPropertyTo0Debug() {
  socketPrueba.sendChangePropertyMessage("defNumberVector", "CCD Guider Simulator", "SIMULATION_SETUP", 
    [["IMAGE_WIDTH", 0]])
}

function setPropertyTo1234Debug() {
  socketPrueba.sendChangePropertyMessage("newNumberVector", "CCD Guider Simulator", "SIMULATION_SETUP", 
  [["IMAGE_WIDTH", 1234]])
}

function connectionOnDebugCustom() {
  socketPrueba.send( '{\"newSwitchVector\":{\"device\":"CCD Imager Simulator\",\"name\":\"CONNECTION\",\"items\": [{\"name\":\"CONNECTED\",\"value\":true}]}}' );
  //socketPrueba.send('{ \"setSwitchVector\": { \"device\": "CCD Imager Simulator\", \"name\": \"CONNECTION\", \"state\": \"Ok\", \"items\": [  { \"name\": \"CONNECTED\", \"value\": true }, { \"name\": \"DISCONNECTED\", \"value\": false } ] } }' );
  //socketPrueba.sendChangePropertyPruebas("defSwitchVector", "CCD Imager Simulator", "CONNECTION", "CONNECTED", "true")
}

function connectionOnDebugPrueba() {
  //socketPrueba.send( '{\"newSwitchVector\":{\"device\":"CCD Imager Simulator\",\"name\":\"CONNECTION\",\"items\": [{\"name\":\"CONNECTED\",\"value\":true}]}}' );
  //socketPrueba.send('{ \"setSwitchVector\": { \"device\": "CCD Imager Simulator\", \"name\": \"CONNECTION\", \"state\": \"Ok\", \"items\": [  { \"name\": \"CONNECTED\", \"value\": true }, { \"name\": \"DISCONNECTED\", \"value\": false } ] } }' );
  //socketPrueba.sendChangePropertyPruebas("defSwitchVector", "CCD Imager Simulator", "CONNECTION", "CONNECTED", true)
  socketPrueba.sendChangePropertyMessage("newSwitchVector", "CCD Imager Simulator", "CONNECTION", 
  [["CONNECTED", true]])
}

const myHost = '127.0.0.1';
const myPort = 7624;

console.log('PRUEBA DE CONEXIÓN');
var socketPrueba = new indigoClient(myHost, myPort);
socketPrueba.connect();

document.getElementById("buttonSendMessage")!.addEventListener ("click", clientSend);

document.getElementById("buttonPrintProperties")!.addEventListener ("click", printIndigoData);
document.getElementById("buttonCopyProperties")!.addEventListener ("click", copyToClipboard);
document.getElementById("buttonGetProps")!.addEventListener ("click", getPropertiesDebug);
document.getElementById("buttonSetProp0")!.addEventListener ("click", setPropertyTo0Debug);
document.getElementById("buttonSetProp1234")!.addEventListener ("click", setPropertyTo1234Debug);
document.getElementById("buttonConnectionOnCustom")!.addEventListener ("click", connectionOnDebugCustom);
document.getElementById("buttonConnectionOnPrueba")!.addEventListener ("click", connectionOnDebugPrueba);
