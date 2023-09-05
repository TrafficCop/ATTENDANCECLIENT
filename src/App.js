//https://medium.com/@ipenywis/intro-to-react-router-for-beginners-multiple-page-apps-461f4729bd3f
//this page only contains routes
import './App.css';
import MainPage from './pages/MainPage';
import TeachersHomePage from './pages/teachers/TeachersHomePage';
import AdminsHomePage from './pages/admins/AdminsHomePage';
import AdminsPage from './pages/admins/AdminsPage'
import Invalid from './pages/Invalid';
import TeachersPage from './pages/teachers/TeachersPage';
import AttendancePage from './pages/teachers/AttendancePage';
import ManagePage from './pages/teachers/ManagePage';
import {
  Navigate,
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
//other react router imports include: switch (which tells the program
//to try all imports one after another) and redirect (automatically redirects)



function App() {
  let token;

  async function getToken() {
    const tokenString = await window.sessionStorage.getItem('token');
    token = tokenString;
  }

  if (!getToken()) {
    return (
      <>
        <Router>
          <Routes>
            <Route path="/" element={<MainPage />} />'
            <Route exact path="/teachers" element={<TeachersHomePage/>}/>
            <Route exact path="/admins" element={<AdminsHomePage/>}/>
          </Routes>
        </Router>
      </>
    );
  }

  return (
  <Router>
    <Routes>
      //new method of routing here (use element, angles inside brackets)
      <Route exact path="/" element={<MainPage/>}/>
      <Route exact path="/teachers" element={<TeachersHomePage/>}/>
      <Route exact path="/teachers/main" element={<TeachersPage/>}/>
      <Route exact path="/teachers/attendance" element={<AttendancePage/>}/>
      <Route exact path="/teachers/manage-students" element={<ManagePage/>}/>
      <Route exact path="/admins" element={<AdminsHomePage/>}/>
      <Route exact path="/admins/home" element={<AdminsPage/>}/>
    </Routes>
  </Router>
  );
}

export default App;
