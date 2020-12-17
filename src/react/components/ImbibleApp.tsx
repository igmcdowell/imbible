import * as React from 'react';
import {Link} from 'react-router-dom';

export const ImbibleApp = ({children}: {children: React.ReactNode}) => (
  <div>
    <div>
      <div className="topbar">
        <h1>
          <Link to="/">Imbible</Link>
        </h1>
      </div>
      <div className="main-content">{children}</div>
    </div>
  </div>
);
