// Install Bootstrap using: npm install bootstrap
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // Create App.css file for custom styles

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <nav className={`sidebar${collapsed ? ' collapsed' : ''}`}>
      <div className="sidebar-header">
        <h3>My Sidebar</h3>
      </div>
      <ul className="list-unstyled">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/page1">Page 1</Link>
        </li>
        <li>
          <Link to="/page2">Page 2</Link>
        </li>
        <li>
          <Link to="/page3">Page 3</Link>
        </li>
        <li>
          <Link to="/page4">Page 4</Link>
        </li>
      </ul>
      <div className="toggle-btn" onClick={toggleSidebar}>
        <span>&#9658;</span>
      </div>
    </nav>
  );
};

const Home = () => <h2>Home</h2>;
const Page1 = () => <h2>Page 1</h2>;
const Page2 = () => <h2>Page 2</h2>;
const Page3 = () => <h2>Page 3</h2>;
const Page4 = () => <h2>Page 4</h2>;

const App = () => {
  return (
    <Router>
      <div className="wrapper">
        <Sidebar />
        <div id="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/page1" element={<Page1 />} />
            <Route path="/page2" element={<Page2 />} />
            <Route path="/page3" element={<Page3 />} />
            <Route path="/page4" element={<Page4 />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
