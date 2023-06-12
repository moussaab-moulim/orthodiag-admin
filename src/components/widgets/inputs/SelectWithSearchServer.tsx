import React, { useState, UIEventHandler, useMemo } from 'react';
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  ListSubheader,
  TextField,
  InputAdornment,
  OutlinedInput,
  SxProps,
  Theme,
  FormHelperText,
  Chip,
  Checkbox,
  ListItemText,
  LinearProgress,
  IconButton,
  Typography,
  ListItemAvatar,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { ControllerRenderProps, FieldPath, FieldValues } from 'react-hook-form';

import { useDebouncedCallback } from 'use-debounce';
import { Close } from '@mui/icons-material';
import { LoadingSkeleton } from '@components/Loading';
import { useTranslation } from 'react-i18next';
import { FileEntity } from '@interfaces/quiz';
import { WithTooltip } from '@components/Tooltip';
import State from '@components/State';
import Image from 'next/image';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
export interface SelectOption<T extends number | string = string> {
  value: T;
  label: string;
  icon?: FileEntity;
}
type Value = SelectOption | null | SelectOption[];
type Selected = string | number | (string | number)[];
export interface ISelectWithProps<
  T extends FieldValues,
  TName extends FieldPath<T>
> {
  options: SelectOption[];
  defaultValue?: Value;
  label: string;
  multiple?: boolean;
  error?: boolean;
  helperText?: string;
  field: ControllerRenderProps<T, TName>;
  disabled?: boolean;
  onChange?: (event: any) => void;
  value: Value;
  sx?: SxProps<Theme>;
  disableClearable?: boolean;
  showSearch?: boolean;
  hasMore: boolean;
  onLaodMore: () => void;
  loading: boolean;
  onSearch: (text: string) => void;
}

export const SelectWithSearchServer = <
  T extends FieldValues,
  TName extends FieldPath<T>
