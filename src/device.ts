import { json } from "stream/consumers";
import { State, Permission, property, textProperty, switchProperty, numberProperty } from "./property.js";

class device {
  public device_name: string = "";
  public device_properties: property[] = [];

  constructor(deviceName: string, jsonObject?: any) {
    this.device_name = deviceName
  }

  // Private variables getters/setters
  getDeviceName(): any {
    return this.device_name;
  }

  setDeviceName(newDeviceName: any): void {
    this.device_name = newDeviceName;
  }

  // Class functions
  handleIncomingProperty(property: any, propertyType : string) {

    if ( !this.isPropertyAdded(property) ) {
      //Ha llegado una nueva Property, introducir en device_properties
      this.addNewProperty(property, propertyType);

    } else {
      // Actualizar los datos de la Property ya existente en device_properties
      this.updateExistingProperty(property, propertyType);
    }
  }

  addNewProperty(newProperty: any, propertyType : string): void {
    switch(propertyType) {
      case "defTextVector":
        this.device_properties.push( new textProperty(newProperty) );
        break;
      case "defSwitchVector":
        this.device_properties.push( new switchProperty(newProperty) );
        break;
      case "defNumberVector":
        this.device_properties.push( new numberProperty(newProperty) );
        break;
      default:
        console.log("Unexpected type of property.");
        break;

    }
  }

  updateExistingProperty(modifiedProperty: any, propertyType : string): void {
    // Obtener el index de la propiedad y reemplazarla con los datos nuevos
    const searchIndex = this.device_properties.findIndex((element) => element.name === modifiedProperty.name);

    switch(propertyType) {
      case "defTextVector":
        this.device_properties[searchIndex] = new textProperty(modifiedProperty) ;
        break;
      case "defSwitchVector":
        // Reemplazar los datos anteriores por un nuevo switchProperty
        this.device_properties[searchIndex] =  new switchProperty(modifiedProperty) ;
        break;
      case "defNumberVector":
        // Reemplazar los datos anteriores por un nuevo numberProperty
        this.device_properties[searchIndex] =  new numberProperty(modifiedProperty) ;
        break;
      default:
        console.log("Unexpected type of property.");
        break;

    }
  }

  getPropertyByName(propertyNameToSearch: String): any {
    const propertyIndex = this.device_properties.findIndex((element) => element.name === propertyNameToSearch);
    return this.device_properties[propertyIndex]
  }

  isPropertyAdded(propertyToSearch: any): boolean {
    const propertyIndex = this.device_properties.findIndex((element) => element.name === propertyToSearch.name);
    return (propertyIndex !== -1)
  }

  setPropertyToBusy(propertyName: String): void {
    const propertyIndex = this.device_properties.findIndex((element) => element.name === propertyName);
    this.device_properties[propertyIndex].setState(State.Busy);
  }
}

export { device };
