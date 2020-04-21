import React, {Component} from "react";
import EditPoints from "./EditPoints.jsx";
//import Login from "./Login.jsx";
//import CreateAccount from "./CreateAccount.jsx";

import {
        HashRouter,
        Switch,
        Route,
        Link,
        Redirect,
} from "react-router-dom";
class PointShark extends Component {

        constructor(props){
                super(props);
        }

        render(){
                return (<div>
                        <HashRouter>
                                <Switch>
                                        <Route path="/login">
                                                login

                                        </Route>

                                        <Route path="/create-account">
                                                create
                                        </Route>

                                        <Route path="/edit-points">

                                                <EditPoints />
                                                edit
                                        </Route>

                                        <Route path="/">
                                                <Redirect to="/login" />
                                        </Route>


                                </Switch>

                        </HashRouter>

                </div>
                );
        }

}

export default PointShark;
