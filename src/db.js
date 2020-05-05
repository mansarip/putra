import Dexie from "dexie";
import { DB_NAME } from "./constant";

const db = new Dexie(DB_NAME);

db.version(1).stores({
  qrcode: "++id",
  log: "++id, date",
});

export default db;
