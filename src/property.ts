import { json } from "stream/consumers";
import { propertyItem, propertyItemNumber } from "./propertyItem.js";

enum State {
  Idle,
  Ok,
  Busy,
  Alert
}

enum Permission {
  ro,
  wo,
  rw
}

class property {
  readonly _name: string;
  readonly _label: string;

  private group: string;
  private device: string;
  private version: number;

  private state: State;
  private perm: Permission;

  
  constructor(jsonObject: any) {
    this._name = jsonObject.name;
    this._label = jsonObject.label;

    this.group = jsonObject.group;
    this.device = jsonObject.device;
    this.version = jsonObject.version;

    this.state = jsonObject.state;
    this.perm = jsonObject.permission;
  }

  // Readonly getters
  get name(): string {
    return this._name;
  }

  get label(): string {
    return this._label;
  }

  
  // Private variables getters/setters
  getGroup(): any {
    return this.group;
  }

  setGroup(newGroup: any): void {
    this.group = newGroup;
  }

  getDevice(): any {
    return this.device;
  }

  setDevice(newDevice: any): void {
    this.device = newDevice;
  }
}


class textProperty extends property {
  
  private items: propertyItem[] = [];

  constructor(jsonObject : any) {
    super(jsonObject);

    jsonObject.items.forEach((singularPropertyItem) => 
      this.items.push(new propertyItem(singularPropertyItem))
    );
  }
}

class switchProperty extends property {
  
  private rule : string;
  private items: propertyItem[] = [];

  constructor(jsonObject : any) {
    super(jsonObject);
    this.rule = jsonObject.rule;

    jsonObject.items.forEach((singularPropertyItem) => 
      this.items.push(new propertyItem(singularPropertyItem))
    );
    
  }
}

class numberProperty extends property {

  private items: propertyItemNumber[] = [];

  constructor(jsonObject : any) {
    super(jsonObject);
    
    jsonObject.items.forEach((singularPropertyItem) => 
      this.items.push(new propertyItemNumber(singularPropertyItem))
    );
    
  }
}

export { State, Permission, property, textProperty, switchProperty, numberProperty };
