"use client";

import React, { useState, useEffect } from 'react';
import { Checkbox } from "@nextui-org/checkbox";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import {Progress} from "@nextui-org/progress";
import { useRouter } from 'next/navigation';

type TaskType = {
    id: number;
    text: string;
};

const tasks: TaskType[] = [
    { id: 1, text: "Become the president of the world!" },
    { id: 2, text: "Complete the marathon!" },
    { id: 3, text: "Learn a new language!" }
];

function Task() {
    const [checkboxStates, setCheckboxStates] = useState<Record<number, boolean>>(
        tasks.reduce((acc, task) => {
            acc[task.id] = false;
            return acc;
        }, {} as Record<number, boolean>)
    );

    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [submitted, setSubmitted] = useState(true);
    const [progress, setProgress] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const allChecked = Object.values(checkboxStates).every(Boolean);
        setIsButtonDisabled(!allChecked);
    }, [checkboxStates]);

    const handleCheckboxChange = (id: number) => {
        setCheckboxStates((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    function submitTask() {
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
            router.push("/riddle");
        }, 3000);
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
                <Button style={{marginTop : "10px"}} isDisabled={isButtonDisabled} color='primary' className="w-full md:w-auto" onClick={submitTask}>
                    Submit Tasks!
                </Button>
            </div>
            <Progress style={{marginTop : "10px", display : submitted ? 'none' : 'inline'}} aria-label="Loading..." value={progress} className="max-w-md"/>
        </div>
    );
}

export { Task };
