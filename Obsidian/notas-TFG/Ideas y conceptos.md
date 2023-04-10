-----

### IDEAS POR EXPLORAR
- [x] Instalación de Indigo
- [x] INDIGO Whitepaper - "INDI: Instrument-Neutral Distributed Interface"
- [ ] Posibles requisitos del proyecto
- [ ] Instalación y descarga con apt-get de INDIGO. Descargas en Linux vs en Arch.
- [ ] Comparativas de INDI con INDIGO. Buscar otras alternativas.

-----

### INSTALACIÓN DE INDIGO en ARCH LINUX

Los comandos a ejecutar para instalar INDIGO en mi máquina de EndeavourOS Archlinux han sido los siguientes:

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

### INDIGO Whitepaper - "INDI: Instrument-Neutral Distributed Interface"

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

A la hora de enviar y recibir mensajes utilizaremos **XML**. Específicamente, definiremos la estructura de vectores y elementos de un vector a través de **DTD (Document Type Definition)**. Acontinuación un gracioso ejemplo en el que se define un vector de Text con uno o más elementos dentor. Notar que en el mismo Vector se definen los atributos de este: el Dispositivo del que estamos tomando datos, nombre y etiqueta, estado actual, permisos... Debajo, se definen uno a uno los elementos del vector con su contenido, y como atributos su nombre y etiqueta.

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

### POSIBLES REQUISITOS DEL PROYECTO

Vamos a ir tomando nota de los posibles requisitos del proyecto

- Registro, login y borrado de usuarios
- Gestión de permisos: cada usuario tendrá un rol asignado con distintos permisos. Se plantea la psobilidad de crear un usuario con solo permisos de lectura, y un superusuario con permisos de escritura y lectura.
- Registro en cliente de los dispositivos disponibles, ya sea de manera independiente o a través de un servidor que los encapsule, y de cada uno de sus vectores Propiedad.
- Solicitar desde el Cliente en cualquier 
- Mostrar al usuario desde el cliente un listado de las Propiedades de todos los Dispositivos conectados
- Actualizar en directo las propiedades de un Dispositivo en consonancia con los cambios que se realicen desde este.
- Enviar al dispositivo solicitudes de modificación de uno o más elementos de una Propiedad en tiempo real.
- Gestionar estados de las Propiedades registradas dentro del cliente independientemente de las respuestas del Dispositivo.
- Eliminar Propiedades o Dispositivos completos del registro del cliente conforme lleguen solicitudes desde los Dispositivos.

-----

### Instalación y descarga con apt-get de INDIGO. Descargas en Linux vs en Arch.

	Pensamientos iniciales: La página web de INDIGO describe comandos adicionales para descargar INDIGO y las herramientas adicionales ain-imager y indigo-control-panel. En cambio, parece ser que el enlace del repositorio en GIT solo incluye la herramienta para desplegar el servidor INDIGO. Hay que explorar como acceder a las otras herramientas en Arch Linux,y tener en cuenta que podría ser necesario hacer una partición de Ubuntu si fuese más conveniente.

Aquí se detallará el proceso.

-----

### Comparativas de INDI con INDIGO. Buscar otras alternativas.

