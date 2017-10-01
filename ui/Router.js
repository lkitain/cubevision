import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link,
} from 'react-router-dom';

import Cubes from './Cubes';
import Cube from './Cube';
import Updater from './Updater';
import Missing from './Missing';
import AcquireCard from './AcquireCard';
import { OUR_CUBE, OUR_BINDER } from './consts';

const BasicExample = () => (
    <Router>
        <div>
            <ul>
                <li><Link to={`/cube/${OUR_CUBE}`}>Current Cube</Link></li>
                <li><Link to={`/cube/${OUR_BINDER}`}>Current Binder</Link></li>
                <li><Link to="/cubes">Cubes</Link></li>
                <li><Link to="/missing">Missing</Link></li>
                <li><Link to="/update">Update</Link></li>
                <li><Link to="/acquire">Acquire</Link></li>
            </ul>

            <hr />

            <Route path="/cubes" component={Cubes} />
            <Route path="/cube/:id" component={Cube} />
            <Route path="/missing" component={Missing} />
            <Route path="/update" component={Updater} />
            <Route path="/acquire" component={AcquireCard} />
        </div>
    </Router>
);

export default BasicExample;
