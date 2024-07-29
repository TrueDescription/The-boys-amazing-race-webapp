import { sql } from "@vercel/postgres";

export default async function signupHandler(req, res) {
  if (req.method === 'POST') {
    const { pin } = req.body;
    if (pin.length === 4) {
      try {
        const result = await sql`INSERT INTO teams (pin) VALUES (${pin}) RETURNING *`;
        return res.status(200).json({ success: true, team: result.rows[0] });
      } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
      }
    } else {
      return res.status(400).json({ success: false, message: "PIN must be 4 digits." });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
