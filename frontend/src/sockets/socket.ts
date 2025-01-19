import config from "../config.json";
import { io } from "socket.io-client";

const socket = io(`${config.backendURL}`,{
        transports: ["polling", "websocket"],  });
export default socket;
