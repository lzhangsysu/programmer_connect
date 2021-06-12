import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
    return (
      <section className="landing">
        <div className="dark-overlay">
          <div className="landing-inner">
            <h1 className="x-large">Programmer Connect</h1>
            <p className="lead">
              Create a programmer profile, share posts and connect with fellow programmers
            </p>
            <div className="buttons">
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
              <Link to="/login" className="btn btn-light">Login</Link>
            </div>
          </div>
        </div>
      </section>
    )
};

export default Landing;