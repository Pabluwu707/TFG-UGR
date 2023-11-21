// Starts a WebSocket client and connects to a server

console.log("Empieza la ejecución.");
let port : number = 7624; //  Default INDI port
let socketUrl : string = `ws://127.0.0.1:${port}`
let socketUrl2 = new URL('ws://127.0.0.1:7624');
const ws = new WebSocket(socketUrl2);

/*
ws.onopen = (event) => {

}
*/

ws.addEventListener("open", function connection ( event ) {
  console.log("We connected to the server!");

  ws.send('<getProperties version="2.0" />');
  
} );


ws.addEventListener("message", function message ( event ) {
  let fecha = Date();
  console.log("[%s] Message from server: %s", fecha, event.data);
} );