import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom';

const Cubes = () => (
  <div>
    <h2>Cubes</h2>
  </div>
);

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
      </ul>

      <hr />

      <Route path="/cubes" component={Cubes} />
      <Route path="/missing" component={Missing} />
    </div>
  </Router>
);

export default BasicExample;
