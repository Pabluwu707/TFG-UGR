
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

## Command Line Property Manipulation Tool: **indigo_prop_tool**

[](https://github.com/indigo-astronomy/indigo/blob/master/indigo_docs/PROPERTY_MANIPULATION.md#command-line-property-manipulation-tool-indigo_prop_tool)

**indigo_prop_tool** is a console based tool that allows users to configure the indigo_server and to set/get item values and get property states and even taking exposures and saving the images. Here is the indigo_prop_tool help:

```
indigo@indigosky:~ $ indigo_prop_tool -h
INDIGO property manipulation tool v.2.0-226 built on Mar  5 2023 23:30:32.
usage: indigo_prop_tool [options] device.property.item=value[;item=value;..]
       indigo_prop_tool set [options] device.property.item=value[;item=value;..]
       indigo_prop_tool set_script [options] agent.property.SCRIPT=filename[;NAME=filename]
       indigo_prop_tool get [options] device.property.item[;item;..]
       indigo_prop_tool get_state [options] device.property
       indigo_prop_tool list [options] [device[.property]]
       indigo_prop_tool list_state [options] [device[.property]]
       indigo_prop_tool discover [options]
set write-only BLOBs:
       indigo_prop_tool set [options] device.property.item=filename[;NAME=filename]
options:
       -h  | --help
       -b  | --save-blobs
       -l  | --use_legacy_blobs
       -e  | --extended-info
       -v  | --enable-log
       -vv | --enable-debug
       -vvv| --enable-trace
       -r  | --remote-server host[:port]   (default: localhost)
       -p  | --port port                   (default: 7624)
       -T  | --token token
       -t  | --time-to-wait seconds        (default: 2)
```

The commands are self-explanatory:

- **set** or no command - set listed property items
- **get** - get listed item values
- **get_state** - get the property state
- **list_state** - list the state of the properties
- **discover** - auto discover and list INDIGO services visible on the network

## Anatomy of the INDIGO client

[](https://github.com/indigo-astronomy/indigo/blob/master/indigo_docs/CLIENT_DEVELOPMENT_BASICS.md#anatomy-of-the-indigo-client)

The indigo client should define several callbacks which will be called by the **bus** on one of the events:

- **attach** - called when client is attached to the **bus**
- **define property** - called when the device broadcasts property definition
- **update property** - called when the device broadcasts property value change
- **delete property** - called when the device broadcasts property removal
- **send message** - called when the device broadcasts a human readable text message
- **detach** - called when client is detached from the **bus**

```bash
// MENSAJE QUE NO FUNCIONA
00:56:08.389522 indigo_server: 19 -> { "setSwitchVector": { "device": "CCD Imager Simulator", "name": "CONNECTION", "state": "Ok", "items": [  { "name": "CONNECTED", "value": true }, { "name": "DISCONNECTED", "value": false } ] } }
// MENSAJE QUE SI FUNCIONA
00:56:15.834954 indigo_server: 18 -> {"newSwitchVector":{"device":"CCD Imager Simulator","name":"CONNECTION","items":[{"name":"CONNECTED","value":true}]}}
00:56:15.835113 indigo_server: B <+ Change 'CCD Imager Simulator'.'CONNECTION' SWITCH UNDEFINED Idle 2.0 0 'WebGUI' {
00:56:15.835124 indigo_server: B <+   'CONNECTED' = On 
00:56:15.835131 indigo_server: B <- }
```

DevicePropertySegment
```typescript

let devicePropertyItems = properties.getItems();

for (let propertyItemId in devicePropertyItems) {

  

let devicePropertyItemRow;

  

switch (properties.constructor.name) {

case "textProperty":

devicePropertyItemRow = this.createPropertyItemTextDOM(device, properties, devicePropertyItems[propertyItemId]);

break;

case "switchProperty":

devicePropertyItemRow = this.createPropertyItemSwitchDOM(device, properties, devicePropertyItems[propertyItemId]);

break;

case "numberProperty":

devicePropertyItemRow = this.createPropertyItemNumberDOM(device, properties, devicePropertyItems[propertyItemId]);

break;

case "blobProperty":

devicePropertyItemRow = this.createPropertyItemBlobDOM(device, properties, devicePropertyItems[propertyItemId]);

break;

default:

devicePropertyItemRow = this.createPropertyItemTextDOM(device, properties, devicePropertyItems[propertyItemId]);

break;

}

devicePropertyRow.appendChild(devicePropertyItemRow);

}
```



- PREFACIO: Introducción y contexto rápido
- INTRODUCCIÓN
	- Gestión de dispositivos astronómicos distribuidos (Descripción general del proyecto)
		- Protocolos:
		- ASCOM
		- INDI
		- INDIGO
	- Critica: dependencia en clientes GUI ya establecidos
	- PROPUESTA
	- Requisitos
	- Conocimientos previos implementados
- Metodología de trabajo
		- Metodología elegida: SCRUM
		- Otras alternativas exploradas
	- Planificación
	- Herramientas utilizadas
	- Historias de usuario
- Implementación
	- Por cada etapa
		- Asignación de historias?
		- Análisis
		- Implementación
		- Pruebas

La principal desventaja de los protocolos anteriormente descritos es su dependencia en un cliente con interfaz gráfica de usuario para la gestión e interpretación de las propiedades del servidor. Si bien estos protocolos ofrecen sus propias implementaciones, el uso de estas herramientas requiere una preparación e instalación previa, lo cual no siempre es posible o conveniente en todas las máquinas. Un ejemplo claro de esto se ve en las herramientas del protocolo ASCOM, cuyo uso está principalmente restringido a sistemas operativos Windows. En una entorno ideal, el cliente sea capaz de poder funcionar independientemente de la plataforma.

Además, en un ámbito como la astronomía se valora mucho las soluciones ligeras y eficientes en su consumo de recursos, dado que la gestión simultánea de múltiples dispositivos distribuidos requiere de un uso optimizado de la memoria y CPU para poder maximizar el tiempo de uso de los dispositivos y su eficiencia durante una sesión de observación en el campo.


El protocolo INDIGO, con su infraestructura optimizada y conexión eficiente es el que mejor se ajusta a las necesidades de este tipo de proyectos. No obstante, a pesar de que su herramienta GUI está disponible en sistema operativos como Linux, MacOS y Windows, sufre del mismo problema, la necesidad de una instalación previa. Esto puede reducir su accesibilidad en dispositivos más ligeros como dispositivos móviles.

INDIGO, con su estructura de mensajes fácilmente interpretable, permite a los usuarios desarrollar sus propios clientes y herramientas a través de código para gestionar el intercambio de mensajes con el servidor, sin tener que depender del software provisto por el equipo de desarrollo. Esto permite al usuario crear soluciones personalizadas que se adapten a las necesidades específicas. Sin embargo la mayor parte de la comunidad de INDIGO se limita al uso del software que provee el protocolo, y las alternativas de código abierto disponibles son pocas y están limitadas a ciertos lenguajes de programación específicos, como Python. Por tanto, recae sobre el usuario la responsabilidad de no solo aprender el funcionamiento del protocolo, sino también adquirir los conocimientos de programación necesarios para poder crear una solución que satisfaga sus necesidades particulares.

  

  
```LaTex
\subsubsection{Requisitos de la interfaz gráfica}

  

Requisitos funcionales de la interfaz gráfica.

  

\begin{enumerate}[label=\textbf{R2.1\arabic*o}, leftmargin=10mm]

  \item La interfaz debe funcionar

\end{enumerate}

  

Requisitos no funcionales de la interfaz gráfica.

  

\begin{enumerate}[label=\textbf{R2.2\arabic*.}, leftmargin=10mm]

  \item La interfaz debe funcionar

\end{enumerate}
```

1.1Establecer conexión 
1.3 Recibir mensajes en tiempo real
Se han declarado variables de clase para almacenar la dirección del host y el puerto al que conectarse, y se ha creado una función connect(), cuya función es generar un objeto WebSocket haciendo uso de los datos almacenados para abrir una conexión con el servidor INDIGO. Una vez establecida la conexión, se declaran una serie de Event Listeners que manejarán todo mensaje que llegue desde esta conexión y permitirán que el cliente reaccione a estos de manera asíncrona. 

1.2 Enviar mensajes en formato JSON
Aprovechando la conexión WebSocket creada, se añade una función send(message) que permite el envió de mensajes a través del socket si este está definido. El envío es asíncrono, y la clase podrá seguir funcionando sin tener que interrumpir su ejecución en espera de una respuesta. En caso de recibir una, será captada por los Event Listeners establecidos.

1.8 Solicitar información de una Propiedad
1.9 Solicitar información de todas las Propiedades de un servidor
Haciendo uso de las funciones de conexión con WebSocket recién declaradas, se añade la función sendGetPropertiesMessage(protocolVersion, deviceName? string, propertyName?: string). Esta función toma como parámetros opcionales el nombre de una propiedad específica y el del dispositivo al que pertenece, y construye y envia un mensaje 'getProperties' para solicitar las propiedades según estos parámetros. Esto nos permite solicitar todas las Propiedades del Servidor, las asociadas a un Dispositivo específico, o los datos concretos de una Propiedad en particular.

1.5 Almacenamiento de Propiedades en estructura de datos
Para el almacenamiento  de los datos correspondientes a los diferentes tipos de propiedades que se pueden recibir a través de los mensajes, se ha diseñado una estructura de datos basada en el principio de herencia de clases en una estructura basada en programación orientada a objetos.

Se ha implementado una clase genérica denominada Property(), con los datos principales de una propiedad como variables. A partir de esta clase genérica, se han derivado cinco clases especializadas: TextProperty(), NumberProperty(), SwitchProperty(), LightProperty(), y BlobProperty(), cada una correspondiente a un tipo específico de propiedad en el sistema INDIGO. Esto nos permite definir parámetros y funciones específicas para cada tipo de propiedad, eliminando redundancias en el código.

Adicionalmente, se ha creado la clase PropertyItem(), encargada de almacenar el nombre y valor de un ítem dentro de una propiedad. Esta clase también se extiende en la subclase PropertyItemNumber(), utilizada específicamente en las propiedades del tipo NumberProperty() y que permite registrar los valores adicionales de este tipo de ítems.

Todas las clase definidas en esta estructura poseen un constructor que permite su creación a partir de un objeto en formato JSON. Con esta estructura declarada, en cuanto se reciba un mensaje del servidor con nuevas propiedades no tenemos más que invocar el constructor correspondiente y almacenarlo en la variable de clase indigoPorperties[], que actuará como contenedor para todas las propiedades gestionadas por el cliente.