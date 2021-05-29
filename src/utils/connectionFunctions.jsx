import Video from 'twilio-video';
import { Client as ConversationsClient } from "@twilio/conversations";
import {Login} from '../Redux/ActionCreators/generalActions';
import { PostRequestApi} from '../utils/apiutils';

export let connected = false;
export let  room="";
export let  chat="";
export let  conv={};
export let  screenTrack="";
export let dict = new Map();
export let  now_streaming="";
export let  mentor="";
export let  curentusername="";
export let  participant= new Map();
export let recent_message="";


export async function capture1(props) {
    var canvas = await document.getElementById('canvas');
    var video = await document.getElementById('video');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight);  
    var img1 = canvas.toDataURL();
    props.setLoading(true);
    let dataTosend=JSON.stringify({img:img1});
    PostRequestApi('process_image',dataTosend).then(data => {
        console.log(data);
        if(data.ans)
       { conv.sendMessage(data.ans);}
        
    }).catch(e => {
        console.log(e);
        
    });
    props.setLoading(false);
};

export async function assignMentor(data){
    
    mentor = data.username;
    now_streaming = mentor;
    curentusername=data.username;
    connectButtonHandler(data);

    
}
export async function assignStudent(data){

    curentusername=data.username;
    connectButtonHandler(data);

}

export async function connectButtonHandler(data) {

    if (!connected) {
        let username = data.username;
        if (!username) {
            alert('Enter your name before connecting');
            return;
        }

        if(String(username)!=="undefined" && !participant[username]){
            participant[username]=true;

        
            connectUser(username,data.setlocalParticipantDiv,data.setLoading).then(() => {
        }).catch(() => {
            alert('Connection failed. Is the backend running?');
        });}
    }
    else {
        disconnect();
        connected = false;
    }
};

export  async function connectUser(username,setlocalParticipantDiv,setLoading) {
  
    const localDiv =await document.getElementById('local');

    let promise = new Promise((resolve, reject) => {
        // get a token from the back end
        let data={username:username};
        setLoading(true);
         PostRequestApi('login',data).then(_data => {
            data = _data;
            Login({username:username,code:"1",token:data.token});
            return Video.connect(String(data.token));
        }).then(_room => {
            setLoading(false);
            room = _room;
            if(username != now_streaming){
                setlocalParticipantDiv("participantHidden");
            }
            if(username == now_streaming){
                setlocalParticipantDiv("participant");
            }
            room.participants.forEach(participantConnected);
            room.on('participantConnected', participantConnected);
            room.on('participantDisconnected', participantDisconnected);
            connected = true;
            updateParticipantCount();
            devicesDisplay();
            connectChat(data.token, data.conversation_sid,username);
            resolve();
        }).catch(e => {
            console.log(e);
            reject();
        });
    });
    return promise;
};


export async function attachTracks(tracks) {
    const container =await document.getElementById('myVideo');

  tracks.forEach(function(track) {
    if (track) {
          let d = document.getElementById("myVideo");
      console.log(d.childNodes);
      try{
        d.removeChild(d.childNodes[0]);
      }catch(e){
         console.log(e);
      }
      let v = track.attach();
      v.setAttribute('id','video');
      console.log(v);
      container.appendChild(v);
    
    }
  });
   
}

export function detachTracks(tracks) {
  tracks.forEach(function(track) {
    if (track) {
      track.detach().forEach(function(detachedElement) {
       detachedElement.remove();
      });
    }
  });
}


export  function stopTracks(tracks) {
  tracks.forEach(function(track) {
    if (track) { track.stop(); }
  })
}



export  async function devicesDisplay(){
  navigator.mediaDevices.enumerateDevices().then(gotDevices);
  const select = await document.getElementById('video-devices');
  try{

      select.addEventListener('change', updateVideoDevice);
  }
  catch(e){
      console.log(e);
  }

}

