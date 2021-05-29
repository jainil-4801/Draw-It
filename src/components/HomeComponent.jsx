import React, { Component } from 'react';
import { Redirect } from 'react-router';
import '../css/style.css';
class HomeComponent extends Component {

    constructor(props){
        super(props);
        this.state={
            flag:false
        }
    }

    setFlag=(flag)=>{
        this.setState({flag:flag});
    }

    componentDidMount(){

    }
    render() {
        if(!this.state.flag)
        return (
            <div>
                <div style={{width:"440px",paddingTop:"60px",border:"1px solid black",margin:"auto",
                backgroundColor:"rgb(236 180 180)",
                 backgroundSize: "cover",borderRadius: "35px",border:"0px",height: "900px"}}>
                        <div class="ggh">
                            DrawIt
                        </div>

                        <div id="quote">
                            "Online learning is not the next big thing, it is now the big thing." <br /> -Donna J. Abernathy
                        </div>

                        <div id="start">
                            <button id="join" onClick={()=>{this.setFlag(true)}}>Join Class</button>
                        </div>
                </div>
            </div>
        )
        else{
            return(
                <Redirect to="/userenter"/>
            )
        }
    }
}

export default  HomeComponent;