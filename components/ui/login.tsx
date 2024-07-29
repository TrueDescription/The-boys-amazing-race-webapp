"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { toast, ToastContainer } from 'react-toastify';import '@/app/globals.css'
import { Client } from '@vercel/postgres';
import {Input} from "@nextui-org/input";
import {Card, CardHeader, CardBody, CardFooter} from "@nextui-org/card";
import {Button, ButtonGroup} from "@nextui-org/button";



function Login() {

    // const [pin, setPin] = useState('');
    // const router = useRouter();
    const [pin, setPin] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    const loginHandler = async () => {
        // check if pin is 4 digets otherwise error
        // make the api call to /api
        // handle return value
        // route with routeer
    }
    const signupHandler = async () => {
    }

    

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.slice(0, 4);
        setPin(value);
        setIsButtonDisabled(value.length !== 4);
    };

    return (
        <div className='CenteredDiv'>
            <Card className='loginCard'>
                <CardBody>
                    {/* <input id='pinInput' type="text" placeholder="Eg: 1234" value={pin} onChange={e => setPin(e.target.value)}/> */}
                    <Input 
                        id='pinInput' 
                        type="number" 
                        placeholder="Ex: 1234" 
                        label="Enter Team Pin"
                        
                        maxLength={4}
                        onChange={handleInputChange} 
                    />
                    <Button onClick={loginHandler} isDisabled={isButtonDisabled} color="primary">Login</Button>
                    <Button onClick={signupHandler} isDisabled={isButtonDisabled} color="primary">Sign Up</Button>
                </CardBody>
            </Card>
            
        </div>
    );
}

export {Login}