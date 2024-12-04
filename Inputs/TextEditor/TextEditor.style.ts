import { Theme } from '@mui/material/styles';
import { FieldError } from 'react-hook-form';
import { ThemeDirection, ThemeMode } from 'types/config';

export const TextEditorWrapper = ({
  theme,
  error,
}: {
  theme: Theme;
  error: FieldError;
}) => ({
  '& .rdw-editor-wrapper': {
    bgcolor: theme.palette.background.paper,
    border: `1px solid`,
    borderColor: error
      ? theme.palette.error.main
      : theme.palette.secondary.light,

    // boxShadow: isFocused && `0px 0px 6px ${theme.palette.primary.light}`,
    borderRadius: '4px',
    '& .rdw-editor-main': {
      px: 2,
      py: 0.5,
      border: 'none',
      minHeight: '150px',
      cursor: 'text',
    },
    '& .rdw-editor-toolbar': {
      pt: 1.25,
      border: 'none',
      borderBottom: '1px solid',
      borderColor: theme.palette.divider,
      bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.light' : 'grey.50',
      '& .rdw-option-wrapper': {
        bgcolor:
          theme.palette.mode === ThemeMode.DARK ? 'dark.light' : 'grey.50',
        borderColor: theme.palette.divider,
      },
      '& .rdw-dropdown-wrapper': {
        bgcolor:
          theme.palette.mode === ThemeMode.DARK ? 'dark.light' : 'grey.50',
        borderColor: theme.palette.divider,
        '& .rdw-dropdown-selectedtext': {
          color:
            theme.palette.mode === ThemeMode.DARK
              ? theme.palette.grey[100]
              : 'grey.900',
        },
        '& .rdw-dropdownoption-default': {
          color:
            theme.palette.mode === ThemeMode.DARK
              ? theme.palette.grey[100]
              : 'grey.900',
        },
      },
    },
    ...(theme.direction === ThemeDirection.RTL && {
      '.rdw-dropdown-carettoopen': {
        right: '10%',
        left: 'inherit',
      },
      '.rdw-dropdown-carettoclose': {
        right: '10%',
        left: 'inherit',
      },
    }),
  },
});