export  async function gotDevices(mediaDevices) {
  console.log("KK");
  const select = await document.getElementById('video-devices');
//   select.innerHTML = `<option value="0">
//                Select Camera
//                 </option>`;
  
  let count = 0;
  mediaDevices.forEach(mediaDevice => {
    if (mediaDevice.kind === 'videoinput') {
      const option = document.createElement('option');
      option.value = mediaDevice.deviceId;
      const label = mediaDevice.label || `Camera ${count++}`;
      const textNode = document.createTextNode(label);
      option.appendChild(textNode);
      select.appendChild(option);
    }
  });
}


export  function updateVideoDevice(event) {
  const select = event.target;
  const localParticipant = room.localParticipant;
  if (select.value !== '') {
    const tracks = Array.from(localParticipant.videoTracks.values()).map(
      function(trackPublication) {
        return trackPublication.track;
      }
    );
    localParticipant.unpublishTracks(tracks);
    console.log(localParticipant.identity + ' removed track: ' + tracks[0].kind);

    detachTracks(tracks);
    stopTracks(tracks);
    Video.createLocalVideoTrack({
      deviceId: { exact: select.value }
    }).then(function(localVideoTrack) {
      localParticipant.publishTrack(localVideoTrack);
      console.log(localParticipant.identity + ' added track: ' + localVideoTrack.kind);
      const previewContainer = document.getElementById('myVideo');
      attachTracks([localVideoTrack], previewContainer);
    });
  }
}



export  async function updateParticipantCount() {
    const count = await document.getElementById('count');
    const bg=await document.getElementById("statusfield");
    const ic=await document.getElementById("statusicon");


    // alert(JSON.stringify(bg));
    
    if (!connected){
        try{
            bg.setAttribute('id',"statusfield");

        }
        catch(e){
            console.log(e);
        }
          ic.innerHTML = `<i class="fa fa-wifi"/>`;
          count.innerHTML = 'Disconnected';
        }
    else{
        try{
            bg.setAttribute('id',"statusfieldConnected");

        }
        catch(e){
            console.log(e);
        }
        ic.innerHTML = `<i class="fa fa-wifi" style="color:white"/>`;
        count.innerHTML = (room.participants.size + 1) + ' people online';
    }
};



export async function participantConnected(participant) {
    const container =await document.getElementById('container');

    let participantDiv = document.createElement('div');
    participantDiv.setAttribute('id', participant.sid);
    
if(participant.identity == now_streaming){
    participantDiv.setAttribute('class','participant');
}
else {
    participantDiv.setAttribute('class','participantHidden');   
}
    let tracksDiv = document.createElement('div');
    participantDiv.appendChild(tracksDiv);

    // let labelDiv = document.createElement('div');
    // labelDiv.setAttribute('class', 'label');
    // labelDiv.innerHTML = participant.identity;
    // participantDiv.appendChild(labelDiv);
    let ad=await document.getElementById('jainil');
    try{

        ad.innerHTML="Streaming "+(now_streaming==""?mentor:now_streaming);
    }catch(e){
        console.log(e);
    }

    dict[participant.identity] = participant.sid;

    container.appendChild(participantDiv);

    participant.tracks.forEach(publication => {
        if (publication.isSubscribed)
            trackSubscribed(tracksDiv, publication.track);
    });
    participant.on('trackSubscribed', track => trackSubscribed(tracksDiv, track));
    participant.on('trackUnsubscribed', trackUnsubscribed);

    updateParticipantCount();
};

export  async function participantDisconnected(participant) {
  let a= await document.getElementById(participant.sid);
  a.remove();
    updateParticipantCount();
};

export function trackSubscribed(div, track) {
    let trackElement = track.attach();
    trackElement.addEventListener('click', () => { zoomTrack(trackElement); });
    div.appendChild(trackElement);
};

export function trackUnsubscribed(track) {
    track.detach().forEach(element => {
        if (element.classList.contains('participantZoomed')) {
            zoomTrack(element);
        }
        element.remove()
    });
};

