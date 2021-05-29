import React from 'react';

export const Loading =(props)=>{
   
    return(
        <div className="spinner" style={{marginTop:"60px"}}>
            <span className="fa fa-spinner fa-pulse fa-7x fa-fw " style={{color:"white",zIndex:"100"}}></span>
            <h2 style={{color:"white"}}>{"Connecting"} . . .</h2>
        </div>
    )
}