import type { VoidFunctionComponent } from 'react';
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import { styled } from '@mui/material/styles';
import type { SxProps } from '@mui/system';
import type { Theme } from '@mui/material';
import PropTypes from 'prop-types';
import { useRef } from 'react';
import rehypeParse from 'rehype-parse';
import rehypeRemark from 'rehype-remark';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import remarkStringify from 'remark-stringify';
import { RefCallBack } from 'react-hook-form';
import { Converter } from 'showdown';
import TurndownService from 'turndown';
import { LoadingSkeleton } from './Loading';
interface QuillEditorProps {
  onChange?: (value: string) => void;
  placeholder?: string;
  sx?: SxProps<Theme>;
  value?: string;
  type?: 'html' | 'markdown';
  field?: any;
}

const Quill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <LoadingSkeleton />,
});

const QuillEditorRoot = styled('div')(({ theme }) => ({
  border: 1,
  borderColor: theme.palette.divider,
  borderRadius: theme.shape.borderRadius,
  borderStyle: 'solid',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  '& .quill': {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    overflow: 'hidden',
  },
  '& .ql-snow.ql-toolbar': {
    borderColor: theme.palette.divider,
    borderLeft: 'none',
    borderRight: 'none',
    borderTop: 'none',
    '& .ql-picker-label:hover': {
      color: theme.palette.primary.main,
    },
    '& .ql-picker-label.ql-active': {
      color: theme.palette.primary.main,
    },
    '& .ql-picker-item:hover': {
      color: theme.palette.primary.main,
    },
    '& .ql-picker-item.ql-selected': {
      color: theme.palette.primary.main,
    },
    '& button:hover': {
      color: theme.palette.primary.main,
      '& .ql-stroke': {
        stroke: theme.palette.primary.main,
      },
    },
    '& button:focus': {
      color: theme.palette.primary.main,
      '& .ql-stroke': {
        stroke: theme.palette.primary.main,
      },
    },
    '& button.ql-active': {
      '& .ql-stroke': {
        stroke: theme.palette.primary.main,
      },
    },
    '& .ql-stroke': {
      stroke: theme.palette.text.primary,
    },
    '& .ql-picker': {
      color: theme.palette.text.primary,
    },
    '& .ql-picker-options': {
      backgroundColor: theme.palette.background.paper,
      border: 'none',
      borderRadius: theme.shape.borderRadius,
      boxShadow: theme.shadows[10],
      padding: theme.spacing(2),
    },
  },
  '& .ql-snow.ql-container': {
    borderBottom: 'none',
    borderColor: theme.palette.divider,
    borderLeft: 'none',
    borderRight: 'none',
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    height: 'auto',
    overflow: 'hidden',
    '& .ql-editor': {
      color: theme.palette.text.primary,
      flex: 1,
      fontFamily: theme.typography.body1.fontFamily,
      fontSize: theme.typography.body1.fontSize,
      height: 'auto',
      overflowY: 'auto',
      padding: theme.spacing(2),
      '&.ql-blank::before': {
        color: theme.palette.text.secondary,
        fontStyle: 'normal',
        left: theme.spacing(2),
      },
    },
  },
}));

const htmlToMarkdown = (htmlText: string) => {
  const file = remark()
    .use(rehypeParse, { emitParseErrors: true, duplicateAttribute: false })
    .use(rehypeRemark)
    .use(remarkStringify)
    .processSync(htmlText);

  return String(file.value);
};

const markdownToHtml = (markdownText: string) => {
  //const file = remark().use(remarkHtml).processSync('**markdownText**');
  const converter = new Converter();
  /*   const file = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(rehypeStringify)
    .process('# Hello, Neptune!'); */

  //console.log('markdownToHtml ', file.value);
  return String(String(converter.makeHtml(markdownText)));
};

export const QuillEditor: VoidFunctionComponent<QuillEditorProps> = (props) => {
  const { sx, onChange, placeholder, value, type, field } = props;
  const refInput = useRef<HTMLDivElement | null>(null);

  return (
    <QuillEditorRoot sx={sx} ref={refInput}>
      <Quill
        {...field}
        onChange={(_value) =>
          type === 'markdown'
            ? onChange?.(htmlToMarkdown(_value))
            : onChange?.(_value)
        }
        placeholder={placeholder}
        value={type === 'markdown' ? markdownToHtml(value ?? '') : value}
        bounds={refInput.current || undefined}
      />
    </QuillEditorRoot>
  );
};
