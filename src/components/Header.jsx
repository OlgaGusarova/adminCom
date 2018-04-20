import React, { Component } from 'react';

class Header extends Component {
  render(){
    return(
      <div className="header">
        <header className="main-header">
          <div className="logo">Admin</div>
          <nav className="navbar navbar-static-top" role="navigation">
            <div className="navbar-custom-menu">
            </div>
          </nav>
        </header>
      </div>
    );
  }
}

export default Header;