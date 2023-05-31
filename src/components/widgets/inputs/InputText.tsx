import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import React, { Fragment, ReactElement, useState } from 'react';
import { useRouter } from 'next/router';
import { QuillEditor } from '@components/quill-editor';

interface IProps {
  name?: string;
  label?: string;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  sx?: object;
  field: any;
  disabled?: boolean;
  type?: React.InputHTMLAttributes<unknown>['type'];
  design?: 'wyswig' | 'default' | 'textarea' | 'richtext';
  onChange?: (...event: any[]) => void;
  inputStartAdornment?: string | ReactElement;
  inputEndAdornment?: string | ReactElement;
  id?: string;
  multiline?: boolean;
  defaultValue?: any;
  readOnly?: boolean;
  variant?: string;
  inputProps?: any;
  shrink?: boolean;
}

const InputText = ({
  sx,
  label,
  required,
  error,
  helperText,
  field,
  disabled,
  type,
  design = 'default',
  onChange,
  inputStartAdornment,
  inputEndAdornment,
  id,
  multiline,
  defaultValue,
  readOnly,
  variant,
  inputProps,
  shrink,
}: IProps) => {
  const router = useRouter();

  return (
    <FormControl id={id} sx={sx} error={error}>
      {((design) => {
        switch (design) {
          case 'default':
            return (
              <TextField
                type={type}
                disabled={disabled}
                label={label}
                error={error}
                multiline={multiline}
                rows={multiline ? 3 : undefined}
                helperText={error && helperText} // here display helper text only when error
                InputProps={{
                  'aria-required': required,
                  disabled,
                  startAdornment: inputStartAdornment,
                  endAdornment: inputEndAdornment,
                  onKeyDown: (e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                    }
                  },
                  readOnly: readOnly,
                }}
                {...field}
                defaultValue={defaultValue}
                onChange={onChange ?? field.onChange}
                variant={variant ?? 'outlined'}
                inputProps={inputProps ?? {}}
                InputLabelProps={{ shrink: shrink }}
              />
            );
          case 'richtext':
            return (
              <QuillEditor
                type='markdown'
                sx={{
                  flexGrow: 1,
                }}
                field={field}
                value={field.value}
                onChange={onChange ?? field.onChange}
              />
            );

          default:
            return (
              <TextField
                type={type}
                disabled={disabled}
                label={label}
                error={error}
                multiline={multiline}
                helperText={error && helperText} // here display helper text only when error
                InputProps={{
                  'aria-required': required,
                  disabled,
                  startAdornment: inputStartAdornment,
                  endAdornment: inputEndAdornment,
                }}
                {...field}
                onChange={onChange ?? field.onChange}
              />
            );
        }
      })(design)}
    </FormControl>
  );
};

export default InputText;
