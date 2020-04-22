import React, {Component} from "react";
import {Redirect} from "react-router";
import Cookies from 'universal-cookie';

import {Form, Button, Card} from "react-bootstrap"; 
const cookies = new Cookies();

class CreateAccount extends Component {

        constructor(props){
                super(props);
                this.state = {
                        username:"",
                        password:"",
                        usernameInvalid:false,
                        passwordInvalid:false,
                        goToLogin: false,
                }
        }

        passswordChange = (event) => {
                this.setState({password: event.target.value});
        }
        usernameChange = (event) => {
                this.setState({username: event.target.value});

                const requestOptions = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: event.target.value})
                };
                fetch(this.props.url + "/userExists", requestOptions)
                        .then(response => {return response.json()})
                        .then(response => {
                                console.log(response);
                                this.setState({usernameInvalid: response.exists})
                        });
        }
        submitButtonClicked = (event) => {
                if(this.state.usernameInvalid || this.state.username == "") {
                        return;
                }
                const requestOptions = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: this.state.username, password:this.state.password})
                };
                fetch(this.props.url + "/newUser", requestOptions);
                cookies.set('loggedIn', 'true', { path: '/' });
                cookies.set('username', this.state.username, { path: '/' });
                this.setState({goToLogin: true});

        }

        render(){
                if(cookies.get('loggedIn') == 'true'){
                        return(<Redirect to="/edit-points" /> );
                }
                if(this.state.goToLogin){
                        return(<Redirect to="/login" /> );
                }
                return (
                        <div className="d-flex align-items-center justify-content-center align-items-center account-wrapper ">
                                <Card className="">
                                        <Card.Body>
                                                <Card.Title>Create Account</Card.Title>
                                                <Form>

                                                        <Form.Group controlId="formBasicEmail">
                                                                <Form.Label>Login</Form.Label>
                                                                <Form.Control isInvalid={this.state.usernameInvalid}  value={this.state.username} onChange={this.usernameChange} type="username" placeholder="Enter Username" />
                                                                <Form.Control.Feedback type="invalid">
                                                                        Username is already taken
                                                                </Form.Control.Feedback>
                                                        </Form.Group>

                                                        <Form.Group controlId="formBasicPassword">
                                                                <Form.Label>Password</Form.Label>
                                                                <Form.Control isInvalid={this.state.isInvalid} value={this.state.password} onChange={this.passswordChange} type="password" className="" placeholder="Password" />
                                                                <Form.Control.Feedback type="invalid">
                                                                        Not valid
                                                                </Form.Control.Feedback>
                                                        </Form.Group>
                                                        <Form.Group className="">
                                                                <Button variant="primary" type="submit" className="login-button" onClick={this.submitButtonClicked}>
                                                                        Create Account
                                                                </Button>

                                                                <Button variant="info" type="" className="login-button" onClick={ () => this.setState({goToLogin: true})}>
                                                                        Go to Login Page
                                                                </Button>
                                                        </Form.Group>
                                                </Form> 
                                        </Card.Body>
                                </Card>
                        </div> 
                );
        }

}

export default CreateAccount;
