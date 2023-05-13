import { FC, useState } from 'react';
import {
  Box,
  Button,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem,
  Paper,
  ThemeProvider,
  Tooltip,
  Typography,
} from '@mui/material';
import { Cog as CogIcon } from '../../../icons/cog';
import { User as UserIcon } from '../../../icons/user';
import { EdgeProps, getBezierPath } from 'reactflow';
import { Answer } from '@interfaces/quiz';
import { PencilAlt } from '@icons/pencil-alt';
import { useSettings } from '@hooks/use-settings';
import { createTheme } from '@theme/index';
import { Delete } from '@mui/icons-material';
import { WithTooltip } from '@components/Tooltip';
import { EditQuizAnswerModal } from './EditQuizAnswerModal';

const foreignObjectSize = 150;
export const AnswerEdgeComponent: FC<EdgeProps<Answer>> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  markerEnd,
}) => {
  const [editAnswerOpen, setEditAnswerOpen] = useState<boolean>(false);

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const { settings } = useSettings();
  const theme = createTheme({
    ...settings,
    mode: 'dark',
  });

  const handleEditClick = () => {
    setEditAnswerOpen(true);
  };

  const handleEditClose = () => {
    setEditAnswerOpen(false);
  };
  return (
    <>
      <path
        id={id}
        style={style}
        className='react-flow__edge-path'
        d={edgePath}
        markerEnd={markerEnd}
      />
      <foreignObject
        width={foreignObjectSize}
        height={foreignObjectSize}
        x={labelX - foreignObjectSize / 2}
        y={labelY - foreignObjectSize / 2}
        className='edgebutton-foreignobject'
        requiredExtensions='http://www.w3.org/1999/xhtml'
      >
        <Box
          sx={{
            backgroundColor: 'background.default',
            minHeight: '100%',
            p: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ThemeProvider theme={theme}>
            <Paper
              elevation={12}
              sx={{
                minWidth: '100%',
                maxWidth: 150,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 2,
                }}
              >
                <WithTooltip title={`${data?.label}`} disable={false}>
                  <Typography
                    variant='subtitle1'
                    sx={{
                      textAlign: 'center',
                      overflow: 'hidden',
                      maxHeight: '45px',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {data?.label}
                  </Typography>
                </WithTooltip>
              </Box>
              <Divider />
              <Box
                sx={{
                  p: 2,
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 2,
                }}
              >
                <Tooltip title='Supprimer'>
                  <IconButton>
                    <Delete fontSize='small' />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Modifier'>
                  <IconButton onClick={handleEditClick}>
                    <PencilAlt fontSize='small' />
                  </IconButton>
                </Tooltip>
              </Box>
            </Paper>
          </ThemeProvider>
          <EditQuizAnswerModal
            answer={data!}
            open={editAnswerOpen}
            onClose={handleEditClose}
          />
        </Box>
      </foreignObject>
    </>
  );
};
