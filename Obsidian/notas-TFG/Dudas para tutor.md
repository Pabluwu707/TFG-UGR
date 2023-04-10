-----

### DUDAS A ACLARAR

- [ ] Formato de los elementos Number en XML. 
- [ ] Escabilidad del servidor INDI

-----

## Formato de los elementos Number en XML
Al definir un elemento Number, junto con su contenido, podemos especificar un formato a través del atributo **numberFormat**. Los numeros pueden ser escritos con un formato Double típico, o **en sexagesimal** con el siguiente formato especial de INDI: "%\<w\>.\<f\>m", donde \<w\> es el ancho total del campo y \<f\> es el ancho de la fracción. 

- **¿Como funcionan los números sexagesimales?**
- **¿A que se refieren los parámetros del formato?**

-----

## Escabilidad del servidor INDI
Entiendo que el enfoque del proyecto será en la parte del Cliente, ya que vamos a crear una biblioteca en Javascript para gestionar la comunicación el cliente con el servidor. Pero me surge la duda de cuanto enfoque debería de poner sobre la parte del servidor.

- **¿Voy a enfocarme solo en la biblioteca de Java o voy a crear un servidor dedicado para gestionar uno o más dispositivos?**
- **En caso de crear un servidor INDI dedicado en vez de utilizar el por defecto, ¿debería centrarme en hacerlo más escalable y permitir la inclusión de más de un Dispositivo compatible con INDI, o simplemente crear un servidor dedicado para el Dispositivo del encargo (en este caso, el telescopio)?**