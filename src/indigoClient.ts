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
      console.log("We connected to the server at %s !", socketUrl);
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
  
  // Sends a message requesting all properties to the INDIGO Server
  sendGetPropertiesMessage(protocolVersion: number = 512, deviceName?: string, propertyName?: string): void {
    
    let messageDevice = "";
    let messagePropertyName = "";

    if (deviceName != undefined) {
      messageDevice = ", &quot;device&quot;: &quot;" + deviceName + "&quot; ";
    }
    if (propertyName != undefined) {
      messagePropertyName = ", &quot;name&quot;: &quot;" + propertyName + "&quot; ";
    }

    let messageData = " ('{ &quot;getProperties&quot;: { &quot;version&quot;: " + protocolVersion + messageDevice + messagePropertyName + "} }') ";
    
    this.send(messageData);
  }

  // Sends new target value of an already existing Property item to INDIGO Server
  // TO-DO: Send Property class instance as parameter? That way property type can be inferred from the class 
  //        instead of being requested as parameter
  //
  sendSetPropertyMessage(propertyType: string, deviceName: string, propertyName: string, 
                        itemName: string, itemTargetValue: string) {
    
    // Set property state to busy locally
    const deviceIndex = this.indigoDevices.findIndex((element) => element.device_name === deviceName);
    this.indigoDevices[deviceIndex].setPropertyToBusy(propertyName);

    // Prepare the message and send it to the INDIGO Server
    // TO-DO: Use switch statement to set property type instead of requesting it as parameter?
    let messageData = " ('{ &quot;" + propertyType 
    + "&quot;: { &quot;device&quot;: &quot;" + deviceName 
    + "&quot;, &quot;name&quot;: &quot;" + propertyName 
    + "&quot;, &quot;items&quot;:[{&quot;name&quot;:&quot;" + itemName 
    + "&quot;, &quot;value&quot;:" + itemTargetValue 
    + "}]}}') ";
    
    this.send(messageData);
  }

  // Sends Delete message for a Device to the INDIGO Server
  sendDelPropertyMessage(deviceName: string, propertyName?: string) {
    
    let messagePropertyName = "";
    
    if (propertyName != undefined) {
      messagePropertyName = ", &quot;name&quot;: &quot;" + propertyName + "&quot; ";
    }

    let messageData = " ('{ &quot;deleteProperty&quot;: { &quot;device&quot;: " + deviceName + messagePropertyName + "} }') ";
    
    this.send(messageData);
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