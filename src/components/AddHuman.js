import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
//import { v4 as uuid } from "uuid";
import { useNavigate } from 'react-router-dom';

function Add() {
    const [humanName, setName] = useState('');
    const [humanAge, setAge] = useState('');

    let navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
    
        const humanData = {
            humanName,
            humanAge
        };
    
        fetch('http://localhost:3001/human', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(humanData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            navigate("/");
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    return (
        <div>
            <Form className="d-grid gap-2" style={{ margin: "15rem" }}>
                <Form.Group className="mb-3" controlId="formName">
                    <Form.Control
                        type="text"
                        placeholder="Enter Name"
                        value={humanName}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formAge">
                    <Form.Control
                        type="text"
                        placeholder="Enter Age"
                        value={humanAge}
                        onChange={(e) => setAge(e.target.value)}
                        required
                    />
                </Form.Group>
                <Button onClick={(e) => handleSubmit(e)} to="/home">Submit</Button>
            </Form>
        </div>
    );
}

export default Add;
