import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
//import Dogs from './Doga';
import { useNavigate } from 'react-router-dom';

function Update() {
    const [dogName, setName] = useState('');
    const [dogAge, setAge] = useState('');

    let navigate = useNavigate();

    useEffect(() => {
        setName(localStorage.getItem('dogName'));
        setAge(localStorage.getItem('dogAge'));
    }, []);

    const handleUpdate = (e) => {
        e.preventDefault();
    
        const dogData = {
            dogName,
            dogAge
        };
    
        fetch(`http://localhost:3001/dog/${dogName}`, {
            method: 'PUT', // or 'PUT' if you are replacing the entire resource
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
            <Form className="d-grid gap-2" style={{ margin: "15rem" }}>
                <Form.Group className="mb-3" controlId="formName">
                    <Form.Control type="text" placeholder="EnterName" value={dogName} required onChange={(e) => setName(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formAge">
                    <Form.Control type="text" placeholder="EnterAge" value={dogAge} required onChange={(e) => setAge(e.target.value)} />
                </Form.Group>
                <Button onClick={(e) => handleUpdate(e)} type="submit">Update</Button>
            </Form>
        </div>
    );
}

export default Update;
