import { indigoClient } from "./indigoClient.js"; 

function clientSend () : void {
  var messageValue = (<HTMLInputElement>document.getElementById("messageBox")).value;
  socketPrueba.send(messageValue);
}

function printIndigoData () : void {
  console.log("Console printing all stored Properties...")
  socketPrueba.printIndigoData();
}

const myHost = '127.0.0.1';
const myPort = 7624;

console.log('PRUEBA DE CONEXIÓN');
var socketPrueba = new indigoClient(myHost, myPort);
socketPrueba.connect();

document.getElementById("buttonSendMessage")!.addEventListener ("click", clientSend);

document.getElementById("buttonPrintProperties")!.addEventListener ("click", printIndigoData);