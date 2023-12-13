import React, {Component} from 'react'
import {render} from 'react-dom'

import Editor from '../../src'
import '../../src/styles.module.css'

export default class Demo extends Component {
  render() {
    return (
      <div className="editor-shell">
        <Editor richText setValue={(val)=> console.log(val)} />
      </div>
    );
  }
}

render(<Demo/>, document.querySelector('#demo'))
