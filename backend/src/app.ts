import initApp from "./server";
import http from "http";
import https from "https";
import fs from "fs";

const port = process.env.PORT || 3000;

initApp()
  .then((app) => {
    if (process.env.NODE_ENV === "production") {
      const httpsOptions = {
        key: fs.readFileSync("/app/ssl/client-key.pem"),
        cert: fs.readFileSync("/app/ssl/client-cert.pem"),
      };
      https.createServer(httpsOptions, app).listen(port, () => {
        console.log(`Server is running on port 443`);
      });
    } else {
      http.createServer(app).listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
    }
  })
  .catch((err) => {
    console.error("Error initializing app", err);
  });
