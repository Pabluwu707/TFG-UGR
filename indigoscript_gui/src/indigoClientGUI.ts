//import { indigoClient } from "./indigoClient.js"; 
import { indigoClient } from "./indigoClient.es.js"

var style_number = {
  
}

class indigoClientGUI {
  public client: indigoClient;
  private parentElement : any;
  private baseTable : any;
  private contador : number = 1;

  constructor(host: any, port: any) {
    this.setupClient(host, port, this);
    this.parentElement = document.querySelector(".indigoscriptgui");
  }

  notifyChange(): void {
    console.log("THERE IS A CHANGE IN THE CLIENT");
    this.createBaseTable();
  }

  setupClient(host: String, port: String, guiParent: any): void {
    this.client = new indigoClient(host, port, guiParent);
    this.client.connect();
  }

  contadorPrueba(): void {
    let elem = document.createElement("table");
    elem.innerText = "Contador: " + String(this.contador);
    this.contador++;
    this.parentElement.appendChild(elem);
  }

  createBaseTable(): void {
    let baseTable = document.createElement("div");
    baseTable.id = "indigoscriptgui";
    this.baseTable = baseTable;
    if (this.parentElement.hasChildNodes()) {
      this.parentElement.innerHTML = '';
    }
    this.parentElement.appendChild(baseTable);
    this.createDevices();
  }

  createDevices(): void {
    let devices = this.getIndigoDevices();
    for (let deviceId in devices) {
      let deviceTable = document.createElement("div");
      deviceTable.id = "indigogui-" + devices[deviceId].getDeviceName();
      deviceTable.style.border = '1px solid black';
      deviceTable.style.margin = '20px 0px';


      //TO-DO: Meter la creación de la headerRow en una subfunción para limpiar esto un poco?
      let headerRow = document.createElement("div");
      headerRow.innerHTML = "DEVICE: " + devices[deviceId].getDeviceName();
      headerRow.innerText = "DEVICE: " + devices[deviceId].getDeviceName();
      headerRow.id = "indigogui-" + devices[deviceId].getDeviceName() + "-header";
      headerRow.style.border = '1px solid black';
      headerRow.style.padding = '3px';
      deviceTable.appendChild(headerRow);

      //TO-DO: Meter la creación de la contentRow en una subfunción para limpiar esto un poco?
      let contentRow = document.createElement("div");
      contentRow.style.border = '1px solid black';
      contentRow.style.padding = '3px';

      let deviceProperties = devices[deviceId].device_properties; 
      for (let propertyId in deviceProperties) {
        //TO-DO: Solo displayea el nombre de la Property, displayear todos los datos del Propert
        /*let devicePropertyRow = document.createElement("div");
        devicePropertyRow.innerText = ("PROPIEDAD: " + deviceProperties[propertyId].name + "\n- Tipo: " + deviceProperties[propertyId].constructor.name);
        devicePropertyRow.id = "indigogui-" + devices[deviceId].getDeviceName() + "-" + deviceProperties[propertyId].name;
        contentRow.appendChild(devicePropertyRow);
        */
        
        let devicePropertyRow = this.createPropertyDOM(devices[deviceId], deviceProperties[propertyId]);
        contentRow.appendChild(devicePropertyRow);
      }
      deviceTable.appendChild(contentRow);


      this.baseTable.appendChild(deviceTable);

      //this.createProperties(devices[deviceId]);
    }
  }

