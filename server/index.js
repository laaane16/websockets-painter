const express = require('express');
const ws = require('express-ws');
const fs = require('fs');
const path = require('path');
const cors = require('cors')

const app = express()
const WsServer = ws(app);
const aWss = WsServer.getWss();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

app.post('/image', (req, res) => {
  try {
    const data = req.body.img.replace('data:image/png;base64,', '');
    fs.writeFileSync(path.resolve(__dirname, 'files',  `${req.query.id}.jpg`), data, 'base64');
    return res.status(200).json({message: 'Загрузка успешно завершена'});
  }catch(e){
    return res.status(500).json('error')
  }
})

app.get('/image', (req, res) => {
  try{
    const filename = req.query.id;
    const file = fs.readFileSync(path.resolve(__dirname, 'files', `${filename}.jpg`))
    const data = 'data:image/png;base64,' + file.toString('base64');
    return res.status(200).json(data)
  }catch(e){
  return res.status(500).json('error')
  }
})

app.ws('/', (ws, req) => {
  ws.on('message', (msg) => {
    const parsedMsg = JSON.parse(msg);
    switch(parsedMsg.method){
      case 'connection':
        connectionHandler(ws, parsedMsg);
        break;
      case 'draw':
        broadcastConnection(ws, parsedMsg);
        break;
      case 'finish':
        broadcastConnection(ws, parsedMsg);
        break;
      case 'move':
        broadcastConnection(ws, parsedMsg);
        break;
    }
  })
})

app.listen(PORT, () => {`server started on ${PORT} port`})
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