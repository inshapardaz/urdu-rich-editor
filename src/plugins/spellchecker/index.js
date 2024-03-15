import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {
  $getRoot,
  COMMAND_PRIORITY_LOW,
} from 'lexical';
import {useEffect, useState} from 'react';

import { AUTO_CORRECT_COMMAND, SPELLCHECK_COMMAND, PUNCTUATION_CORRECT_COMMAND } from "../../commands/spellCheckCommand";
import { Drawer } from 'antd';

const getReplaceAllRegex = (corrections)  => {
  let retVal = '';
  corrections.forEach((c) => {
    // retVal += `(${c.completeWord ? `\\b${c.incorrectText.trim()}\\b` : c.incorrectText.trim()})|`;
    retVal += `(${c.incorrectText.trim()})|`;
  });

  // return new RegExp(retVal.slice(0, -1), 'gimu');
  return new RegExp(`\\b${retVal.slice(0, -1)}\\b`, 'giu');
};
const correctPunctuations = (punctuationCorrections, text) => {
  text = text.replace(/  +/g, ' ');
  punctuationCorrections.forEach((c) => {
    text = text.replaceAll(c.completeWord ? `${c.incorrectText}\\b` : c.incorrectText, c.correctText);
  });
  return text;
};

const autoCorrectText = (autoCorrections, text) => {
    const correctionRegex = getReplaceAllRegex(autoCorrections);
    return text.replaceAll(correctionRegex, (matched) => autoCorrections.find((o) => o.incorrectText === matched)?.correctText.trim());
};

export default function SpellCheckerPlugin({ locale, language, configuration = { enabled : false} }) {
  if (!configuration.enabled) return null;
  const [editor] = useLexicalComposerContext();
  const [open, setOpen] = useState(false);

  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    editor.registerCommand(
      SPELLCHECK_COMMAND,
      () => {
        setOpen(true);
      },
      COMMAND_PRIORITY_LOW,
    );

    /* automatic correction */

    editor.registerCommand(
      AUTO_CORRECT_COMMAND,
      () => {
        autoCorrect();
      },
      COMMAND_PRIORITY_LOW,
    );

    const autoCorrectNode = (node, corrections) => {
      if (node.getChildren) {
        node.getChildren().map((child) => {
          autoCorrectNode(child, corrections);
        });
      }

      if (node.getType() === 'text') {
        node.setTextContent(autoCorrectText(corrections, node.getTextContent()));
      }

      return node
    }

    const autoCorrect = () => {
      var corrections = configuration.autoCorrections ? configuration.autoCorrections(language) : [];
      editor.update(() => {
        var root = $getRoot(editor);
        var children = root.getChildren();
        children.forEach((child) => {
          autoCorrectNode(child, corrections);
        });
      });
    }
    /* automatic correction ends */

    /* Punctuation correction */
    editor.registerCommand(
      PUNCTUATION_CORRECT_COMMAND,
      () => {
        punctuationCorrection();
      },
      COMMAND_PRIORITY_LOW,
    );

  }, [editor]);


  const punctuationCorrectionNode = (node, corrections) => {
    if (node.getChildren) {
      node.getChildren().map((child) => {
        punctuationCorrectionNode(child, corrections);
      });
    }

    if (node.getType() === 'text') {
      node.setTextContent(correctPunctuations(corrections, node.getTextContent()));
    }

    return node
  }

  const punctuationCorrection = () => {
    var corrections = configuration.punctuationCorrections ? configuration.punctuationCorrections(language) : [];
    editor.update(() => {
      var root = $getRoot(editor);
      var children = root.getChildren();
      children.forEach((child) => {
        punctuationCorrectionNode(child, corrections);
      });
    });
  }

  /* Punctuation correction ends */

  return (
    <>
      <Drawer
        title={locale?.resources?.spellchecker}
        placement="right"
        closable={true}
        onClose={onClose}
        open={open}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>
    </>);
}
