import { query } from "@/lib/dbQuery";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") { return res.status(405).json({ message: "Method not allowed" }); }

    const userInfo = req.body
    try {
        const rows = await query("call studentupdate(?)", [userInfo]);
        let status = rows[0][0].Result; 
        if(typeof status === "string") { status = JSON.parse(status); } 
        if (status.code === 0) { 
            return res.status(401).json({ success: false, message: status[0] }); 
        } 
        else { 
            return res.status(200).json({ success: true, message: status[0] }); 
        }
    } catch (err) { return res.status(500).json({ success: false, message: `Server error. ${err}` }); }
}