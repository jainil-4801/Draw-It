import React, { Component,getState } from 'react';
import '../css/style.css';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {Login} from '../Redux/ActionCreators/generalActions';
import { PostRequestApi} from '../utils/apiutils';
import {Loading} from './Loading';
import Mentor from './MentorComponent';
import Student from './StudentComponent';
import {onStart,assignMentor,assignStudent,toggleChatHandler,capture1,conv,onChatInputKey,now_streaming,recent_message,mentor} from '../utils/connectionFunctions';


const mapStateToProps =(state)=>({
    username: state.generalReducer.username,
    usercode: state.generalReducer.usercode,
    token:state.generalReducer.token
})



const mapDispatchToProps = dispatch=>({
    Login:(data)=>dispatch(Login(data)),
});

class UserEnterComponent extends Component {

    constructor(props){
        super(props);
        this.state={
            name:"",
            code:"",
            localDiv:"participantHidden",
            count:0,
            student:false,
            mentor:false,
            load:false,
            imageload:false
        }
        this.handleSubmit=this.handleSubmit.bind(this);
        this.setlocalParticipantDiv=this.setlocalParticipantDiv.bind(this);
        this.setCount=this.setCount.bind(this);
        this.setLoading=this.setLoading.bind(this);
        this.setImageLoading=this.setImageLoading.bind(this);

    }


    async componentDidMount (){
       onStart();
   
    }

    setLoading(flag){
        this.setState({load:flag});
    }
    setImageLoading(flag){
        this.setState({imageload:flag});
    }
    setlocalParticipantDiv(name){
        this.setState({localDiv:name})
    }

    setCount(count){
        this.setState({count:count})
    }
    setRole(role){
        if(role=="student"){
            this.setState({student:true});
            assignStudent({username:this.state.name,code:this.state.code,setlocalParticipantDiv:this.setlocalParticipantDiv,setLoading:this.setLoading});
            }
        else{

            this.setState({mentor:true});
            assignMentor({username:this.state.name,code:this.state.code,setlocalParticipantDiv:this.setlocalParticipantDiv,setLoading:this.setLoading});
        }


    }
    handleSubmit(event){
     event.preventDefault();
    }


    render() {

        if(!this.state.student && !this.state.mentor){
            return (
                <div className="maindiv" >
                                <div className="head titlefor">
                                    <h1 className="headingfor">DrawIt</h1>
                                </div>

                                        <form className="formstyle formfor" onSubmit={this.handleSubmit}>
                                                <div id="name" className="namefield">
                                                    <label for="username" className="style2">{(!this.state.student && !this.state.mentor)?"Enter Name":("Welcome ")}{(!this.state.student && !this.state.mentor)?"": <i class="fas fa-smile-wink"></i>} </label>
                                                </div>
                                                <div id="name_input" className="nameinput">
                                                    <i className="fas fa-user style3"></i> 
                                                    <input type="text" autocomplete="off"  className="inputfield" name="username" id="username" onChange={(e)=>this.setState({name:e.target.value})}/>
                                                </div>
                                                    <div id="room" className="roomcode">
                                                        <label for="code" className="style2">Enter Room Code</label>
                                                    </div>


                                                <div id="room_input" className="iconfor">
                                                    <i className="fas fa-key style3"></i> 
                                                    <input type="text" className="inputfield2" name="code" id="code" onChange={(e)=>this.setState({code:e.target.value})}/>
                                                </div>

                                                    {/* <div className="statusfield">
                                                        <p id="count" className="style2 style4">Disconnected</p>
                                                    </div> */}

                                                    
                                            <div className="style5">
                                                    <div id="panel" className="joinfield">
                                                        <div className="asfield">
                                                            Join As
                                                        </div>
                                                        <div className="style7">
                                                            <button  className="b1 style7" id="join_leave_student" onClick={(e)=>{ this.setRole("student");}} >Student</button>
                                                            <button  className="b2 style8" id="join_leave_mentor" onClick={(e)=>{this.setRole("mentor");}}>Mentor</button>
                                                        </div>
                                                    </div>
                                                
                                                </div>
                            {/* <!-- <button id="toggle_chat" disabled>Toggle chat</button> --> */}
                                </form>


      </div >
        )
}
    else if(this.state.mentor){
        return(
            <Mentor
            name={this.state.name}
            load={this.state.load}
            imageload={this.state.imageload}
            localDiv={this.state.localDiv}
            toggleChatHandler={toggleChatHandler}
            capture1={capture1}
            conv={conv}
            onChatInputKey={onChatInputKey}
            mentor={mentor}
            recent_message={recent_message}
            setImageLoading={this.setImageLoading}

            />
        )}


    else if(this.state.student){
        return(
            <Student
            name={this.state.name}
            load={this.state.load}
            imageload={this.state.imageload}
            localDiv={this.state.localDiv}
            toggleChatHandler={toggleChatHandler}
            capture1={capture1}
            conv={conv}
            onChatInputKey={onChatInputKey}
            mentor={mentor}
            recent_message={recent_message}
            now_streaming={now_streaming}
            setImageLoading={this.setImageLoading}
                                        />
                                  )
                    }
                                        
        
       
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserEnterComponent));
