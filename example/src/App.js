import React from 'react'

import { Editor } from 'urdu-rich-editor'
import 'urdu-rich-editor/dist/index.css'

const App = () => {
  return (<React.StrictMode>
    <div className="editor-container">
      <Editor richText setValue={(val)=> console.log(val)} />
    </div>
  </React.StrictMode>);
}

export default App
