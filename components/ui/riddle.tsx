"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {Input} from "@nextui-org/input";
import {Card, CardHeader, CardBody, CardFooter} from "@nextui-org/card";
import {Progress} from "@nextui-org/progress";

   

function RiddlePage() {
    const [answer, setAnswer] = useState('');
    const [isCorrect, setIsCorrect] = useState(false);
    const [submitted, setSubmitted] = useState(true);
    const [progress, setProgress] = useState(0);
    const router = useRouter();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();
        if (value === "test") {
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
        setAnswer(value);
        console.log(value);
    };

    return (
        <div className={isCorrect ? 'CenteredDiv correct-answer' : 'CenteredDiv'}>
            <div>
                <Card >
                    <CardBody className='CardBody'>
                        <Card className='Card'>
                            <CardBody className='CardBody'>
                                <h1 className='montserrat-fontest'>
                                    I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?
                                </h1>
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