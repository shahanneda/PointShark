import React, {Component} from "react";
import {Redirect} from "react-router-dom";

import Cookies from 'universal-cookie';
import {Card, Button, Row, Col, ListGroup, Table} from "react-bootstrap";

const cookies = new Cookies();

class Admin extends Component {

        constructor(props){
                super(props);
                this.state ={
                        goToLogin: false,
                        currentGameWonSelected: 0,
                        points: 0,
                        username:cookies.get("username"),
                        isAdmin: true,
                        users: {},
                };
        }

        componentDidMount(){
                const requestOptions = {
                        method: 'get',
                        headers: { 'Content-Type': 'application/json' },
                };
                fetch(this.props.url + "/getUsers", requestOptions).then(response => response.json()).then(response => {
                        console.log(response);
                        this.setState({users: response, isAdmin: response[this.state.username].admin});
                });
        }

        submitPoints = () => {

                const requestOptions = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({id: this.state.username, points: this.state.points})
                };
                fetch(this.props.url + "/setCurrentScore", requestOptions);
        }


        render(){
                if(cookies.get("loggedIn") != "true" || this.state.goToLogin || !this.state.isAdmin){
                        return(<Redirect to="/login" />);
                }

                let users = this.state.users;
                return (<div>

                        <div className="d-flex align-items-center justify-content-center align-items-center account-wrapper ">
                                <Card className="w-75">
                                        <Card.Header> 
                                                Logged in as <span className="text-primary mr-2">{this.state.username}</span>
                                                <Button varient="danger" onClick={ () =>{
                                                        this.setState({ goToLogin: true}) ;
                                                        cookies.set("loggedIn", "false",  { path: '/' });

                                                }} >   Logout </Button> 
                                        </Card.Header>


                                        <Card.Body>
                                                <Row> 
                                                        <Table  bordered hover>
                                                                <thead>
                                                                        <tr>
                                                                                <th>Name</th>
                                                                                <th>Current Points</th>
                                                                                <th>Last Points</th>
                                                                                <th>Time Updated</th>
                                                                                <th>Message</th>
                                                                        </tr>
                                                                </thead>
                                                                <tbody>
                                                                        {
                                                                                Object.keys(users).map( id => {
                                                                                        let date = new Date(users[id].lastUpdatedTime);
                                                                                        return(
                                                                                                <tr key={id}>
                                                                                                        <th>{id}</th>
                                                                                                        <th>{users[id].currentPoints}</th>
                                                                                                        <th>{users[id].lastPoints}</th>
                                                                                                        <th>{(date.getHours() > 12 ? date.getHours() % 12 : date.getHours()) + ":" + date.getMinutes()}</th>
                                                                                                        <th> {users[id].updateMessage}</th>
                                                                                                </tr>


                                                                                        );

                                                                                })
                                                                        }
                                                                </tbody>
                                                        </Table>
                                                </Row>
                                        </Card.Body>
                                </Card>
                        </div>


                </div> 
                );
        }

}

export default Admin;
