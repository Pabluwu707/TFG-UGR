class propertyItem {
  readonly _name: string;
  readonly _label: string;
  private value: any;

  constructor(name: string, label: string, value = null) {
    this._name = name;
    this._label = label;
    this.value = value;
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

  constructor(name: string, label: string, value = null,
              min: number, max: number, step: number,
              format: string, target: number) {
    super(name, label, value);
    this.min = min;
    this.max = max;
    this.step = step;
    this.format = format;
    this.target = target;
  }
}

export { propertyItem, propertyItemNumber };
