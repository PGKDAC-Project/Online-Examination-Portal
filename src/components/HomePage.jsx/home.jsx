import { Link } from 'react-router';

function Home() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">My Learning Platform</Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNavDropdown"
                    aria-controls="navbarNavDropdown"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul className="navbar-nav ms-auto"> {/* ms-auto to push items to the right */}
                        <li className="nav-item">
                            <Link className="nav-link" to="/login">Login</Link>
                        </li>
                        {/* add other navbar items here */}
                        <li className="nav-item">
                            {/* Assuming you have a route for /about in App.jsx */}
                            <Link className="nav-link" to="/about">About</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Home;