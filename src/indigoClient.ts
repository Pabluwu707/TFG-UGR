import { device } from "./device.js";
import { State, Permission, property, textProperty, switchProperty, numberProperty } from "./property.js";
import { propertyItem } from "./propertyItem.js";

class indigoClient {
  public port: number;
  public host: string;
  public socket: WebSocket | null;

  public indigoData: property[] = [];
  public indigoDevices: device[] = [];

  constructor(host: string, port: number) {
    this.host = host;
    this.port = port;
    this.socket = null;
  }

  connect(): void {
    let socketUrl: string = `ws://${this.host}:${this.port}`
    this.socket = new WebSocket(socketUrl);

    this.socket.addEventListener('open', () => {
      console.log("We connected to the server %s !", socketUrl);
    });

    this.socket.addEventListener('message', (event) => {
      const jsondata = JSON.parse(event.data);
      
      /*let fecha = new Date();
      let hora = fecha.getHours();
      let minutos = fecha.getMinutes();
      console.log("[%s:%s] Message from server: %s", hora, minutos, event.data);
      */
      console.log(event.data);
      //this.printFullPropertyForDebug(jsondata);

      this.handleIncomingProperties(jsondata)
      
    });
  }

  send(message : string): void {
    if (this.socket) {
      console.log('Se va a enviar el mensaje: ', message);
      this.socket.send(message);
      console.log('Mensaje enviado.');
    } else {
      console.log('Socket indefinido.');
    }
  }

  close(): void {
    if (this.socket) {
      this.socket.close();
    }
  }

  handleIncomingProperties(incomingJsonData: any) {
    for (const topLevelKey in incomingJsonData) {

      const obj = incomingJsonData[topLevelKey];
      const objDeviceName : string = obj["device"];

      const searchIndex = this.indigoDevices.findIndex((element) => element.device_name === objDeviceName);
      const found = (searchIndex !== -1);
      if (!found) {
        // Ha llegado un nuevo Device, introducir en la variable indigoDevices
        this.indigoDevices.push( new device(objDeviceName) );

        // Una vez registrado el nuevo dispositivo, añadir la propiedad en este
        this.indigoDevices[this.indigoDevices.length-1].handleIncomingProperty(obj, topLevelKey);

      } else {
        // Dispositivo ya registrado, añadir o actualizar la propiedad en este
        this.indigoDevices[searchIndex].handleIncomingProperty(obj, topLevelKey);

      }
    }
  }
  
  getAllPropertiesFromServer(version: number = 512, device?: string, propertyName?: string): void {
    let result = "";
    
    let messageDevice = "";
    let messagePropertyName = "";

    if (device != undefined) {
      messageDevice = ", &quot;device&quot;: &quot;" + device + "&quot; ";
    }
    if (propertyName != undefined) {
      messagePropertyName = ", &quot;name&quot;: &quot;" + propertyName + "&quot; ";
    }

    let messageData = " ('{ &quot;getProperties&quot;: { &quot;version&quot;: 512" + messageDevice + messagePropertyName + "} }') ";
    
    this.send(messageData);
  }

  updateRegisteredProperty(name: string, key: string, newValue: string): void {
    const searchIndex = this.indigoData.findIndex((element) => element.name === name);
    const found = (searchIndex != -1);

    if (found && this.indigoData[searchIndex].hasOwnProperty(key)) {
      this.indigoData[searchIndex][key] = newValue;
      console.log("Variable " + key + " updated to new value: " + newValue);
    } else {
      console.log("Unable to update the Property.");
    }
  }

  // CÓDIGO DE DEBUGEO: IMPRIME EL TIPO DE PROPERTY SEGUIDO
  // DE TODOS SUS PARES KEY VALUE
  printFullPropertyForDebug(jsondata : object) : void {

      for (const topLevelKey in jsondata) {
        console.log("Property tipe: " + topLevelKey);
        const obj = jsondata[topLevelKey];
        const objName = obj["name"];
        console.log("This object's name is " + objName + "\nKeys of the object:");

        const keys = Object.keys(obj);

        keys.forEach((key) => {
          const value = obj[key];
          console.log(`${key}: ${value}`);
        });
      }
  }

  printIndigoData() : device[] {
    console.log(this.indigoDevices);
    return this.indigoDevices;
  }
}

export { indigoClient };


// ----- EJECUCIÓN DE PRUEBA
/*
const myHost = '127.0.0.1';
const myPort = 7624;

console.log('PRUEBA DE CONEXIÓN');
var socketPrueba = new indigoClient(myHost, myPort);
socketPrueba.connect();
socketPrueba.send('{ "getProperties": { "version": 512, "client": "My Client" } }');
*/