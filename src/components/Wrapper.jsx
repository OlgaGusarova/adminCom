import React, { Component } from 'react';
import Header from './Header';
import Content from './Content';
import Footer from './Footer';

class Wrapper extends Component {
  render(){
    return(
      <div>
        <div className="wrapperContent">
          <Header/>
          <Content/>
        </div>
        <Footer/>
      </div>
    );
  }
}

export default Wrapper;