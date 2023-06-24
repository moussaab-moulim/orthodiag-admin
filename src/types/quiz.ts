import { Status } from './common';

export interface Quiz {
  id: number;

  code: string;

  name: string;
  status: Status;
  rootNode: {
    id: number;
  };
}

export interface QuizListItem {
  id: number;

  code: string;
  status: Status;
  name: string;
  rootNode: {
    id: number;
  };
}

export interface QuizNode {
  id: number;
}

export interface QuizNodeView {
  id: number;
  isInlineAnswers: boolean;
  question: Question;

  answers: Answer[];
}

export interface QuizNodeTree {
  id: number;
  isInlineAnswers: boolean;
  isRoot?: boolean;
  question: Question | null;

  parentAnswer: Answer | null;
  answers: Answer[];

  nextNodes: QuizNodeTree[];

  previousNode?: QuizNodeTree;
}
export interface QuizNodeApiItem {
  id: number;
  isInlineAnswers: boolean;
  question: Question | null;
  parentAnswer: {
    id: number;
    label: string;
    icon?: FileEntity;
    result: {
      id: number;
      treatmentGroups: string[][];
    };
  } | null;

  nextNodes: QuizNodeApiItem[];
}

export const mapQuizNodeTreeApiItem = (
  node: QuizNodeApiItem,
  previousNode?: QuizNodeTree
): QuizNodeTree => {
  console.log('mqping', node);
  const nodeObject: QuizNodeTree = {
    id: node.id,
    isInlineAnswers: node.isInlineAnswers,
    isRoot: !previousNode,
    question: node.question,
    parentAnswer: node.parentAnswer
      ? {
          ...node.parentAnswer,

          result: { id: node.parentAnswer.result.id },
        }
      : null,
    answers: node.nextNodes
      .filter((_node) => _node.parentAnswer !== null)
      .map((_node) => _node.parentAnswer as Answer),
    nextNodes: [],
  };
  return {
    ...nodeObject,
    previousNode: previousNode,
    nextNodes: node.nextNodes.map((_node) =>
      mapQuizNodeTreeApiItem(_node, nodeObject)
    ),
  };
};
export interface NodeDataType extends QuizNodeTree {
  level: number;
  parent: number | null;
}

export interface Question {
  id: number;

  code: string;

  question: string;

  description: string;

  images: FileEntity[];
}

export interface FileEntity {
  id: string;
  path: string;
}

export interface Answer {
  id: number;

  label: string;

  result: { id: number };

  icon?: FileEntity;

  hasSiblings?: boolean;
}

export interface Result {
  id: number;
  problem: Problem[];
  treatmentGroups: string[][];
  treatments: Treatment[];
}
export interface Problem {
  id: number;

  code: string;

  name: string;

  description: string;

  images: FileEntity[];
}

export interface Treatment {
  id: number;

  code: string;

  name: string;

  cost: string;
  duration: string;

  description: string;

  images: FileEntity[];
}
