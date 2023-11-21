-----

### IDEAS POR EXPLORAR
- [x] INDI Whitepaper - "INDI: Instrument-Neutral Distributed Interface"
- [x] INDI Library: ¿qué es? Información
- [x] Instalación de INDI Library
- [ ] Comparativas de INDI con INDIGO. Buscar otras alternativas.
- [x] Instalación de INDIGO en Arch Linux
- [x] Instalación y descarga con apt-get de INDIGO. Descargas en Linux vs en Arch.
- [ ] POSIBLES REQUISITOS DEL PROYECTO225
- [ ] Sobre la biblioteca en Javascript

-----

### INDI Whitepaper - "INDI: Instrument-Neutral Distributed Interface"

	Pensamientos iniciales: A continuación un resumen del paper de INDI en el que se explica el protocolo a grandes rasgos, sus aplicaciones y ejemplos de uso. 

[Enlace al paper](http://www.clearskyinstitute.com/INDI/INDI.pdf)

Indi ofrece un protocolo de comunicación **basado en XML** para controlar remotamente distintos dispositivos de manera interactiva. En INDI, todas las comunicaciones, comandos y funciones se realizan a través de **Propiedades**, vectores de uno o más variables con nombre a través de las cuales se pueden controlar los parámetros del dispositivo.

Un **Cliente INDI** se conecta a un **Dispositivo INDI**, solicita a través de una query su conjunto de Propiedades, y una vez las conoce puede enviar Peticiones para modificar esas Propiedades y transmitir esos cambios al Dispositivo. El Cliente puede automatizar cambios de manera automatizada o implementar interfaces para que un usuario las cambie manualmente, o también puede monitorizar las Propiedades del Dispositivos en tiempo real sin llegar a cambiarlas por su cuenta.

El **esquema** más básico de una **arquitectura INDI** es la de un cliente básico que a través de los protocolos INDI se comunica con un dispositivo compatible, pero es posible añadir un servidor INDI conectado al cliente que recoja y gestione una cantidad múltiple de dispositivos al mismo tiempo.


Sobre las Propiedades. Las Propiedades son vectores de una o más variables. Se recogen los siguientes tipos:
- Text
- Number
- Switch (booleanos)
- Lights (Idle/OK/Busy/Alert)
- BLOB (arbitrary binary large objects such as images)

Cada Propiedad tiene un **nombre** y **etiqueta**. Dentro de cada vector Propiedad, cada elemento también tiene un nombre y etiqueta. Se puede configurar los Permisos de todas los elementos de una propiedad excepto las Lights. Se aconseja desde la documentación que se permita la modificación de las variables Read-only incluso aunque estén marcadas como tal, siempre que se indique adecuadamente en la GUI que deberían de ser cambios hechos con cuidado.

A la hora de enviar y recibir mensajes utilizaremos **XML**. Específicamente, definiremos la estructura de vectores y elementos de un vector a través de **DTD (Document Type Definition)**. A continuación un gracioso ejemplo en el que se define un vector de Text con uno o más elementos dentro. Notar que en el mismo Vector se definen los atributos de este: el Dispositivo del que estamos tomando datos, nombre y etiqueta, estado actual, permisos... Debajo, se definen uno a uno los elementos del vector con su contenido, y como atributos su nombre y etiqueta.

```dtd
# Define a property that holds one or more text elements.  
<!ELEMENT defTextVector (defText+) >  
<!ATTLIST defTextVector 
	device %nameValue; #REQUIRED name of Device  
	name %nameValue; #REQUIRED name of Property  
	label %labelValue; #IMPLIED GUI label, use name by default  
	group %groupTag; #IMPLIED Property group membership, blank by default  
	state %propertyState; #REQUIRED current state of Property  
	perm %propertyPerm; #REQUIRED ostensible Client controlability  
	timeout %numberValue; #IMPLIED worse-case time to affect, 0 default, N/A for ro  
	timestamp %timeValue #IMPLIED moment when these data were valid  
	message %textValue #IMPLIED commentary  
>

# Define one member of a text vector  
<!ELEMENT defText %textValue >  
<!ATTLIST defText  
	name %nameValue; #REQUIRED name of this text element  
	label %labelValue; #IMPLIED GUI label, or use name by default  
>
```

Veamos un ejemplo aplicando esto. Un Dispositivo informa al Cliente que que existe una Propiedad con un valor numérico. Este valor tiene un rango válido de -100 a 100, en pasos de 10, con un valor incial de 50.

```xml
Define a read-write numeric field whose valid range is -100 to +100 in steps of 10, with initial value 50:  
<defNumberVector device="OTA" name="Focus" state="Idle" perm="rw" timeout="50"  
label="Focus position, μM">
	<defNumber name="Focus" label="" format="%4.0f" min="-100" max="100" step="10">50</defNumber>  
</defNumberVector>
```


Dado que la **comunicación entre Cliente y Dispositivo(s)** se hace **a través de mensajes XML básicos**, se puede utilizar **cualquier mecanismo de transporte que permita transferir secuencias de bytes**. Se pueden usar sockets TCP, sockets UNIX, fifos... o se pueden utilizar frameworks de mayor nivel como P2P, JXTA, Jabber... *Habrá que estudiar la manera en la que montaremos la comunicación entre la biblioteca de Java y nuestro Dispositivo de prueba, pero (sin saber yo mucho actualmente) lo más probable es que apuntemos a algo más simple como TCP.*

El paper tambien habla sobre diferentes esquemas aparte del básico de conexiones Cliente-Servidor, planteando la posibilidad de crear varios Servidores que se comuniquen entre sí para más capacidad de multiprocesamiento. También plantea la posibilidad de desplegar varios Clientes sincronizados entre sí a tiempo real gracias a un servidor que los conecta.

Lo último y más interesante del paper son los diversos ejemplos que ofrece de mensajes enviados por el protocolo. Servirán de apoyo para ver como funciona el programa.

**Esto no es un resumen extensivo del paper, se han obviado algunas partes de este. Ante cualquier duda, directo a este.**
[Enlace al paper](http://www.clearskyinstitute.com/INDI/INDI.pdf)


-----

### INDI Library: ¿qué es? Información.

El anterior paper define el protocolo de envío y recepción de mensajes INDI a grandes rasgos, pero ahora vamos a ver un uso aplicado del protocolo con INDI Library.

INDI Library recopila una serie de programas diseñados para el control de equipamiento astronómico (como por ejemplo, telescopios, cámaras, cúpulas...). Toma como base el Protocolo INDI e implementa los programas necesarios para controlar los parámetros de los dispositivos que queramos.

Específicamente, interesa señalar que INDI Library ofrece, además de Server y Cliente (como se proponía en el paper del protocolo INDI), la implementacion de **Drivers**, software diseñado para controlar un dispositivo y gestionar la comunicación entre Server INDI y Dispositivo.

|  |  |
|-|-|
| **INDI Server** | Un dispositivo que actua a modo de hub y conecta clientes con drivers. Trata cada cliente o dispositivo conectado como un nodo y permite el control y reentutamiento de tráfico según las necesidades del desarrollador. |
| **INDI Clients** | Frontend que se conecta con dispositivos de forma directa a través de Drivers, o a través de Servidores. Hay muchos tipos:<br>- Los que más nos interesan son los Clientes GUI como KStars, jINDI, o Xephem. Implementan una interfaz gráfica en forma de panel de control que permite monitorizar y ajustar los parametros de los dispositivos conectados. **Nuestro proyecto se asemejará a estos.**<br>- Clientes para smart phone y tablet, como KStars Lite, IPARCOS, Telescope.Touch..<br>- Clientes de registro dedicados expresamente a registrar mensajes, alarmas, y datos intercambiados entre dispositivos.<br>- ETC...|
| **INDI Drivers** | Los drivers son el software que se comunica con los dispositivos. Son diseñados expresamente para un tipo de dispositivos o para uno en específico, conoce sus propiedades y sus valores parametrizables, y se encarga de tanto controlarlas en el dispositivo como de comunicarlas a los clientes. INDI Library se centra en recopilar una serie de Drivers compatibles con toda clase de dispositivos para poder conectarlos a nuestro cliente. |


-----

### Instalación de INDI Library

	A continuación se comparte un extracto de la página web de INDI Lib, donde se explica el proceso para instalar INDI Lib en una máquina Ubuntu Linux.

Para instalar INDI y KStars en sistemas basados en Debian (en este caso, Ubuntu) basta con descargar los siguientes paquetes y sus respectivas dependencias con apt-get. (También añadir el repo si no se había hecho antes.)
```
sudo apt-add-repository ppa:mutlaqja/ppa
sudo apt install indi-full
sudo apt install kstars-bleeding
```


También se comparte el proceso para instalar en Arch Linux

> 1. Install INDI & KStars

`sudo pacman -Syu`  
`sudo pacman -S --needed kstars breeze-icons yaourt binutils patch cmake make libraw libindi gpsd gcc`  
`yaourt -Sya --noconfirm libindi_3rdparty`

> 2. Astrometry.net

`yaourt -Sya sextractor-bin`  
`yaourt -Sya astrometry.net`

> Determine what Index files you require and then download them. Or you can use KStars to download them for you.

`wget broiler.astrometry.net/~dstn/4100/index-4107.fits`
`wget broiler.astrometry.net/~dstn/4100/index-4108.fits`
`wget broiler.astrometry.net/~dstn/4100/index-4109.fits
`sudo mv index-410[789].fits /usr/share/astrometry/data`

-----

### Comparativas de INDI con INDIGO. 

Comparativa de las diferencias en GitHub: https://github.com/indigo-astronomy/indigo/blob/master/indigo_docs/INDI-COMPARISON.md

Más información escrita en el FAQ de INDIGO: https://www.indigo-astronomy.org/faq.html

-----

### Instalación de INDIGO en Arch Linux

Los comandos a ejecutar para compilar INDIGO en mi máquina de EndeavourOS Archlinux han sido los siguientes:

```
yay patchelf 
git clone https://github.com/indigo-astronomy/indigo.git 
cd indigo 
make all 
build/bin/indigo_server -v 
indigo_ccd_simulator [other drivers]
```

No he creado un script shell para que se haga automáticamente porque me daba pereza, pero sería tal cual guardar el código en un archivo con extensión .sh y luego ejecuta el comando sh en la terminal.


-----

### Instalación y descarga con apt-get de INDIGO. Descargas en Linux vs en Arch.

	Pensamientos iniciales: La página web de INDIGO describe comandos adicionales para descargar INDIGO y las herramientas adicionales ain-imager y indigo-control-panel. En cambio, parece ser que el enlace del repositorio en GIT solo incluye la herramienta para desplegar el servidor INDIGO. Hay que explorar como acceder a las otras herramientas en Arch Linux,y tener en cuenta que podría ser necesario hacer una partición de Ubuntu si fuese más conveniente.

Tras múltiples intentos desastrosos e infructuosos a partes iguales de instalar INDIGO en Arch Linux, opté por crear una nueva partición de Ubuntu en la que realizar todo el desarrollo del proyecto. Desde esta ha sido sencillo seguir los pasos listados en la página de Indigo Astronomy para instalar INDIGO y las herramientas asociadas. Se detalla el proceso a continuación:


Binary distribution of INDIGO Infrastructure or INDIGO Control Panel can be installed on Linux either automatically by apt-get or manually by dpkg.

To setup automatic installation and subsequent updates, you need to add our repository URL to APT sources list. To do it from command line, create the file /etc/apt/sources.list.d/indigo.list as root with you favourite editor, e.g. like this

```bash
$ sudo vi /etc/apt/sources.list.d/indigo.list
```

add the following line

```bash
deb [trusted=yes] https://indigo-astronomy.github.io/indigo_ppa/ppa indigo main
```

and execute the following commands

```bash
$ sudo apt-get update

$ sudo apt-get install indigo

$ sudo apt-get install ain-imager

$ sudo apt-get install indigo-control-panel
```

To do it from e.g. Synaptic package manager, execute it, go to Settings > Repositories, click new and fill URI, distribution and sections with the following text:

![[Pasted image 20230719201922.png]]

Once done, click Reload and search for indigo packages. 

-----

### POSIBLES REQUISITOS DEL PROYECTO

Vamos a ir tomando nota de los posibles requisitos del proyecto

### Biblioteca

- La biblioteca debe ser capaz de establecer conexiónes con el dispositivo/servidor de dispositivos utilizando protocolos WebSocket
- La biblioteca debe ser capaz de enviar mensajes y recibir mensajes del dispositivo en tiempo real
- La biblioteca debe gestionar posibles errores de conexión y reintentar la conexión si es necesario.
- La biblioteca deberá ser capaz de procesar los mensajes del protocolo INDIGO recibidos del dispositivo y generar respuestas apropiadas para estos en JSON.
- La biblioteca será capaz de solicitar al dispositivo un listado de todas las Propiedades. 
- Deberá solicitar el listado de las Propiedades del dispositivo al iniciar la conexión 
- La biblioteca será capaz de procesar los distintos tipos de Porpiedades existentes en el protocolo INDI: text, number, switch, lights, y BLOB.
- La biblioteca almacenará la información recibida del Dispositivo y sus Propiedades en una estructura interna de clase(s) 
- La biblioteca será capaz de enviar solicitudes de modificación de una o más Propiedades conocidas previamente.
- La biblioteca será capaz de sondear el estado de una Propiedad tras haber solicitado su modificación para comprobar el resultado de la operación previa (?) -NO
- La biblioteca gestionará los diferentes estados de las Propiedades y actuará según estos
- La biblioteca será capaz de borrar Dispositivos o Propiedades de su estructura interna si recibe una señal de borrado desde el servidor
- Será posible establecer si el Dispositivo tiene o no permisos para enviar BLOBs a través del WebSocket (Never, Also, Only)
- La biblioteca debe ser configurable para permitir a los usuarios ajustar parámetros

- Comprobación de que los valores sean correctos y detecciond e errores si ocurre
- Crear ejemplos de cliente web perfectamente documentados wue muestren las distintas funcionalidades
- Gestión de BLOBs de INDIGO: descargar BLOBs desde la URL del servidor o devolver la URL directamente

### Cliente web de ejemplo?
- Registro, login y borrado de usuarios
- Gestión de permisos: cada usuario tendrá un rol asignado con distintos permisos. Se plantea la psobilidad de crear un usuario con solo permisos de lectura, y un superusuario con permisos de escritura y lectura.
- Registro en cliente de los dispositivos disponibles, ya sea de manera independiente o a través de un servidor que los encapsule, y de cada uno de sus vectores Propiedad.
- Mostrar al usuario desde el cliente un listado de las Propiedades de todos los Dispositivos conectados
- Actualizar en directo las propiedades de un Dispositivo en consonancia con los cambios que se realicen desde este.
- Enviar al dispositivo solicitudes de modificación de uno o más elementos de una Propiedad en tiempo real.
- Gestionar estados de las Propiedades registradas dentro del cliente independientemente de las respuestas del Dispositivo.
- Eliminar Propiedades o Dispositivos completos del registro del cliente conforme lleguen solicitudes desde los Dispositivos.
-----

# Sobre la biblioteca en Javascript

Un puñado de notas sobre como organizar la biblioteca de Javascript y cosas a tener en cuenta.

La biblioteca de Javascript recopilará todas las funciones necesarias para conectarse a un socket específico, mandar las peticiones correspondientes y saber interpretar las que le lleguen. A efectos prácticos y a nivel de código, serán uno o más archivos js que recopilarán los métodos en cuestión, para luego ser utilizados por el HTML. A un nivel muy básico, montaremos un cliente simple que se comunicará directamente con uno o más dispositivos.

Se presentan las siguientes opciones para montar la biblioteca: o bien usar Javascript a palo seco, o bien utilizar algún framework chulo (En cuyo caso obviamente sería Typescript). 

Javascript Vanilla vendría mejor si el scope de la biblioteca acaba siendo más pequeño y mas ligero. Vendrá bien si la biblioteca acaba siendo más pequeña, y a través de los ejemplos realizados hemos visto que permite tanto la creación de una biblioteca modularizada (a través de ES Modules) como la recreación de un enfoque Orientado a Objetos bastante eficiente en cuanto a carga (a través del uso de Prototipos y COnstructores). 

Por otra parte, Typescript ofrece multiples herramientas a nivel de desarrollo que debería de hacer ambos enfoques antes mencionados mucho más fáciles de implementar y no tan feos a nivel de código.

Queda pendiente terminar el [tutorial de Librerías en Javascript Vanilla](https://www.youtube.com/watch?v=ZvYhXr0hSzE) para ver como ensamblar el paquete, y buscar el tutorial de librerias en TypeScript para comparar.
Mañana también empezaré a pensar que funciones debería de añadir al sistema, y los requisitos menjro enfocados de cada a las conexiones socket y a la estructura de biblioteca.

-----

# Datos más técnicos de INDIGO

Los simuladores disponibles para realizar pruebas con INDIGO son
- indigo_ccd_simulator
- indigo_gps_simulator
- indigo_dome_simulator
- indigo_mount_simulator
- indigo_rotator_simulator

Recordar que la instrucción para desplegar un servidor INDIGO con esos simuladores es
	$ indigo_server indigo_ccd_simulator 
Especial énfasis en la barra baja.

-----

# Memoria

