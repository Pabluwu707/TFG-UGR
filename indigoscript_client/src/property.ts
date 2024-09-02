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
    this.perm = jsonObject.perm;
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

  getState(): any {
    return this.state;
  }

  setState(newState: State): void {
    this.state = newState;
  }
}


class textProperty extends property {
  
  readonly _type: string = "textProperty";
  
  private items: propertyItem[] = [];

  constructor(jsonObject : any) {
    super(jsonObject);

    jsonObject.items.forEach((singularPropertyItem) => 
      this.items.push(new propertyItem(singularPropertyItem))
    );
  }

  get type(): string {
    return this._type;
  }

  getItems(): any {
    return this.items;
  }
}

class switchProperty extends property {
  
  readonly _type: string = "switchProperty";
  
  private rule : string;
  private items: propertyItem[] = [];

  constructor(jsonObject : any) {
    super(jsonObject);
    this.rule = jsonObject.rule;

    jsonObject.items.forEach((singularPropertyItem) => 
      this.items.push(new propertyItem(singularPropertyItem))
    );
    
  }

  get type(): string {
    return this._type;
  }

  getItems(): any {
    return this.items;
  }
}

class numberProperty extends property {
  
  readonly _type: string = "numberProperty";

  private items: propertyItemNumber[] = [];

  constructor(jsonObject : any) {
    super(jsonObject);
    
    jsonObject.items.forEach((singularPropertyItem) => 
      this.items.push(new propertyItemNumber(singularPropertyItem))
    );
    
  }

  get type(): string {
    return this._type;
  }

  getItems(): any {
    return this.items;
  }
}

class lightProperty extends property {
  
  readonly _type: string = "lightProperty";

  private items: propertyItem[] = [];

  constructor(jsonObject : any) {
    super(jsonObject);
    
    jsonObject.items.forEach((singularPropertyItem) => 
      this.items.push(new propertyItemNumber(singularPropertyItem))
    );
    
  }

  get type(): string {
    return this._type;
  }

  getItems(): any {
    return this.items;
  }
}

class blobProperty extends property {
  
  readonly _type: string = "blobProperty";

  private items: propertyItem[] = [];

  constructor(jsonObject : any) {
    super(jsonObject);
    
    jsonObject.items.forEach((singularPropertyItem) => 
      this.items.push(new propertyItem(singularPropertyItem))
    );
    
  }

  get type(): string {
    return this._type;
  }

  getItems(): any {
    return this.items;
  }
}



export { State, Permission, property, textProperty, switchProperty, numberProperty, lightProperty, blobProperty };
