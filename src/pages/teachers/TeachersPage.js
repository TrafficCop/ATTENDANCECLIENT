import React from 'react';
import {Link} from "react-router-dom";

const TeachersPage = () => {
    return (
        <>
        <div className="main">
        <Link to="/teachers/manage-students"><button className="option">Manage students</button></Link>
        <Link to="/teachers/attendance"><button className="option">Take today's attendance</button></Link>
        </div>
        </>
    );
}

export default TeachersPage;