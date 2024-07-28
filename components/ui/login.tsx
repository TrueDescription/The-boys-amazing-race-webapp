import React from 'react';
import '@/app/globals.css'


function Login() {
    return (
        <div className='loginDiv'>
            <form>
                <h1>Enter Team Pin:</h1>
                <input>Eg: 1234</input>
                <button>Login</button>
                <button>Sign Up</button>
            </form>
        </div>
    );
}

export {Login}