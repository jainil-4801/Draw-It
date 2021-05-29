import * as ActionType from '../Actions';
// import Axios from 'axios';
// import { PostRequestApi} from '../../utils/apiutils';


export const Login=(data)=>async(dispatch)=>{
    try{
 
    if(data['token'].length>0){

        dispatch(loginSuccess({username:data.username,code:data.code,token:data.token}));
    }
    else{
        dispatch(loginFailed(null));
    }
    }catch(error){
        console.log(error)
    }
}


export const loginSuccess = (data) => ({
type: ActionType.USER_LOGIN_SUCCESS,
payload:data
});

export const loginFailed = (data) => ({
type: ActionType.USER_LOGIN_FAILED,
payload:data
});