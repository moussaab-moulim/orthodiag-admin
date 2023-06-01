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
import Image from "next/image";
interface EditQuizAnswerModalProps {
  open: boolean;
  onClose: () => void;
  answer: Answer;
}

const initialValues = (answer?: Answer) => {
  if (answer) {
    return {
      label: answer.label,
      icon: answer.icon
        ? { value: answer.icon?.id, label: answer.icon?.id, icon: answer.icon }
        : null,
    };
  }

  return {
    label: '',
    icon: null,
  };
};
type IFormInputs = ReturnType<typeof initialValues>;

export const EditQuizAnswerModal: FC<EditQuizAnswerModalProps> = ({
  answer,
  open,
  onClose,
}: EditQuizAnswerModalProps) => {
  const isMounted = () => true;
  const router = useRouter();
  const { t } = useTranslation();

  const [imagesSelectParams, imagesSelectActions] = usePaginatedState({
    page: 1,
    limit: 10,
    merge: true,
  });

  const {
    data: images,
    isFetching: imagesFetching,
    isSuccess: imagesSuccess,
  } = useGetFilesInfiniteScrollQuery(imagesSelectParams);

  const [updateQuizAnswer] = useUpdateAnswerMutation();

  const {
    handleSubmit,
    formState: { isDirty, errors, isSubmitting },
    control,
    watch,
    reset,
  } = useForm<IFormInputs>({
    mode: 'all',
    defaultValues: initialValues(answer),
    resolver: yupResolver(
      object().shape({
        label: string().required(t('Label is required')),
        icon: object().nullable(),
      })
    ),
  });

  const { showApiCallNotification } = useCommon();

  const mappedImages: SelectOption[] = useMemo(() => {
    return (
      images?.data?.map((image) => ({
        label: image.id,
        value: image.id,
        icon: image,
      })) ?? []
    );
  }, [images]);

  const selectedIcon = watch('icon');
  const onSubmit = (data: IFormInputs) => onSubmitHandler(data);
  const onSubmitHandler = async (dataForm: IFormInputs) => {
    try {
      const apiAnswer = await showApiCallNotification(
        updateQuizAnswer({
          ...dataForm,
          id: answer.id,
          icon: dataForm.icon?.icon,
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
                Modifier la réponse
              </Typography>
              <Box sx={{ flexGrow: 1 }} />

              <IconButton onClick={onClose}>
                <XIcon fontSize='small' />
              </IconButton>
            </Box>
            <Grid item xs={12} sx={{ mb: 3 }}>
              <Typography sx={{ mb: 1 }} variant='subtitle2'>
                Label
              </Typography>
              <Controller
                name={'label'}
                control={control}
                // {...register(`prices.${index}.price`)}
                render={({ field, fieldState: { error } }) => (
                  <InputText
                    field={field}
                    sx={{ width: '100%' }}
                    error={!!error}
                    helperText={
                      error?.message
                        ? t<string>(error.message as unknown as string)
                        : ''
                    }
                  />
                )}
              />
            </Grid>

            {selectedIcon && (
              <Box
                sx={{
                  width: '400px',
                  height: '400px',
                  position: 'relative',
                  borderRadius: 2,
                  boxShadow: 1,
                  overflow: 'hidden',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  '& .carousel-root': {
                    flex: 1,
                  },
                  m: 'auto',
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    height: '200px',
                    position: 'relative',
                  }}
                >
                  <Image
                    src={selectedIcon.icon.path}
                    alt={selectedIcon.icon.id}
                    fill
                    sizes="100vw"
                    style={{
                      objectFit: "contain"
                    }} />
                </Box>
              </Box>
            )}
            <Box sx={{ px: 2 }}>
              <Controller
                name='icon'
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <SelectWithSearchServer
                    label={t('Selectionner un icon')}
                    field={field}
                    value={field.value}
                    options={mappedImages}
                    defaultValue={field.value}
                    error={!!error}
                    helperText={error?.message ? t<string>(error.message) : ''}
                    hasMore={!!images && images.hasNextPage}
                    onLaodMore={() => {
                      imagesSelectActions.onSelectLoadMore();
                    }}
                    loading={imagesFetching}
                    onSearch={(text) => {
                      imagesSelectActions.onSelectSearch(text, 'search');
                    }}
                  />
                )}
              />
            </Box>

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
