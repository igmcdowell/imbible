import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { IndexLink } from 'react-router'

const ImbibleApp = ({children}) => (
  <div>
    <div>
      <div className="topbar">
        <h1><IndexLink to="/">Imbible</IndexLink></h1>
      </div>
      <div className="main-content">
        {children}
      </div>
    </div>
  </div>
)


export default ImbibleApp
