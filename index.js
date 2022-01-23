require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const router = require('./routes/index')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const path = require('path')

const PORT = process.env.PORT || 5000
const app = express()


app.use(cors())

app.use(express.json({ extended: true }))
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))
app.use('/api', router)

// Обработка ошибок, последний Middleware
app.use(errorHandler)

const WSServer = require('express-ws')(app);
const aWss = WSServer.getWss()
const webSocketProject = require('./controllers/webSocketProject')

// const https = require("http");
// const server = https.createServer(app);
const WebSocket = require("ws");


const start = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL)
            .then(() => console.log("Successfully connect to MongoDB."))
            .catch(err => console.error("Connection error", err));


        //const webSocketServer = new WebSocket.Server({ server });
        const wss = new WebSocket(process.env.REACT_APP_API_URL_WS);

        app.ws('/ws', (ws, req) => {
                wss.on('open', function open() {
                    wss.send(JSON.stringify({
                        id: '1',
                        username: 'username',
                        method: "connection",
                    }));
                });
            ws.on('message', (msg) => {
                wss.send(msg);
                msg = JSON.parse(msg)
                webSocketProject.webSocketFunction(msg, aWss, ws)
            })
        })


        // webSocketServer.on('connection', ws => {
        //
        //     wss.on('open', function open() {
        //         wss.send(JSON.stringify({
        //             id: '1',
        //             username: 'username',
        //             method: "connection",
        //         }));
        //     });
        //
        //     ws.on('message', m => {
        //         wss.send(m);
        //         webSocketServer.clients.forEach(client => client.send(m));
        //     });
        // });


        //const wsESP = new WebSocket('ws://192.168.0.107:81');
        //const wss = new WebSocketServer({ port: 5000 });
        // wss.on('connection', function connection(ws) {
        //     ws.on('message', function message(msg) {
        //         msg = JSON.parse(msg)
        //         switch (msg.method) {
        //             case "connection":
        //                 ws.send(msg);
        //
        //                 break
        //             case "message":
        //                 ws.send(msg);
        //                 break
        //             case "close":
        //
        //                 break
        //         }
        //     });
        // });

        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}


start()
