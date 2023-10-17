import React from 'react';
import { createRoot } from 'react-dom/client';
import Editor from './editor';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <div className="editor-container">
      <Editor richText setValue={(val)=> console.log(val)} />
    </div>
  </React.StrictMode>
);
