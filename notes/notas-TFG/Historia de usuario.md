- Como usuario de la biblioteca, quiero establecer una conexión con el servidor INDIGO haciendo uso del protocolo WebSocket
- Como usuario de la biblioteca, quiero enviar mensajes formato JSON al servidor a través de la conexión WS.
- Como usuario de la biblioteca, quiero recibir mensajes del servidor en tiempo real a través de la conexión.

- Como usuario de la biblioteca, quiero que los mensajes recibidos sean procesados correctamente en función del tipo de respuesta (almacenar cambios en las Propiedades, procesar mensajes de error, notificaciones de conexión/desconexión...)

- Como usuario de la biblioteca, quiero que se almacenen en una estructura de datos las Propiedades que se reciban a través de mensajes y que no hayan sido almacenadas previamente.
- Como usuario de la biblioteca, quiero que se actualicen automáticamente la estructura de datos de las Propiedades almacenadas al recibir mensajes con Propiedades almacenadas previamente.
- Como usuario de la biblioteca quiero que se verifiquen que los datos de las Propiedades almacenadas en la estructura de datos sean correctos y estén dentro de los rangos especificados, y que se detecten errores si se producen.

- Como usuario de la biblioteca, quiero solicitar la información de todas las Propiedades asociadas a un servidor INDI.
- Como usuario de la biblioteca, quiero solicitar información sobre una o varias Propiedades específicas asociadas a un servidor.
- Como usuario de la biblioteca, quiero realizar cambios sobre las Propiedades almacenadas en la estructura de datos y enviar esos cambios a través de mensajes al servidor.
- Como usuario de la biblioteca, quiero que las solicitudes de lectura o escritura de Propiedades se limiten/restrinjan en función de sus permisos (Read-only, Write-only, Read-write)
- Como usuario de la biblioteca, quiero que el State de una Propiedad (Idle, OK, Busy, Alert) se modifique automáticamente dentro de la estructura de datos al State correspondiente tras realizar modificaciones sobre dicha propiedad.

