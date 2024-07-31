import { sql } from "@vercel/postgres";
import { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(request: NextApiRequest,response: NextApiResponse,) {
  const { pin } = request.body;
  console.log(pin);
  try {
    return response.status(200)
    // const existingPin = await sql`SELECT pin FROM team WHERE pin = ${pin};`;
    // if (existingPin.rowCount != null && existingPin.rowCount > 0) {
    //   return response.status(200);
    // }
    // return response.status(401);
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error });
  }
}