import React, {useState, useRef, useEffect} from 'react';
const download = require('downloadjs');



export default function AdminsPage({name}) {
    let token;
    let type;
    let user;

    async function getToken() {
        const tokenString = await window.sessionStorage.getItem('token');
        const typeString = await window.sessionStorage.getItem('type');
        const userString = await window.sessionStorage.getItem('userId');
        token = tokenString
        type = typeString
        user = userString
    }

    async function validate() {
        await getToken();
        if (token) {
        let resp = await fetch('/user/validateToken', {
            method: "GET",
            headers: { "token_header_key": token, "userId": user, "admin": 'true'},
        })
        
        resp = await resp.json();
        resp = await JSON.stringify(resp);
        if (resp !== '"success"' || type !== 'admin') {
            return false;
        } 
        return true
        } 
        return false;
    }

    
    const [dState, setDState] = useState('');
    const downloadRef = useRef();

    async function downloadEvent(e) {
        e.preventDefault();
        const tablename = downloadRef.current.value;
        const body = {
            "tblname": tablename
        };
        let response = await fetch("/admins/download/", {
            method: "POST",
            headers: { "Content-Type": "application/json",
                    'Accept': 'application/json'},
            body: JSON.stringify(body)
        })
        const blob = await response.blob();
        download(blob, 'table.csv');
    }

    const [bool, setBool] = useState(true);
    useEffect(() => {
        async function valid() {
            setBool(await validate());
        }
        valid();
    })
    if (!bool) {
        return <div>You are not authorized to access this page</div>
    } else {
    return (
        <>
        <div>
            <h3>Download a table {name}</h3>
            <form>
            <div className="form-group">
                <input ref={downloadRef} type="text" value={dState} onChange={e=> setDState(e.target.value)}></input>
                <button onClick={(e)=> downloadEvent(e)}>Download Table</button>
            </div>
            </form>
        </div>
        </>
    );
    }
};