import React, { useEffect } from "react";

import {
  $getSelection,
  $getRoot,
  $createParagraphNode,
  $createTextNode,
  $setSelection} from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";

export const ControlledValuePlugin = ({ value, onChange, isRichtext, format }) => {
  useAdoptPlaintextValue(value, isRichtext);

  const handleChange = (editorState) => {
    editorState.read(() => {
      onChange(editorState);
    });
  };

  return <OnChangePlugin onChange={handleChange} />;
};

export const useAdoptPlaintextValue = (value, isRichtext) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.update(() => {
      console.log(`Value updated %o`, value);
      if (isRichtext) {
        const paragraphNode = $createParagraphNode();
        const textNode = $createTextNode(value);
        paragraphNode.append(textNode);
        $getRoot().clear();
        $getRoot().append(paragraphNode);
      } else {
        const root = $getRoot();
        root.append(paragraphNode);
        const initialSelection = $getSelection()?.clone() ?? null;
        $getRoot().clear();
        $getRoot().select(); // for some reason this is not even necessary
        $getSelection()?.insertText(value);
        $setSelection(initialSelection);
      }
    });
  }, [value, editor]);
};

// export const useAdoptPlaintextValue = (value: string) => {
//   const [editor] = useLexicalComposerContext();

//   useEffect(() => {
//     editor.update(() => {
//       const paragraph = $createParagraphNode();
//       const text = $createTextNode(value);
//       paragraph.append(text);
//       $getRoot().clear();
//       $getRoot().append(paragraph);
//     });
//   }, [value, editor]);
// };
