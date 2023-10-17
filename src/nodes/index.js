import { ListItemNode, ListNode } from '@lexical/list';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { CodeNode } from '@lexical/code';
import {HorizontalRuleNode} from './horizontalRuleNode';

const EditorNodes = [
  HeadingNode,
  ListNode,
  ListItemNode,
  QuoteNode,
  CodeNode,
  AutoLinkNode,
  LinkNode,
  HorizontalRuleNode,
];

export default EditorNodes;
