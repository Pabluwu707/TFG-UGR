import { device } from "./device.js";
import { State, Permission, property, textProperty, switchProperty, numberProperty } from "./property.js";
import { propertyItem } from "./propertyItem.js";

class indigoClient {
  public port: number;
  public host: string;
  public socket: WebSocket | null;

  public indigoData: property[] = [];
  public indigoDevices: device[] = [];

  public observers: any = [];

  constructor(host: string, port: number, guiParent?: any) {
    this.host = host;
    this.port = port;
    this.socket = null;
    if (guiParent) {
      this.observers.push(guiParent);
    }
  }

  // Websocket functionalities
  connect(): void {
    let socketUrl: string = `ws://${this.host}:${this.port}`
    this.socket = new WebSocket(socketUrl);

    this.socket.addEventListener('open', () => {
      console.log("We connected to the server at %s !", socketUrl);
    });

    this.socket.addEventListener('close', () => {
      console.log("Connection to the server at %s was closed!", socketUrl);
      this.close();
    });

    this.socket.addEventListener('message', (event) => {
      const jsondata = JSON.parse(event.data);
      
      this.observers.forEach(observer => observer.notifyChange(this.indigoData));
      
      let fecha = new Date();
      let hora = fecha.getHours();
      let minutos = fecha.getMinutes();
      let segundos = fecha.getSeconds();
      console.log("[%s:%s:%s] Message from server: %s", hora, minutos, segundos, event.data);
      
      //console.log(event.data);
      //console.log(jsondata);
      //this.printFullPropertyForDebug(jsondata);

      this.handleIncomingProperties(jsondata)
      
    });
  }

