import { FC, useState } from 'react';
import {
  Box,
  Button,
  FormControlLabel,
  Grid,
  Icon,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { Handle, Node, NodeProps, Position } from 'reactflow';
import { PencilAlt } from '@icons/pencil-alt';
import { NodeDataType, QuizListItem, QuizNodeTree } from '@interfaces/quiz';
import { OpenWith } from '@mui/icons-material';
import Image from 'next/image';
import { Carousel } from 'react-responsive-carousel';
import {
  useCreateQuizAnswerMutation,
  useCreateQuizNodeMutation,
  useDeleteQuizNodeMutation,
} from '@slices/quizReduxApi';
import { useCommon } from '@hooks/useCommon';
import { t } from 'i18next';
import { EditQuizQuestionModal } from './EditQuizQuestionModal';
import { DeleteQuizNodeModal } from './DeleteQuizNodeModal';
export const QuizNodeComponent: FC<NodeProps<NodeDataType>> = ({
  data,
  xPos,
  yPos,
  sourcePosition,
  targetPosition,
}) => {
  const [createQuizNode] = useCreateQuizNodeMutation();
  const { showApiCallNotification } = useCommon();
  const [deleteQuizNodeOpen, setDeleteQuizNodeOpen] = useState<boolean>(false);

  const [isEditQuestionModalOpen, setIsEditQuestionModalOpen] = useState(false);
  const handleEditQuestionModalClose = () => {
    setIsEditQuestionModalOpen(false);
  };

  const handleCreateQuizNode = async () => {
    try {
      const answer = await showApiCallNotification(
        createQuizNode({
          previousNode: { id: data.id },
        }).unwrap(),
        {
          success: 'Creation operation Succesful',
          pending: 'Creation operation pending',

          error: {
            render(err) {
              console.log('toast err', err);
              return (
                <Grid container>
                  <Grid item xs={12}>
                    {t<string>(`Creation operation failed`)}: {err.data.status}
                  </Grid>
                  <Grid item xs={12}>
                    {t<string>(err?.data?.data?.message ?? `${err}`)}
                  </Grid>
                </Grid>
              );
            },
          },
        }
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteClick = async () => {
    setDeleteQuizNodeOpen(true);
  };

  const handleDeleteClose = async () => {
    setDeleteQuizNodeOpen(false);
  };

  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100%',
        p: 3,
      }}
    >
      {data.previousNode && (
        <Handle type='target' position={targetPosition ?? Position.Left} />
      )}

      <Handle type='source' position={sourcePosition ?? Position.Right} />

      <Paper
        elevation={12}
        sx={{
          maxWidth: 320,
          mx: 'auto',
          p: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant='h6'>
            Question{' '}
            {`${(data.question?.images ?? []).length > 0 ? 'image' : 'text'}`}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton>
            <OpenWith className='nodeHandle' fontSize='small' />
          </IconButton>
        </Box>

        <Box
          sx={{
            mt: 3,
            display: 'flex',
            flexFlow: 'row nowrap',
            position: 'relative',
          }}
        >
          <ListItemText
            primary={
              <Typography variant='subtitle2'>
                {data.question!.question}
              </Typography>
            }
            secondary={
              <Typography color='textSecondary' variant='body2'>
                {data.question!.code}
              </Typography>
            }
          />

          <Tooltip title='Modifier'>
            <IconButton
              edge='start'
              onClick={() => setIsEditQuestionModalOpen(true)}
            >
              <PencilAlt fontSize='small' />
            </IconButton>
          </Tooltip>
        </Box>

        {data.question!.images.length > 0 && (
          <Box
            sx={{
              width: '100%',
              height: '200px',
              position: 'relative',
              borderRadius: 2,
              boxShadow: 1,
              overflow: 'hidden',
            }}
          >
            <Carousel
              autoPlay={false}
              infiniteLoop={false}
              showThumbs={false}
              showIndicators={false}
            >
              {data.question!.images.map((i, index) => (
                <Box
                  key={index}
                  sx={{
                    width: '100%',
                    height: '200px',
                    position: 'relative',
                    borderRadius: 5,
                    boxShadow: 1,
                  }}
                >
                  <Image
                    unoptimized
                    key={index}
                    src={i.path}
                    alt={i.path}
                    fill
                    sizes='100vw'
                    style={{
                      objectFit: 'contain',
                    }}
                  />
                </Box>
              ))}
            </Carousel>
          </Box>
        )}

        <Box
          sx={{
            mt: 2,
            px: 1.5,
          }}
        >
          <FormControlLabel
            defaultChecked={false}
            control={<Switch edge='start' checked={!data.isInlineAnswers} />}
            label='Reponses vertical'
          />
        </Box>

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          {!data.isRoot && (
            <Button fullWidth variant='contained' onClick={handleDeleteClick}>
              suprimer
            </Button>
          )}
          <Button fullWidth variant='contained' onClick={handleCreateQuizNode}>
            ajouter reponse
          </Button>
        </Box>
      </Paper>
      {isEditQuestionModalOpen && (
        <EditQuizQuestionModal
          open={isEditQuestionModalOpen}
          onClose={handleEditQuestionModalClose}
          quizNode={data}
        />
      )}

      {deleteQuizNodeOpen && (
        <DeleteQuizNodeModal
          open={deleteQuizNodeOpen}
          onClose={handleDeleteClose}
          quizNode={data}
        />
      )}
    </Box>
  );
};
