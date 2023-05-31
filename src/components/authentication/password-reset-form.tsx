import { useEffect, useRef, useState } from 'react';
import type { ClipboardEvent, FC, KeyboardEvent } from 'react';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  FormHelperText,
  TextField,
  Typography,
} from '@mui/material';
import { useAuth } from '../../hooks/use-auth';
import { useMounted } from '../../hooks/use-mounted';
import { useResetPasswordMutation } from '@slices/authentication';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';

export const PasswordResetForm: FC = (props) => {
  const isMounted = useMounted();
  //const { passwordReset } = useAuth();
  const router = useRouter();
  const [resetPassword, { isLoading, isError, error, isSuccess }] =
    useResetPasswordMutation();
  const token: string = router.query.token as string;

  const itemsRef = useRef<HTMLInputElement[]>([]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      password: '',
      passwordConfirm: '',
      submit: null,
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(7, 'Must be at least 7 characters')
        .max(255)
        .required('Required'),
      passwordConfirm: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Required'),
    }),
    onSubmit: async (values, helpers): Promise<void> => {
      try {
        await resetPassword({ hash: token, password: values.password });
        console.error('catching try', error);
      } catch (err) {
        console.error('catching ', err);

        if (isMounted()) {
          helpers.setStatus({ success: false });
          helpers.setErrors({ submit: err.message });
          helpers.setSubmitting(false);
        }
      }
    },
  });
  console.error('catching try comp', error);
  useEffect(() => {
    if (isError) {
      formik.setStatus({ success: false });
      formik.setErrors({
        submit:
          (error as any).data.error ||
          Object.values((error as any).data.errors).join('\n'),
      });
      formik.setSubmitting(false);
    }
  }, [isError, error]);
  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, 6);
  }, []);

  return (
    <form noValidate onSubmit={formik.handleSubmit} {...props}>
      <TextField
        error={Boolean(formik.touched.password && formik.errors.password)}
        fullWidth
        helperText={formik.touched.password && formik.errors.password}
        label='Mot de passe'
        margin='normal'
        name='password'
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        type='password'
        value={formik.values.password}
        disabled={isSuccess}
      />
      <TextField
        error={Boolean(
          formik.touched.passwordConfirm && formik.errors.passwordConfirm
        )}
        fullWidth
        helperText={
          formik.touched.passwordConfirm && formik.errors.passwordConfirm
        }
        label='Confirmation de mot de passe'
        margin='normal'
        name='passwordConfirm'
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        type='password'
        value={formik.values.passwordConfirm}
        disabled={isSuccess}
      />
      {formik.errors.submit && (
        <Box sx={{ mt: 3 }}>
          <FormHelperText error>{formik.errors.submit}</FormHelperText>
        </Box>
      )}
      <Box sx={{ mt: 3 }}>
        <Button
          disabled={formik.isSubmitting || isSuccess}
          fullWidth
          size='large'
          type='submit'
          variant='contained'
        >
          Réinitialiser le mot de passe
        </Button>
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          mt: 3,
        }}
      >
        {isSuccess && (
          <Alert severity='success'>
            <AlertTitle>Votre mot de passe est changé avec succes</AlertTitle>
            Veuilliez fermer cette page et revenir vers OrthoDiag
          </Alert>
        )}
      </Box>
    </form>
  );
};
