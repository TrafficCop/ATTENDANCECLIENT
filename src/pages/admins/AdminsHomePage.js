import React, {useState, useRef} from "react";
import {useNavigate,
 BrowserRouter as Router,
  Route,
  Routes,} from "react-router-dom";
//Functional Component 
const AdminsHomePage = () => {
  //import and use the LogIn function from LogIn.js when done

  //note you can have if statements for returns - then you can
  //decide if a log in is valid - redirect -invalid = message
  const navigate = useNavigate();

  const [userDesc, setUserDesc] = useState('Username');
  const [passDesc, setPassDesc] = useState('Password');

  const usernameRef = useRef();
  const passwordRef = useRef();

  function clickHandle(e, type){
    if (type === "user") {
      if (e.target.value ==="Username") {
        setUserDesc("");
      }
    } else {
      if (e.target.value ==="Password") {
        setPassDesc("");
      }
    }
  }

  async function submit(e) {
    try {
      e.preventDefault()
      const user = String(usernameRef.current.value);
      const pass = String(passwordRef.current.value);
      const body = {
        "username": user,
        "password": pass
      }
      let response = await fetch(`/login/admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json",
        'Accept': 'application/json'},
        body: JSON.stringify(body)
      });

      response = await response.json();
      let token = response;
      //response = await JSON.stringify(response);
      response = await (fetch('/user/validateToken', {
        method: "GET",
        headers: { "token_header_key": response,
        'userId': user,
        "admin": 'true', 
        'Accept': 'application/json'},
      }));
      response = await response.json();
      response = await JSON.stringify(response);

      if (response === '"success"') {
        await window.sessionStorage.setItem('token', JSON.stringify(token));
        await window.sessionStorage.setItem('type', 'admin');
        await window.sessionStorage.setItem('userId', user);
        navigate('/admins/home');
      } else {
        alert("Invalid login");
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
    <div>
      <h3>Welcome Admin</h3>
      <small>Please sign in </small>
      <form>
      <div className="form-group">
        <input ref={usernameRef} type="text" value={userDesc} onClick={e=>clickHandle(e,"user")} onChange={e=> setUserDesc(e.target.value)}>
        </input>
        <input ref={passwordRef} type="text" value={passDesc} onClick={e=>clickHandle(e,"pass")} onChange={e=> setPassDesc(e.target.value)}>
        </input>
        <button onClick={e => submit(e)}>Sign in</button>
      </div>
      </form>
    </div>
    </>
  );
};

export default AdminsHomePage;