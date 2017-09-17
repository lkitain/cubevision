import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom';

import Cubes from './Cubes';
import Cube from './Cube';

class Update extends React.Component {
    constructor(props) {
        super(props);
        this.handleSave = this.handleSave.bind(this);
    }
    handleSave() {
        fetch('/api/cube/postcube', {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({
                name: this.name.value,
                cards: this.cards.value,
            }),
        });
    }
    render() {
        return (
          <div>
            <input ref={(name) => { this.name = name; }} />
            <textarea ref={(cards) => { this.cards = cards; }} />
            <button onClick={this.handleSave}>Save</button>
          </div>
        );
    }
}

const Missing = () => (
  <div>
    <h2>Missing</h2>
  </div>
);

const BasicExample = () => (
  <Router>
    <div>
      <ul>
        <li><Link to="/cubes">Cubes</Link></li>
        <li><Link to="/missing">Missing</Link></li>
        <li><Link to="/update">Update</Link></li>
      </ul>

      <hr />

      <Route path="/cubes" component={Cubes} />
      <Route path="/cube/:id" component={Cube} />
      <Route path="/missing" component={Missing} />
      <Route path="/update" component={Update} />
    </div>
  </Router>
);

export default BasicExample;
