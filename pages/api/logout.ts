// pages/api/logout.ts
import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Overwrite the cookie with an expired one
  res.setHeader("Set-Cookie", serialize("authToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0), // expire immediately
    path: "/",
  }));

  res.status(200).json({ success: true, message: "Logged out" });
}