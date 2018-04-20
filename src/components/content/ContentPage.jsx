import React, { Component } from 'react';
import ContentTable from './ContentTable';
import ContentEditPage from './ContentEditPage';
import { Switch, Route, withRouter } from 'react-router';

class ContentPage extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route path="/content/create" component={ContentEditPage}/>
          <Route path="/content/update/:id" component={ContentEditPage}/>
          <Route exact path="/content/admin" component={ContentTable}/>
        </Switch>
      </div>
    );
  }
}

export default withRouter(ContentPage);