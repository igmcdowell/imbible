'use strict';
import * as React from 'react';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import * as ReactDOM from 'react-dom';

import drinksApp from './reducers';
import {initialData} from './drinkData';
import {router} from './components/ImbibleRouter';

import './components/auto_suggest.css';
import '../style/app.css';
const store = createStore(drinksApp, {drinks: initialData});
ReactDOM.render(<Provider store={store}>{router}</Provider>, document.getElementById('root'));
