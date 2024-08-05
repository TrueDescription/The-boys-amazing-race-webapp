import { sql } from "@vercel/postgres";
import { NextApiRequest, NextApiResponse } from 'next';
import { json } from "stream/consumers";


export default async function handler(request: NextApiRequest, response: NextApiResponse,) {
if (request.method !== "POST") {
    return response.status(405).json({ error: "Method not allowed" });
    }
  const { pin } = request.body;
  try {
    console.log(pin);
    const result = await sql`SELECT 
                                  pin, 
                                  pageState,
                                  riddleStage,
                                  taskStage,
                                  optionalCount,
                                  created_at,
                                  final_time
                             FROM team WHERE pin = ${pin};`;
    console.log(result.rows);
    // const resultJson = {pageState : result.rows[0].pagestate, 
    //                                    riddleStage: result.rows[0].riddlestage, 
    //                                    taskStage: result.rows[0].taskstage};
    const resultJson = result.rows[0];
    console.log(resultJson);
    return response.status(200).json( resultJson );
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error });
  }
}