// lib/db.ts
import mysql, { RowDataPacket } from "mysql2/promise";

export async function query<T extends RowDataPacket[]>(
  sql: string,
  params: (string | number | boolean | null)[] = []
): Promise<T> {
  const connection = await mysql.createConnection({
    host: process.env.DBHOST,
    port: Number(process.env.DBPORT),
    user: process.env.DBUSERNAME,
    password: process.env.DBPASSWORD,
    database: process.env.DBNAME,
  });

  try {
    const [results] = await connection.execute<T>(sql, params);
    return results;
  } catch (error) {
    console.error("DB Query Error:", error);
    throw error;
  } finally {
    await connection.end();
  }
}
