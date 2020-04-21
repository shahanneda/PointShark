import React, {Component} from "react";
import EditPoints from "./EditPoints.jsx";

class PointShark extends Component {

        constructor(props){
                super(props);
        }

        render(){
                return (<div>
                                <EditPoints />
                        </div>
                );
        }

}

export default PointShark;