export  async function disconnect() {
    const toggleChat =await document.getElementById('toggle_chat');
    const root = await document.getElementById('root');
    const container =await document.getElementById('container');

    room.disconnect();
    if (chat) {
        chat.shutdown().then(() => {
            conv = null;
            chat = null;
        });
    }
    while (container.lastChild.id != 'local')
        container.removeChild(container.lastChild);
    // button.innerHTML = 'Join call';
    if (root.classList.contains('withChat')) {
        root.classList.remove('withChat');
    }
    try
    {
    toggleChat.disabled = true;
    connected = false;
    updateParticipantCount();}
    catch(e){
        console.log(e);
    }
};

export  async function shareScreenHandler() {
    // event.preventDefault();
    const shareScreen = await document.getElementById('share_screen');

    if (!screenTrack) {
        navigator.mediaDevices.getDisplayMedia().then(stream => {
            screenTrack = new Video.LocalVideoTrack(stream.getTracks()[0]);
            room.localParticipant.publishTrack(screenTrack);
            screenTrack.mediaStreamTrack.onended = () => { shareScreenHandler() };
            console.log(screenTrack);
            shareScreen.innerHTML = 'Stop sharing';
        }).catch(() => {
            alert('Could not share the screen.')
        });
    }
    else {
        room.localParticipant.unpublishTrack(screenTrack);
        screenTrack.stop();
        screenTrack = null;
        shareScreen.innerHTML = 'Share screen';
    }
};

export  async function zoomTrack(trackElement) {
    const container =await document.getElementById('container');



    if (!trackElement.classList.contains('trackZoomed')) {
        // zoom in
        container.childNodes.forEach(participant => {
            if (participant.classList && participant.classList.contains('participant')) {
                let zoomed = false;
                participant.childNodes[0].childNodes.forEach(track => {
                    if (track === trackElement) {
                        track.classList.add('trackZoomed')
                        zoomed = true;
                    }
                });
                if (zoomed) {
                    participant.classList.add('participantZoomed');
                }
                else {
                    participant.classList.add('participantHidden');
                }
            }
        });
    }
    else {
        // zoom out
        container.childNodes.forEach(participant => {
            if (participant.classList && participant.classList.contains('participant')) {
                participant.childNodes[0].childNodes.forEach(track => {
                    if (track === trackElement) {
                        track.classList.remove('trackZoomed');
                    }
                });
                participant.classList.remove('participantZoomed')
                participant.classList.remove('participantHidden')
            }
        });
    }
};

export async function connectChat(token, conversationSid,username) {
    const chatContent =await document.getElementById('chat-content');
    const toggleChat = await document.getElementById('toggle_chat');
    const usernameInput = username;
    return ConversationsClient.create(token).then(_chat => {//change
        chat = _chat;
        return chat.getConversationBySid(conversationSid).then((_conv) => {
            conv = _conv;
            conv.on('messageAdded', async(message) => {
                const val = await parseURL(message.author, message.body);
                if(val == 0)
                    addMessageToChat(message.author, message.body);
            });
            return conv.getMessages().then((messages) => {
                chatContent.innerHTML = '';
                console.log(messages.items.map((m)=>m.body));
                if(usernameInput == mentor){
                    conv.sendMessage('Mentor joined '+mentor);
                    
                }
                // alert("Let See");
                // for (let i = 0; i < messages.items.length; i++) {
                //     addMessageToChat(messages.items[i].author, messages.items[i].body);
                // }
                toggleChat.disabled = false;
            });
        });
    }).catch(e => {
        console.log(e);
    });
};

export  async function addMessageToChat(user, message) {
    const chatContent = await document.getElementById('chat-content');
    const chatScroll = await document.getElementById('chat-scroll');


    chatContent.innerHTML += `<p><b>${user}</b>: ${message}`;
    chatScroll.scrollTop = chatScroll.scrollHeight;
}

