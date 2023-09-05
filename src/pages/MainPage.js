import React from "react";
import {Link} from "react-router-dom";
//Functional Component 
const MainPage = () => {
  return (
    <>
    <div className="container">
      <div className="title">
      <h3>Welcome FCS</h3>
      <small>Select your role to begin</small>
      </div>
      <div className="home">
      <Link to="/admins"><button>Admins</button></Link>
      <Link to="/teachers"><button>Teachers</button></Link>
      </div>
    </div>
    </>
  );
};

export default MainPage;