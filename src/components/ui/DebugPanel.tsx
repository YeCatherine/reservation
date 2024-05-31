import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export interface DebugPanelProps {
  /**
   * Data to display in the debug panel.
   */
  data: Record<string, unknown>;
  /**
   * Title of the debug panel (optional).
   */
  title?: string;
  /**
   * Whether the debug panel is expanded by default (optional).
   */
  expanded?: boolean;
}

const DebugPanel: React.FC<DebugPanelProps> = ({
  data,
  title = 'Debug Panel',
  expanded = false,
}) => {
  const [expandAccordion, setExpandAccordion] = useState(expanded);

  useEffect(() => {
    setExpandAccordion(expanded);
  }, [expanded]);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <Accordion
      expanded={expandAccordion}
      onChange={() => setExpandAccordion(!expandAccordion)}
      sx={{ m: 2, p: 2 }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel-content"
        id="panel-header"
      >
        <Typography>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <pre>{JSON.stringify(data, null, 4)}</pre>
      </AccordionDetails>
    </Accordion>
  );
};

export default DebugPanel;
