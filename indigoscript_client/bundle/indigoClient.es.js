/*! indigoscript-client v1.0.0 |  | Copyright 2024 | ISC license */
class propertyItem {
    _name;
    _label;
    value;
    constructor(jsonObject) {
        this._name = jsonObject.name;
        this._label = jsonObject.label;
        this.value = jsonObject.value;
    }
    // Readonly getters
    get name() {
        return this._name;
    }
    get label() {
        return this._label;
    }
    // Private variables getters/setters
    getValue() {
        return this.value;
    }
    setValue(newValue) {
        this.value = newValue;
    }
}
class propertyItemNumber extends propertyItem {
    min;
    max;
    step;
    format;
    target;
    constructor(jsonObject) {
        super(jsonObject);
        this.min = jsonObject.min;
        this.max = jsonObject.max;
        this.step = jsonObject.step;
        this.format = jsonObject.format;
        this.target = jsonObject.target;
    }
}

var State;
(function (State) {
    State[State["Idle"] = 0] = "Idle";
    State[State["Ok"] = 1] = "Ok";
    State[State["Busy"] = 2] = "Busy";
    State[State["Alert"] = 3] = "Alert";
})(State || (State = {}));
var Permission;
(function (Permission) {
    Permission[Permission["ro"] = 0] = "ro";
    Permission[Permission["wo"] = 1] = "wo";
    Permission[Permission["rw"] = 2] = "rw";
})(Permission || (Permission = {}));
class property {
    _name;
    _label;
    group;
    device;
    version;
    state;
    perm;
    constructor(jsonObject) {
        this._name = jsonObject.name;
        this._label = jsonObject.label;
        this.group = jsonObject.group;
        this.device = jsonObject.device;
        this.version = jsonObject.version;
        this.state = jsonObject.state;
        this.perm = jsonObject.perm;
    }
    // Readonly getters
    get name() {
        return this._name;
    }
    get label() {
        return this._label;
    }
    // Private variables getters/setters
    getGroup() {
        return this.group;
    }
    setGroup(newGroup) {
        this.group = newGroup;
    }
    getState() {
        return this.state;
    }
    setState(newState) {
        this.state = newState;
    }
}
class textProperty extends property {
    _type = "textProperty";
    items = [];
    constructor(jsonObject) {
        super(jsonObject);
        jsonObject.items.forEach((singularPropertyItem) => this.items.push(new propertyItem(singularPropertyItem)));
    }
    get type() {
        return this._type;
    }
    getItems() {
        return this.items;
    }
}
class switchProperty extends property {
    _type = "switchProperty";
    rule;
    items = [];
    constructor(jsonObject) {
        super(jsonObject);
        this.rule = jsonObject.rule;
        jsonObject.items.forEach((singularPropertyItem) => this.items.push(new propertyItem(singularPropertyItem)));
    }
    get type() {
        return this._type;
    }
    getItems() {
        return this.items;
    }
}
class numberProperty extends property {
    _type = "numberProperty";
    items = [];
    constructor(jsonObject) {
        super(jsonObject);
        jsonObject.items.forEach((singularPropertyItem) => this.items.push(new propertyItemNumber(singularPropertyItem)));
    }
    get type() {
        return this._type;
    }
    getItems() {
        return this.items;
    }
}

