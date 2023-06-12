import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import NextLink from 'next/link';
import PropTypes from 'prop-types';

import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  MenuItem,
  Select,
} from '@mui/material';

import {
  Answer,
  NodeDataType,
  Question,
  Quiz,
  QuizNode,
  QuizNodeTree,
  QuizNodeView,
} from '@interfaces/quiz';
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  NodeDragHandler,
  Position,
  useReactFlow,
} from 'reactflow';

import {
  useCreateQuizNodeMutation,
  useGetQuizNodeTreeQuery,
  useUpdateQuizNodeMutation,
} from '@slices/quizReduxApi';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { AnswerEdgeComponent } from '@components/dashboard/quiz/AnswerEdgeComponent';
import { LoadingBackdrop } from '@components/Loading';
import { useCommon } from '@hooks/useCommon';
import dagre from 'dagre';
import { QuizEndComponent } from './QuizEndNode';
import { QuizNodeComponent } from './QuizNodeComponent';

interface QuizEditorProps {
  quiz?: Quiz;
}

const displayOptions = [
  {
    value: 'LR',
    label: 'Horizontal',
  },
  {
    value: 'TB',
    label: 'Vertical',
  },
];
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 493;
const nodeHeight = 650;

const endQuizNode = {
  id: null,
  question: null,
  answers: [],
  nextNodes: [],
  isInlineAnswers: false,
};
const typesPositions: any = {
  quizQuestionNode: 650,
  quizEndNode: 300,
};

const nodeTypes = {
  quizQuestionNode: QuizNodeComponent,
  quizEndNode: QuizEndComponent,
};

const edgeTypes = {
  answerEdge: AnswerEdgeComponent,
};

const getLayoutedElements = (
  nodes: Node<NodeDataType>[],
  edges: Edge<Answer>[],
  direction = 'TB'
) => {
  const isHorizontal = direction === 'LR';

  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? Position.Left : Position.Top;
    node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return node;
  });

  return { nodes, edges };
};

export const QuizEditor: FC<QuizEditorProps> = (props) => {
  const { showErrorNotification } = useCommon();
  const { quiz, ...other } = props;
  const {
    data: quizNodeTree,
    isFetching,
    isError,
    isSuccess,
    error,
  } = useGetQuizNodeTreeQuery(quiz?.rootNode?.id ?? skipToken);

  const [updateQuizNode] = useUpdateQuizNodeMutation();

  const [nodes, setNodes] = useState<Node<NodeDataType>[]>([]);
  const [edges, setEdges] = useState<Edge<Answer>[]>([]);

  const [displayMode, setDisplayMode] = useState<string>('TB');

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    return setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);
  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    return setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  //console.log('treenode', nodes);
  //console.log('edges', edges);

  useEffect(() => {
    if (isSuccess && quizNodeTree) {
      const initNodes = nodesGenerator(quizNodeTree);
      const initEdges = edgesGenerator(initNodes);

      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(initNodes, initEdges, displayMode);

      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
    }
  }, [quizNodeTree, isSuccess, displayMode]);
  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title='Edit quiz'
        action={
          <FormControl size='small' variant='outlined'>
            <Select
              value={displayMode}
              onChange={(e) => {
                setDisplayMode(e.target.value);
              }}
            >
              {displayOptions.map((d, key) => (
                <MenuItem key={key} value={d.value}>
                  {d.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        }
      />
      <Divider />
      <CardContent
        sx={{
          height: '100%',
          minHeight: '600px',
          display: 'grid',
          position: 'relative',
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          minZoom={0.2}
          maxZoom={1}
        >
          <Background />
          <Controls />
        </ReactFlow>
        <LoadingBackdrop open={isFetching} sx={{ position: 'absolute' }} />
      </CardContent>
      {/*  <CardActions
        sx={{
          flexWrap: 'wrap',
          m: -1,
        }}
      >
        <NextLink href='/dashboard/customers/1' passHref>
          <Button
            component='a'
            sx={{
              m: 1,
              mr: 'auto',
            }}
            variant='outlined'
          >
            Cancel
          </Button>
        </NextLink>
        <Button color='error'>Delete user</Button>
      </CardActions> */}
    </Card>
  );
};

function extractChildren(x: Partial<QuizNodeTree>) {
  return x.nextNodes!;
}
function flatten(
  children: QuizNodeTree['nextNodes'],
  extractChildren: (node: QuizNodeTree) => QuizNodeTree['nextNodes'],
  level?: number,
  parent?: number
): Node<NodeDataType>[] {
  return Array.prototype.concat.apply(
    children.map((node) => ({
      ...nodeMapper(node, level, parent),
    })),
    children.map((node) =>
      flatten(
        extractChildren(node) || [],
        extractChildren,
        (level || 1) + 1,

        node.id
      )
    )
  );
}

function nodesGenerator(tree: QuizNodeTree): Node<NodeDataType>[] {
  const nodesArray = flatten(
    extractChildren({ nextNodes: [tree] }),
    extractChildren
  );
  return nodesArray;
}

function nodeMapper(
  quizNode: QuizNodeTree,
  level?: number,

  parent?: number
): Node<NodeDataType> {
  const _level = level || 1;

  const data: NodeDataType = {
    ...quizNode,
    id: quizNode.id,
    previousNode: quizNode.previousNode,
    answers: quizNode.answers,
    question: quizNode.question,
    isInlineAnswers: quizNode.isInlineAnswers,
    level: _level,
    parent: parent || null,
    parentAnswer: quizNode.parentAnswer,
  };
  console.log('node ');
  return {
    id: quizNode.id.toString(),
    data: data,
    position: { x: 0, y: 0 },
    type: quizNode.question ? 'quizQuestionNode' : 'quizEndNode',
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    dragHandle: '.nodeHandle',
  };
}

function edgesGenerator(nodes: Node<NodeDataType>[]) {
  const edges: Edge<Answer>[] = [];

  nodes.forEach((node) => {
    node.data.answers.forEach((a) => {
      edges.push({
        id: `${node.id}-${
          a.nextQuizNode
            ? a.nextQuizNode!.id.toString()
            : `end-${node.id}-${a.id}`
        }`,
        source: node.id.toString(),
        target: a.nextQuizNode
          ? a.nextQuizNode.id.toString()
          : `end-${node.id}-${a.id}`,
        label: a.label,
        data: { ...a, hasSiblings: node.data.answers.length > 1 },
        type: 'answerEdge',
      });
    });
  });
  return edges;
}
