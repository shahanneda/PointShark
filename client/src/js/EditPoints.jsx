import React, {Component} from "react";
import {Redirect} from "react-router-dom";

import Cookies from 'universal-cookie';
import {Card, Button, Row, Col, ListGroup} from "react-bootstrap";

const cookies = new Cookies();

class EditPoints extends Component {

        constructor(props){
                super(props);
                this.state ={
                        goToLogin: false,
                        currentGameWonSelected: 0,
                        points: 0,
                        username:cookies.get("username"),
                };
        }


        submitPoints(){

                const requestOptions = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: this.state.username, password:this.state.password})
                };
                fetch(this.props.url + "/loginUser", requestOptions).then(response => response.json()).then(response => {
                        console.log(response);
                        if(response.correctPass){
                                cookies.set('loggedIn', 'true', { path: '/' });
                                cookies.set('username', this.state.username, { path: '/' });
                                this.setState({goToEditPage: true})
                        }else{
                                this.setState({passwordInvalid: true});
                        }
                });
        }


        render(){
                if(cookies.get("loggedIn") != "true" || this.state.goToLogin){
                        return(<Redirect to="/login" />);
                }

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
                                                        <Col xs={12} md={6} className="">
                                                                <ListGroup>
                                                                        <ListGroup.Item onClick={() => this.setState({currentGameWonSelected: 3})} active={this.state.currentGameWonSelected == 3}>
                                                                                First Place (+3)
                                                                        </ListGroup.Item>
                                                                        <ListGroup.Item onClick={() => this.setState({currentGameWonSelected: 2})} active={this.state.currentGameWonSelected == 2}>
                                                                                Second Place (+2)
                                                                        </ListGroup.Item>
                                                                        <ListGroup.Item onClick={() => this.setState({currentGameWonSelected: 1})} active={this.state.currentGameWonSelected == 1}>
                                                                                Third Place (+1)
                                                                        </ListGroup.Item>

                                                                </ListGroup>
                                                                <div className="input-group justify-content-center align-items-center" >
                                                                        <Button className=" m-1" variant="primary" onClick={() =>{this.setState({points: this.state.points + this.state.currentGameWonSelected})}}> Add Points</Button> 
                                                                        <Button className=" m-1" variant="info" onClick={() =>{this.setState({points: this.state.points - this.state.currentGameWonSelected})}}> Subtract Points</Button> 
                                                                </div>
                                                        </Col>
                                                        <Col xs={12} md={6} > 

                                                                <div className="display-4 text-primary text-center">
                                                                        Your new points will be <span className="text-success"> {this.state.points}</span>
                                                                </div>
                                                                <Button className="w-100" variant="danger" onClick={this.submitPoints} > Submit Changes </Button>

                                                        </Col>
                                                </Row>
                                        </Card.Body>
                                </Card>
                        </div>


                </div> 
                );
        }

}

export default EditPoints;
