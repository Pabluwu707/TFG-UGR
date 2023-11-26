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

  
  constructor(name: string, label: string, 
              group: string, device: string, version: number, 
              state: State, permission: Permission) {
    this._name = name;
    this._label = label;

    this.group = group;
    this.device = device;
    this.version = version;

    this.state = state;
    this.perm = permission;
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
    super(jsonObject.name, jsonObject.label, 
          jsonObject.group, jsonObject.device, 
          jsonObject.version, jsonObject.state, 
          jsonObject.perm);
    //TODO: Parsear propertyItems
  }
}

class switchProperty extends property {
  
  private rule : string;
  private items: propertyItem[] = [];

  constructor(jsonObject : any) {
    super(jsonObject.name, jsonObject.label, 
          jsonObject.group, jsonObject.device, 
          jsonObject.version, jsonObject.state, 
          jsonObject.perm);
    this.rule = jsonObject.rule;
    //TODO: Parsear propertyItems
    
  }
}

class numberProperty extends property {

  private items: propertyItemNumber[] = [];

  constructor(jsonObject : any) {
    super(jsonObject.name, jsonObject.label, 
          jsonObject.group, jsonObject.device, 
          jsonObject.version, jsonObject.state, 
          jsonObject.perm);
    //TODO: Parsear propertyItemNumbers
    
  }
}

export { State, Permission, property, textProperty, switchProperty, numberProperty };