>({
  options,
  defaultValue,
  label,
  multiple = false,
  error,
  helperText,
  field,
  disabled = false,
  onChange,
  value,
  sx,
  showSearch = true,
  hasMore,
  onLaodMore,
  loading,

  onSearch,
}: ISelectWithProps<T, TName>) => {
  const selectedValues: SelectOption[] = useMemo(() => {
    if (multiple) {
      return field.value;
    } else {
      if (field.value != null) {
        return [field.value];
      } else return [];
    }
  }, [field.value]);

  const [searchText, setSearchText] = useState<string>('');

  const debounceOnSearch = useDebouncedCallback((value: string) => {
    onSearch(value);
  }, 1000);

  const { t } = useTranslation();

  const handleSelect = (eventValue: Selected) => {
    let selectedOption = null;

    //if multiple we send array ifnot we send only one {label,value object}
    if (Array.isArray(eventValue)) {
      selectedOption = options.filter((_opt) =>
        eventValue.includes(_opt.value)
      );
    } else {
      selectedOption = options.find((_opt) => _opt.value === eventValue);
    }
    onChange ? onChange(selectedOption) : field.onChange(selectedOption);
  };

  const handleDeleteItem = (item: string | number) => {
    if (multiple) {
      const filteredValue = (value as SelectOption[]).filter(
        (_opt) => _opt.value !== item
      );
      onChange ? onChange(filteredValue) : field.onChange(filteredValue);
    } else {
      onChange ? onChange(null) : field.onChange(null);
    }
  };
  const labelId = `id-${field.name}`;
  const handleScroll: UIEventHandler<HTMLDivElement> = (event) => {
    if (
      Math.abs(
        event.currentTarget.scrollHeight -
          event.currentTarget.clientHeight -
          event.currentTarget.scrollTop
      ) < 1 &&
      hasMore &&
      !loading
    ) {
      onLaodMore();
      //user is at the end of the list so load more items
    }
  };
  return (
    <FormControl sx={{ ...sx }} fullWidth>
      <InputLabel id={labelId} error={error}>
        {label}
      </InputLabel>
      <Select
        labelId={labelId}
        error={error}
        {...field}
        inputProps={{
          'data-testid': 'select__data-testid',
        }}
        disabled={disabled}
        onChange={(e) => handleSelect(e.target.value)}
        multiple={multiple}
        defaultValue={
          Array.isArray(defaultValue)
            ? defaultValue.map((_opt: SelectOption) => _opt.value)
            : defaultValue?.value ?? ''
        }
        MenuProps={{
          autoFocus: false,
          PaperProps: {
            sx: {
              maxHeight: ITEM_HEIGHT * 6.5 + ITEM_PADDING_TOP,
            },
            onScroll: handleScroll,
          },
        }}
        value={
          Array.isArray(value)
            ? value.map((_opt: SelectOption) => _opt.value)
            : value?.value ?? ''
        }
        // This prevents rendering empty string in Select's value
        // if search text would exclude currently selected option.
        input={<OutlinedInput label={label} />}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {Array.isArray(selected) ? (
              selected.map((item, renderIndex) => {
                const selected =
                  options.find((_opt) => _opt.value === item)?.label ?? '';
                return (
                  <Chip
                    key={renderIndex}
                    label={selected}
                    onDelete={() => handleDeleteItem(item)}
                    onMouseDown={(event) => event.stopPropagation()}
                  />
                );
              })
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <Chip
                  label={
                    options.find((_opt) => _opt.value === selected)?.label ?? ''
                  }
                  sx={{ overflow: 'hidden' }}
                  onDelete={() => handleDeleteItem(selected)}
                  onMouseDown={(event) => event.stopPropagation()}
                />
              </Box>
            )}
          </Box>
        )}
        sx={field.value ? { '.MuiSelect-select': { py: '12.5px' } } : {}}
      >
        {showSearch && (
          <ListSubheader sx={{ pt: 1, pb: 1 }}>
            <TextField
              size='small'
              placeholder={t<string>('menu:search')}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                debounceOnSearch(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key !== 'Escape') {
                  // Prevents autoselecting item while typing (default Select behaviour)
                  e.stopPropagation();
                }
              }}
            />
            {loading && (
              <Box
                sx={{ width: '100%', position: 'absolute', left: 0, bottom: 0 }}
              >
                <LinearProgress />
              </Box>
            )}
          </ListSubheader>
        )}
        {selectedValues?.map((option: SelectOption, i: number) => {
          const icon = option.icon;

          return (
            <MenuItem
              key={i}
              value={option.value}
              data-cy={`select-option-${option.value}`}
            >
              {multiple && <Checkbox checked={true} />}
              {icon && (
                <ListItemAvatar sx={{ pr: 2 }}>
                  <Box
                    sx={{
                      alignItems: 'center',
                      display: 'flex',
                      height: 100,
                      justifyContent: 'center',
                      overflow: 'hidden',
                      width: 100,
                      '& img': {
                        width: '100%',
                        height: 'auto',
                      },
                    }}
                  >
                    <Image
                      unoptimized
                      alt={icon.id}
                      src={icon.path}
                      width={100}
                      height={100}
                    />
                  </Box>
                </ListItemAvatar>
              )}
              <ListItemText primary={option.label} />
            </MenuItem>
          );
        })}

        {options
          .filter(
            (_p) =>
              !selectedValues.some(
                (_sp: SelectOption) => _sp.value === _p.value
              )
          )
          .map((option, i) => {
            const icon = option.icon;

            return (
              <MenuItem
                key={i}
                value={option.value}
                data-cy={`select-option-${option.value}`}
              >
                {multiple && <Checkbox checked={false} />}
                {icon && (
                  <ListItemAvatar sx={{ pr: 2 }}>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex',
                        height: 100,
                        justifyContent: 'center',
                        overflow: 'hidden',
                        width: 100,
                        '& img': {
                          width: '100%',
                          height: 'auto',
                        },
                      }}
                    >
                      <Image
                        unoptimized
                        alt={icon.id}
                        src={icon.path}
                        width={100}
                        height={100}
                      />
                    </Box>
                  </ListItemAvatar>
                )}
                <ListItemText primary={option.label} />
              </MenuItem>
            );
          })}

        {loading && (
          <MenuItem>
            <LoadingSkeleton sx={{ height: 56, width: '100%' }} />
          </MenuItem>
        )}
      </Select>
      <FormHelperText error={error}>{helperText}</FormHelperText>
    </FormControl>
  );
};
