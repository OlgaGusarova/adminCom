import React, { Component } from 'react';
import LanguageTable from './LanguageTable';
import LanguageEditPage from './LanguageEditPage';
import { Switch, Route, withRouter } from 'react-router';

class LanguagePage extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route path="/language/create"  component={LanguageEditPage}/>
          <Route path="/language/update/:id"  component={LanguageEditPage}/>
          <Route exact path="/language/admin" component={LanguageTable}/>
        </Switch>
      </div>
    );
  }
}

export default withRouter(LanguagePage);