import * as Actions from './Actions';
export const initialState={
    username:null,
    usercode:null,
    isLoading:false,
    errMess:null,
    token:null,
    image:null
}
export const generalReducer =( state=initialState, action)=>{
    switch(action.type){

        case Actions.USERS_LOADING:
            return {...state, isLoading: true, errMess: null, username: null,usercode:null, token:null}
        case Actions.USER_LOGIN_SUCCESS:
            return {...state, isLoading: false, errMess: null, username: action.payload.username, usercode : action.payload.code,token :action.payload.token}
        case Actions.USER_LOGIN_FAILED:
            return {...state, isLoading: false, errMess: "LOGIN FAILED", username: null, usercode : null,token :null}
        
    
        default:
            return state;
    }

}