import React from 'react';
import createReactClass from 'create-react-class';
import {Switch, Route} from 'react-router';
import {Link} from 'react-router-dom';

import ContentPage from './content/ContentPage';
import LanguagePage from './language/LanguagePage';
import Table from './Table';

var LeftMenu = createReactClass ({

  getInitialState() {
    return {
      activeMenu: ''
    }
  },

  isActiveClass(value) {
    if (value === this.state.activeMenu)
      return 'treeview menu-open';
    else
      return '';
  },

  isActiveUl(value) {
    if (value === this.state.activeMenu)
      return {display: 'block'};
    else
      return {};
  },

  onClick() {
    console.log(this.state.activeMenu);
  },

  openMenu(event) {
    var name = '';
    if (event.target.name !== undefined)
      name = event.target.name;
    else
      name = event.target.parentElement.name;

    if (this.state.activeMenu === '')
      this.setState({activeMenu: name});
    else if (this.state.activeMenu === name)
      this.setState({activeMenu: ''});
    else
      this.setState({activeMenu: name});
  },

  render(){
    return(
      <div>
        <ul className="sidebar-menu" data-widget="tree">
          <li><Link name="content" to="/content/admin"><i className="fa fa-link"></i>Контент</Link></li>
          <li><Link name="language" to="/language/admin"><i className="fa fa-link"></i>Языки</Link></li>
          <li className={this.isActiveClass("distribs")} onClick={this.openMenu}>
            <Link name="distribs" to="#"><i className="fa fa-link"></i> <span>Дистрибьюторы</span>
              <span className="pull-right-container">
                <i className="fa fa-angle-left pull-right"></i>
              </span>
            </Link>
            <ul className="treeview-menu" style={this.isActiveUl("distribs")}>
              <li>
                <Link name="distributor" to="/distributor/admin">
                  <i className="fa fa-angle-double-right"></i>Дистрибьюторы
                </Link>
              </li>
              <li>
                <Link name="distributor_сategory" to="/distributor_сategory/admin">
                  <i className="fa fa-angle-double-right"></i>Категории для дистрибьютеров
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    );
  }
});

var Content = createReactClass({
  render(){
    return(
      <div>
        <aside className="main-sidebar">
          <section className="sidebar">
            <LeftMenu/>
          </section>
        </aside>
        <div className="content-wrapper">
          <section className="content">
            <div className="row">
              <div className="col-xs-12">
                <div className="box">
                  <div className="box-body">
                    <Switch>
                      <Route path="/content" component={ContentPage}/>
                      <Route path="/language" component={LanguagePage}/>
                      <Route exact path="/" component={Table}/>
                    </Switch>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }
});

export default Content;