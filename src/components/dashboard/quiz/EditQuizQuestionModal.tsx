import { FC, useMemo } from 'react';
import {
  Backdrop,
  Box,
  Button,
  Divider,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  Modal,
  Paper,
  Switch,
  TextField,
  Typography,
} from '@mui/material';

import { X as XIcon } from '../../../icons/x';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';

import * as yup from 'yup';
import { useRouter } from 'next/router';
import {
  useCreateQuizMutation,
  useGetQuestionsInfiniteScrollQuery,
  useUpdateQuizNodeMutation,
} from '@slices/quizReduxApi';
import { useCommon } from '@hooks/useCommon';

import { NodeDataType } from '@interfaces/quiz';
import { Controller, useForm } from 'react-hook-form';
import {
  SelectOption,
  SelectWithSearchServer,
} from '@components/widgets/inputs/SelectWithSearchServer';
import { yupResolver } from '@hookform/resolvers/yup';
import { usePaginatedState } from '@hooks/usePaginatedState';
import { EditQuestionForm } from './EditQuestionForm';
interface EditQuizQuestionModalProps {
  open: boolean;
  onClose: () => void;
  quizNode: NodeDataType;
}

interface IFormInputs {
  question: SelectOption | null;
  edit: boolean;
}

export const EditQuizQuestionModal: FC<EditQuizQuestionModalProps> = ({
  open,
  onClose,
  quizNode,
}: EditQuizQuestionModalProps) => {
  console.log('currentQuest', quizNode.question);
  const isMounted = () => true;
  const router = useRouter();
  const { t } = useTranslation();
  const [updateQuizNode] = useUpdateQuizNodeMutation();
  const { showApiCallNotification } = useCommon();
  const initailQuiz = quizNode.question
    ? {
        label: `${quizNode.question.code} :${quizNode.question.question}`,
        value: quizNode.question.id.toString(),
      }
    : null;
  const [questionsSelectParams, questionsSelectActions] = usePaginatedState({
    page: 1,
    limit: 10,
    merge: true,
  });

  const {
    handleSubmit,
    formState: { isDirty, errors, isSubmitting },
    control,
    watch,
    reset,
  } = useForm<IFormInputs>({
    mode: 'all',
    defaultValues: {
      question: initailQuiz,
      edit: false,
    },
    resolver: yupResolver(
      yup.object().shape({
        question: yup.object().required('Question is required'),
        edit: yup.bool(),
      })
    ),
  });

  const {
    data: questions,
    isFetching: questionsFetching,
    isSuccess: questionsSuccess,
  } = useGetQuestionsInfiniteScrollQuery(questionsSelectParams);

  const handleQuestionSelected = async (event: any) => {
    console.log('selcted question', event);
    try {
      const answer = await showApiCallNotification(
        updateQuizNode({
          id: quizNode.id,
          question: { id: +event.value },
        }).unwrap(),
        {
          success: 'Update operation Succesful',
          pending: 'Update operation pending',

          error: {
            render(err) {
              console.log('toast err', err);
              return (
                <Grid container>
                  <Grid item xs={12}>
                    {t<string>(`Update operation failed`)}: {err.data.status}
                  </Grid>
                  <Grid item xs={12}>
                    {t<string>(err.data.data.message)}
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

  const mappedQuestions: SelectOption[] = useMemo(() => {
    const qs = (
      questions
        ? questions.data.map((q) => ({
            label: `${q.code} :${q.question}`,
            value: q.id.toString(),
          }))
        : []
    ).filter((q) => q.value !== quizNode.question?.id.toString());

    if (initailQuiz) qs.unshift(initailQuiz);

    return qs;
  }, [questions, quizNode]);
  console.log('mapped', mappedQuestions);
  return (
    <Modal
      open={open}
      aria-labelledby='modal-modal-title'
      sx={{ overflow: 'scroll' }}
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
          }}
        >
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              px: 2,
              py: 1,
            }}
          >
            <Box>
              <Typography variant='h6' id='modal-modal-title'>
                Modifier question
              </Typography>
              <Typography variant='subtitle2'>(id: {quizNode.id})</Typography>
            </Box>
            <Box sx={{ flexGrow: 1 }} />

            <IconButton onClick={onClose}>
              <XIcon fontSize='small' />
            </IconButton>
          </Box>
          <Box sx={{ px: 2 }}>
            <Controller
              name='question'
              control={control}
              render={({ field, fieldState: { error } }) => (
                <SelectWithSearchServer
                  label={t('Selectionner un question')}
                  field={field}
                  value={field.value}
                  options={mappedQuestions}
                  defaultValue={field.value}
                  error={!!error}
                  helperText={error?.message ? t<string>(error.message) : ''}
                  hasMore={!!questions && questions.hasNextPage}
                  onLaodMore={() => {
                    questionsSelectActions.onSelectLoadMore();
                  }}
                  loading={false}
                  onSearch={(text) => {
                    questionsSelectActions.onSelectSearch(text, 'search');
                  }}
                  onChange={(e) => {
                    field.onChange(e);
                    handleQuestionSelected(e);
                  }}
                />
              )}
            />
          </Box>
          <Box sx={{ px: 2 }}>
            <FormControlLabel
              control={
                <Controller
                  name='edit'
                  control={control}
                  defaultValue={false}
                  render={({ field }) => (
                    <Grid sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                      <Switch {...field} checked={field.value} />
                      <Typography sx={{ fontWeight: '400' }}>
                        {field.value
                          ? t<string>('common:yes')
                          : t<string>('common:no')}
                      </Typography>
                    </Grid>
                  )}
                />
              }
              label={t<string>('Edit question')}
              labelPlacement='start'
              sx={{ ml: 0 }}
            />
          </Box>
          <Divider sx={{ m: 2 }} />

          {quizNode.question && (
            <EditQuestionForm
              disabled={!watch('edit')}
              question={quizNode.question}
            />
          )}
        </Paper>
      </Box>
    </Modal>
  );
};
