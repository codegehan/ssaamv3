// pages/api/login.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";
import { query } from "@/lib/dbQuery";

// interface UserRow {
//     id: string,
//     firstname: string
// }

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

    // console.log("Type of Result:", typeof status);
    // console.log("Actual Result:", status);

    if (status.code === 0) {
        return res.status(401).json({ success: false, message: status.data });
    } else {
        const token = "mock-jwt-token";
        // Set cookie
        res.setHeader("Set-Cookie", serialize("authToken", token, {
        httpOnly: true,       // cannot be accessed via JS
        secure: process.env.NODE_ENV === "production", // only HTTPS in prod
        sameSite: "strict",
        path: "/",            // cookie available everywhere
        maxAge: 60 * 5  // 5 minutes
        }));

        return res.status(200).json({
          success: true,
          user: status.data
        });

        // return res.status(200).json({ success: true, message: status.data });
    }
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }

  // 🔑 Replace this with your real authentication logic
//   if (id === "1234" && password === "1234") {
//     const token = "mock-jwt-token"; // generate a real JWT in production

//     // Set cookie
//     res.setHeader("Set-Cookie", serialize("authToken", token, {
//       httpOnly: true,       // cannot be accessed via JS
//       secure: process.env.NODE_ENV === "production", // only HTTPS in prod
//       sameSite: "strict",
//       path: "/",            // cookie available everywhere
//       maxAge: 60 * 60 * 24  // 1 day
//     }));

//     return res.status(200).json({
//       success: true,
//       user: { id, name: "John Doe" }
//     });
//   }

//   return res.status(401).json({ success: false, message: "Incorrect Account" });
}
