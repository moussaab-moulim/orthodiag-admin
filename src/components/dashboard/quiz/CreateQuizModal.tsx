import type { FC } from 'react';
import {
  Box,
  Button,
  Dialog,
  Divider,
  FormHelperText,
  Grid,
  IconButton,
  Input,
  Modal,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import AddPhotoIcon from '@mui/icons-material/AddPhotoAlternate';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { QuillEditor } from '../../quill-editor';
import { ArrowsExpand as ArrowsExpandIcon } from '../../../icons/arrows-expand';
import { X as XIcon } from '../../../icons/x';
import { useTranslation } from 'react-i18next';
import { useMounted } from '@hooks/use-mounted';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import { useCreateQuizMutation } from '@slices/quizReduxApi';
import { useCommon } from '@hooks/useCommon';
import { toast } from 'react-toastify';
interface CreateQuizModalProps {
  open: boolean;
  onClose: () => void;
}

export const CreateQuizModal: FC<CreateQuizModalProps> = ({
  open,
  onClose,
}: CreateQuizModalProps) => {
  const isMounted = () => true;
  const router = useRouter();
  const { t } = useTranslation();

  const [createQuiz] = useCreateQuizMutation();

  const { showApiCallNotification } = useCommon();
  const formik = useFormik({
    initialValues: {
      code: '',
      name: '',
      submit: null,
    },
    validationSchema: Yup.object({
      code: Yup.string().required('Code is required'),
      name: Yup.string().required('Password is required'),
    }),
    onSubmit: async (values, helpers): Promise<void> => {
      try {
        const quiz = await showApiCallNotification(
          createQuiz({
            code: values.code,
            name: values.name,
          }).unwrap(),
          {
            success: 'Creation operation failed',
            pending: 'Creation operation pending',

            error: {
              render(err) {
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

        if (isMounted() && quiz) {
          router.push(`quizes/${quiz.id}/edit`).catch(console.error);
          onClose();
        }
      } catch (err) {
        console.error(err);

        if (isMounted()) {
          helpers.setStatus({ success: false });
          helpers.setErrors({
            submit: err.data?.errors
              ? Object.values(err.data?.errors).join(' | ')
              : err.data.message,
          });
          helpers.setSubmitting(false);
        }
      }
    },
  });
  return (
    <Modal open={open} aria-labelledby='modal-modal-title'>
      <form
        noValidate
        onSubmit={formik.handleSubmit}
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
              <Typography variant='h6' id='modal-modal-title'>
                Ajouter un quiz
              </Typography>
              <Box sx={{ flexGrow: 1 }} />

              <IconButton onClick={onClose}>
                <XIcon fontSize='small' />
              </IconButton>
            </Box>
            <Box sx={{ px: 2 }}>
              <TextField
                autoFocus
                error={Boolean(formik.touched.code && formik.errors.code)}
                fullWidth
                helperText={formik.touched.code && formik.errors.code}
                label='Code'
                margin='normal'
                name='code'
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type='text'
                value={formik.values.code}
              />

              <TextField
                autoFocus
                error={Boolean(formik.touched.name && formik.errors.name)}
                fullWidth
                helperText={formik.touched.name && formik.errors.name}
                label='Name'
                margin='normal'
                name='name'
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type='text'
                value={formik.values.name}
              />
              {formik.errors.submit && (
                <Box sx={{ mt: 3 }}>
                  <FormHelperText error>{formik.errors.submit}</FormHelperText>
                </Box>
              )}
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
                disabled={formik.isSubmitting}
                fullWidth
                size='large'
                type='submit'
                variant='contained'
              >
                {t('Ajouter')}
              </Button>
            </Box>
          </Paper>
        </Box>
      </form>
    </Modal>
  );
};
