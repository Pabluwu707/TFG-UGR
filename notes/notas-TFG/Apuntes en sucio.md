
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


Equivalencia entre mensajes XML a JSON
```
<newNumberVector device="Mount" name="EQUATORIALJ2000_COORD">
<oneNumber name="RA" >10:20:30</oneNumber>
<oneNumber name="Dec">40:50:60</oneNumber>
</newNumberVector>

('{ "getProperties": { "version": 512, "client": "My Client" } }') 

('{ "defTextVector": { "version": 512, "device": "Server", "name": "LOAD", "group": "Main", "label": "Load driver", "perm": "rw", "state": "Idle", "items": [  { "name": "DRIVER", "label": "Load driver", "value": "" } ] } }') 



<newNumberVector device='CCD Imager Simulator' name='CCD_EXPOSURE' token='FA0012'>
	<oneNumber name='EXPOSURE'>1</defNumber>
</newNumberVector>

  vvvvvv

('{ &quot;newNumberVector&quot;: { &quot;device&quot;: &quot;deviceName!!&quot;, &quot;name&quot;: &quot;propertyName!!&quot;, &quot;items&quot;:[{&quot;name&quot;:&quot;itemName!!!!&quot;,&quot;value&quot;:valueValue!!!!}]}}')
```
