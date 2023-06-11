import { FC, useMemo } from 'react';
import {
  Box,
  Button,
  Divider,
  FormHelperText,
  Grid,
  IconButton,
  Modal,
  Paper,
  TextField,
  Typography,
} from '@mui/material';

import { X as XIcon } from '../../../icons/x';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import {
  useCloneQuizNodeMutation,
  useCreateQuizMutation,
  useUpdateAnswerMutation,
} from '@slices/quizReduxApi';
import { useCommon } from '@hooks/useCommon';
import { Answer } from '@interfaces/quiz';
import { Controller, useForm } from 'react-hook-form';
import InputText from '@components/widgets/inputs/InputText';
import { yupResolver } from '@hookform/resolvers/yup';
import { array, object, string } from 'yup';
import {
  SelectOption,
  SelectWithSearchServer,
} from '@components/widgets/inputs/SelectWithSearchServer';
import { usePaginatedState } from '@hooks/usePaginatedState';
import { useGetFilesInfiniteScrollQuery } from '@slices/fileReduxApi';
import { Carousel } from 'react-responsive-carousel';
import Image from 'next/image';
import { number } from 'yup';
interface CloneQuizNodeModalProps {
  open: boolean;
  onClose: () => void;
  parentNodeId: number;
}

type IFormInputs = {
  cloneNodeId: number | null;
};

export const CloneQuizNodeModal: FC<CloneQuizNodeModalProps> = ({
  parentNodeId,
  open,
  onClose,
}: CloneQuizNodeModalProps) => {
  const { t } = useTranslation();

  const [cloneQuizNode] = useCloneQuizNodeMutation();

  const {
    handleSubmit,
    formState: { isDirty, errors, isSubmitting },
    control,
  } = useForm<IFormInputs>({
    mode: 'all',
    defaultValues: { cloneNodeId: null },
    resolver: yupResolver(
      object().shape({
        cloneNodeId: number().required(t('Id is required')),
      })
    ),
  });

  const { showApiCallNotification } = useCommon();

  const onSubmit = (data: IFormInputs) => onSubmitHandler(data);
  const onSubmitHandler = async (dataForm: IFormInputs) => {
    try {
      console.log('cloning', dataForm.cloneNodeId, 'into', parentNodeId);
      const apiAnswer = await showApiCallNotification(
        cloneQuizNode({
          id: Number(dataForm.cloneNodeId),
          previousNode: { id: Number(parentNodeId) },
        }).unwrap(),
        {
          success: 'Clone operation Succesful',
          pending: 'Clone operation pending',

          error: {
            render(err) {
              console.log('toast err', err);
              return (
                <Grid container>
                  <Grid item xs={12}>
                    {t<string>(`Clone operation failed`)}: {err.data.status}
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

  return (
    <Modal open={open} aria-labelledby='modal-modal-title'>
      <form
        // noValidate
        /// onSubmit={formik.handleSubmit}
        onSubmit={handleSubmit(onSubmit)}
        style={{ height: '100%' }}
      >
        <Box
          sx={{
            backgroundColor: 'background.default',
            minHeight: '100%',
            p: 3,
          }}
        >
          <Paper
            elevation={12}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              margin: 3,
              minHeight: 500,
              mx: 'auto',
              outline: 'none',
              width: 600,
              p: 3,
            }}
          >
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
              }}
            >
              <Typography variant='h6' id='modal-clone-title'>
                Cloner une node
              </Typography>
              <Box sx={{ flexGrow: 1 }} />

              <IconButton onClick={onClose}>
                <XIcon fontSize='small' />
              </IconButton>
            </Box>
            <Grid item xs={12} sx={{ mb: 3 }}>
              <Typography sx={{ mb: 1 }} variant='subtitle2'>
                Id quiz node
              </Typography>
              <Controller
                name={'cloneNodeId'}
                control={control}
                // {...register(`prices.${index}.price`)}
                render={({ field, fieldState: { error } }) => (
                  <InputText
                    field={field}
                    sx={{ width: '100%' }}
                    error={!!error}
                    type='number'
                    helperText={
                      error?.message
                        ? t<string>(error.message as unknown as string)
                        : ''
                    }
                  />
                )}
              />
            </Grid>

            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'flex-end',
                p: 2,
              }}
            >
              <Divider />
              <Button
                color='primary'
                type='submit'
                fullWidth
                size='large'
                variant='contained'
                disabled={!isDirty}
              >
                Cloner
              </Button>
            </Box>
          </Paper>
        </Box>
      </form>
    </Modal>
  );
};
