import React, { Fragment, useState, useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from 'react-router-dom';
import PieChart from './Chart';
import { Typography } from '@mui/material';

function Home() {
    const [dog, setDog] = useState([]);
    const [human, setHuman] = useState([]);
    const [user, setUser] = useState([]);
    const [error, setError] = useState(null); 
    let history = useNavigate();

    useEffect(() => {
        fetch('http://localhost:3001/dog')
            .then(response => {
                if (!response.ok) {
                    throw new Error("HTTP error");
                }
                return response.json();
            })
            .then(data => {
                setDog(data);
                setError(null);
            })
            .catch(error => {
                console.error("Error fetching dog data", error);
                setError("Failed to fetch dog data. Please try again later.");
            });

        fetch('http://localhost:3001/human')
            .then(response => {
                if (!response.ok) {
                    throw new Error("HTTP error");
                }
                return response.json();
            })
            .then(data => {
                setHuman(data);
                setError(null);
            })
            .catch(error => {
                console.error("Error fetching human data", error);
                setError("Failed to fetch human data. Please try again later.");
            });

            fetch('http://localhost:3001/user')
            .then(response => {
                if (!response.ok) {
                    throw new Error("HTTP error");
                }
                return response.json();
            })
            .then(data => {
                setHuman(data);
                setError(null);
            })
            .catch(error => {
                console.error("Error fetching user data", error);
                setError("Failed to fetch user data. Please try again later.");
            });
    }, []);


    const dogCountByOwner = () => {
        const dogCount = {};
    
        dog.forEach(dog => {
            if (dog.humanName in dogCount && (dog.humanName !== 'undifined') && (dog.humanName !== 'null')) {
                dogCount[dog.humanName]++;
            } else {
                dogCount[dog.humanName] = 1;
            }
        });
    
        return dogCount;
    };
    
    const dogCounts = dogCountByOwner();

    const handleUpdateHuman = (humanName, humanAge) => {
        localStorage.setItem('humanName', humanName);
        localStorage.setItem('humanAge', humanAge);
    }

    const handleUpdate = (dogName, dogAge) => {
        localStorage.setItem('dogName',dogName);
        localStorage.setItem('dogAge', dogAge);
    }

    const handleDelete = (dogName) => {
        if (window.confirm('Are you sure you want to delete this dog?')) {
            fetch(`http://localhost:3001/dog/${dogName}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                console.log('Delete successful', data);
                setDog(prevDog => prevDog.filter(f => f.dogName !== dogName));
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        }
    };


    const handleDeleteHuman = (humanName) => {
        if (window.confirm('Are you sure you want to delete this human?')) {
            fetch(`http://localhost:3001/human/${humanName}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                console.log('Delete successful', data);
                setHuman(prevHuman => prevHuman.filter(f => f.humanName !== humanName));
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        }
    };

    const [sortedField, setSortedField] = React.useState(null);
    let sortedProducts = [...dog];
    let currentHumans = [...human];
    if (sortedField !== null) {
        sortedProducts.sort((a, b) => {
            if (a[sortedField] < b[sortedField]) {
                return -1;
            }
            if (a[sortedField] > b[sortedField]) {
                return 1;
            }
            return 0;
        });
    }

    const dogAges = sortedProducts.reduce((acc, curr) => {
        acc[curr.Age] = (acc[curr.Age] || 0) + 1;
        return acc;
    }, {});

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5); 

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (size) => {
        setPageSize(size);
    };

    const indexOfLastDog = currentPage * pageSize;
    const indexOfFirstDog = indexOfLastDog - pageSize;
    const currentDogs = sortedProducts.slice(indexOfFirstDog, indexOfLastDog);

    return (
        <Fragment>
            {error && (
                <Typography variant="h6" color="error" sx={(2)}>
                    {error}
                </Typography>
            )}
            {!error && (
                
                <div style={{ margin: "10rem" }} >
                   <Table stripped bordered hover size="sm">
                        <thead>
                            <tr>
                                <th>
                                    Name
                                </th>
                                <th>
                                    Age
                                </th>
                                <th>
                                    Owner
                                </th>
                                <th>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {dog && dog.length > 0 ? (
                                dog.map((item) => {
                                    return (
                                        <tr key={item._id}>
                                            <td>
                                                {item.dogName}
                                            </td>
                                            <td>
                                                {item.dogAge}
                                            </td>
                                            <td>
                                                {item.humanName}
                                            </td>
                                            <td>
                                                <Link to={'/update'}>
                                                    <Button onClick={() => handleUpdate(item._id, item.dogName, item.dogAge)}>Update</Button>
                                                </Link>
                                                &nbsp;
                                                <Button onClick={() => handleDelete(item.dogName)}>DELETE</Button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="4">No data available</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                    <div>
                        <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</Button>
                        <span> Page {currentPage} </span>
                        <Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentDogs.length < pageSize}>Next</Button>
                        <select onChange={(e) => handlePageSizeChange(parseInt(e.target.value))} value={pageSize}>
                            <option value="5">5 per page</option>
                            <option value="10">10 per page</option>
                            <option value="15">15 per page</option>
                        </select>
                    </div>
                    <br></br>
                    <Link className='d-grid gap-2' to="/create">
                        <Button size="lg">Create</Button>
                    </Link>
                    <div>
                        <PieChart/>
                    </div>
                    <div style={{ margin: "10rem" }} >
                    <Table stripped bordered hover size="sm">
                        <thead>
                            <tr>
                                <th>
                                    <Button type="button" onClick={() => setSortedField('Name')}>
                                        Name
                                    </Button>
                                </th>
                                <th>
                                    <Button type="button" onClick={() => setSortedField('Age')}>
                                        Age
                                    </Button>
                                </th>
                                <th>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentHumans && currentHumans.length > 0 ? (
                                currentHumans.map((item) => {
                                    return (
                                        <tr key={item.id}>
                                            <td>
                                                {item.humanName}
                                            </td>
                                            <td>
                                                {item.humanAge}
                                            </td>
                                            <td>
                                                <Link to={'/updateHuman'}>
                                                    <Button onClick={() => handleUpdate(item.id, item.humanName, item.humanAge)}>Update</Button>
                                                </Link>
                                                &nbsp;
                                                <Button onClick={() => handleDeleteHuman(item.humanName)}>DELETE</Button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="3">No data available</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                    <div>
                        <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</Button>
                        <span> Page {currentPage} </span>
                        <Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentDogs.length < pageSize}>Next</Button>
                        <select onChange={(e) => handlePageSizeChange(parseInt(e.target.value))} value={pageSize}>
                            <option value="5">5 per page</option>
                            <option value="10">10 per page</option>
                            <option value="15">15 per page</option>
                        </select>
                    </div>
                    
                    <br></br>
                    <Link className='d-grid gap-2' to="/createHuman">
                        <Button size="lg">Create</Button>
                    </Link>
                    
                    </div>
                </div>

                
                
            )}

{error && (
                <Typography variant="h6" color="error" sx={(2)}>
                    {error}
                </Typography>
            )}
            {!error && (
                <div style={{ margin: "10rem" }}>
                    <Table stripped bordered hover size="sm">
                        <thead>
                            <tr>
                                <th>Human Name</th>
                                <th>Number of Dogs</th>
                            </tr>
                        </thead>
                        <tbody>
    {Object.keys(dogCounts).map((humanName, index) => (
        <tr key={index}>
            <td>{humanName}</td>
            <td>{dogCounts[humanName]}</td>
        </tr>
    ))}
</tbody>
                    </Table>
                </div>
            )}
        </Fragment>
        
            

    );
}

export default Home;
