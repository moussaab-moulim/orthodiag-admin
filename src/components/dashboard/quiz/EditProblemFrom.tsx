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
import { Problem } from '@interfaces/quiz';
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
import {
  useCreateProblemMutation,
  useUpdateProblemMutation,
} from '@slices/problemReduxApi';

import { remark } from 'remark';
import remarkHtml from 'remark-html';

import rehypeParse from 'rehype-parse';
import rehypeRemark from 'rehype-remark';
import remarkStringify from 'remark-stringify';
import { useRouter } from 'next/router';

interface EditProblemFormProps {
  problem?: Problem;
  disabled: boolean;
}

const initialProblem = (problem?: Problem) => {
  if (problem) {
    return {
      code: problem.code,
      name: problem.name,
      description: problem.description,
      images: problem.images.map((i) => ({
        label: i.id,
        value: i.id,
        icon: i,
      })) as SelectOption[],
    };
  }

  return {
    code: '',
    name: '',
    description: '',
    images: [],
  };
};
type IFormInputs = ReturnType<typeof initialProblem>;
export const EditProblemForm: FC<EditProblemFormProps> = ({
  problem,
  disabled,
}) => {
  const { t } = useTranslation();
  const { showApiCallNotification } = useCommon();
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

  const [updateQuizProblem] = useUpdateProblemMutation();
  const [createQuizProblem] = useCreateProblemMutation();
  const router = useRouter();
  const {
    handleSubmit,
    formState: { isDirty, errors, isSubmitting },
    control,
    watch,
    reset,
  } = useForm<IFormInputs>({
    mode: 'all',
    defaultValues: initialProblem(problem),
    resolver: yupResolver(
      object().shape({
        code: string().required(t('Code is required')),
        name: string().required(t('Name is required')),

        description: string(),
        images: array(),
      })
    ),
  });

  useEffect(() => {
    reset(initialProblem(problem));
  }, [problem]);

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
      (item) => !problem?.images.some((i) => i.id === item.value)
    ) as SelectOption[];

    if (problem) {
      problem.images.forEach((i) => {
        is.unshift({
          label: i.id,
          value: i.id,
          icon: i,
        });
      });
    }

    return is;
  }, [problem, images]);

  const onSubmit = (data: IFormInputs) => onSubmitHandler(data);
  console.log('watch', watch());
  const onSubmitHandler = async (dataForm: IFormInputs) => {
    console.log('submitting', dataForm);

    try {
      if (!problem) {
        //create
        const answer = await showApiCallNotification(
          createQuizProblem({
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
                      {t<string>(err.data?.data?.message)}
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
          updateQuizProblem({
            ...dataForm,
            id: problem.id,
            name: dataForm.name,
            images: dataForm.images.map((im) => im.icon!),
            description: dataForm.description,
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
      }
    } catch (err) {
      console.error(err);
    }
  };
  console.log('errors', errors);
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
                  disabled={!!problem}
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
              Name
            </Typography>
            <Controller
              name={'name'}
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
                      src={img.icon?.path}
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
                label={t('Selectionner des images problem')}
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
                loading={false}
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