  createPropertyDOM(device: any, properties: any): any {

    let devicePropertyDiv = document.createElement("div");
    devicePropertyDiv.id = "indigogui-" + device.getDeviceName() + "-" + properties.name;
    devicePropertyDiv.className = "indigoproperty";

    let devicePropertyTitle = document.createElement("div");
    devicePropertyTitle.id = "indigogui-" + device.getDeviceName() + "-" + properties.name + "-title";
    devicePropertyTitle.innerText = ("PROPIEDAD: " + properties.name + " - (" + properties.constructor.name + ")");
    devicePropertyTitle.className = "indigopropertytitulo";
    devicePropertyDiv.appendChild(devicePropertyTitle);

    let devicePropertyItemDiv = document.createElement("div")
    devicePropertyItemDiv.id = "indigogui-" + device.getDeviceName() + "-" + properties.name + "-items";
    devicePropertyItemDiv.className = "indigopropertyitems";
    let rawPropertyItem;
    switch (properties.constructor.name) {
      case "textProperty":
        rawPropertyItem = properties.getItems();
        for (let propertyItemId in rawPropertyItem) {
          let devicePropertyItemRow;
          devicePropertyItemRow = this.createPropertyItemTextDOM(device, properties, rawPropertyItem[propertyItemId]);

          devicePropertyItemDiv.appendChild(devicePropertyItemRow);
        }
        break;

      case "switchProperty":
        rawPropertyItem = properties.getItems();
          for (let propertyItemId in rawPropertyItem) {
            let devicePropertyItemRow;
            devicePropertyItemRow = this.createPropertyItemSwitchDOM(device, properties, rawPropertyItem[propertyItemId]);
          
            devicePropertyItemDiv.appendChild(devicePropertyItemRow);
          }
        break;

      case "numberProperty":
        rawPropertyItem = properties.getItems();
        for (let propertyItemId in rawPropertyItem) {
          let devicePropertyItemRow;
          devicePropertyItemRow = this.createPropertyItemNumberDOM(device, properties, rawPropertyItem[propertyItemId]);
        
          devicePropertyItemDiv.appendChild(devicePropertyItemRow);
        }
        break;

      case "blobProperty":
        rawPropertyItem = properties.getItems();
        for (let propertyItemId in rawPropertyItem) {
          let devicePropertyItemRow;
          devicePropertyItemRow = this.createPropertyItemBlobDOM(device, properties, rawPropertyItem[propertyItemId]);
        
          devicePropertyItemDiv.appendChild(devicePropertyItemRow);
        }
        break;

      default:
        rawPropertyItem = properties.getItems();
        for (let propertyItemId in rawPropertyItem) {
          let devicePropertyItemRow;
          devicePropertyItemRow = this.createPropertyItemTextDOM(device, properties, rawPropertyItem[propertyItemId]);

          devicePropertyItemDiv.appendChild(devicePropertyItemRow);
        }
        break;
    }
    devicePropertyDiv.appendChild(devicePropertyItemDiv)

    if(properties.perm != "ro") {
      if(properties.constructor.name == "textProperty" || properties.constructor.name == "numberProperty") {

        let devicePropertyButton = document.createElement("button")
        devicePropertyButton.type = "button";
        devicePropertyButton.innerText = ("Update");
        devicePropertyButton.id = "indigogui-" + device.getDeviceName() + "-" + properties.name + "-button";
        devicePropertyButton.addEventListener('click', () => {
            this.updateTextProperty(devicePropertyDiv.id);
        })

        devicePropertyDiv.appendChild(devicePropertyButton);
      }
    }

    return devicePropertyDiv;
  }

  createPropertyItemTextDOM(device: any, properties: any, item: any): any {
    let devicePropertyRow = document.createElement("div");
    //devicePropertyRow.innerText = ("--- " + item.name + ": " + item.getValue());
    devicePropertyRow.id = "indigogui-" + device.getDeviceName() + "-" + properties.name + "-" + item.name;

    let devicePropertyRowInput = document.createElement("input");
    devicePropertyRowInput.id = "indigogui-" + device.getDeviceName() + "-" + properties.name + "-" + item.name + "-input";
    devicePropertyRowInput.name = item.name;
    devicePropertyRowInput.value = item.value;
    
    switch(properties.perm) {
      case "ro":
        devicePropertyRowInput.readOnly = true;
        break;
      case "wo":
        devicePropertyRowInput.readOnly = false;
        devicePropertyRowInput.type = "password";
        break;
      default:
        //Read and write, leave the input as is
        devicePropertyRowInput.readOnly = false;
        break;
    }

    let devicePropertyRowLabel = document.createElement("label")
    devicePropertyRowLabel.id = "indigogui-" + device.getDeviceName() + "-" + properties.name + "-" + item.name + "-label";
    devicePropertyRowLabel.htmlFor = devicePropertyRowInput.id
    devicePropertyRowLabel.innerText = item.name

    devicePropertyRow.append(devicePropertyRowLabel)
    devicePropertyRow.append(devicePropertyRowInput)
    return devicePropertyRow;
  }

