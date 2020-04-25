import React, {Component} from "react";
import {Redirect} from "react-router-dom";

import Cookies from 'universal-cookie';
import {Card, Button, Row, Col, ListGroup, Table, Modal} from "react-bootstrap";
import Repeatable  from "react-repeatable"

const cookies = new Cookies();

class ViewAll extends Component {

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
      currentRemoveUserId: "",
      showModal: false,
    };
  }

  componentDidMount(){
    this.updateData();
    setInterval(this.updateData, 30000)
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

  setUserScore = (id, score, message) => {

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({id: id, points: score, message: message})
    };
    fetch(this.props.url + "/setCurrentScore", requestOptions);
  }

  handleChangeScoreButton = (id, type, users) => {
    if(type == "+"){

      this.setUserScore(id, users[id].currentPoints + 1, users[id].updateMessage)
      users[id].currentPoints +=1;
    }else{
      this.setUserScore(id, users[id].currentPoints - 1, users[id].updateMessage)
      users[id].currentPoints -=1;
    }
    this.setState({users: users}); 

  };
  deleteUserClicked = () => {
    this.setState({showModal: false});

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({id: this.state.currentRemoveUserId})
    };

    fetch(this.props.url + "/deleteUser", requestOptions).then(() =>{
      this.updateData();
    });
    console.log("sent remove request");

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
                    {this.state.isAdmin ? <th> Delete </th> : ""}
                  </tr>
                </thead>
                <tbody>

                  <Modal show={this.state.showModal} onHide={() => this.setState({showModal: false})}>
                    <Modal.Header closeButton>
                      <Modal.Title>Are you sure?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>User will be deleted forever!</Modal.Body>
                    <Modal.Footer>
                      <Button variant="primary" onClick={() => this.setState({showModal: false})}>
                        Cancel
                      </Button>
                      <Button variant="danger" onClick={this.deleteUserClicked}>
                        Confirm
                      </Button>
                    </Modal.Footer>
                  </Modal>
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
                                <Repeatable
                                  tag="button"
                                  type="button"
                                  onHold={() => this.handleChangeScoreButton(id, "+", users)}
                                  onRelease={() => this.handleChangeScoreButton(id, "+", users)}
                                  className="mr-2 ml-2 btn btn-primary "
                                >
                                  +
                                </Repeatable>
                                <Repeatable
                                  tag="button"
                                  type="button"
                                  onHold={() => this.handleChangeScoreButton(id, "-", users)}
                                  onRelease={() => this.handleChangeScoreButton(id, "-", users)}
                                  className="mr-2 ml-2 btn btn-danger"
                                >
                                  -
                                </Repeatable>
                              </div> : "" }


                          </th>

                          <th>{users[id].lastPoints}</th>
                          <th>{(date.getHours() > 12 ? date.getHours() % 12 : date.getHours()) + ":" + (date.getMinutes() < 10? date.getMinutes() + "0" : date.getMinutes()) }</th>
                          <th> {users[id].updateMessage}</th>
                          {this.state.isAdmin && id != this.state.username  ? <th> <Button variant="danger" onClick={ ()=> this.setState({showModal: true, currentRemoveUserId: id}) }> Remove </Button> </th> : ""}
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

export default ViewAll;
