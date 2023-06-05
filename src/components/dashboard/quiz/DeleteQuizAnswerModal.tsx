import { useCommon } from '@hooks/useCommon';
import { Answer } from '@interfaces/quiz';
import { Warning } from '@mui/icons-material';
import { Paper, Avatar, Typography, Button, Dialog, Grid } from '@mui/material';
import { Box, alpha } from '@mui/system';
import { useDeleteAnswerMutation } from '@slices/quizReduxApi';
import { t } from 'i18next';
import React, { FC } from 'react';

interface EditQuizAnswerModalProps {
  open: boolean;
  onClose: () => void;
  answer: Answer;
}
export const DeleteQuizAnswerModal: FC<EditQuizAnswerModalProps> = ({
  answer,
  open,
  onClose,
}) => {
  const { showApiCallNotification } = useCommon();

  const [deleteAnswer] = useDeleteAnswerMutation();

  const handleDeleteClick = async () => {
    try {
      const apiAnswer = await showApiCallNotification(
        deleteAnswer(answer.id).unwrap(),
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
          <Typography variant='h5'>Suprrimer une réponse</Typography>
          <Typography color='textSecondary' sx={{ mt: 1 }} variant='body2'>
            {`la suppression d'une réponse, supprime tous les nœuds et réponses
            suivants, êtes-vous sûr de vouloir continuer ?`}
          </Typography>
          <Typography color='textSecondary' sx={{ mt: 1 }} variant='body2'>
            {`\u2022 Reponse (id:"${answer.id},"label:"${answer.label}") de la question "${answer.parentQuizNode?.question?.code}"`}
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
