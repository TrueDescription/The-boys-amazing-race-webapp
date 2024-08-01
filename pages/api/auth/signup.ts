import { sql } from "@vercel/postgres";
import { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(request: NextApiRequest,response: NextApiResponse,) {
  const { pin } = request.body;
  try {
    const existingPin = await sql`SELECT pin FROM team WHERE pin = ${pin};`;
    if (existingPin.rowCount != null && existingPin.rowCount > 0) {
      return response.status(409).json({ success: false, message: "PIN already exists." });
    }
    const result = await sql`INSERT INTO team (pin, pageState, riddleStage, taskStage) VALUES (${pin}, ${0}, ${0}, ${0}) RETURNING *`;
    return response.status(200).json({ result });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error });
  }
}