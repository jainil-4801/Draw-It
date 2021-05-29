import React, { Component,getState ,useState,useEffect,createRef} from 'react';
import Video from 'twilio-video';
import { Client as ConversationsClient } from "@twilio/conversations";
import '../css/style.css';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {Login} from '../Redux/ActionCreators/generalActions';
import { PostRequestApi} from '../utils/apiutils';
import {Loading} from './Loading';
import {conv,now_streaming,recent_message} from '../utils/connectionFunctions';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'



 function Mentor(props){
    const { transcript, resetTranscript } = useSpeechRecognition();
    
    const[ flag,setflag]=useState(false);
      useEffect(() => {
        try{
            if(conv!="" &&  flag&& transcript.length>=0){
                let message=transcript.length>=45?transcript.substr(transcript.length-40):transcript;
                conv.sendMessage("qwerty "+message);
            }
        }
        catch(e){
            console.group(e);
        }
       

      },[transcript]);


  

    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
        return null
      }

      const handleListen = event => {
          setflag(true);
        SpeechRecognition.startListening({continuous:true,autoPlay:true});
      };

   
  
     
      
    return(

        <div className="maindiv">

                               <div className="head titlefor">
                                    <h1 className="headingfor">DrawIt</h1>
                                </div>
                                  <div className="labelFor">

                                        <label for="username" className="style2 style11"> Welcome {props.name}  </label>
                                        <span><i class="style2 fa fa-1x fa-smile-wink"></i></span>
                                  </div>


                                        <br/>
                                        
                                            <div id="statusfield">
                                                        <p id="count" className="style2 style4">Disconnected  </p>
                                                        <span id="statusicon"><i className="fa fa-wifi"/></span>
                                           </div>


                            
                                     {props.load?<Loading/>:<>   <div className="cameradiv">

                                                    <select id="video-devices" className="optionCamera" onClick={handleListen}>
                                                        <option value="0">
                                                             Select Camera
                                                        </option>
                                                    </select>
                                            </div>

            
                                            <div id="one" className="label rootlabel">
                                                    <p className="ribbon">
                                                        <span class="text" id="jainil" >
                                                        Streaming  {now_streaming!=null?now_streaming:"Guest"}

                                                        </span>

                                                    </p>
                                           </div>
                                    <div id="root">
                                                           
                                            <div id="container" className="containers containeradd"    >
                                                                <div id="local" className={props.localDiv}>
                                                                            <div id="myVideo" className="vid">
                                                                                <video autoPlay playsInline id="video"></video>
                                                                            </div>

                                                                </div>
                                                                {props.imageload?<Loading/>:<span></span>}
                                                                <div id="imageDiv" >
                                                 {/* <!-- <img src="#" id="myImg" style="width: 400px; height: 308px; position: absolute; margin: auto; opacity: 0.5; left: 37%">
                         --> */}
                                                             </div>
                                                             <div id="final" className="final">
                                                                {transcript.length>=50?transcript.substr(transcript.length-50):transcript}
                                                            </div>
                                                           
                                                           
                                                    {/* <!-- more participants will be added dynamically here --> */}
                                                </div>
                                <canvas disabled id="canvas" className="canvasstyle"></canvas>

                                <div className="btngr">
                                                   <button id="share_screen" className="btnsharescreen" >

                                                        <i className="fa fa-2x fa-desktop"> </i>

                                                        <span className="tooltiptext">Share Screen</span>
                                                    </button>

                                                    <button id="toggle_chat" className="btntogglechat" onClick={()=>{props.toggleChatHandler()}} >
                                                        
                                                        <i className="fa fa-2x fa-comment style3"> </i>

                                                        <span className="tooltiptext">Toggle Chat</span>
                                                    </button>
                                                    <a href="/"><button id="Leave_call" className="btnleave">
                                                        <i className="fa fa-2x fa-phone style3" > </i>

                                                        <span className="tooltiptext">Leave Call</span>
                                                    </button></a>
                                            </div>

                                <div id="somebuttons">
                                               
                                                    <button className="btncapture" id="capture" onClick={()=>{props.capture1({setLoading:props.setImageLoading})}}>

                                                            <i className="fa fa-2x fa-camera"> </i>
                                                                <span className="tooltiptext">Capture Screenshot</span>

                                                    </button>
                                                <button className="btnclearscreen" onClick={()=>{ conv.sendMessage("clear screen");}} id="cls">
                                                   
                                                    <i className="fa fa-2x fa-hand-rock"></i>
                                                    <span className="tooltiptext">Clear Screen</span>

                                                </button>
                                </div>


                                    <div id="chat" className="chatstyle">
                                                <div className="chatscrolls" id="chat-scroll" >
                                                    <div id="chat-content">
                                                        {/* <!-- chat content will be added dynamically here --> */}
                                                    </div>
                                                </div>

                                                <div className="chatin">
                                                    <input id="chat-input" placeholder="Type Your Query" className="chatinput" type="text" onKeyUp={(e)=>{props.onChatInputKey(e)}}/>
                                                </div>

                                            <div className="style13">

                                                        <div className="style14">
                                                            <button id="Allow" onClick={()=>{ conv.sendMessage("Access Allowed to "+recent_message);}} className="allowbtn btnallow">
                                                                <i className="fa fa-2x fa-hand-pointer style3" > </i>
                                                                <span className="tooltiptext">Allow</span>
                                                            </button>
                                                        </div>
                                                        <div className="btnturnover">
                                                            <button id="turn_over" onClick={()=>{conv.sendMessage("Access Granted to "+props.mentor);
                                                                }} className="turnoverbtn style10" >
                                                                <i className="fa fa-2x fa-retweet style3" ></i>
                                                                <span className="tooltiptext">Turn Over</span>
                                                            </button>
                                                        </div>
                                            </div>
                                    </div>

                        </div>
                        </>}

                                        <script src="https://webrtc.github.io/adapter/adapter-latest.js"></script>
                                        <script src="https://code.jquery.com/jquery-3.5.1.min.js" integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=" crossorigin="anonymous"></script>
                                        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
                                        <script src="https://media.twiliocdn.com/sdk/js/video/releases/2.3.0/twilio-video.min.js"></script>
                                        <script src="https://media.twiliocdn.com/sdk/js/conversations/releases/1.0.0/twilio-conversations.min.js"></script>
                            </div>
                                
                            
                        
                                        
                                
    );
}
export default Mentor;