  createPropertyItemSwitchDOM(device: any, properties: any, item: any): any {
    let devicePropertyRow = document.createElement("div");
    //devicePropertyRow.innerText = ("--- " + item.name + ": " + item.getValue());
    devicePropertyRow.id = "indigogui-" + device.getDeviceName() + "-" + properties.name + "-" + item.name;
    devicePropertyRow.className = "indigobutton"

    let devicePropertyRowLabel = document.createElement("label")
    devicePropertyRowLabel.id = "indigogui-" + device.getDeviceName() + "-" + properties.name + "-" + item.name + "-label";
    //devicePropertyRowLabel.htmlFor = devicePropertyRowInput.id
    //devicePropertyRowLabel.innerText = item.name
    
    let devicePropertyRowInput = document.createElement("input")
    devicePropertyRowInput.id = "indigogui-" + device.getDeviceName() + "-" + properties.name + "-" + item.name + "-input";
    devicePropertyRowInput.name = item.name
    devicePropertyRowInput.type = "checkbox"
    if(item.value == true) {
      devicePropertyRowInput.checked = true; 
    } else {
      devicePropertyRowInput.checked = false; 
    }
    devicePropertyRowInput.addEventListener('click', () => {
      this.updateSwitchProperty(("indigogui-" + device.getDeviceName() + "-" + properties.name + "-items"), 
                                ("indigogui-" + device.getDeviceName() + "-" + properties.name + "-" + item.name + "-input"));
    })

    let devicePropertyRowSpan = document.createElement("span")
    devicePropertyRowSpan.id = "indigogui-" + device.getDeviceName() + "-" + properties.name + "-" + item.name + "-span";
    devicePropertyRowSpan.textContent = item.name

    devicePropertyRowLabel.append(devicePropertyRowInput)
    devicePropertyRowLabel.append(devicePropertyRowSpan)
    devicePropertyRow.append(devicePropertyRowLabel)
    
    /*
    let devicePropertyItemButton = document.createElement("button")
    devicePropertyItemButton.type = "button";
    devicePropertyItemButton.innerText = item.name;
    devicePropertyItemButton.id = "indigogui-" + device.getDeviceName() + "-" + properties.name + "-" + item.name;
    devicePropertyItemButton.addEventListener('click', () => {
        this.updateSwitchProperty(devicePropertyRow.id, item.name);
    })
    devicePropertyRow.append(devicePropertyItemButton)
    */
    return devicePropertyRow;
  }

  createPropertyItemNumberDOM(device: any, properties: any, item: any): any {
    let devicePropertyRow = document.createElement("div");
    //devicePropertyRow.innerText = ("--- " + item.name + ": " + item.getValue());
    devicePropertyRow.id = "indigogui-" + device.getDeviceName() + "-" + properties.name + "-" + item.name;

    let devicePropertyRowInput = document.createElement("input")
    devicePropertyRowInput.id = "indigogui-" + device.getDeviceName() + "-" + properties.name + "-" + item.name + "-input";
    devicePropertyRowInput.value = item.value

    let devicePropertyRowLabel = document.createElement("label")
    devicePropertyRowLabel.id = "indigogui-" + device.getDeviceName() + "-" + properties.name + "-" + item.name + "-label";
    devicePropertyRowLabel.htmlFor = devicePropertyRowInput.id
    devicePropertyRowLabel.innerText = item.name

    devicePropertyRow.append(devicePropertyRowLabel)
    devicePropertyRow.append(devicePropertyRowInput)
    return devicePropertyRow;
  }

  createPropertyItemBlobDOM(device: any, properties: any, item: any): any {
    let devicePropertyRow = document.createElement("div");
    //devicePropertyRow.innerText = ("--- " + item.name + ": " + item.getValue());
    devicePropertyRow.id = "indigogui-" + device.getDeviceName() + "-" + properties.name + "-" + item.name;

    let blob = new Blob(item.value, {type: 'image/png'});
    let blobUrl = URL.createObjectURL(blob)
    let devicePropertyRowBlob = document.createElement("img")
    devicePropertyRowBlob.id = "indigogui-" + device.getDeviceName() + "-" + properties.name + "-" + item.name + "-input";
    devicePropertyRowBlob.src = blobUrl

    let devicePropertyRowLabel = document.createElement("label")
    devicePropertyRowLabel.id = "indigogui-" + device.getDeviceName() + "-" + properties.name + "-" + item.name + "-label";
    devicePropertyRowLabel.htmlFor = devicePropertyRowBlob.id
    devicePropertyRowLabel.innerText = item.name

    devicePropertyRow.append(devicePropertyRowLabel)
    devicePropertyRow.append(devicePropertyRowBlob)
    return devicePropertyRow;
  }

