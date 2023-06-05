import { useCommon } from '@hooks/useCommon';
import { QuizNodeTree } from '@interfaces/quiz';
import { Warning } from '@mui/icons-material';
import { Paper, Avatar, Typography, Button, Dialog, Grid } from '@mui/material';
import { Box, alpha } from '@mui/system';
import { useDeleteQuizNodeMutation } from '@slices/quizReduxApi';
import { t } from 'i18next';
import React, { FC } from 'react';

interface EditQuizNodeModalProps {
  open: boolean;
  onClose: () => void;
  quizNode: QuizNodeTree;
}
export const DeleteQuizNodeModal: FC<EditQuizNodeModalProps> = ({
  quizNode,
  open,
  onClose,
}) => {
  const { showApiCallNotification } = useCommon();

  const [deleteQuizNode] = useDeleteQuizNodeMutation();

  const handleDeleteClick = async () => {
    try {
      const apiQuizNode = await showApiCallNotification(
        deleteQuizNode(quizNode.id).unwrap(),
        {
          success: 'Delete operation Succesful',
          pending: 'Delete operation pending',

          error: {
            async render(err) {
              console.log('toast err', err);
              return (
                <Grid container>
                  <Grid item xs={12}>
                    {t<string>(`Delete operation failed`)}: {err.data.status}
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
      onClose();
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <Dialog open={open}>
      <Box
        sx={{
          display: 'flex',
          pb: 2,
          pt: 3,
          px: 3,
        }}
      >
        <Avatar
          sx={{
            backgroundColor: (theme) => alpha(theme.palette.error.main, 0.08),
            color: 'error.main',
            mr: 2,
          }}
        >
          <Warning fontSize='small' />
        </Avatar>
        <div>
          <Typography variant='h5'>Suprrimer une Nœuds</Typography>
          <Typography color='textSecondary' sx={{ mt: 1 }} variant='body2'>
            {`la suppression d'une Nœuds, supprime tous les nœuds et réponses
            suivants, êtes-vous sûr de vouloir continuer ?`}
          </Typography>
          <Typography color='textSecondary' sx={{ mt: 1 }} variant='body2'>
            {`\u2022 Nœud (id:"${quizNode.id},"code question question:"${quizNode.question?.code}")`}
          </Typography>
        </div>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          px: 3,
          py: 1.5,
        }}
      >
        <Button sx={{ mr: 2 }} variant='outlined' onClick={onClose}>
          Annuler
        </Button>
        <Button
          sx={{
            backgroundColor: 'error.main',
            '&:hover': {
              backgroundColor: 'error.dark',
            },
          }}
          variant='contained'
          onClick={handleDeleteClick}
        >
          Supprimer
        </Button>
      </Box>
    </Dialog>
  );
};
