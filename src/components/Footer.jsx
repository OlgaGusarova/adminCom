import React, { Component } from 'react';

class Footer extends Component {
  render(){
    return(
        <footer className="main-footer footer">
          <div className="pull-right hidden-xs">
            RumexComAdmin
          </div>
          <strong>Copyright &copy; 2018 RumexGroup.</strong> All rights reserved.
        </footer>
    );
  }
}

export default Footer;