const _jsxFileName = "/Users/gavinatkinson/Tlon/PaperCollateralRenderer/preview/src/js/App.js";import React, { Component } from 'react';
// import wallet1 from './sampleWallets/wallet1.json'; // walletX.value
// import wallet2 from './sampleWallets/wallet2.json'; // walletX.value
// import wallet3 from './sampleWallets/wallet3.json'; // walletX.value
// import wallet4 from './sampleWallets/wallet4.json'; // walletX.value
import wallet5 from './sampleWallets/wallet5.json';

import PaperCollateralRenderer from '../../../lib/dist/index.js';

class App extends Component {
  constructor(props) {
    super(props);App.prototype.__init.call(this);
    this.state = {
      pages: [],
    };
  }


  __init() {this.handleOutput = data => {
    this.setState({pages: data})
    // console.log('App Scope: ', data)
  }}


  render() {
    return (
      React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 27}}
      , React.createElement('h4', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 28}}, "Fonts")
      , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 29}}, "In order to test this, you must open font book and disable Inter, Inter UI and Source Code Pro or any fonts this library uses."                        )
        , 
          React.createElement(PaperCollateralRenderer, {
            wallet: wallet5,
            className: '',
            callback: data => this.handleOutput(data),
            mode: 'REGISTRATION', __self: this, __source: {fileName: _jsxFileName, lineNumber: 31}}
          )
        

        , 
          this.state.pages.map(p => {
            return React.createElement('img', { style: {maxWidth:'550px', border:'1px solid black'}, src: p.durl, __self: this, __source: {fileName: _jsxFileName, lineNumber: 41}} )
          })
        
      )
    )
  }


}

export default App
