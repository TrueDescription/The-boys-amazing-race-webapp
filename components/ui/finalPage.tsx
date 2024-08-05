"use client";

import React, { useEffect, useState } from "react";
import {Spinner} from "@nextui-org/react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function FinalPage() {

    const [loadingData, setLoadingData] = useState(true);
    const router = useRouter();
    const [startTime, setStartTime] = useState('');
    const [formattedTime, setFormattedTime] = useState('');

    const { data: session, status } = useSession();
    useEffect(() => {
        if (status === 'loading') return; 
        else if (!session || !session.user) {
          signIn();
        } else if (session && session?.user?.pin) {
            const pin = session.user.pin;
            fetch('/api/getUserData', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pin })
            }).then(response => {
                if (response.ok) {
                    const data = response.json();
                    return data;
                }
            }).then(data => {
                if (data.hasOwnProperty('pageState') && data.hasOwnProperty('riddleStage') && data.hasOwnProperty('taskStage')
                    && data.hasOwnProperty('created_at')) {
                    if (data.pageState == 1) {
                        router.push('/task');
                        return;
                    } else if (data.pageState == 0) {
                        router.push('/riddle');
                        return;
                    }
                    const now = new Date().getTime();
                    const startTime = new Date(data.created_at ).getTime();
                    setStartTime(new Date(data.created_at).toLocaleTimeString());
                    const finalTime = Math.abs(now - startTime) ;
                    const hours = Math.floor(finalTime / (1000 * 60 * 60));
                    const minutes = Math.floor((finalTime % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((finalTime % (1000 * 60)) / 1000);

                    const formattedTime = `${hours}:${minutes}:${seconds}`;
                    setFormattedTime(`${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
                    console.log(`Time difference is ${formattedTime}`);
                    setLoadingData(false);
                }
            });
            // pull data from db using pin
        }
      }, [session, status]);

    if (status === 'loading' || !session || loadingData) {
        return (
            <div className='CenteredDiv'>
                <Spinner label="Loading..." />
            </div>
        );
    }   

    return (
        <div className="flex flex-col items-center p-4">
            <h1 className="text-xl font-bold">Task Timing Details</h1>
            <div className="mt-4">
                <p>Start Time: {startTime}</p>
                <p>Time Elapsed: {formattedTime}</p>
            </div>
        </div>
      );
}

//  { FinalPage };