  createPropertyItemLightDOM(device: any, properties: any, item: any): any {
    //TO-DO: Imprimir diferentes valores según el tipo de propiedad 
    //      (los Numberproperty imprimen min, max... mientras quelos otros solo imprimen name y value)
    let devicePropertyRow = document.createElement("div");
    //devicePropertyRow.innerText = ("--- " + item.name + ": " + item.getValue());
    devicePropertyRow.id = "indigogui-" + device.getDeviceName() + "-" + properties.name + "-" + item.name;

    let devicePropertyRowInput = document.createElement("input")
    devicePropertyRowInput.id = "indigogui-" + device.getDeviceName() + "-" + properties.name + "-" + item.name + "-input"
    devicePropertyRowInput.type = "checkbox"
    if(item.value == true) {
      devicePropertyRowInput.checked = true; 
    } else {
      devicePropertyRowInput.checked = false; 
    }

    let devicePropertyRowLabel = document.createElement("label")
    devicePropertyRowLabel.id = "indigogui-" + device.getDeviceName() + "-" + properties.name + "-" + item.name + "-label"
    devicePropertyRowLabel.htmlFor = devicePropertyRowInput.id
    devicePropertyRowLabel.innerText = item.name

    devicePropertyRow.append(devicePropertyRowLabel)
    devicePropertyRow.append(devicePropertyRowInput)
    return devicePropertyRow;
  }

  updateTextProperty(propertyId: string): any {
    // GET NEW ATTRIBUTES FROM HTML USING PROPERTYID
    let propertyItemFromHTML = <HTMLInputElement>document.getElementById(propertyId);
    if(!propertyItemFromHTML) {
      throw new Error('Property not found');
    }
    console.log(propertyItemFromHTML.id)

    let variables = propertyItemFromHTML.id.split(/-/);
    let deviceName = variables[1]
    let propertyName = variables[2]
    let items:any[] = []

    const inputs = propertyItemFromHTML.querySelectorAll<HTMLInputElement>('input');
    inputs.forEach(input => {
      console.log(input)
      let itemPair:any[]  = []
      itemPair.push(input.name)
      itemPair.push(input.value)
      items.push(itemPair)
    })
    console.log(items)

    // SEND NEW ATTRIBUTES THROUGH CLIENT
    this.client.sendChangePropertyMessage("newStringVector", deviceName, propertyName, items)
  }

  updateSwitchProperty(propertyId: string, buttonSelectedId: string) {
    let propertyItemFromHTML = <HTMLInputElement>document.getElementById(propertyId);
    if(!propertyItemFromHTML) {
      throw new Error('Property not found');
    }

    let variables = propertyItemFromHTML.id.split(/-/);
    let deviceName = variables[1]
    let propertyName = variables[2]
    let items:any[] = []

    const buttons = propertyItemFromHTML.querySelectorAll<HTMLInputElement>('input');
    buttons.forEach(button => {
      if (button.id == buttonSelectedId) {
        let itemPair:any[]  = [];
        itemPair.push(button.name)
        itemPair.push(true)
        items.push(itemPair)

        button.checked = true
        button.disabled = true
      } else {
        if(button.checked) {
          let itemPair:any[]  = [];
          itemPair.push(button.name)
          itemPair.push(false)
          items.push(itemPair)
          button.checked = false
          button.removeAttribute("disabled")
        }
      }
    })
    console.log(items)

    // SEND NEW ATTRIBUTES THROUGH CLIENT
    this.client.sendChangePropertyMessage("newSwitchVector", deviceName, propertyName, items)
  }

  // IndigoClient library interactions
  getIndigoDevices(): any {
    return this.client.printIndigoData();
  }

  sendEnumeratePropertiesMessage(): void {
    this.client.sendEnumeratePropertiesMessage()
  }

  sendCustomMessage(message: String): void {
    this.client.send(message);
  }

  updatePropertyItem(): void {
    var propertyType
    var deviceName
    var propertyName
    var itemName
    var itemTargetValue
    this.client.sendChangePropertyMessage(propertyType, deviceName, propertyName, itemName, itemTargetValue);
  }
}

export { indigoClientGUI };