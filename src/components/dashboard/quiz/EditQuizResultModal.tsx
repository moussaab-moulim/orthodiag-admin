import { FC, useEffect, useMemo } from 'react';
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
  useCreateQuizMutation,
  useGetProblemsInfiniteScrollQuery,
  useGetQuizResultQuery,
  useGetTreatmentsInfiniteScrollQuery,
  useUpdateQuizResultMutation,
} from '@slices/quizReduxApi';
import { useCommon } from '@hooks/useCommon';
import { Answer, Result } from '@interfaces/quiz';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
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
import { Remove } from '@mui/icons-material';
import { Trash } from '@icons/trash';
interface EditQuizResultModalProps {
  open: boolean;
  onClose: () => void;
  answer: Answer;
}

const initialValues = (result?: Result) => {
  if (result) {
    return {
      problem: result.problem.map((prb) => ({
        value: prb.id.toString(),
        label: `${prb.code}-${prb.name}`,
        icon: prb.images[0],
      })) as SelectOption[],

      treatments: result.treatmentGroups.map((trGroup) =>
        trGroup.map((g) => {
          const trt = result.treatments.find((t) => t.id.toString() === g);
          return {
            value: trt?.id.toString(),
            label: `${trt?.code ?? ''}-${trt?.name ?? ''}`,
            icon: trt?.images?.[0],
          };
        })
      ) as Array<SelectOption[]>,
    };
  }

  return {
    problem: [],
    treatments: [[]],
  };
};
type IFormInputs = ReturnType<typeof initialValues>;

export const EditQuizResultModal: FC<EditQuizResultModalProps> = ({
  answer,
  open,
  onClose,
}: EditQuizResultModalProps) => {
  const isMounted = () => true;
  const router = useRouter();
  const { t } = useTranslation();

  const { data: result, isFetching: resultFetching } = useGetQuizResultQuery(
    answer.result.id
  );

  const {
    handleSubmit,
    formState: { isDirty, errors, isSubmitting },
    control,
    watch,
    reset,
  } = useForm<IFormInputs>({
    mode: 'all',
    defaultValues: initialValues(result),
    resolver: yupResolver(
      object().shape({
        problem: array().of(object()).required(t('Problem is required')),
        treatments: array()
          .of(array().of(object()))
          .required(t('Treatment is required')),
      })
    ),
  });

  const {
    fields: treatmentGroups,
    remove,
    insert,
    append,
  } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: 'treatments', // unique name for your Field Array
  });

  useEffect(() => {
    reset(initialValues(result));
  }, [result]);

  const [problemsSelectParams, problemsSelectActions] = usePaginatedState({
    page: 1,
    limit: 10,
    merge: true,
  });
  const { data: problems, isFetching: problemsFetching } =
    useGetProblemsInfiniteScrollQuery(problemsSelectParams);
  const mappedProblems: SelectOption[] =
    problems?.data?.map((prb) => ({
      value: prb.id.toString(),
      label: `${prb.code}-${prb.name}`,
      icon: prb.images[0],
    })) ?? [];
  const [treatmentsSelectParams, treatmentsSelectActions] = usePaginatedState({
    page: 1,
    limit: 10,
    merge: true,
  });

  const { data: treatments, isFetching: treatmentsFetching } =
    useGetTreatmentsInfiniteScrollQuery(treatmentsSelectParams);
  const [updateResult] = useUpdateQuizResultMutation();
  const mappedTreatments: SelectOption[] =
    treatments?.data?.map((trt) => ({
      value: trt.id.toString(),
      label: `${trt.code}-${trt.name}`,
      icon: trt.images[0],
    })) ?? [];

  const { showApiCallNotification } = useCommon();

  const onSubmit = (data: IFormInputs) => onSubmitHandler(data);
  const onSubmitHandler = async (dataForm: IFormInputs) => {
    try {
      const apiAnswer = await showApiCallNotification(
        updateResult({
          id: answer.result.id,
          answer: { id: answer.id },
          treatments: dataForm.treatments.map((grp) =>
            grp.map((trt) => ({ id: Number(trt.value) }))
          ),
          problem: dataForm.problem.map((prb) => ({ id: Number(prb.value) })),
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
              <Typography variant='h6' id='modal-modal-title'>
                Modifier le resultat
              </Typography>
              <Box sx={{ flexGrow: 1 }} />

              <IconButton onClick={onClose}>
                <XIcon fontSize='small' />
              </IconButton>
            </Box>
            <Grid item xs={12} sx={{ mb: 3 }}>
              <Typography sx={{ mb: 1 }} variant='subtitle2'>
                Probleme
              </Typography>
              <Controller
                name='problem'
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <SelectWithSearchServer
                    label={t('Selectionner les problemes')}
                    field={field}
                    value={field.value}
                    options={mappedProblems}
                    multiple
                    defaultValue={field.value}
                    error={!!error}
                    helperText={error?.message ? t<string>(error.message) : ''}
                    hasMore={!!problems && problems.hasNextPage}
                    onLaodMore={() => {
                      problemsSelectActions.onSelectLoadMore();
                    }}
                    loading={problemsFetching}
                    onSearch={(text) => {
                      problemsSelectActions.onSelectSearch(text, 'search');
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sx={{ mb: 3 }}>
              <Typography sx={{ mb: 1 }} variant='subtitle2'>
                Traitements
              </Typography>
              <Grid container>
                <Grid item sm={12}>
                  {treatmentGroups.map((trtGroup, trtIndex) => {
                    return (
                      <Box
                        key={trtGroup.id}
                        sx={{ display: 'flex', flexWrap: 'nowrap', gap: 2 }}
                      >
                        <Controller
                          name={`treatments.${trtIndex}`}
                          control={control}
                          render={({ field, fieldState: { error } }) => (
                            <SelectWithSearchServer
                              label={t(
                                `Selectionner les traitemens ${trtIndex + 1}`
                              )}
                              field={field}
                              value={field.value}
                              options={mappedTreatments}
                              multiple
                              defaultValue={field.value}
                              error={!!error}
                              helperText={
                                error?.message ? t<string>(error.message) : ''
                              }
                              hasMore={!!treatments && treatments.hasNextPage}
                              onLaodMore={() => {
                                treatmentsSelectActions.onSelectLoadMore();
                              }}
                              loading={treatmentsFetching}
                              onSearch={(text) => {
                                treatmentsSelectActions.onSelectSearch(
                                  text,
                                  'search'
                                );
                              }}
                            />
                          )}
                        />

                        <IconButton
                          disabled={treatmentGroups.length <= 1}
                          onClick={() => {
                            remove(trtIndex);
                          }}
                        >
                          <Trash />
                        </IconButton>
                      </Box>
                    );
                  })}
                </Grid>
                <Grid
                  item
                  sm={12}
                  sx={{ mt: 2, justifyContent: 'flex-end', display: 'flex' }}
                >
                  <Button
                    color='primary'
                    size='small'
                    variant='outlined'
                    onClick={() => {
                      append([[]]);
                    }}
                  >
                    Ajouter group de traitment
                  </Button>
                </Grid>
              </Grid>
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
              >
                Sauvgarder
              </Button>
            </Box>
          </Paper>
        </Box>
      </form>
    </Modal>
  );
};
