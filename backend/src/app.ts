import initApp from "./server";
import http from "http";
import https from "https";
import fs from "fs";
import {chatSocket} from "./sockets/chat_socket";
import {Server} from "socket.io";

const port = process.env.PORT || 3000;

initApp()
    .then((app) => {
        if (process.env.NODE_ENV === "production") {
            const httpsOptions = {
                key: fs.readFileSync("/app/ssl/client-key.pem"),
                cert: fs.readFileSync("/app/ssl/client-cert.pem"),
                passphrase: process.env.SSL_PASSPHRASE,
            };
            const server = https.createServer(httpsOptions, app).listen(port, () => {
                console.log(`Server is running on port ${port} with https`);
            });
            const io = new Server(server, {cors: {origin: "*"}});
            chatSocket(io);
        } else {
            const server = http.createServer(app).listen(port, () => {
                console.log(`Server is running on port ${port} with http`);
            });
            const io = new Server(server, {cors: {origin: "*"}});
            chatSocket(io);
        }
    })
    .catch((err) => {
        console.error("Error initializing app", err);
    });
