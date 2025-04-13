const express = require('express');
const ws = require('express-ws');

const app = express()
const WsServer = ws(app);
const aWss = WsServer.getWss();

const PORT = process.env.PORT || 5000;

app.ws('/', (ws, req) => {
  ws.on('message', (msg) => {
    const parsedMsg = JSON.parse(msg);
    switch(parsedMsg.method){
      case 'connection':
        connectionHandler(ws, parsedMsg);
        break;
      case 'draw':
        broadcastConnection(ws, parsedMsg);
      case 'finish':
        broadcastConnection(ws, parsedMsg)
    }
  })
})

app.listen(PORT, () => {console.log(`server started on ${PORT} port`)})
function connectionHandler(ws, message){
  ws.id = message.id;
  broadcastConnection(ws, message);
}

function broadcastConnection(ws, msg){
  aWss.clients.forEach((client) => {
    if (client.id === msg.id){
      client.send(JSON.stringify(msg))
    }
  })
}