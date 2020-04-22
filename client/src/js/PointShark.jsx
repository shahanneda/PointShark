import React, {Component} from "react";
import EditPoints from "./EditPoints.jsx";
//import Login from "./Login.jsx";
import CreateAccount from "./CreateAccount.jsx";
import {Container} from "react-bootstrap";

import {
        HashRouter,
        Switch,
        Route,
        Link,
        Redirect,
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
class PointShark extends Component {

        constructor(props){
                super(props);
        }

        render(){
                return (<Container>

                        <HashRouter>
                                <Switch>
                                        <Route path="/login">
                                                login

                                        </Route>

                                        <Route path="/create-account">
                                                <CreateAccount url={this.props.url}/>
                                        </Route>

                                        <Route path="/edit-points">

                                                <EditPoints />
                                        </Route>

                                        <Route path="/">
                                                <Redirect to="/login" />
                                        </Route>


                                </Switch>

                        </HashRouter>

                </Container>
                );
        }

}

export default PointShark;
