import React, {Component} from "react";
import {Redirect} from "react-router-dom";

import Cookies from 'universal-cookie';
import {Card, Button} from "react-bootstrap";

const cookies = new Cookies();

class EditPoints extends Component {

        constructor(props){
                super(props);
                this.state ={
                        goToLogin: false,
                };
        }

        render(){
                if(cookies.get("loggedIn") != "true" || this.state.goToLogin){
                        return(<Redirect to="/login" />);
                }

                return (<div>
                        <Button varient="danger" onClick={ () =>{
                                this.setState({ goToLogin: true}) ;
                                cookies.set("loggedIn", "false",  { path: '/' });

                        }} > Logout </Button> 


                </div> 
                );
        }

}

export default EditPoints;
