import mongoose, { Connection } from "mongoose";

let conn: Connection | null = null;

export async function connectDB(uri = process.env.MONGODB_URI as string) {
  if (!uri) throw new Error("MONGODB_URI not set");
  if (conn && conn.readyState === 1) return conn;

  const db = await mongoose.connect(uri, { autoIndex: true });
  conn = db.connection;

  console.log("MongoDB connected:", conn.name);
  return conn;
}
