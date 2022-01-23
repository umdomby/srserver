// const Connection = require('../models/Connections');
// const Message = require('../models/Messages');



class WebSocketProject {

    // async messages(aWss, msg) {
    //     aWss.clients.forEach(client => {
    //         client.send(JSON.stringify({
    //             method: 'messages', message2: 'to message2'
    //         }));
    //     })
    // }

    espConnectionWS(wsESP, msg) {
        try {
            const a = 0;
            if(wsESP.readyState === wsESP.CLOSED && wsESP.readyState === wsESP.CLOSING) {
                wsESP.on('open', function open() {
                        wsESP.send(JSON.stringify({
                            username: msg.username,
                            method: "connection",
                        }))
                });
                // wsESP.onopen = () => {
                //     wsESP.send(JSON.stringify({
                //         id: '1',
                //         username: msg.username,
                //         method: "connection",
                //     }))
                // }
            }

            wsESP.onmessage = (event) => {
                var s = event.data.replace(/\\n/g, "\\n")
                    .replace(/\\'/g, "\\'")
                    .replace(/\\"/g, '\\"')
                    .replace(/\\&/g, "\\&")
                    .replace(/\\r/g, "\\r")
                    .replace(/\\t/g, "\\t")
                    .replace(/\\b/g, "\\b")
                    .replace(/\\f/g, "\\f");
                // remove non-printable and other non-valid JSON chars
                s = s.replace(/[\u0000-\u0019]+/g, "");
                let msg = JSON.parse(s)
                if(wsESP.readyState !== wsESP.CLOSED && wsESP.readyState !== wsESP.CLOSING) {
                    switch (msg.method) {
                        case "connection":
                            wsESP.send(JSON.stringify({
                                id: '1',
                                username: msg.username,
                                method: msg.method,
                            }))
                            console.log("case: connection")
                            break
                        case "messages":
                            wsESP.send(JSON.stringify({
                                id: '1',
                                method: 'messages',
                                message2: msg.message2,
                                accel: msg.accel,
                                stop: 0
                            }))
                            console.log("case: messages")
                            break
                        default:
                            console.log('default')
                    }
                }
            }
        }catch (e) {
            console.log(e)
        }
    }



    async webSocketFunction(msg, aWss, ws) {

        switch (msg.method) {
            case "connection":
                // wsESP.on('open', function open() {
                //     wsESP.send(JSON.stringify({
                //         username: msg.username,
                //         method: "connection",
                //     }))
                // });
                //this.espConnectionWS(wsESP, msg)
                this.connectionHandler(ws, msg, aWss);
                //await this.messages(aWss, msg)
                break
            case "messages":
                //this.espConnectionWS(wsESP, msg)
                // wsESP.on('message', function message(msg) {
                //     wsESP.send(JSON.stringify(msg))
                //     console.log('received: %s', msg);
                // });
                await this.broadcastConnection(ws, msg, aWss)

                break
            case "close":

                break
        }
    }

    connectionHandler = (ws, msg, aWss) => {
        ws.id = msg.id
        ws.username = msg.username
        this.broadcastConnection(ws, msg, aWss)
    }

    broadcastConnection = (ws, msg, aWss) => {
        aWss.clients.forEach(client => {
            if (client.id === msg.id) {
                //client.send(JSON.stringify({method: 'connection', username: 'msg.username'}))
                client.send(JSON.stringify(msg))
            }
        })
    }
}

module.exports = new WebSocketProject()
