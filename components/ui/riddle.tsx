"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {Input} from "@nextui-org/input";
import {Card, CardHeader, CardBody, CardFooter} from "@nextui-org/card";
import {Progress} from "@nextui-org/progress";
import { useSession, signIn } from 'next-auth/react';
import {Spinner} from "@nextui-org/react";
import { sql } from "@vercel/postgres";
import stageData from '@/data/stageData.json'


interface stageData {
    riddlePage: {
      stages: {
        [key: number]: {
          answer: string;
          question: string;
        };
      };
    };
  }
   

function RiddlePage() {
    const [answer, setAnswer] = useState('test');
    const [riddle, setRiddle] = useState('test2');
    const [isCorrect, setIsCorrect] = useState(false);
    const [submitted, setSubmitted] = useState(true);
    const [loadingData, setLoadingData] = useState(true);
    const [progress, setProgress] = useState(0);
    const router = useRouter();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();
        if (value === answer) {
            console.log('success');
            setIsCorrect(true);
            setSubmitted(false);
            let x = 0;

            const intervalId = setInterval(() => {
                if (x >= 30) {
                    clearInterval(intervalId);
                }
                x += 1
                setProgress(prevProgress => prevProgress + 4);
            }, 100);
            setTimeout(() => {
                router.push('/task')
            }, 3000);
            
        } else {
            setIsCorrect(false);
        }
        // setAnswer(value);
        // console.log(value);
    };


    const { data: session, status } = useSession();
    // console.log(session?.user.pin);
    useEffect(() => {
        // console.log(session);
        // console.log(session?.user.pin);
        // console.log(status);
        if (status === 'loading') return; 
        else if (!session || !session.user) {
          signIn();
        } else if (session && session?.user?.pin) {
            const pin = session.user.pin;
            // console.log("pin");
            fetch('/api/getUserData', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pin })
            }).then(response => {
                // redirect to valid page based of pageState 0 for riddle and 1 for task
                // if on valid page, pull data from stageData.json using a handler api function probably
                // setLoadingData(false) after the data is pulled and inputed to riddle and answer
                if (response.ok) {
                    const data = response.json();
                    return data;
                }
            }).then(data => {
                if (data.hasOwnProperty('pageState') && data.hasOwnProperty('riddleStage') && data.hasOwnProperty('taskStage')) {
                    if (data.pageState == 1) {
                        router.push('/task');
                        return;
                    }
                    const currStageData = stageData['riddlePage']['stages'][data.riddleStage];
                    setAnswer(currStageData.answer.toLowerCase());
                    setRiddle(currStageData.question);
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
        <div className={isCorrect ? 'CenteredDiv correct-answer' : 'CenteredDiv'}>
            <div>
                <Card >
                    <CardBody className='CardBody'>
                        <Card className='Card'>
                            <CardBody className='CardBody'>
                                <h1 className='montserrat-fontest'>{riddle}</h1>
                            </CardBody>
                        </Card>
                        <Input 
                            className='riddleInput' 
                            isClearable={!isCorrect} 
                            onChange={handleInputChange} 
                            disabled={isCorrect} 
                        />
                    </CardBody>
                </Card>

            </div>
            <Progress style={{marginTop : "10px", display : submitted ? 'none' : 'inline'}} aria-label="Loading..." value={progress} className="max-w-md"/>
        </div>
    );
}

export { RiddlePage };