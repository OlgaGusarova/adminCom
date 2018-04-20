import React, {Component} from 'react';
import { Switch, Route, withRouter } from 'react-router';
import Wrapper from './Wrapper';

class MainRoute extends Component {
  render(){
    return(
      <div>
        <Switch>
          <Route path='/' component={Wrapper} />
        </Switch>
      </div>
    );
  }
}

export default withRouter(MainRoute);