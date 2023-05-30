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
import { Treatment } from '@interfaces/quiz';
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
import Image from 'next/image';
import { usePaginatedState } from '@hooks/usePaginatedState';
import { PageParams } from '@interfaces/common';
import { useGetFilesInfiniteScrollQuery } from '@slices/fileReduxApi';
import { useCommon } from '@hooks/useCommon';
import { useUpdateTreatmentMutation } from '@slices/treatmentReduxApi';
import { remark } from 'remark';
import remarkHtml from 'remark-html';

import rehypeParse from 'rehype-parse';
import rehypeRemark from 'rehype-remark';
import remarkStringify from 'remark-stringify';

interface EditTreatmentFormProps {
  treatment: Treatment;
  disabled: boolean;
}

const initialTreatment = (treatment?: Treatment) => {
  if (treatment) {
    return {
      code: treatment.code,
      name: treatment.name,
      description: treatment.description,
      images: treatment.images.map((i) => ({
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
type IFormInputs = ReturnType<typeof initialTreatment>;
export const EditTreatmentForm: FC<EditTreatmentFormProps> = ({
  treatment,
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

  const [updateQuizTreatment] = useUpdateTreatmentMutation();

  const {
    handleSubmit,
    formState: { isDirty, errors, isSubmitting },
    control,
    watch,
    reset,
  } = useForm<IFormInputs>({
    mode: 'all',
    defaultValues: initialTreatment(treatment),
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
    reset(initialTreatment(treatment));
  }, [treatment]);

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
      (item) => !treatment?.images.some((i) => i.id === item.value)
    ) as SelectOption[];

    if (treatment) {
      treatment.images.forEach((i) => {
        is.unshift({
          label: i.id,
          value: i.id,
          icon: i,
        });
      });
    }

    return is;
  }, [treatment, images]);

  const onSubmit = (data: IFormInputs) => onSubmitHandler(data);

  const onSubmitHandler = async (dataForm: IFormInputs) => {
    console.log('dataForm', dataForm);
    try {
      const answer = await showApiCallNotification(
        updateQuizTreatment({
          ...dataForm,
          id: treatment.id,
          images: dataForm.images.map((im) => im.icon!),
          //send description as markdown
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
                  disabled={!!treatment}
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
                  // defaultValue={markdownToHtml(field.value)}
                  // onChange={(value) => {
                  //   console.log("field is changing");
                  //   // field.onChange((field.value = htmlToMarkdown(value))); // do not do this infinite loop !!!!!!!!!!
                  // }}
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
                      layout='fill'
                      objectFit='contain'
                      alt={img.label}
                    ></Image>
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
                    layout='fill'
                    objectFit='contain'
                  />
                </Box>
              ))}
            </Carousel>
          </Box>
        )}
        <Box sx={{ px: 2 }}>
          <Controller
            name='images'
            control={control}
            render={({ field, fieldState: { error } }) => (
              <SelectWithSearchServer
                label={t('Selectionner des images treatment')}
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
