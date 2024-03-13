# urdu-web-editor

> Urdu Rich Text Editor for web based on lexical

[![NPM](https://img.shields.io/npm/v/urdu-web-editor.svg)](https://www.npmjs.com/package/urdu-web-editor) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save urdu-web-editor
```

## Usage

```jsx
import React, { Component } from 'react'

import Editor from 'urdu-web-editor'

class Example extends Component {
  render() {
    return <Editor value={theValue}
        onChange={changeCallback}
        onSave={saveCallback}
        configuration={uiConfiguration} />
  }
}
```

#### Properties

##### Value

It is the value that you want to set for the editor. Its value depends on the format. If the type of editor and format used.
- If using plain text editor, it must be plain text.
- If using rich text editor with raw format, provided value must be a valid lexical state json
- If using rich text editor with markdown format, provided value must be a valid markdown

Pass `null` if initializing an empty editor

#### OnChange

Callback function called when any change in editor takes place, parameter passed in the callback function is the formatted value from editor. This value can be passed back into value property.

#### OnSave

This callback function is called when save button is clicked on the editor. This will only work if the `showSave` is set to true in the configuration object

#### Configuration

Configuration object to customize the functionality and ui of the editor. Its structure is as follows:

```js
  {
    "richText" : false,
    "format": "raw",
    "language" : "en",
    "placeholder" : null,
    "toolbar" : {
      "fonts" : null,
      "defaultFont": null,
      "showAlignment": true,
      "showBlockFormat": true,
      "showFontFormat": true,
      "showInsert": true,
      "showListFormat": true,
      "showUndoRedo": true,
      "showExtraFormat": true,
      "showInsertLink": true,
      "showSave": false,
    },
    "spellchecker" : {
      "enabled": false,
      "language" : "en",
      "punctuationCorrections": () => [],
      "autoCorrections": () => [],
      "wordList" : () => [],
    }
  }
```

##### richText

Type : boolean

Default value : false

Set it to true to use rich text editor. Otherwise plain text editor is used.

##### format

Type : string

Default value : `raw`

Possible values : `raw`, `markdown`

Set the format of output from editor when `richText` is set to `true`. The `value`, `onChange` and `onSave` will use this property to import or export editor contents in the selected format.

#### language

Type : string

Default value : `en`

Possible values : `en`, `ur`

This is the two letter language code to use for user interface. Editor features and layout will be modified based on language.

#### placeholder

Type: string

Default value : `null`

Text to use when there is no value present. By default a generic message will be used while placeholder is not specified or is `null`.

#### toolbar

Type : object

Default value :
```js
{
  "fonts" : null,
  "defaultFont": null,
  "showAlignment": true,
  "showBlockFormat": true,
  "showFontFormat": true,
  "showInsert": true,
  "showListFormat": true,
  "showUndoRedo": true,
  "showExtraFormat": true,
  "showInsertLink": true,
  "showSave": false,
}
```

| Property | type | Default Value | Description |
| ----- | ----- | ----- | ---------------|
| fonts |  `object` | `null` | List of fonts to show. If `null` a standard list of fonts is shown. |
| defaultFont | `string` | `null` | Font-face value of default font. If this property is `null` first font is selected as default font. |
| showAlignment | `bool` | `true` | Show/hide text alignment controls |
| showBlockFormat | `bool` | `true` | Show/hide text alignment controls |
| showFontFormat | `bool` | `true` | Show/hide text alignment controls |
| showInsert | `bool` | `true` | Show/hide text insert menu  |
| showListFormat | `bool` | `true` | Show/hide text list formatting controls |
| showUndoRedo | `bool` | `true` | Show/hide text undo and redo controls |
| showExtraFormat | `bool` | `true` | Show/hide extra formatting options of superscript, subscript and strike through |
| showInsertLink | `bool` | `true` | Show/hide insert link button |
| showSave | `bool` | `false` | Show/hide save button |

##### Default font list and value of font-face
```json
[
  { "value": "Arial", "label": "Arial" },
  { "value": "Courier New", "label": "Courier New" },
  { "value": "Georgia", "label": "Georgia" },
  { "value": "Times New Roman", "label": "Times New Roman" },
  { "value": "Trebuchet MS", "label": "Trebuchet MS" },
  { "value": "Verdana", "label": "Verdana" },
];
```

#### spellchecker

Type : object

Default value :
```js
{
  "enabled": false,
  "language : "en",
  "punctuationCorrections": (lang) => [],
  "autoCorrections": (lang) => [],
  "wordList" : (lang) => [],
}
```

| Property | type | Default Value | Description |
| ----- | ----- | ----- | ---------------|
| enabled | `bool` | `false` | Enable/disable language tools including spell checker |
| language | `string` | `en` | Two character language code to use for language tools including spell checker. |
| punctuationCorrections | `function(language)` | `[]` | Function to load punctuation correction list. See below for details. |
| autoCorrections | `function(language)` | `[]` | Function to load automatic correction list. See below for details. |
| wordList | `function(language)` | `[]` | Function to load word list for spell checking. It is a simple string array. |


###### Punctuation and auto correct function response structure

```json
[{
  "incorrectText": "",
  "correctText": "",
  "completeWord": true
}]
```

## Development

### Install dependencies

```bash
npm install
```

### Develop library

```bash
npm start
```



## License

MIT © [umerfaruk](https://github.com/umerfaruk)
