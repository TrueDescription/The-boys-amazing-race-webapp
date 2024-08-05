"use client";

import React, { useState, useEffect } from 'react';
import { Checkbox } from "@nextui-org/checkbox";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner } from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import {Progress} from "@nextui-org/progress";
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { sql } from "@vercel/postgres";
import stageData from '@/data/stageData.json'


type TaskType = {
    id: number;
    text: string;
};

const tasks: TaskType[] = [];
const optionalTasks: TaskType[] = [];

function Task() {
    

    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [submitted, setSubmitted] = useState(true);
    const [progress, setProgress] = useState(0);
    const [loadingData, setLoadingData] = useState(true);
    const [finalFlag, setFinalFlag] = useState(0);
    // const [optional, setOptional] = useState(false);
    const router = useRouter();

    const [checkboxStates, setCheckboxStates] = useState<Record<number, boolean>>(
        tasks.reduce((acc, task) => {
            acc[task.id] = false;
            return acc;
        }, {} as Record<number, boolean>)
    );
    const [optionalStates, setOptionalStates] = useState<Record<number, boolean>>(
        optionalTasks.reduce((acc, task) => {
            acc[task.id] = false;
            return acc;
        }, {} as Record<number, boolean>)
    );

    useEffect(() => {
        if (loadingData) return;
        const allChecked = Object.values(checkboxStates).every(Boolean);
        setIsButtonDisabled(!allChecked);
    }, [checkboxStates]);

    const handleCheckboxChange = (id: number) => {
        setCheckboxStates((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const handleOptionalChange = (id: number) => {
        setOptionalStates((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    function submitTask() {
        setSubmitted(false);
        // change the db page stage
        // increment the optional task count
        let x = 0;
        Object.values(optionalStates).forEach((element) => {
            if (element) {
                x++;
            }
        })
        // change the db page stage
        // increment the optional task count
        // this works ^
        const existingPin = sql`UPDATE team
                                SET
                                    optionalCount = optionalCount + ${x},  
                                    taskStage = taskStage + 1,   
                                    pageState = ${finalFlag} 
                                WHERE pin = ${session?.user.pin};`
            .then( () => {
                // console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!" + x);
                // const intervalId = setInterval(() => {
                //     if (x >= 30) {
                //         clearInterval(intervalId);
                //     }
                //     x += 1
                //     setProgress(prevProgress => prevProgress + 4);
                // }, 100);
                // setTimeout(() => {
                //     router.push("/riddle");
                // }, 3000);
                if (finalFlag == 2) {
                    router.push('/finalPage');
                } else {
                    router.push("/riddle");
                }
            });

        
    }
    
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
                tasks.length = 0;
                optionalTasks.length = 0;
                if (data.hasOwnProperty('pageState') && data.hasOwnProperty('riddleStage') && data.hasOwnProperty('taskStage')) {
                    if (data.pageState == 0) { // change back to 0 after dev
                        router.push('/riddle');
                        return;
                    } else if (data.pageState == 2) {
                        router.push('/finalPage');
                    }
                    if (data.taskStage + 1 == stageData['taskPage']['stages'].length) {
                        setFinalFlag(2);
                    }
                    const currStageData = stageData['taskPage']['stages'][data.taskStage];
                    currStageData.requiredTasks.forEach((element, i) => {
                        tasks.push({id: i, text : element});
                    });
                    if (stageData['taskPage']['stages'][data.taskStage].hasOwnProperty('optionalTasks')) {
                        currStageData.optionalTasks?.forEach((element, i) => {
                            optionalTasks.push({id: i, text : element});
                        });
                    }
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
        <div className='CenteredDivTask'>
            <div>
                <Table aria-label="Task table" >
                    <TableHeader>
                        <TableColumn>
                            Task
                        </TableColumn>
                        <TableColumn>
                            Completion
                        </TableColumn>
                    </TableHeader>
                    <TableBody>
                        {tasks.map((task) => (
                            <TableRow key={task.id}>
                                <TableCell>
                                    {task.text}
                                </TableCell>
                                <TableCell>
                                    <Checkbox
                                        size="lg"
                                        isSelected={checkboxStates[task.id]}
                                        onChange={() => handleCheckboxChange(task.id)}
                                    />
                                        
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    
                </Table>
                <Table >
                    <TableHeader>
                        <TableColumn>
                            Optional Task
                        </TableColumn>
                        <TableColumn>
                            Completion
                        </TableColumn>
                    </TableHeader>
                    <TableBody>
                        {optionalTasks.map((oTask) => (
                            <TableRow key={oTask.id}>
                                <TableCell>
                                    {oTask.text}
                                </TableCell>
                                <TableCell>
                                    <Checkbox
                                        size="lg"
                                        isSelected={optionalStates[oTask.id]}
                                        onChange={() => handleOptionalChange(oTask.id)}
                                    />  
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Button style={{marginTop : "10px"}} isDisabled={isButtonDisabled} color='primary' className="w-full md:w-auto" onClick={submitTask}>
                    Submit Tasks!
                </Button>
            </div>
            <Progress style={{marginTop : "10px", display : submitted ? 'none' : 'inline'}} aria-label="Loading..." isIndeterminate className="max-w-md"/>
        </div>
    );
}

export { Task };
