import * as React from 'react';
import {Route} from 'react-router';
import {ImbibleApp} from './ImbibleApp';
import {HomePage} from './HomePage';
import {DrinkDetailView} from '../components/DrinkDetailView';
import {HashRouter} from 'react-router-dom';

// Note: use hash router since we want direct nav to work with arbitrary hosting.
export const router = (
  <HashRouter>
    <ImbibleApp>
      <Route path="/">
        <Route exact path="/" component={HomePage} />
        <Route path="/drinks/:id" component={DrinkDetailView} />
      </Route>
    </ImbibleApp>
  </HashRouter>
);
