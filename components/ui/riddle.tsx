import React from 'react';
import {Input} from "@nextui-org/input";
import {Card, CardHeader, CardBody, CardFooter} from "@nextui-org/card";



function RiddlePage() {
    return (
        <div className='CenteredDiv'>
            <Card>
                <CardBody>
                    <Card>
                        <CardBody>
                            <h1 className='.montserrat-fontest'>
                            I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?                    
                            </h1>
                        </CardBody>
                    </Card>
                    <Input className='riddleInput'/>
                </CardBody>
            </Card>
            
        </div>

    );
}

export {RiddlePage};