  send(message : string): void {
    if (this.socket) {
      console.log('Se va a enviar el mensaje: ', message);
      //let message2 = JSON.stringify(message);
      //this.socket.send(message2);
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

  // MESSAGES FROM DEVICE TO CLIENT
  handleIncomingProperties(incomingJsonData: any) {
    for (const topLevelKey in incomingJsonData) {
      if(topLevelKey == "deleteProperty") {
        console.log("Petición de borrado");
          const objDelete = incomingJsonData[topLevelKey];
          const objDeleteDevice = objDelete["device"];
          const objDeleteName = objDelete["name"];

          const searchIndexDel = this.indigoDevices.findIndex((element) => element.device_name === objDeleteDevice);
          const foundDel = (searchIndexDel !== -1);
          if (foundDel) {
            console.log("Se borrará el property " + objDeleteName + " en el device " + objDeleteDevice);
            this.indigoDevices[searchIndexDel].removeProperty(objDeleteName);
            if(this.indigoDevices[searchIndexDel].getPropertyCount() <= 0) {
              console.log("Device vacio, lo borramos.")
              this.indigoDevices.splice(searchIndexDel, 1);
            }
          }
      }

      if(topLevelKey == "message") {
        console.log("Ha llegado un mensaje");
      }

      if (topLevelKey.startsWith("set") || topLevelKey.startsWith("def")) {
        console.log("Tipo de mensaje recibido: " + String(topLevelKey));

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
  
  // MESSAGES FROM CLIENT TO DEVICE
  // Sends a message requesting all properties to the INDIGO Server
  sendEnumeratePropertiesMessage(protocolVersion: number = 512, deviceName?: string, propertyName?: string): void {
    
    let messageDevice = "";
    let messagePropertyName = "";

    if (deviceName != undefined) {
      messageDevice = ", \"device\": \"" + deviceName + "\"";
    }
    if (propertyName != undefined) {
      messagePropertyName = ", \"name\": \"" + propertyName + "\" ";
    }

    let messageData = " ('{ \"getProperties\": { \"version\": " + protocolVersion + ', \"client\": \"My Client\"' + messageDevice + messagePropertyName + "} }') ";
    
    this.send(messageData);
  }

  // Sends new target value of an already existing Property item to INDIGO Server
  //
  sendChangePropertyMessage(propertyType: string, deviceName: string, propertyName: string, 
    items: any[]) {

    var itemsFormatted:any[] = []
    items.forEach(item => {
      itemsFormatted.push({"name": item[0], "value": item[1]})
    });

    let messagePropertyType = "";
    let regexSetDef = /(set|def|new)(.*?)Vector/;
    let match = propertyType.match(regexSetDef);
    if (match) {
      messagePropertyType = "new" + String(match[2]) + "Vector";
    }

    var property = { "device": deviceName, "name": propertyName, "items": itemsFormatted };

    var message = { [messagePropertyType] : property};
    this.send(JSON.stringify(message))
  }

  // Sends a defVector message to the INDIGO Server
  // DefVector defines or describes the properties.
  sendDefPropertyMessage(propertyType: string, deviceName: string, propertyName: string, 
                        itemName: string, itemTargetValue: string) {
    
    // Set property state to busy locally
    const deviceIndex = this.indigoDevices.findIndex((element) => element.device_name === deviceName);
    this.indigoDevices[deviceIndex].setPropertyToBusy(propertyName);
    
    // 
    let messagePropertyType = "";
    let regexSetDef = /(set|def|new)(.*?)Vector/;
    let match = propertyType.match(regexSetDef);
    if (match) {
      messagePropertyType = "def" + match[2] + "Vector";
    } else {
      return 0;
    }

    // Prepare the message and send it to the INDIGO Server
    // TO-DO: Use switch statement to set property type instead of requesting it as parameter?
    let messageData = " ('{ \"" + messagePropertyType 
    + "\": { \"device\": \"" + deviceName 
    + "\", \"name\": \"" + propertyName 
    + "\", \"items\": [{\"name\":\"" + itemName 
    + "\", \"value\": " + itemTargetValue 
    + "} ] } } ')";
    
    this.send(messageData);
  }

  // Sends a SetVector message to the INDIGO Server
  // DefVector updates or modifies the values of an existing property.
  sendSetPropertyMessage(propertyType: string, deviceName: string, propertyName: string, 
                        itemName: string, itemTargetValue: string) {
    
    // Set property state to busy locally
    const deviceIndex = this.indigoDevices.findIndex((element) => element.device_name === deviceName);
    this.indigoDevices[deviceIndex].setPropertyToBusy(propertyName);
    
    // 
    let messagePropertyType = "";
    let regexSetDef = /(set|def|new)(.*?)Vector/;
    let match = propertyType.match(regexSetDef);
    if (match) {
      messagePropertyType = "set" + match[2] + "Vector";
    } else {
      return 0;
    }

    // Prepare the message and send it to the INDIGO Server
    // TO-DO: Use switch statement to set property type instead of requesting it as parameter?
    let messageData = " ('{ \"" + messagePropertyType 
    + "\": { \"device\": \"" + deviceName 
    + "\", \"name\": \"" + propertyName 
    + "\", \"items\": [{\"name\":\"" + itemName 
    + "\", \"value\": " + itemTargetValue 
    + "} ] } } ')";
    
    this.send(messageData);
  }

  // Sends a NewVector message to the INDIGO Server
  // NewVector creates or sets a new instance of a Property.
  sendNewPropertyMessage(propertyType: string, deviceName: string, propertyName: string, 
                        itemName: string, itemTargetValue: string) {
    
    // Set property state to busy locally
    const deviceIndex = this.indigoDevices.findIndex((element) => element.device_name === deviceName);
    this.indigoDevices[deviceIndex].setPropertyToBusy(propertyName);
    
    // 
    let messagePropertyType = "";
    let regexSetDef = /(set|def|new)(.*?)Vector/;
    let match = propertyType.match(regexSetDef);
    if (match) {
      messagePropertyType = "new" + match[2] + "Vector";
    } else {
      return 0;
    }

    // Prepare the message and send it to the INDIGO Server
    // TO-DO: Use switch statement to set property type instead of requesting it as parameter?
    let messageData = " ('{ \"" + messagePropertyType 
    + "\": { \"device\": \"" + deviceName 
    + "\", \"name\": \"" + propertyName 
    + "\", \"items\": [{\"name\":\"" + itemName 
    + "\", \"value\": " + itemTargetValue 
    + "} ] } } ')";
    
    this.send(messageData);
  }

  // DEBUG
  sendChangePropertyPruebas(propertyType: string, deviceName: string, propertyName: string, 
    itemName: string, itemTargetValue: any) {
    var items = [{ "name": itemName, "value": itemTargetValue }]
    var property = { "device": deviceName, "name": propertyName, "items": items };

    let messagePropertyType = "";
    let regexSetDef = /(set|def|new)(.*?)Vector/;
    let match = propertyType.match(regexSetDef);
    if (match) {
      messagePropertyType = "def" + String(match[2]) + "Vector";
      console.log("Nos encantan las pruebas. Enviamos: " + messagePropertyType);
    }

    var message = { [messagePropertyType] : property};
    this.send(JSON.stringify(message))
  }

  // Sends new target value of an already existing Property item to INDIGO Server
  //
  sendChangePropertyMessagePruebas(propertyType: string, deviceName: string, propertyName: string, 
                        itemName: string, itemTargetValue: string) {
    
    // Set property state to busy locally
    const deviceIndex = this.indigoDevices.findIndex((element) => element.device_name === deviceName);
    this.indigoDevices[deviceIndex].setPropertyToBusy(propertyName);
    
    // 
    let messagePropertyType = "";
    let regexSetDef = /(set|def)(.*?)Vector/;
    let match = propertyType.match(regexSetDef);
    if (match) {
      messagePropertyType = "new" + match[2] + "Vector";
    } else {
      return 0;
    }
  }

  // Sends Delete message for a Device to the INDIGO Server
  sendDelPropertyMessage(deviceName: string, propertyName?: string) {
    
    let messagePropertyName = "";
    
    if (propertyName != undefined) {
      messagePropertyName = ", \"name\": \"" + propertyName + "\" ";
    }

    let messageData = " (\'{ \"deleteProperty\": { \"device\": " + deviceName + messagePropertyName + "} }\') ";
    
    this.send(messageData);
  }

  // Sends message to Server to enable BLOB prperties

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

  getIndigoDevices() : device[] {
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