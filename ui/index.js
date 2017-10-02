import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { StyleRoot } from 'radium';

import { fetchCubes, fetchCards, fetchCubeCards } from './actions';
import Router from './Router';
import todoApp from './reducers';

const store = createStore(
    todoApp,
    applyMiddleware(
        thunkMiddleware,
    ),
);

store.dispatch(fetchCubes());
store.dispatch(fetchCards());
store.dispatch(fetchCubeCards());

window.store = store;

ReactDOM.render(
    <Provider store={store}>
        <StyleRoot>
            <Router />
        </StyleRoot>
    </Provider>,
    // eslint-disable-next-line no-undef
    document.getElementById('root'),
);
