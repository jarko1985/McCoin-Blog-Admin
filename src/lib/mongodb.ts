import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) throw new Error('Missing MONGODB_URI');

let cached = (global as any).mongoose as { conn: typeof mongoose | null, promise: Promise<typeof mongoose> | null } | undefined;
if (!cached) cached = (global as any).mongoose = { conn: null, promise: null };

export async function dbConnect() {
  if (cached!.conn) return cached!.conn;
  cached!.promise ||= mongoose.connect(MONGODB_URI);
  cached!.conn = await cached!.promise;
  return cached!.conn;
}