// lib/db.ts
import mysql, { RowDataPacket } from "mysql2/promise";

export async function query<T extends RowDataPacket[]>(
  sql: string,
  params: (string | number | boolean | null)[] = []
): Promise<T> {
  const connection = await mysql.createConnection({
    host: "119.92.169.229",
    user: "admin",
    password: "!@#Admin123*",
    database: "ssaam_2024_2025",
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
