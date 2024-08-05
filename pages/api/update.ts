import { sql } from "@vercel/postgres";
import { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(request: NextApiRequest, response: NextApiResponse,) {
if (request.method !== "POST") {
    return response.status(405).json({ error: "Method not allowed" });
    }
  const { pin, page } = request.body;
  try {
    console.log(pin);
    if (page == 'riddle') {
        const result = await sql`UPDATE team
        SET
            riddleStage = riddleStage + 1,   
            pageState = 1 
        WHERE pin = ${pin};`;
    } else if (page === 'task') {
        const { x, finalFlag } = request.body;
        const result = await sql`UPDATE team
        SET
            optionalCount = optionalCount + ${x},  
            taskStage = taskStage + 1,   
            pageState = ${finalFlag} 
        WHERE pin = ${pin};`
    } else if (page === 'final') {
        const { now } = request.body;
        const result = await sql`UPDATE team
        SET
            final_time = ${now}
        WHERE pin = ${pin};`
    }
    
    
    return response.status(200).json({});
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error });
  }
}