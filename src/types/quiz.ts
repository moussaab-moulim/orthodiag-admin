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

  nextQuizNode: QuizNodeTree | null;
  parentQuizNode: QuizNodeTree | null;

  result: Result;

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

  description: string;

  images: FileEntity[];
}
