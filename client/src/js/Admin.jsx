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
      goToEdit: false,
      points: 0,
      username:cookies.get("username"),
      isAdmin: false,
      users: {},
    };
  }

  componentDidMount(){
    this.updateData();
  }

  updateData = () => {
    const requestOptions = {
      method: 'get',
      headers: { 'Content-Type': 'application/json' },
    };
    fetch(this.props.url + "/getUsers", requestOptions).then(response => response.json()).then(response => {
      console.log(response);
      this.setState({users: response, isAdmin: response[this.state.username].admin});
    });
  }

  setUserScore = (id, score) => {

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({id: id, points: score})
    };
    fetch(this.props.url + "/setCurrentScore", requestOptions);
  }

  render(){
    if(cookies.get("loggedIn") != "true" || this.state.goToLogin){
      return(<Redirect to="/login" />);
    }
    if(this.state.goToEdit){
      return(<Redirect to="/edit-points" />);
    }

    let users = this.state.users;
    return (<div>

      <div className="d-flex align-items-center justify-content-center align-items-center account-wrapper ">
        <Card className="w-75">
          <Card.Header> 
            Logged in as <span className="text-primary mr-2">{this.state.username}</span>
            <div className="float-right">
              <Button className=" mr-2" onClick={ () =>{
                this.setState({ goToEdit: true}) ;

              }} >   Edit your Points</Button> 
              <Button varient="danger" onClick={ () =>{
                this.setState({ goToLogin: true}) ;
                cookies.set("loggedIn", "false",  { path: '/' });

              }} >   Logout </Button> 
            </div>

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
                          <th>
                            {users[id].currentPoints}

                            {this.state.isAdmin ?
                              <div>
                                <Button className="mr-2 ml-2" onClick={() =>{
                                  this.setUserScore(id, users[id].currentPoints+1)
                                  users[id].currentPoints +=1;
                                  this.setState({users: users}); 

                                }}>+</Button>

                                <Button className="mr-2 ml-2 btn-danger" onClick={() =>{
                                  this.setUserScore(id, users[id].currentPoints+1)
                                  users[id].currentPoints -=1;
                                  this.setState({users: users}); 

                                }}>-</Button> 
                              </div> : "" }


                          </th>

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
