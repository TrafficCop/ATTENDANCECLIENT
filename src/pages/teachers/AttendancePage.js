import React, {useState, useRef, useEffect} from "react";
import EntryList from "./EntryList";
/*When a teacher signs onto this page each day, we perform a query to the database
to see if the attendance log for today has been made. if not, it automatically creates one.
The display will contain a sign in/sign out where people can type in first and last name then 
click the sign in button. 
The sign out can not be done until sign in has happened (for this specific person - do a query).
Each sign in causes the page to rerender a list of people signed in today.
*/

const AttendancePage = () => {
    const [attlist, setAttlist] = useState([]);
    const init = 1;
    let [counter, setCounter] = useState(1);

    const firstNameRef = useRef();
    const lastNameRef = useRef();
    const [firstName, setFirstName] = useState("First Name");
    const [lastName, setLastName] = useState("Last Name");

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
        async function setUp() {
            const userId = await window.sessionStorage.getItem('userId');
            const qury = `/teachers/attendance/${userId}`;
            const resp = await fetch(qury, {
                method: "POST",
                headers: { "Content-Type": "application/json"},
            });
        }
        setUp();
    }, [init]);
    
    useEffect(() => {
        async function getData() {
            const userId = await window.sessionStorage.getItem('userId');

            const query  = `/teachers/current/${userId}`;
            const response = await fetch(query, {
                method: "GET",
                headers: { "Content-Type": "application/json"}
            });

            //const qry = `/teachers/${userId}/attendance/sign-in`;
            /*const data = await fetch("/teachers/teacher/sign-in",
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });*/
            return response.json();
        }
        async function setData() {
            setAttlist(await getData()); 
        }
        setData();
    }, [counter]);

    async function signIn() {
        let lastname = '';
        if (lastNameRef.current.value !== '') 
            lastname = " " + lastNameRef.current.value;
        const name = firstNameRef.current.value + lastname;
        const userId = await window.sessionStorage.getItem('userId');
        const qry = `/teachers/${userId}/sign-in`;
        const body = {
            "name": name,
        }
        const data = await fetch(qry, {
            method: "PUT",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify(body)
        });

        let response = await data.json();

        alert(response)
        setCounter(counter + 1);
    }

    async function signOut() {
        let lastname = '';
        if (lastNameRef.current.value !== '') 
            lastname = " " + lastNameRef.current.value;
        const name = firstNameRef.current.value + lastname;
        const userId = await window.sessionStorage.getItem('userId');
        const qry = `/teachers/${userId}/sign-out`;
        const body = {
            "name": name,
        }
        const data = await fetch(qry, {
            method: "PUT",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify(body)
        });

        let response = await data.json();

        alert(response)
        setCounter(counter + 1);
    }
    const [type, setType] = useState("attendance");

    if (!bool) {
        return <div>You are not authorized to access this page</div>
    }

    return (
        <>
        <div className="form-container">
        <div className="left">
        <input ref={firstNameRef} value={firstName} onChange={e=> setFirstName(e.target.value)} onClick={e=>clickHandle(e, "first")}></input>
        <input ref={lastNameRef} value={lastName} onChange={e=> setLastName(e.target.value)} onClick={e=>clickHandle(e, "last")}></input>
        </div>
        <div className="right">
        <button className="green" onClick={e=>signIn()}>Sign in</button>
        <button className="red" onClick={e=>signOut()}>Sign out</button>
        </div>
        </div>
        <table>
            <tbody>
                <tr>
                    <th>Name</th>
                    <th>Time in</th>
                    <th>Time out</th>
                </tr>
                <EntryList entries={attlist} type={type}/>
            </tbody>
        </table>
        </>
    )
}

export default AttendancePage;
