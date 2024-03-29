import { FC, useState } from 'react';
import { Box, Button, IconButton, Paper, Typography } from '@mui/material';
import { Handle, NodeProps, Position } from 'reactflow';
import { NodeDataType } from '@interfaces/quiz';
import { ContentCopy, OpenWith } from '@mui/icons-material';

import { EditQuizQuestionModal } from './EditQuizQuestionModal';
import { EditQuizResultModal } from './EditQuizResultModal';
import { CloneQuizNodeModal } from './CloneQuizNodeModal';
export const QuizEndComponent: FC<NodeProps<NodeDataType>> = ({
  data,
  xPos,
  yPos,
  targetPosition,
}) => {
  const [isEditQuestionModalOpen, setIsEditQuestionModalOpen] = useState(false);
  const [isEditResultModalOpen, setIsEditResultModalOpen] = useState(false);
  const [isCloneQuizNodeModalOpen, setIsCloneQuizNodeModalOpen] =
    useState(false);

  const handleCloneQuizNodeModalOpen = () => {
    setIsCloneQuizNodeModalOpen(false);
  };

  const handleEditQuestionModalClose = () => {
    setIsEditQuestionModalOpen(false);
  };

  const handleEditResultModalClose = () => {
    setIsEditResultModalOpen(false);
  };
  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100%',
        p: 3,
      }}
    >
      <Handle type='target' position={targetPosition ?? Position.Left} />
      <Paper
        elevation={12}
        sx={{
          maxWidth: 320,
          mx: 'auto',
          p: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant='h6'>Fin</Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton onClick={() => setIsCloneQuizNodeModalOpen(true)}>
            <ContentCopy fontSize='small' />
          </IconButton>
          <IconButton>
            <OpenWith className='nodeHandle' fontSize='small' />
          </IconButton>
        </Box>

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button
            fullWidth
            variant='outlined'
            onClick={() => setIsEditResultModalOpen(true)}
          >
            Modifier Resultat
          </Button>
          <Button
            fullWidth
            variant='contained'
            onClick={() => setIsEditQuestionModalOpen(true)}
          >
            ajouter Question
          </Button>
        </Box>
      </Paper>
      {isCloneQuizNodeModalOpen && (
        <CloneQuizNodeModal
          parentNodeId={data.id}
          open={isCloneQuizNodeModalOpen}
          onClose={handleCloneQuizNodeModalOpen}
        />
      )}
      {isEditResultModalOpen && (
        <EditQuizResultModal
          open={isEditResultModalOpen}
          onClose={handleEditResultModalClose}
          answer={data.parentAnswer!}
        />
      )}
      {isEditQuestionModalOpen && (
        <EditQuizQuestionModal
          open={isEditQuestionModalOpen}
          onClose={handleEditQuestionModalClose}
          quizNode={data}
        />
      )}
    </Box>
  );
};