class device {
    device_name = "";
    device_properties = [];
    constructor(deviceName, jsonObject) {
        this.device_name = deviceName;
    }
    // Private variables getters/setters
    getDeviceName() {
        return this.device_name;
    }
    setDeviceName(newDeviceName) {
        this.device_name = newDeviceName;
    }
    getDeviceProperties() {
        return this.device_properties;
    }
    // Class functions
    handleIncomingProperty(property, propertyType) {
        if (!this.isPropertyAdded(property)) {
            //Ha llegado una nueva Property, introducir en device_properties
            this.addNewProperty(property, propertyType);
        }
        else {
            // Actualizar los datos de la Property ya existente en device_properties
            this.updateExistingProperty(property, propertyType);
        }
    }
    addNewProperty(newProperty, propertyType) {
        let regexSetDef = /(set|def)(.*?)Vector/;
        let match = propertyType.match(regexSetDef);
        if (match) {
            let extractedPropertyType = match[2];
            console.log(extractedPropertyType);
            switch (extractedPropertyType) {
                case "Text":
                    this.device_properties.push(new textProperty(newProperty));
                    break;
                case "Switch":
                    this.device_properties.push(new switchProperty(newProperty));
                    break;
                case "Number":
                    this.device_properties.push(new numberProperty(newProperty));
                    break;
                default:
                    console.log("Unexpected type of property: " + extractedPropertyType);
                    break;
            }
        }
        else {
            console.log("Unexpected type of message. Not Set of Def.");
        }
    }
    updateExistingProperty(modifiedProperty, propertyType) {
        // Obtener el index de la propiedad y reemplazarla con los datos nuevos
        const searchIndex = this.device_properties.findIndex((element) => element.name === modifiedProperty.name);
        let regexSetDef = /(set|def)(.*?)Vector/;
        let match = propertyType.match(regexSetDef);
        if (match) {
            let extractedPropertyType = match[2];
            switch (extractedPropertyType) {
                case "Text":
                    this.device_properties[searchIndex] = new textProperty(modifiedProperty);
                    break;
                case "Switch":
                    // Reemplazar los datos anteriores por un nuevo switchProperty
                    this.device_properties[searchIndex] = new switchProperty(modifiedProperty);
                    break;
                case "Number":
                    // Reemplazar los datos anteriores por un nuevo numberProperty
                    this.device_properties[searchIndex] = new numberProperty(modifiedProperty);
                    break;
                default:
                    console.log("Unexpected type of property: " + extractedPropertyType);
                    break;
            }
        }
    }
    removeProperty(propertyName) {
        console.log("DENTRO DEL DEVICE");
        console.log("Se va a buscar el Property " + propertyName);
        const propertyIndex = this.device_properties.findIndex((element) => element.name === propertyName);
        if (propertyIndex !== -1) {
            console.log("Borrando con un splice");
            this.device_properties.splice(propertyIndex, 1);
        }
        else {
            console.log("Aqui no hay nada");
        }
    }
    getPropertyByName(propertyNameToSearch) {
        const propertyIndex = this.device_properties.findIndex((element) => element.name === propertyNameToSearch);
        return this.device_properties[propertyIndex];
    }
    isPropertyAdded(propertyToSearch) {
        const propertyIndex = this.device_properties.findIndex((element) => element.name === propertyToSearch.name);
        return (propertyIndex !== -1);
    }
    setPropertyToBusy(propertyName) {
        const propertyIndex = this.device_properties.findIndex((element) => element.name === propertyName);
        this.device_properties[propertyIndex].setState(State.Busy);
    }
    getPropertyCount() {
        return this.device_properties.length;
    }
}

