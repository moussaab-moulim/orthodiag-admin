import { FC, useEffect, useMemo } from 'react';
import { Backdrop, Box, Button, Grid, Typography } from '@mui/material';
import {
  SelectOption,
  SelectWithSearchServer,
} from '@components/widgets/inputs/SelectWithSearchServer';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import InputText from '@components/widgets/inputs/InputText';
import { toKebabCase } from '@utils/helpers';
import { usePaginatedState } from '@hooks/usePaginatedState';
import { useGetFilesInfiniteScrollQuery } from '@slices/fileReduxApi';
import { useCommon } from '@hooks/useCommon';
import {
  useCreatePracticeMutation,
  useUpdatePracticeMutation,
} from '@slices/practiceReduxApi';
import { useRouter } from 'next/router';
import { Practice } from '@interfaces/practice';
import * as yup from 'yup';
import Image from 'next/image';

interface EditPracticeFormProps {
  practice?: Practice;
  disabled: boolean;
}

const initialPractice = (practice?: Practice) => {
  if (practice) {
    return {
      address: practice.address,
      city: practice.city,
      image: {
        label: practice.image.id,
        value: practice.image.id,
        icon: practice.image,
      } as SelectOption,
      latitude: practice.latitude,
      longitude: practice.longitude,
      name: practice.name,
      email: practice.email,
      rating: practice.rating,
    };
  }

  return {
    address: '',
    city: '',
    image: null,
    latitude: 0,
    longitude: 0,
    name: '',
    email: '',
    rating: 0,
  };
};

type IFormInputs = ReturnType<typeof initialPractice>;

export const EditPracticeForm: FC<EditPracticeFormProps> = ({
  practice,
  disabled,
}) => {
  const router = useRouter();
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

  const [updatePractice] = useUpdatePracticeMutation();
  const [createPractice] = useCreatePracticeMutation();

  const {
    handleSubmit,
    formState: { isDirty, errors, isSubmitting },
    control,
    watch,
    reset,
  } = useForm<IFormInputs>({
    mode: 'all',
    defaultValues: initialPractice(practice),
    resolver: yupResolver(
      yup.object().shape({
        image: yup.object().required('image is required'),
        address: yup.string().required('address is required'),
        city: yup.string().required('city is required'),
        latitude: yup.number().required('latitude is required'),
        longitude: yup.number().required('longitude is required'),
        name: yup.string().required('name is required'),
        email: yup.string().email('must be an email').required('email is required'),
        rating: yup.number().required('rating is required'),
      })
    ),
  });

  useEffect(() => {
    reset(initialPractice(practice));
  }, [practice]);

  const mappedImages: SelectOption[] = useMemo(() => {
    const is = (
      images
        ? images.data.map((item) => ({
            label: item.id,
            value: item.id.toString(),
            icon: item,
          }))
        : []
    ).filter((item) => !(practice?.image.id === item.value)) as SelectOption[];

    if (practice) {
      is.unshift({
        label: practice.image.id,
        value: practice.image.id.toString(),
        icon: practice.image,
      });
    }

    return is;
  }, [practice, images]);

  const onSubmit = (data: IFormInputs) => {
    console.log('in onsubmit');
     onSubmitHandler(data);
  };
  console.log('watch', watch());
  const onSubmitHandler = async (dataForm: IFormInputs) => {
    console.log('dataForm in handler', dataForm);
    try {
      if (!practice) {
        //create
        const answer = await showApiCallNotification(
          createPractice({
            ...dataForm,
            image: dataForm.image?.icon,
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
        const answer = await showApiCallNotification(
          updatePractice({
            ...dataForm,
            id: practice.id,
            image: dataForm.image?.icon,
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
          <Grid item xs={12} sx={{ mb: 3 }}>
            <Typography sx={{ mb: 1 }} variant='subtitle2'>
              Name
            </Typography>
            <Controller
              name={'name'}
              control={control}
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
              Email
            </Typography>
            <Controller
              name={'email'}
              control={control}
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
              Address
            </Typography>
            <Controller
              name={'address'}
              control={control}
              render={({ field, fieldState: { error } }) => (
                <InputText
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
          <Grid item xs={12} sx={{ mb: 3 }}>
            <Typography sx={{ mb: 1 }} variant='subtitle2'>
              City
            </Typography>
            <Controller
              name={'city'}
              control={control}
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

          <Grid item xs={12}>
            <Typography sx={{ mb: 1 }} variant='subtitle2'>
              Latitude
            </Typography>
            <Controller
              name={'latitude'}
              control={control}
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
              Longitude
            </Typography>
            <Controller
              name={'longitude'}
              control={control}
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
              Rating
            </Typography>
            <Controller
              name={'rating'}
              control={control}
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
        </Grid>

        {watch('image') && (
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
            {/* <Carousel
              autoPlay={false}
              infiniteLoop={false}
              renderItem={() => (
                <Box
                  key={watch("image")?.value}
                  sx={{
                    width: "100%",
                    height: 50,
                    position: "relative",
                  }}
                >
                  <Image
                    unoptimized
                    src={watch("image")?.icon?.path || ""} // Provide a default value for src
                    alt={watch("image")?.label || ""}
                    fill
                    style={{
                      objectFit: "contain",
                    }}
                  />
                </Box>
              )}
              showIndicators={false}
            > */}
            <Box
              key={watch('image')?.value}
              sx={{
                width: '100%',
                height: '200px',
                position: 'relative',
              }}
            >
              <Image
                unoptimized
                key={watch('image')?.value}
                src={watch('image')?.icon?.path || ''}
                alt={watch('image')?.label || ''}
                fill
                style={{
                  objectFit: 'contain',
                }}
              />
            </Box>
            {/* </Carousel> */}
          </Box>
        )}

        <Box sx={{ px: 2 }}>
          <Controller
            name='image'
            control={control}
            render={({ field, fieldState: { error } }) => (
              <SelectWithSearchServer
                label={t('Selectionner une image de Practice')}
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
            Sauvegarder
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
