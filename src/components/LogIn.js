//contains function pertaining to log ins
import React from 'react';
import {Redirect} from 'react-router-dom';

function verify(){
    if(localStorage.getItem('token') === null){
        return (
          <div>Invalid Login</div>  
        );
    }
    return(
        <Redirect to="/" />
    );
}
