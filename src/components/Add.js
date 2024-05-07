import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Add() {
    const [dogName, setName] = useState('');
    const [dogAge, setAge] = useState('');
    const [humanName, setHumanName] = useState('');

    let navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
    
        const dogData = {
            dogName,
            dogAge,
            humanName
        };
    
        fetch('http://localhost:3001/dog', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dogData)
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
            <Form onSubmit={handleSubmit} className="d-grid gap-2" style={{ margin: "15rem" }}>
                <Form.Group className="mb-3" controlId="formName">
                    <Form.Control
                        type="text"
                        placeholder="Enter Name"
                        value={dogName}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formAge">
                    <Form.Control
                        type="text"
                        placeholder="Enter Age"
                        value={dogAge}
                        onChange={(e) => setAge(e.target.value)}
                        required
                    />
                
                </Form.Group>
                <Form.Group className="mb-3" controlId="formOwner">
                    <Form.Control
                        type="text"
                        placeholder="Enter Owner Name"
                        value={humanName}
                        onChange={(e) => setHumanName(e.target.value)}
                        required
                    />
                </Form.Group>
                <Button type="submit">Submit</Button>
            </Form>
        </div>
    );
}

export default Add;
