import React from 'react';
import '@/app/globals.css'


function Login() {
    return (
        <div className='loginDiv'>
            <form>
                <h1>Enter Team Pin:</h1>
                <input type="text" placeholder="Eg: 1234" />
                <button type='submit'>Login</button>
                <button type='submit'>Sign Up</button>
            </form>
        </div>
    );
}

export {Login}