export  async function toggleChatHandler() {
    const chatScroll = await document.getElementById('chat-scroll');
    const ad= await document.getElementById('somebuttons');
    const root = await document.getElementById('root');

    // event.preventDefault();
    if (root.classList.contains('withChat')) {
        root.classList.remove('withChat');
        ad.style.display="block"
    }
    else {
        root.classList.add('withChat');
        chatScroll.scrollTop = chatScroll.scrollHeight;
        ad.style.display="none";

    }
};

export async function onChatInputKey(ev) {
    console.log('chat');

    const chatInput = await document.getElementById('chat-input');

    if (ev.keyCode == 13) {//enter
        console.log('enter pressed')
        conv.sendMessage(chatInput.value);
        chatInput.value = '';
    }
};




export async function parseURL(author, message) {
    console.log(message);
    const images = await document.getElementById('imageDiv');

    if(message.startsWith("https")){

        let image = document.createElement('img');

        image.setAttribute('class','myImg');

        image.setAttribute('src',message);

        images.appendChild(image);

        return 1;

    }
    else if(message.startsWith("qwerty")){
        
       try
        {   
            
        let speech = await document.getElementById('speech');

        speech.innerHTML=message.substr(5);
       }
        catch(e){
            console.log(e); 
        }
        return 1;

    }
    else if(message.startsWith("accept")){

        recent_message = author;
    
    }
    else if(message.startsWith("Access Granted ")== true && author == mentor){
        var now_id = dict[now_streaming];
        var want_id = dict[author];
        
        if(now_id==undefined){
            now_id = "local";
        }
        if(want_id == undefined){
            want_id = "local";
        }

        console.log(now_id);
        console.log(want_id);

        if(now_id != want_id){
           await document.getElementById(now_id).setAttribute('class','participantHidden');
           await document.getElementById(want_id).setAttribute('class','participant');
        }
        now_streaming = author;
    }

    else if(message.startsWith("Access Allowed") == true && author == mentor){
        
        var now_id = dict[now_streaming];
        var want_id = dict[recent_message];
        
        if(now_id==undefined){
            now_id = "local";
        }
        if(want_id == undefined){
            want_id = "local";
        }

        console.log(now_id);
        console.log(want_id);

        if(now_id != want_id){
           await document.getElementById(now_id).setAttribute('class','participantHidden');
           await document.getElementById(want_id).setAttribute('class','participant');
        }
        now_streaming = recent_message;

    }
    else if(message.startsWith("Mentor joined") == true){
        var want_id = dict[author];
        if(want_id == undefined){
            want_id = "local";
        }
       await document.getElementById(want_id).setAttribute('class','participant');

        now_streaming = author;
        mentor = author;
    }
    else if(message.startsWith("clear screen") == true && author == mentor){
        images.innerHTML = "";
    }

    return 0;
}


export function onStart() {
    if (
        !"mediaDevices" in navigator ||
        !"getUserMedia" in navigator.mediaDevices
    ) {
        alert("Camera API is not available in your browser");
        return;
    }

    // get page elements
    const video = document.querySelector("#video");

    // video constraints
    const constraints = {
        video: {
            width: {
                min: 1280,
                ideal: 1920,
                max: 2560,
            },
            height: {
                min: 720,
                ideal: 1080,
                max: 1440,
            },
        },
    };

    // use front face camera
    let useFrontCamera = true;

    // current video stream
    let videoStream;

    
    async function initializeCamera() {
        if (videoStream) {
            videoStream.getTracks().forEach((track) => {
                track.stop();
            });
        }
        constraints.video.facingMode = useFrontCamera ? "user" : "environment";

        try {
            videoStream = await navigator.mediaDevices.getUserMedia(constraints);
            video.srcObject = videoStream;
        } catch (err) {}
    }

    initializeCamera();
}