class indigoClient {
    port;
    host;
    socket;
    indigoData = [];
    indigoDevices = [];
    observers = [];
    constructor(host, port, guiParent) {
        this.host = host;
        this.port = port;
        this.socket = null;
        if (guiParent) {
            this.observers.push(guiParent);
        }
    }
    // Websocket functionalities
    connect() {
        let socketUrl = `ws://${this.host}:${this.port}`;
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
            this.handleIncomingProperties(jsondata);
        });
    }
    send(message) {
        if (this.socket) {
            console.log('Se va a enviar el mensaje: ', message);
            //let message2 = JSON.stringify(message);
            //this.socket.send(message2);
            this.socket.send(message);
            console.log('Mensaje enviado.');
        }
        else {
            console.log('Socket indefinido.');
        }
    }
    close() {
        if (this.socket) {
            this.socket.close();
        }
    }
    // MESSAGES FROM DEVICE TO CLIENT
    handleIncomingProperties(incomingJsonData) {
        for (const topLevelKey in incomingJsonData) {
            if (topLevelKey == "deleteProperty") {
                console.log("Petición de borrado");
                const objDelete = incomingJsonData[topLevelKey];
                const objDeleteDevice = objDelete["device"];
                const objDeleteName = objDelete["name"];
                const searchIndexDel = this.indigoDevices.findIndex((element) => element.device_name === objDeleteDevice);
                const foundDel = (searchIndexDel !== -1);
                if (foundDel) {
                    console.log("Se borrará el property " + objDeleteName + " en el device " + objDeleteDevice);
                    this.indigoDevices[searchIndexDel].removeProperty(objDeleteName);
                    if (this.indigoDevices[searchIndexDel].getPropertyCount() <= 0) {
                        console.log("Device vacio, lo borramos.");
                        this.indigoDevices.splice(searchIndexDel, 1);
                    }
                }
            }
            if (topLevelKey == "message") {
                console.log("Ha llegado un mensaje");
            }
            if (topLevelKey.startsWith("set") || topLevelKey.startsWith("def")) {
                console.log("Tipo de mensaje recibido: " + String(topLevelKey));
                const obj = incomingJsonData[topLevelKey];
                const objDeviceName = obj["device"];
                const searchIndex = this.indigoDevices.findIndex((element) => element.device_name === objDeviceName);
                const found = (searchIndex !== -1);
                if (!found) {
                    // Ha llegado un nuevo Device, introducir en la variable indigoDevices
                    this.indigoDevices.push(new device(objDeviceName));
                    // Una vez registrado el nuevo dispositivo, añadir la propiedad en este
                    this.indigoDevices[this.indigoDevices.length - 1].handleIncomingProperty(obj, topLevelKey);
                }
                else {
                    // Dispositivo ya registrado, añadir o actualizar la propiedad en este
                    this.indigoDevices[searchIndex].handleIncomingProperty(obj, topLevelKey);
                }
            }
        }
    }
    updateRegisteredProperty(name, key, newValue) {
        const searchIndex = this.indigoData.findIndex((element) => element.name === name);
        const found = (searchIndex != -1);
        if (found && this.indigoData[searchIndex].hasOwnProperty(key)) {
            this.indigoData[searchIndex][key] = newValue;
            console.log("Variable " + key + " updated to new value: " + newValue);
        }
        else {
            console.log("Unable to update the Property.");
        }
    }
    // MESSAGES FROM CLIENT TO DEVICE
    // Sends a message requesting all properties to the INDIGO Server
    sendEnumeratePropertiesMessage(protocolVersion = 512, deviceName, propertyName) {
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
    sendChangePropertyMessage(propertyType, deviceName, propertyName, items) {
        var itemsFormatted = [];
        items.forEach(item => {
            itemsFormatted.push({ "name": item[0], "value": item[1] });
        });
        let messagePropertyType = "";
        let regexSetDef = /(set|def|new)(.*?)Vector/;
        let match = propertyType.match(regexSetDef);
        if (match) {
            messagePropertyType = "new" + String(match[2]) + "Vector";
        }
        var property = { "device": deviceName, "name": propertyName, "items": itemsFormatted };
        var message = { [messagePropertyType]: property };
        this.send(JSON.stringify(message));
    }
    // Sends a defVector message to the INDIGO Server
    // DefVector defines or describes the properties.
    sendDefPropertyMessage(propertyType, deviceName, propertyName, itemName, itemTargetValue) {
        // Set property state to busy locally
        const deviceIndex = this.indigoDevices.findIndex((element) => element.device_name === deviceName);
        this.indigoDevices[deviceIndex].setPropertyToBusy(propertyName);
        // 
        let messagePropertyType = "";
        let regexSetDef = /(set|def|new)(.*?)Vector/;
        let match = propertyType.match(regexSetDef);
        if (match) {
            messagePropertyType = "def" + match[2] + "Vector";
        }
        else {
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
    sendSetPropertyMessage(propertyType, deviceName, propertyName, itemName, itemTargetValue) {
        // Set property state to busy locally
        const deviceIndex = this.indigoDevices.findIndex((element) => element.device_name === deviceName);
        this.indigoDevices[deviceIndex].setPropertyToBusy(propertyName);
        // 
        let messagePropertyType = "";
        let regexSetDef = /(set|def|new)(.*?)Vector/;
        let match = propertyType.match(regexSetDef);
        if (match) {
            messagePropertyType = "set" + match[2] + "Vector";
        }
        else {
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
    sendNewPropertyMessage(propertyType, deviceName, propertyName, itemName, itemTargetValue) {
        // Set property state to busy locally
        const deviceIndex = this.indigoDevices.findIndex((element) => element.device_name === deviceName);
        this.indigoDevices[deviceIndex].setPropertyToBusy(propertyName);
        // 
        let messagePropertyType = "";
        let regexSetDef = /(set|def|new)(.*?)Vector/;
        let match = propertyType.match(regexSetDef);
        if (match) {
            messagePropertyType = "new" + match[2] + "Vector";
        }
        else {
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
    sendChangePropertyPruebas(propertyType, deviceName, propertyName, itemName, itemTargetValue) {
        var items = [{ "name": itemName, "value": itemTargetValue }];
        var property = { "device": deviceName, "name": propertyName, "items": items };
        let messagePropertyType = "";
        let regexSetDef = /(set|def|new)(.*?)Vector/;
        let match = propertyType.match(regexSetDef);
        if (match) {
            messagePropertyType = "def" + String(match[2]) + "Vector";
            console.log("Nos encantan las pruebas. Enviamos: " + messagePropertyType);
        }
        var message = { [messagePropertyType]: property };
        this.send(JSON.stringify(message));
    }
    // Sends new target value of an already existing Property item to INDIGO Server
    //
    sendChangePropertyMessagePruebas(propertyType, deviceName, propertyName, itemName, itemTargetValue) {
        // Set property state to busy locally
        const deviceIndex = this.indigoDevices.findIndex((element) => element.device_name === deviceName);
        this.indigoDevices[deviceIndex].setPropertyToBusy(propertyName);
        let regexSetDef = /(set|def)(.*?)Vector/;
        let match = propertyType.match(regexSetDef);
        if (match) {
            "new" + match[2] + "Vector";
        }
        else {
            return 0;
        }
    }
    // Sends Delete message for a Device to the INDIGO Server
    sendDelPropertyMessage(deviceName, propertyName) {
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
    printFullPropertyForDebug(jsondata) {
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
    printIndigoData() {
        console.log(this.indigoDevices);
        return this.indigoDevices;
    }
    getIndigoDevices() {
        return this.indigoDevices;
    }
}
// ----- EJECUCIÓN DE PRUEBA
/*
const myHost = '127.0.0.1';
const myPort = 7624;

console.log('PRUEBA DE CONEXIÓN');
var socketPrueba = new indigoClient(myHost, myPort);
socketPrueba.connect();
socketPrueba.send('{ "getProperties": { "version": 512, "client": "My Client" } }');
*/

export { indigoClient };
