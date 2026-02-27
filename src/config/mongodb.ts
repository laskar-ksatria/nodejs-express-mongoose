import mongoose from "mongoose";
import env from "../env";
import * as Sentry from "@sentry/node";

/**
 * Start on local - brew services start mongodb/brew/mongodb-community
 * Stop on local - brew services stop mongodb/brew/mongodb-community
 * @returns
 */

export default async function dbConnect(callBack: Function) {
  try {
    const uri = env.MONGGO_URI;
    mongoose.connect(uri);
    const db = mongoose.connection;
    db.on("error", () => {
      Sentry.captureException(new Error("Failed connect mongoDB"));
      console.error.bind(console, "connection error: ");
    });
    db.once("open", function () {
      console.log("We are connected to mongoDB");
      callBack();
    });
  } catch (error) {
    console.log("Error DB: ", error);
    Sentry.captureException(error);
  }
}
