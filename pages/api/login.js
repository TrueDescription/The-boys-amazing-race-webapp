import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
  if (req.method == 'POST') {
    const { pin } = req.body;
    try {
      const result = await sql`SELECT * FROM teams WHERE pin = ${pin}`;
      if (result.rowCount > 0) {
        return res.status(200).json({ success: true, message: "Login successful!", team: result.rows[0] });
      } else {
        return res.status(404).json({ success: false, message: "Invalid PIN or team does not exist." });
      }
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
