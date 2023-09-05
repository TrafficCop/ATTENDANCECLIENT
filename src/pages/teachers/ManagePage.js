import React, {useState, useRef, useEffect} from 'react';
import EntryList from './EntryList';

export default function ManagePage() {
    const type="manage";
    const [attlist, setAttlist] = useState([]);

    const [counter, setCounter] = useState(1);
    const [firstName, setFirstName] = useState('First Name');
    const [lastName, setLastName] = useState('Last Name');
    const firstNameRef = useRef();
    const lastNameRef = useRef();

    let token;
    let typelog;
    let user;

    async function getToken() {
        const tokenString = await window.sessionStorage.getItem('token');
        const typeString = await window.sessionStorage.getItem('type');
        const userString = await window.sessionStorage.getItem('userId');
        token = tokenString
        typelog = typeString
        user = userString
    }

    async function validate() {
        await getToken();
        if (token) {
        let resp = await fetch('/user/validateToken', {
            method: "GET",
            headers: { "token_header_key": token, "userId": user, "admin": 'false'},
        })
        
        resp = await resp.json();
        resp = await JSON.stringify(resp);
        if (resp !== '"success"' || typelog !== 'teacher') {
            return false;
        } 
        return true
        } 
        return false;
    }

    const [bool, setBool] = useState(true);
    useEffect(() => {
        async function valid() {
            setBool(await validate());
        }
        valid();
    })

    async function addHandle(){
        const first = firstNameRef.current.value;
        const last = lastNameRef.current.value;
        let lastname = ''
        if (last !== '') {
            lastname = " " + last;
        }
        const name = first + lastname;
        const body = {
            "name": name,
        }
        const userId = await window.sessionStorage.getItem('userId');
        const query = `/teachers/${userId}/manage-student`;
        const data = await fetch(query, {
            method: "PUT",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify(body),
        });
        let response = await data.json();
        alert(response);
        setCounter(counter + 1);
    }

    async function removeHandle(){
        const first = firstNameRef.current.value;
        const last = lastNameRef.current.value;
        let lastname = ''
        if (last !== '') {
            lastname = " " + last;
        }
        const name = first + lastname;
        const body = {
            "name": name,
        }
        const userId = await window.sessionStorage.getItem('userId');
        const query = `/teachers/${userId}/manage-student`;
        const data = await fetch(query, {
            method: "DELETE",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify(body),
        });
        let response = await data.json();
        alert(response);
        setCounter(counter + 1);
    }

    function clickHandle(e, type){
        if (type === "first") {
          if (e.target.value ==="First Name") {
            setFirstName("");
          }
        } else {
          if (e.target.value ==="Last Name") {
            setLastName("");
          }
        }
    }

    useEffect(() => {
        async function getData() {
            const userId = await window.sessionStorage.getItem('userId');

            const query  = `/teachers/current-students/${userId}`;
            const response = await fetch(query, {
                method: "GET",
                headers: { "Content-Type": "application/json"}
            });

            return response.json();
        }
        async function setData() {
            setAttlist(await getData()); 
        }
        setData();
    }, [counter]);

    if (!bool) {
        return <div>You are not authorized to access this page</div>
    }

    return (
        <>
            <div className="form-container">
                <div className="left">
                    <input ref={firstNameRef} onClick={e=>clickHandle(e, "first")} onChange={e=>setFirstName(e.target.value)} value={firstName}></input>
                    <input ref={lastNameRef} onClick={e=>clickHandle(e, "last")} onChange={e=>setLastName(e.target.value)} value={lastName}></input>
                </div>
                <div className="right">
                    <button className="green" onClick={e=>addHandle()}>Add student</button>
                    <button className="red" onClick={e=>removeHandle()}>Remove student</button>
                </div>
            </div>
            <table className="manage">
                <tbody>
                    <tr>
                        <th className="manage">Name</th>
                    </tr>
                    <EntryList entries={attlist} type={type}/>
                </tbody>
            </table>
            
        </>
    )
}
