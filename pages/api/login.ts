import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";
import { query } from "@/lib/dbQuery";
import { generateToken } from "@/lib/jwt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id, password } = req.body;


  try {
    const rows = await query(
        "call student_login(?)",
        [JSON.stringify({studentid: id, password})]
    )
    let status = rows[0][0].Result; 
    if(typeof status === "string") {
        status = JSON.parse(status);
    } 
    if (status.code === 0) {
        return res.status(401).json({ success: false, message: status.data });
    } else {
        // const token = "mock-jwt-token";
        const token = generateToken(id);
        // Set cookie
        res.setHeader("Set-Cookie", serialize("authToken", token, {
        httpOnly: true,                                 // cannot be accessed via JS
        secure: process.env.NODE_ENV === "production", // only HTTPS in prod
        sameSite: "strict",
        path: "/",                                     // cookie available everywhere
        maxAge: 60 * 5                                 // 5 minutes
        }));

        return res.status(200).json({
          success: true,
          user: status.data
        });
    }
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
