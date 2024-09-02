class propertyItem {
  readonly _name: string;
  readonly _label: string;
  private value: any;

  constructor(jsonObject: any) {
    this._name = jsonObject.name;
    this._label = jsonObject.label;
    this.value = jsonObject.value;
  }

  // Readonly getters
  get name(): string {
    return this._name;
  }

  get label(): string {
    return this._label;
  }

  // Private variables getters/setters
  getValue(): any {
    return this.value;
  }

  setValue(newValue: any): void {
    this.value = newValue;
  }
}

class propertyItemNumber extends propertyItem {
  private min : number;
  private max : number;
  private step : number;
  private format : string;
  private target : number;

  constructor(jsonObject: any) {
    super(jsonObject);
    this.min = jsonObject.min;
    this.max = jsonObject.max;
    this.step = jsonObject.step;
    this.format = jsonObject.format;
    this.target = jsonObject.target;
  }
}

export { propertyItem, propertyItemNumber };
