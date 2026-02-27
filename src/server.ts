import { server } from "./app";
import toobusy from "toobusy-js";
import env from "./env";

const versionState = [
  {
    name: "Version",
    value: process.version,
  },
  {
    name: "Root",
    value: "server.ts",
  },
  {
    name: "Port",
    value: "3005",
  },
];

const MyServer = async () => {
  try {
    server.listen(env.PORT, () => {
      console.table(versionState);
      console.log(`Server running on http://localhost:${env.PORT} 🚀`);
    });
    process.on("SIGINT", function () {
      toobusy.shutdown();
      process.exit();
    });
    process.on("exit", () => toobusy.shutdown());
  } catch (error) {
    console.log(error);
    process.exit();
  }
};

MyServer();
