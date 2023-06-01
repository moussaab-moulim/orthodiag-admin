import { FC, useEffect, useMemo } from 'react';
import {
  Backdrop,
  Box,
  Button,
  Grid,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { Question } from '@interfaces/quiz';
import {
  SelectOption,
  SelectWithSearchServer,
} from '@components/widgets/inputs/SelectWithSearchServer';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string } from 'yup';
import { array } from 'yup';
import { useTranslation } from 'react-i18next';
import InputText from '@components/widgets/inputs/InputText';
import { toKebabCase } from '@utils/helpers';
import { LoadingBackdrop } from '@components/Loading';
import { Carousel } from 'react-responsive-carousel';
import Image from "next/image";
import { usePaginatedState } from '@hooks/usePaginatedState';
import { PageParams } from '@interfaces/common';
import { useGetFilesInfiniteScrollQuery } from '@slices/fileReduxApi';
import { useCommon } from '@hooks/useCommon';

import { useRouter } from 'next/router';
import { useUpdateQuestionMutation } from '@slices/quizReduxApi';
import { useCreateQuestionMutation } from '@slices/questionReduxApi';

interface EditQuestionFormProps {
  question?: Question;
  disabled: boolean;
}

const initialQuestion = (question?: Question) => {
  if (question) {
    return {
      code: question.code,
      question: question.question,
      description: question.description,
      images: question.images.map((i) => ({
        label: i.id,
        value: i.id,
        icon: i,
      })) as SelectOption[],
    };
  }

  return {
    code: '',
    question: '',
    description: '',
    images: [],
  };
};
type IFormInputs = ReturnType<typeof initialQuestion>;
export const EditQuestionForm: FC<EditQuestionFormProps> = ({
  question,
  disabled,
}) => {
  const { t } = useTranslation();
  const { showApiCallNotification } = useCommon();
  const router = useRouter();
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

  const [updateQuizQuestion] = useUpdateQuestionMutation();
  const [createQuizQuestion] = useCreateQuestionMutation();
  const {
    handleSubmit,
    formState: { isDirty, errors, isSubmitting },
    control,
    watch,
    reset,
  } = useForm<IFormInputs>({
    mode: 'all',
    defaultValues: initialQuestion(question),
    resolver: yupResolver(
      object().shape({
        code: string().required(t('Code is required')),
        question: string().required(t('Question is required')),

        description: string(),
        images: array(),
      })
    ),
  });

  useEffect(() => {
    reset(initialQuestion(question));
  }, [question]);

  const mappedImages: SelectOption[] = useMemo(() => {
    const is = (
      images
        ? images.data.map((item) => ({
            label: item.id,
            value: item.id.toString(),
            icon: item,
          }))
        : []
    ).filter(
      (item) => !question?.images.some((i) => i.id === item.value)
    ) as SelectOption[];

    if (question) {
      question.images.forEach((i) => {
        is.unshift({
          label: i.id,
          value: i.id,
          icon: i,
        });
      });
    }

    return is;
  }, [question, images]);

  const onSubmit = (data: IFormInputs) => onSubmitHandler(data);

  const onSubmitHandler = async (dataForm: IFormInputs) => {
    try {
      if (!question) {
        //create

        const answer = await showApiCallNotification(
          createQuizQuestion({
            ...dataForm,
            images: dataForm.images.map((im) => im.icon!),
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
                      {t<string>(`Creation operation failed`)}:{' '}
                      {err.data.status}
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
        router.push(`${router.route.replace('/new', `/${answer.id}/edit`)}`);
      } else {
        //edit
        const answer = await showApiCallNotification(
          updateQuizQuestion({
            ...dataForm,
            id: question.id,
            images: dataForm.images.map((im) => im.icon!),
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
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        minHeight: '100%',
        p: 3,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={2}>
            <Typography sx={{ mb: 1 }} variant='subtitle2'>
              Code
            </Typography>
            <Controller
              name={'code'}
              control={control}
              // {...register(`prices.${index}.price`)}
              render={({ field, fieldState: { error } }) => (
                <InputText
                  disabled={!!question}
                  field={field}
                  sx={{ width: '100%' }}
                  error={!!error}
                  onChange={({ target }) => {
                    field.onChange(
                      toKebabCase(target.value.toString()).toUpperCase()
                    );
                  }}
                  helperText={
                    error?.message
                      ? t<string>(error.message as unknown as string)
                      : ''
                  }
                />
              )}
            />
          </Grid>
          <Grid item xs={10}>
            <Typography sx={{ mb: 1 }} variant='subtitle2'>
              Question
            </Typography>
            <Controller
              name={'question'}
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

          <Grid item xs={12} sx={{ mb: 3 }}>
            <Typography sx={{ mb: 1 }} variant='subtitle2'>
              Description
            </Typography>
            <Controller
              name={'description'}
              control={control}
              // {...register(`prices.${index}.price`)}
              render={({ field, fieldState: { error } }) => (
                <InputText
                  design='richtext'
                  field={field}
                  sx={{ width: '100%' }}
                  multiline
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
        </Grid>

        {watch('images').length > 0 && (
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
            <Carousel
              autoPlay={false}
              infiniteLoop={false}
              renderThumbs={() =>
                watch('images').map((img, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      width: '100%',
                      height: 50,
                      position: 'relative',
                    }}
                  >
                    <Image
                      src={
                        'https://uc2e4d818cec287bd048895c1179.dl.dropboxusercontent.com/cd/0/get/B9I6gpqfraIZBY-wq73Xg3LoAlqVPZVC5o46zbHYL4rmGIMPunJgQGRP1USeVfxEOrweKpYY4TmI_Veu3fyDSd4skIVT5flKJFZi0xLbTZbfALt16CDubUdk0me3LQmSaWV3XEuht5gubxvmqlpk0ovCpAGaHqXhVr4vQaFqBieiLSEFesLOi0Jr7reOUqSP_IU/file&w=3840&q=75'
                      }
                      alt={img.label}
                      fill
                      sizes="100vw"
                      style={{
                        objectFit: "contain"
                      }}></Image>
                  </Box>
                ))
              }
              showIndicators={false}
            >
              {watch('images').map((i, index) => (
                <Box
                  key={index}
                  sx={{
                    width: '100%',
                    height: '200px',
                    position: 'relative',
                  }}
                >
                  <Image
                    key={index}
                    src={i.icon!.path}
                    alt={i.label}
                    fill
                    sizes="100vw"
                    style={{
                      objectFit: "contain"
                    }} />
                </Box>
              ))}
            </Carousel>
          </Box>
        )}
        <Box sx={{ px: 2, mt: 4 }}>
          <Controller
            name='images'
            control={control}
            render={({ field, fieldState: { error } }) => (
              <SelectWithSearchServer
                label={t('Selectionner des images question')}
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
                multiple
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
            display: 'flex',
            justifyContent: 'center',
            mt: 3,
          }}
        >
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
      </form>
      {disabled && (
        <Backdrop
          open
          sx={{
            bgcolor: 'background.default',
            color: '#fff',
            opacity: '0.7!important',
            position: 'absolute',
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
        />
      )}
    </Box>
  );
};
