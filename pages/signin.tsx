"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Client } from '@vercel/postgres';
import {Input} from "@nextui-org/input";
import {Card, CardHeader, CardBody, CardFooter} from "@nextui-org/card";
import {Button, ButtonGroup} from "@nextui-org/button";
import {Progress} from "@nextui-org/progress";
import { signIn } from 'next-auth/react';


export default function Login() {

    const router = useRouter()
    const [pin, setPin] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [loadingDisplay, setLoad] = useState(false);
    

    const loginHandler = async () => {
        setLoad(true);
        setIsButtonDisabled(true);
        const result = await signIn('credentials', {
            redirect: false,
            pin: pin,
        });
        if (result?.ok) {
            console.log('Login successful');
            router.push('/riddle'); // change this to redirect to correct page state
        } else {
            setLoad(false);
            setIsButtonDisabled(false);
            toast.error('Incorrect PIN', {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            console.log('Login failed');
        }
    }
    const signupHandler = async () => {
        setLoad(true);
        setIsButtonDisabled(true);
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pin })
        });
        if (response.ok) {
            console.log('Signup Valid');
            loginHandler();
        } else {
            setLoad(false);
            setIsButtonDisabled(false);
            toast.error('PIN Already Used', {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
    }

    

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPin(value);
        setIsButtonDisabled(value.length !== 4);
    };

    return (
        
        <main>
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
                <Progress
                    size="sm"
                    isIndeterminate
                    aria-label="Loading..."
                    className={loadingDisplay ? "max-w-md" : "hidden"}
                />    
            </div>
                   
            <ToastContainer
                position="bottom-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
        </main>
    );
}

export {Login}