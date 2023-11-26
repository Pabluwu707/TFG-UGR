import { State, Permission, property, textProperty, switchProperty, numberProperty } from "./property.js";
import { propertyItem } from "./propertyItem.js";

class indigoClient {
  public port: number;
  public host: string;
  public socket: WebSocket | null;

  public indigoData: property[] = [];

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

      this.printFullPropertyForDebug(jsondata);

      for (const topLevelKey in jsondata) {

        const obj = jsondata[topLevelKey];
        const objName : string = obj["name"];

        const searchIndex = this.indigoData.findIndex((element) => element.name == objName);
        let found = (searchIndex != -1);

        if (!found) {
          //Ha llegado una nueva Property, introducir en la variable indigoData
          this.insertNewProperty(obj, topLevelKey);

        } else {
          // Actualizar los datos de la Property anteriormente introducida en indigoData
          console.log("Propiedad repetida, actualizando datos");
          this.updateExistingProperty(obj, topLevelKey, searchIndex);
        }
      }
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


  insertNewProperty(propertyData : any, propertyType : string): void {
    switch(propertyType) {
      case "defTextVector":
        // Llamar al constructor de textProperty
        this.indigoData.push( new textProperty(propertyData) );
        break;
      case "defSwitchVector":
        // Llamar al constructor de switchProperty
        this.indigoData.push( new switchProperty(propertyData) );
        break;
      case "defNumberVector":
        // Llamar al constructor de numberProperty
        this.indigoData.push( new numberProperty(propertyData) );
        break;
      default:
        console.log("Unexpected type of property.");
        break;
    }
  }

  updateExistingProperty(propertyData : any, propertyType : string, propertyIndex : number): void {
    switch(propertyType) {
      case "defTextVector":
        // Reemplazar los datos anteirores por un nuevo textProperty
        this.indigoData[propertyIndex] = new textProperty(propertyData) ;
        break;
      case "defSwitchVector":
        // Reemplazar los datos anteirores por un nuevo switchProperty
        this.indigoData[propertyIndex] =  new switchProperty(propertyData) ;
        break;
      case "defNumberVector":
        // Reemplazar los datos anteirores por un nuevo numberProperty
        this.indigoData[propertyIndex] =  new numberProperty(propertyData) ;
        break;
      default:
        console.log("Unexpected type of property.");
        break;
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
    const searchIndex = this.indigoData.findIndex((element) => element.name == name);
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

  printIndigoData() : void {
    console.log(this.indigoData);
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