import React, { Component } from 'react'
import {Switch,Route,Redirect,withRouter} from 'react-router-dom';
import HomeComponent from './HomeComponent';
import UserEnterComponent from './UserEnterComponent';
import { connect } from 'react-redux';
import {Loading} from './LoadingComponent';

const mapStateToProps =(state)=>({
    token: state.generalReducer.token,

})
class MainComponent extends Component {

    constructor(props){
        super(props);
        this.state={

        }
    }

    componentDidMount(){

    }
    render() {


        const HomePage=()=>{
            return(
    
                <div  >

                    <HomeComponent/>
    
                </div>
                
            )
            }

            const UserEnter=()=>{
                return(
        
                    <div  >
    
                        <UserEnterComponent/>
        
                    </div>
                    
                )
                }

        return (
            <Switch>
                    <Route path='/home' component={HomePage}></Route>
                    <Route path='/userenter' component={UserEnter}></Route>
                    <Redirect to='/home'/>
            </Switch>
        )
    }
}

export default withRouter(connect(mapStateToProps)(MainComponent));
