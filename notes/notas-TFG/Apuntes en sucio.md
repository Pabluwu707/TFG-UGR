
Constructor del textProperty
```typescript

constructor(name: string, label: string,
group: string, device: string, version: number,
state: State, permission: Permission) {

super(name, label, group, device, version, state, permission);

}
```

Constructor del switchProperty
```typescript

constructor(name: string, label: string,
group: string, device: string, version: number,
state: State, permission: Permission,
rule: string) {

super(name, label, group, device, version, state, permission);
this.rule = rule;

}
```

Constructor del numberProperty
```typescript

constructor(name: string, label: string,
group: string, device: string, version: number,
state: State, permission: Permission) {

super(name, label, group, device, version, state, permission);

}
```