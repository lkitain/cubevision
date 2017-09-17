import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom';

import Cubes from './Cubes';
import Cube from './Cube';
import Updater from './Updater';

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
      <Route path="/update" component={Updater} />
    </div>
  </Router>
);

export default BasicExample;
