'use client';

import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import SendIcon from '@mui/icons-material/Send';
import ChatIcon from '@mui/icons-material/Chat';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';
import AddIcon from '@mui/icons-material/Add';
import Chip from '@mui/material/Chip';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import DiagnosticsIcon from '@mui/icons-material/FindInPage';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CircularProgress from '@mui/material/CircularProgress';
import BugReportIcon from '@mui/icons-material/BugReport';
import Autocomplete from '@mui/material/Autocomplete';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import SupportIcon from '@mui/icons-material/Support';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const drawerWidth = 340;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%)',
    position: 'relative',
    marginLeft: theme.spacing(2),
    overflow: 'auto',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'radial-gradient(circle at 50% 50%, rgba(103, 58, 183, 0.05) 0%, rgba(103, 58, 183, 0) 70%)',
      pointerEvents: 'none',
    },
  }),
);

const ChatContainer = styled(Box, { 
  shouldForwardProp: (prop) => prop !== 'hasConversation' 
})<{ hasConversation?: boolean }>(({ theme, hasConversation }) => ({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  position: 'relative',
  zIndex: 1,
  ...(hasConversation && {
    justifyContent: 'flex-start',
  }),
}));

const ChatInputContainer = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(3),
  left: '50%',
  transform: 'translateX(-50%)',
  padding: theme.spacing(1.5, 2),
  borderRadius: 28,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
  background: 'rgba(40, 40, 50, 0.8)',
  backdropFilter: 'blur(10px)',
  maxWidth: '800px',
  width: 'calc(100% - 400px)',
  overflow: 'hidden',
  zIndex: 10,
  marginLeft: drawerWidth / 2,
}));

const StyledDrawer = styled(Box)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  marginLeft: theme.spacing(2),
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  height: 'calc(100vh - 32px)',
  background: 'rgba(18, 18, 30, 0.7)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(180deg, rgba(156, 39, 176, 0.05) 0%, rgba(103, 58, 183, 0.05) 100%)',
    pointerEvents: 'none',
    borderRadius: 'inherit',
  }
}));

const NewChatButton = styled(ListItemButton)(({ theme }) => ({
  border: '1px solid rgba(255, 255, 255, 0.12)',
  borderRadius: theme.shape.borderRadius,
  margin: theme.spacing(1, 2),
  backdropFilter: 'blur(5px)',
  background: 'rgba(255, 255, 255, 0.03)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: theme.palette.primary.main,
  },
}));

const WelcomeText = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(90deg, #9c27b0, #7e57c2)',
  backgroundClip: 'text',
  textFillColor: 'transparent',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 700,
  marginBottom: theme.spacing(2),
}));

// Updated component for default prompts container
const DefaultPromptsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(4), // Increased margin to move up from chat box
  justifyContent: 'center',
  maxWidth: '800px',
  width: '100%',
  margin: '0 auto',
  padding: theme.spacing(0, 2),
}));

// Updated component for prompt chips - pill style with border only
const PromptChip = styled(Chip)(({ theme }) => ({
  background: 'transparent',
  border: '1px solid rgba(156, 39, 176, 0.4)',
  color: theme.palette.text.primary,
  '&:hover': {
    background: 'rgba(156, 39, 176, 0.1)',
    borderColor: theme.palette.primary.main,
  },
  transition: 'all 0.2s ease',
  fontWeight: 500,
  padding: theme.spacing(1.2, 0.5),
  borderRadius: 20,
  height: 'auto',
}));

const StatusBox = styled(Paper, { 
  shouldForwardProp: (prop) => prop !== 'status' 
})<{ status?: 'success' | 'failure' | 'inactive' }>(({ theme, status }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '150px',
  width: '200px',
  padding: theme.spacing(2),
  margin: theme.spacing(2),
  borderRadius: theme.spacing(2),
  boxShadow: status === 'success' 
    ? `0 0 15px rgba(46, 204, 113, 0.5), inset 0 0 20px rgba(46, 204, 113, 0.3)` 
    : status === 'failure'
      ? `0 0 15px rgba(231, 76, 60, 0.5), inset 0 0 20px rgba(231, 76, 60, 0.3)`
      : `0 0 15px rgba(149, 165, 166, 0.5), inset 0 0 20px rgba(149, 165, 166, 0.3)`,
  background: status === 'success' 
    ? 'rgba(46, 204, 113, 0.15)' 
    : status === 'failure'
      ? 'rgba(231, 76, 60, 0.15)'
      : 'rgba(149, 165, 166, 0.15)',
  border: `1px solid ${
    status === 'success' 
      ? 'rgba(46, 204, 113, 0.5)' 
      : status === 'failure'
        ? 'rgba(231, 76, 60, 0.5)'
        : 'rgba(149, 165, 166, 0.5)'
  }`,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: status === 'success' 
      ? `0 5px 20px rgba(46, 204, 113, 0.6), inset 0 0 20px rgba(46, 204, 113, 0.4)` 
      : status === 'failure'
        ? `0 5px 20px rgba(231, 76, 60, 0.6), inset 0 0 20px rgba(231, 76, 60, 0.4)`
        : `0 5px 20px rgba(149, 165, 166, 0.6), inset 0 0 20px rgba(149, 165, 166, 0.4)`,
  }
}));

const DiagnosticsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  maxWidth: '900px',
  width: '100%',
  position: 'relative',
}));

const DiagnosticsRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  position: 'relative',
}));

const ConnectorLine = styled('div')(({ theme }) => ({
  position: 'absolute',
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  zIndex: 0,
}));

const HorizontalConnector = styled(ConnectorLine)(({ theme }) => ({
  height: '3px',
  width: '20px',
}));

const VerticalConnector = styled(ConnectorLine)(({ theme }) => ({
  width: '3px',
  height: '40px',
  left: '50%',
  transform: 'translateX(-50%)',
}));

// Custom hook for typing effect
function useTypingEffect(text: string, speed: number = 50) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  
  useEffect(() => {
    let i = 0;
    setIsTyping(true);
    
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(prev => prev + text.charAt(i));
        i++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
      }
    }, speed);
    
    return () => clearInterval(typingInterval);
  }, [text, speed]);
  
  return { displayedText, isTyping };
}

// Blinking cursor component
const BlinkingCursor = styled('span')(({ theme }) => ({
  display: 'inline-block',
  width: '3px',
  height: '1.2em',
  backgroundColor: theme.palette.primary.main,
  marginLeft: '2px',
  verticalAlign: 'text-bottom',
  animation: 'blink 1s step-end infinite',
  '@keyframes blink': {
    'from, to': { opacity: 1 },
    '50%': { opacity: 0 },
  },
}));

// Add interface for API response
interface ApiCallLog {
  _id: string;
  _index?: string;
  component: string;
  application: string;
  module?: string;
  http_status: string;
  status: string;
  url: string;
  http_method?: string;
  duration_millis?: number;
  request_name?: string;
  end_timestamp?: string;
  requestBody?: string;
  responseBody?: string;
  http_headers?: string;
  client?: string;
  host?: string;
  timestamp?: string;
  // Add other fields as needed
}

interface TraceResponse {
  trace_id: string;
  count: number;
  summary: {
    oms_count: number;
    cims_count: number;
    wms_count: number;
  };
  latestFailureCall?: ApiCallLog;
  oms: ApiCallLog[];
  cims: ApiCallLog[];
  wms: ApiCallLog[];
}

interface SystemStatus {
  name: string;
  status: 'success' | 'failure' | 'inactive';
  callCount: number;
}

// --- New Jira RCA Analysis Component ---
interface JiraUser {
  displayName: string;
  emailAddress?: string;
  avatarUrls?: { [key: string]: string };
}

interface JiraIssue {
  id: string;
  key: string;
  fields: {
    summary: string;
    description?: string;
    status: { name: string };
    assignee?: JiraUser;
    reporter?: JiraUser;
    priority?: { name: string };
  };
}

interface JiraResponse {
  issues: JiraIssue[];
}

// Add new interface for issue summary
interface IssueSummary {
  summary: string;
  rca?: string;
}

// Add this interface for Freshdesk tickets
interface FreshdeskTicket {
  id: number;
  subject: string;
  status: number;
  priority: number;
  created_at: string;
  updated_at: string;
  due_by: string;
  requester_id: number;
  responder_id: number | null;
  custom_fields: {
    cf_client?: string;
    cf_product_or_service?: string;
    cf_rca?: string;
    cf_corrective_action?: string;
    cf_preventive_action?: string;
    [key: string]: any;
  };
  tags: string[];
  source: number;
  company_id: number;
}

function JiraRcaAnalysis() {
  const [loading, setLoading] = useState(false);
  const [issues, setIssues] = useState<JiraIssue[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [searchMode, setSearchMode] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [autocompleteOptions, setAutocompleteOptions] = useState<{ summary: string; key: string }[]>([]);
  const [autocompleteLoading, setAutocompleteLoading] = useState(false);
  
  // Add new state for the detail dialog
  const [selectedIssue, setSelectedIssue] = useState<JiraIssue | null>(null);
  const [issueSummary, setIssueSummary] = useState<IssueSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  
  // Gradient text style
  const gradientText = {
    background: 'linear-gradient(90deg, #9c27b0, #7e57c2)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 700,
  };

  // Fetch recent issues on mount or when not in search mode
  useEffect(() => {
    if (searchMode) return;
    setLoading(true);
    setError(null);
    fetch('http://localhost:8080/api/jira/issues/recent?email=prakhar.singh@increff.com')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch Jira issues');
        return res.json();
      })
      .then((data: JiraResponse) => {
        setIssues(data.issues || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Could not fetch Jira issues');
        setLoading(false);
      });
  }, [searchMode]);

  // Autocomplete handler
  const handleAutocompleteInput = async (event: any, value: string) => {
    setSearch(value);
    if (!value.trim()) {
      setAutocompleteOptions([]);
      return;
    }
    setAutocompleteLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8080/api/jira/issues/autocomplete?query=${encodeURIComponent(value)}`
      );
      if (!res.ok) throw new Error('Failed to fetch autocomplete');
      const data = await res.json();
      setAutocompleteOptions(data || []);
    } catch {
      setAutocompleteOptions([]);
    }
    setAutocompleteLoading(false);
  };

  // Search handler (by key)
  const handleSearch = async (selectedKey?: string) => {
    const queryKey = selectedKey || search;
    if (!queryKey.trim()) return;
    setSearchLoading(true);
    setSearchMode(true);
    setError(null);
    
    try {
      // First, search for the issue to get results
      const searchRes = await fetch(
        `http://localhost:8080/api/jira/issues/search?email=prakhar.singh@increff.com&query=${encodeURIComponent(
          queryKey
        )}`
      );
      
      if (!searchRes.ok) throw new Error('Failed to search Jira issues');
      const searchData: JiraResponse = await searchRes.json();
      setIssues(searchData.issues || []);
      
      // If we have results, get the first issue key and fetch its details
      if (searchData.issues && searchData.issues.length > 0) {
        const issueKey = searchData.issues[0].key;
        
        // Fetch the specific issue details - same as clicking a card
        const issueRes = await fetch(
          `http://localhost:8080/api/jira/issues/${issueKey}`
        );
        
        if (!issueRes.ok) throw new Error('Failed to fetch issue details');
        const issueData = await issueRes.json();
        
        // Set the selected issue with full details
        setSelectedIssue(issueData);
        setIssueSummary(null); // Reset summary when opening a new issue
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Could not search Jira issues');
    }
    
    setSearchLoading(false);
  };

  // Allow Enter key to trigger search
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Modify the autocomplete onChange handler
  const handleAutocompleteChange = (_, value) => {
    if (typeof value === 'string') {
      setSearch(value);
      handleSearch(value);
    } else if (value && value.key) {
      // If we have a specific issue key from autocomplete
      setSearch(value.key);
      
      // Directly fetch this specific issue
      setSearchLoading(true);
      fetch(`http://localhost:8080/api/jira/issues/${value.key}`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch issue details');
          return res.json();
        })
        .then(data => {
          setSelectedIssue(data);
          setIssueSummary(null);
          
          // Also update the search results to include this issue
          setIssues([data]);
          setSearchMode(true);
        })
        .catch(err => {
          console.error('Error fetching issue:', err);
          setError('Could not fetch issue details');
        })
        .finally(() => {
          setSearchLoading(false);
        });
    }
  };

  // Reset to recent tickets
  const handleShowRecent = () => {
    setSearch('');
    setSearchMode(false);
    setError(null);
  };

  // Add function to handle card click
  const handleCardClick = (issue: JiraIssue) => {
    setSelectedIssue(issue);
    setIssueSummary(null); // Reset summary when opening a new issue
  };

  // Add function to close dialog
  const handleCloseDialog = () => {
    setSelectedIssue(null);
    setIssueSummary(null);
  };

  // Add function to fetch issue summary
  const handleSummarizeIssue = async () => {
    if (!selectedIssue) return;
    
    setSummaryLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8080/api/jira/issues/${selectedIssue.key}/summarize`
      );
      if (!res.ok) throw new Error('Failed to summarize issue');
      const data: IssueSummary = await res.json();
      setIssueSummary(data);
    } catch (err) {
      console.error('Error summarizing issue:', err);
    } finally {
      setSummaryLoading(false);
    }
  };

  // Add function to handle copying text
  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        // Optional: Show a success message
        console.log('Text copied to clipboard');
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        overflow: 'auto',
        px: 2,
        py: 4,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Subheading and search bar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
          width: '100%', // Ensure full width
        }}
      >
        {/* Search box with autocomplete */}
        <Box sx={{ 
          flex: 1, 
          minWidth: 500, // Increased from 320px
          maxWidth: '80%', // Added max width to ensure it doesn't get too wide
          display: 'flex', 
          alignItems: 'center', 
          gap: 1 
        }}>
          <Autocomplete
            freeSolo
            loading={autocompleteLoading}
            options={autocompleteOptions}
            getOptionLabel={option =>
              typeof option === 'string'
                ? option
                : `${option.key} - ${option.summary}`
            }
            filterOptions={x => x} // Show all options as is
            inputValue={search}
            onInputChange={handleAutocompleteInput}
            onChange={handleAutocompleteChange}
            renderOption={(props, option) => (
              <li {...props} style={{ padding: '10px 16px' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography
                    sx={{
                      background: 'linear-gradient(90deg, #9c27b0, #7e57c2)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontWeight: 700,
                    }}
                  >
                    {typeof option === 'string' ? option : option.key}
                  </Typography>
                  {typeof option !== 'string' && (
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {option.summary}
                    </Typography>
                  )}
                </Box>
              </li>
            )}
            renderInput={params => (
              <TextField
                {...params}
                size="medium"
                placeholder="Search by summary, key, assignee, etc."
                onKeyDown={handleSearchKeyDown}
                sx={{
                  flex: 1,
                  background: 'rgba(30, 30, 40, 0.6)',
                  borderRadius: 2,
                  width: '100%', // Ensure full width
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    borderRadius: 2,
                    fontWeight: 500,
                    height: 56,
                  },
                  '& input': {
                    color: '#fff',
                    fontSize: '1.1rem',
                    padding: '14px 16px',
                  },
                }}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {autocompleteLoading ? (
                        <CircularProgress color="inherit" size={18} />
                      ) : null}
                      {params.InputProps.endAdornment}
                      <IconButton
                        onClick={() => handleSearch()}
                        disabled={searchLoading || !search.trim()}
                        sx={{
                          color: 'primary.main',
                        }}
                        size="small"
                      >
                        {searchLoading ? (
                          <CircularProgress size={20} sx={{ color: 'primary.main' }} />
                        ) : (
                          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                            <path
                              d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99a1 1 0 001.41-1.41l-4.99-5zm-6 0C8.01 14 6 11.99 6 9.5S8.01 5 10.5 5 15 7.01 15 9.5 12.99 14 10.5 14z"
                              fill="currentColor"
                            />
                          </svg>
                        )}
                      </IconButton>
                    </>
                  ),
                }}
              />
            )}
            ListboxProps={{
              style: {
                margin: '8px 0',
                padding: '8px',
                background: 'rgba(18, 18, 30, 0.85)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                width: '100%', // Ensure full width
                maxWidth: 'none', // Remove any max-width constraints
              }
            }}
            PaperComponent={({ children }) => (
              <Paper
                elevation={6}
                sx={{
                  background: 'transparent',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  overflow: 'hidden',
                  width: '100%', // Ensure full width
                  maxWidth: 'none', // Remove any max-width constraints
                }}
              >
                {children}
              </Paper>
            )}
            sx={{
              width: '100%', // Ensure the Autocomplete itself is full width
            }}
          />
        </Box>
        
        {/* Status indicator moved to right of search box */}
        <Typography
          variant="subtitle1"
          sx={{
            color: 'text.secondary',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            whiteSpace: 'nowrap',
            ml: 'auto', // Push to the right
          }}
        >
          {searchMode ? (
            <>
              Showing search results for{' '}
              <Typography component="span" sx={gradientText}>
                &quot;{search}&quot;
              </Typography>
              <Chip
                label="Show Recent"
                size="small"
                onClick={handleShowRecent}
                sx={{
                  ml: 2,
                  background: 'rgba(156,39,176,0.12)',
                  color: '#fff',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              />
            </>
          ) : (
            <>
              Showing{' '}<Typography component="span" sx={gradientText}>recent tickets</Typography>
            </>
          )}
        </Typography>
      </Box>

      {/* Content */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 6 }}>
          <CircularProgress sx={{ color: 'primary.main' }} />
        </Box>
      )}
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      {!loading && !error && issues.length === 0 && (
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          No Jira issues found.
        </Typography>
      )}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: 3,
          width: '100%',
        }}
      >
        {issues.map(issue => (
          <Card
            key={issue.id}
            sx={{
              background: 'rgba(18, 18, 30, 0.7)',
              borderRadius: 2,
              boxShadow: '0 4px 16px rgba(156,39,176,0.08)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#fff',
              height: 260,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(156,39,176,0.15)',
              },
            }}
            variant="outlined"
            onClick={() => handleCardClick(issue)}
          >
            <CardHeader
              avatar={
                <Avatar
                  src={issue.fields.assignee?.avatarUrls?.['32x32']}
                  sx={{ bgcolor: '#9c27b0' }}
                >
                  {issue.fields.assignee?.displayName?.[0] || '?'}
                </Avatar>
              }
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography
                    variant="subtitle2"
                    sx={gradientText}
                  >
                    {issue.key}
                  </Typography>
                  <Chip
                    label={issue.fields.status.name}
                    size="small"
                    sx={{
                      ml: 1,
                      background: 'rgba(255,255,255,0.08)',
                      color: 'white',
                      fontWeight: 500,
                    }}
                  />
                  {issue.fields.priority && (
                    <Chip
                      label={issue.fields.priority.name}
                      size="small"
                      sx={{
                        ml: 1,
                        background: 'rgba(231, 76, 60, 0.15)',
                        color: 'white',
                        fontWeight: 500,
                      }}
                    />
                  )}
                </Box>
              }
              subheader={
                <Typography sx={{ ...gradientText, fontWeight: 600, fontSize: '1rem', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                  {issue.fields.summary}
                </Typography>
              }
              subheaderTypographyProps={{ sx: { color: '#fff', fontWeight: 500 } }}
              sx={{ pb: 0 }}
            />
            <CardContent sx={{ pt: 1, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  mb: 1,
                  maxHeight: 60,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'pre-line',
                  wordBreak: 'break-word',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {issue.fields.description
                  ? issue.fields.description
                  : 'No description.'}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Assignee
                  </Typography>
                  <Typography variant="body2" sx={gradientText}>
                    {issue.fields.assignee?.displayName || 'Unassigned'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Reporter
                  </Typography>
                  <Typography variant="body2" sx={gradientText}>
                    {issue.fields.reporter?.displayName || 'Unknown'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Issue Detail Dialog */}
      <Dialog
        open={!!selectedIssue}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(18, 18, 30, 0.95)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            color: '#fff',
            minHeight: '60vh',
            maxHeight: '85vh',
            overflow: 'hidden',
          },
        }}
      >
        {selectedIssue && (
          <>
            <DialogTitle sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              pb: 2
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ ...gradientText, fontSize: '1.3rem' }}>
                  {selectedIssue.key}
                </Typography>
                <Chip
                  label={selectedIssue.fields.status.name}
                  size="small"
                  sx={{
                    background: 'rgba(255,255,255,0.08)',
                    color: 'white',
                    fontWeight: 500,
                  }}
                />
                {selectedIssue.fields.priority && (
                  <Chip
                    label={selectedIssue.fields.priority.name}
                    size="small"
                    sx={{
                      background: 'rgba(231, 76, 60, 0.15)',
                      color: 'white',
                      fontWeight: 500,
                    }}
                  />
                )}
              </Box>
              <IconButton 
                onClick={handleCloseDialog}
                sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
              <Typography variant="h5" sx={{ ...gradientText, mb: 3, fontSize: '1.5rem' }}>
                {selectedIssue.fields.summary}
              </Typography>
              
              {/* Issue content - description and details side by side */}
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                {/* Description - left side */}
                <Box sx={{ flex: { md: '0 0 66.67%' }, width: '100%' }}>
                  <Paper sx={{ 
                    p: 3, 
                    background: 'rgba(255, 255, 255, 0.03)', 
                    borderRadius: 2,
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    height: '100%',
                    maxHeight: { md: '40vh' } // Limit the height to 40% of viewport height
                  }}>
                    <Typography variant="subtitle1" sx={{ mb: 1, color: 'text.secondary', fontSize: '1.1rem' }}>
                      Description
                    </Typography>
                    <Paper sx={{ 
                      p: 2, 
                      background: 'rgba(255, 255, 255, 0.03)', 
                      borderRadius: 2,
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      height: 'calc(100% - 40px)', // Fill remaining height minus the title
                      overflow: 'auto',
                      mx: 0 // Constant margin (0) from parent div
                    }}>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-line', fontSize: '1rem' }}>
                        {/* Process description to handle image tags */}
                        {selectedIssue.fields.description ? 
                          selectedIssue.fields.description.replace(
                            /!([^|]+)\|width=(\d+),height=(\d+),alt="([^"]+)"!/g, 
                            '[Image: $4]'
                          ) : 
                          'No description provided.'
                        }
                      </Typography>
                    </Paper>
                  </Paper>
                </Box>
                
                {/* Issue Details - right side */}
                <Box sx={{ 
                  flex: { md: '0 0 33.33%' }, 
                  width: '100%',
                  paddingRight: { md: 3 } // Added padding-right instead of margin
                }}>
                  <Paper sx={{ 
                    p: 3, 
                    background: 'rgba(255, 255, 255, 0.03)', 
                    borderRadius: 2,
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    height: '100%',
                    maxHeight: { md: '40vh' }, // Limit the height to 40% of viewport height
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2 // Reduced gap from 3 to 2
                  }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary', fontSize: '1.1rem' }}>
                      Issue Details
                    </Typography>
                    
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                        Status
                      </Typography>
                      <Typography variant="body2" sx={{ ...gradientText, fontSize: '1.05rem' }}>
                        {selectedIssue.fields.status.name}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                        Assignee
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Avatar
                          src={selectedIssue.fields.assignee?.avatarUrls?.['48x48']} // Using larger avatar image
                          sx={{ width: 32, height: 32, bgcolor: '#9c27b0' }}
                        >
                          {selectedIssue.fields.assignee?.displayName?.[0] || '?'}
                        </Avatar>
                        <Typography variant="body2" sx={{ ...gradientText, fontSize: '1.05rem' }}>
                          {selectedIssue.fields.assignee?.displayName || 'Unassigned'}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                        Reporter
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Avatar
                          src={selectedIssue.fields.reporter?.avatarUrls?.['48x48']} // Using larger avatar image
                          sx={{ width: 32, height: 32, bgcolor: '#7e57c2' }}
                        >
                          {selectedIssue.fields.reporter?.displayName?.[0] || '?'}
                        </Avatar>
                        <Typography variant="body2" sx={{ ...gradientText, fontSize: '1.05rem' }}>
                          {selectedIssue.fields.reporter?.displayName || 'Unknown'}
                        </Typography>
                      </Box>
                    </Box>
                    
                    {selectedIssue.fields.priority && (
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                          Priority
                        </Typography>
                        <Typography variant="body2" sx={{ ...gradientText, fontSize: '1.05rem' }}>
                          {selectedIssue.fields.priority.name}
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                </Box>
              </Box>
              
              {/* AI Summary Section - full width below description and details */}
              <Box sx={{ mt: 3, maxHeight: '30vh' }}> {/* Added maxHeight to ensure it fits */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle1" sx={{ color: 'text.secondary', fontSize: '1.1rem' }}>
                    AI Summary
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleSummarizeIssue}
                    disabled={summaryLoading}
                    startIcon={summaryLoading ? 
                      <CircularProgress size={16} /> : 
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor"/>
                        <path d="M12 11C12.55 11 13 10.55 13 10C13 9.45 12.55 9 12 9C11.45 9 11 9.45 11 10C11 10.55 11.45 11 12 11Z" fill="currentColor"/>
                        <path d="M12 15C12.55 15 13 14.55 13 14V13C13 12.45 12.55 12 12 12C11.45 12 11 12.45 11 13V14C11 14.55 11.45 15 12 15Z" fill="currentColor"/>
                        <path d="M7 11.5C7.83 11.5 8.5 10.83 8.5 10C8.5 9.17 7.83 8.5 7 8.5C6.17 8.5 5.5 9.17 5.5 10C5.5 10.83 6.17 11.5 7 11.5Z" fill="currentColor"/>
                        <path d="M17 11.5C17.83 11.5 18.5 10.83 18.5 10C18.5 9.17 17.83 8.5 17 8.5C16.17 8.5 15.5 9.17 15.5 10C15.5 10.83 16.17 11.5 17 11.5Z" fill="currentColor"/>
                        <path d="M12 17C13.1 17 14 16.1 14 15C14 13.9 13.1 13 12 13C10.9 13 10 13.9 10 15C10 16.1 10.9 17 12 17Z" fill="currentColor"/>
                      </svg>
                    }
                    sx={{
                      borderColor: 'rgba(156, 39, 176, 0.5)',
                      color: 'primary.main',
                      '&:hover': {
                        borderColor: 'primary.main',
                        background: 'rgba(156, 39, 176, 0.08)',
                      },
                      fontSize: '0.9rem',
                      py: 0.8
                    }}
                  >
                    {issueSummary ? 'Refresh Summary' : 'Summarize with AI'}
                  </Button>
                </Box>
                
                <Paper sx={{ 
                  p: 2, 
                  background: issueSummary ? 'rgba(156, 39, 176, 0.08)' : 'rgba(255, 255, 255, 0.03)', 
                  borderRadius: 2,
                  border: '1px solid rgba(156, 39, 176, 0.2)',
                  minHeight: 150,
                  transition: 'all 0.3s ease',
                }}>
                  {summaryLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 150 }}>
                      <CircularProgress size={30} sx={{ color: 'primary.main' }} />
                    </Box>
                  ) : issueSummary ? (
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Typography variant="body1" sx={{ mb: 2, fontWeight: 500, fontSize: '1.05rem', lineHeight: 1.6, flex: 1 }}>
                          {issueSummary.summary}
                        </Typography>
                        <IconButton 
                          size="small" 
                          onClick={() => handleCopyText(issueSummary.summary)}
                          sx={{ 
                            ml: 1, 
                            color: 'primary.main',
                            '&:hover': { backgroundColor: 'rgba(156, 39, 176, 0.12)' }
                          }}
                          title="Copy summary"
                        >
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      
                      {issueSummary.rca && (
                        <>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, mb: 1 }}>
                            <Typography variant="subtitle2" sx={{ color: 'primary.main', fontSize: '1rem' }}>
                              Root Cause Analysis:
                            </Typography>
                            <IconButton 
                              size="small" 
                              onClick={() => handleCopyText(issueSummary.rca || '')}
                              sx={{ 
                                color: 'primary.main',
                                '&:hover': { backgroundColor: 'rgba(156, 39, 176, 0.12)' }
                              }}
                              title="Copy RCA"
                            >
                              <ContentCopyIcon fontSize="small" />
                            </IconButton>
                          </Box>
                          <Typography variant="body2" sx={{ 
                            p: 1.5, 
                            background: 'rgba(255, 255, 255, 0.05)', 
                            borderRadius: 1,
                            border: '1px solid rgba(156, 39, 176, 0.2)',
                            fontSize: '0.95rem',
                            lineHeight: 1.5
                          }}>
                            {issueSummary.rca}
                          </Typography>
                        </>
                      )}
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 150, flexDirection: 'column', gap: 1 }}>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="rgba(156, 39, 176, 0.5)"/>
                        <path d="M12 11C12.55 11 13 10.55 13 10C13 9.45 12.55 9 12 9C11.45 9 11 9.45 11 10C11 10.55 11.45 11 12 11Z" fill="rgba(156, 39, 176, 0.5)"/>
                        <path d="M12 15C12.55 15 13 14.55 13 14V13C13 12.45 12.55 12 12 12C11.45 12 11 12.45 11 13V14C11 14.55 11.45 15 12 15Z" fill="rgba(156, 39, 176, 0.5)"/>
                        <path d="M7 11.5C7.83 11.5 8.5 10.83 8.5 10C8.5 9.17 7.83 8.5 7 8.5C6.17 8.5 5.5 9.17 5.5 10C5.5 10.83 6.17 11.5 7 11.5Z" fill="rgba(156, 39, 176, 0.5)"/>
                        <path d="M17 11.5C17.83 11.5 18.5 10.83 18.5 10C18.5 9.17 17.83 8.5 17 8.5C16.17 8.5 15.5 9.17 15.5 10C15.5 10.83 16.17 11.5 17 11.5Z" fill="rgba(156, 39, 176, 0.5)"/>
                        <path d="M12 17C13.1 17 14 16.1 14 15C14 13.9 13.1 13 12 13C10.9 13 10 13.9 10 15C10 16.1 10.9 17 12 17Z" fill="rgba(156, 39, 176, 0.5)"/>
                      </svg>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem' }}>
                        Click the Summarize button to generate an AI summary of this issue
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
}

export default function HomePage() {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('chat');
  const hasConversation = conversation.length > 0;
  
  // Add state for diagnostics
  const [traceId, setTraceId] = useState('');
  const [systemsData, setSystemsData] = useState<SystemStatus[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Add state for Freshdesk tickets
  const [freshdeskTickets, setFreshdeskTickets] = useState<FreshdeskTicket[]>([]);
  const [freshdeskLoading, setFreshdeskLoading] = useState(false);
  
  // Add state for Freshdesk rules dialog
  const [rulesDialogOpen, setRulesDialogOpen] = useState(false);
  const defaultTicketRules = "- If the ticket subject or description contains words like 'error', 'fail', 'bug', or 'issue', set type to 'Bug'.\n" +
    "- If the ticket contains words like 'feature', 'enhancement', or 'improvement', set type to 'Feature Request'.\n" +
    "- If the ticket contains urgent language like 'urgent', 'asap', 'immediately', set priority to 3 (High).\n" +
    "- If the ticket is marked as closed but has no resolution, set resolution to 'Resolved by Success Team'.\n" +
    "- If the ticket is from a VIP customer, set priority to at least 2 (Medium).";
  const [ticketRules, setTicketRules] = useState(defaultTicketRules);
  
  // Load saved rules from localStorage on component mount
  useEffect(() => {
    const savedRules = localStorage.getItem('freshdesk-rules');
    if (savedRules) {
      setTicketRules(savedRules);
    }
  }, []);
  
  // Function to fetch Freshdesk tickets
  const fetchFreshdeskTickets = async () => {
    setFreshdeskLoading(true);
    try {
      // Make an actual API call to fetch Freshdesk tickets with the correct endpoint
      const response = await fetch('http://localhost:8080/api/freshdesk/tickets/all');
      
      if (!response.ok) {
        throw new Error('Failed to fetch Freshdesk tickets');
      }
      
      const data = await response.json();
      setFreshdeskTickets(data || []);
    } catch (err) {
      console.error("Error fetching Freshdesk tickets:", err);
      // Set empty array on error to show the "No tickets found" message
      setFreshdeskTickets([]);
    } finally {
      setFreshdeskLoading(false);
    }
  };
  
  // Use the typing effect hook
  const { displayedText, isTyping } = useTypingEffect('Hi, Avishek Chatterjee', 70);

  // Expanded list of default prompts
  const defaultPrompts = [
    "How to setup Omni",
    "Inventory not syncing to CIMS",
    "Why SMS?",
    "Integration with Shopify",
    "Troubleshoot payment issues",
    "Setup multi-location inventory"
  ];

  // Process API response and determine component statuses
  const processApiResponse = (data: TraceResponse): SystemStatus[] => {
    // Define all systems we want to display
    const systemNames = ['OMS', 'CIMS', 'WMS', 'Proxy', 'RMS', 'Channel'];
    
    // Create initial system data with inactive status
    const systemStatuses: SystemStatus[] = systemNames.map(name => ({
      name,
      status: 'inactive',
      callCount: 0
    }));
    
    // Update status for OMS
    const omsSystem = systemStatuses.find(s => s.name === 'OMS');
    if (omsSystem) {
      omsSystem.callCount = data.oms.length;
      omsSystem.status = omsSystem.callCount > 0 ? 'success' : 'inactive';
    }
    
    // Update status for CIMS
    const cimsSystem = systemStatuses.find(s => s.name === 'CIMS');
    if (cimsSystem) {
      cimsSystem.callCount = data.cims.length;
      cimsSystem.status = cimsSystem.callCount > 0 ? 'success' : 'inactive';
    }
    
    // Update status for WMS
    const wmsSystem = systemStatuses.find(s => s.name === 'WMS');
    if (wmsSystem) {
      wmsSystem.callCount = data.wms.length;
      wmsSystem.status = wmsSystem.callCount > 0 ? 'success' : 'inactive';
    }
    
    // If there's a failure, mark that system as failed
    if (data.latestFailureCall) {
      const failedComponentName = data.latestFailureCall.component.toUpperCase();
      const failedSystem = systemStatuses.find(s => s.name === failedComponentName);
      if (failedSystem) {
        failedSystem.status = 'failure';
      }
    }
    
    return systemStatuses;
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      // Add message to conversation
      setConversation([...conversation, message]);
      console.log('Message sent:', message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handlePromptClick = (prompt: string) => {
    setMessage(prompt);
    // Optional: automatically send the message
    // setTimeout(() => handleSendMessage(), 100);
  };

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
  };

  // Function to handle trace ID submission
  const handleTraceIdSubmit = async () => {
    if (traceId.trim()) {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real implementation, we would make an API call here
        // For now, simulate the API call with a timeout
        setTimeout(() => {
          // Mock API call - this would be replaced with an actual fetch call
          // Example: const response = await fetch('/api/trace/' + traceId);
          //          const data = await response.json();
          
          // For demonstration, we'll use the example data provided
          const exampleResponse: TraceResponse = {
            trace_id: "917df85e-e3ee-4481-8d4c-ea9b258c1f65",
            count: 39,
            summary: {
              oms_count: 39,
              cims_count: 0,
              wms_count: 0
            },
            latestFailureCall: {
              _id: "zQRUbpYB3rARF5bqxB4g",
              _index: "oms-inbound-2025-04-25",
              component: "oms",
              application: "oms-inbound",
              module: "ORDER_MANAGEMENT_SYSTEM",
              client: "1200061523",
              host: "staging-styli-omni",
              timestamp: "2025-04-25T19:02:49.892",
              url: "http://localhost:8080/oms/orders/outward/sub-orders/452?sync=false",
              http_method: "GET",
              http_status: "500",
              status: "FAILURE",
              duration_millis: 1084,
              request_name: "GET_SUB_ORDER",
              end_timestamp: "2025-04-25T19:02:50.976",
              requestBody: "",
              responseBody: "{\"code\":\"UNKNOWN_ERROR\",\"message\":\"Internal Error in OMS\",\"description\":null,\"errors\":[]}",
              http_headers: ""
            },
            oms: Array(39).fill({
              _id: "sample-id",
              component: "oms",
              application: "oms-application",
              http_status: "200",
              status: "SUCCESS",
              url: "http://example.com"
            }),
            cims: [],
            wms: []
          };
          
          // Process the response
          const processedSystems = processApiResponse(exampleResponse);
          setSystemsData(processedSystems);
          setIsLoading(false);
        }, 1500);
      } catch (err) {
        console.error("Error fetching trace data:", err);
        setError("Failed to fetch trace data. Please try again.");
        setIsLoading(false);
      }
    }
  };

  // Handle trace ID key press
  const handleTraceIdKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTraceIdSubmit();
    }
  };

  // Add function to handle copying text
  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        // Optional: Show a success message
        console.log('Text copied to clipboard');
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  // Add useEffect to fetch Freshdesk tickets when the tab changes to 'freshdesk'
  useEffect(() => {
    if (activeTab === 'freshdesk') {
      fetchFreshdeskTickets();
    }
  }, [activeTab]); // Only depend on activeTab, not freshdeskTickets.length

  // Add these state variables to your HomePage component
  const [selectedTicket, setSelectedTicket] = useState<FreshdeskTicket | null>(null);
  const [ticketEditData, setTicketEditData] = useState<{ actual: any, edited: any } | null>(null);
  const [ticketEditLoading, setTicketEditLoading] = useState(false);
  const [ticketEditError, setTicketEditError] = useState<string | null>(null);
  const [ticketUpdateSuccess, setTicketUpdateSuccess] = useState(false);

  // Add this function to handle ticket click
  const handleTicketClick = async (ticket: FreshdeskTicket) => {
    setSelectedTicket(ticket);
    setTicketEditData(null);
    setTicketEditError(null);
    setTicketUpdateSuccess(false);
    setTicketEditLoading(true);
    
    try {
      const response = await fetch(
        `http://localhost:8080/api/freshdesk/tickets/${ticket.id}/ai-edit?rules=${encodeURIComponent(ticketRules)}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to process ticket');
      }
      
      const data = await response.json();
      setTicketEditData(data);
    } catch (err) {
      console.error('Error processing ticket:', err);
      setTicketEditError('Failed to process ticket. Please try again.');
    } finally {
      setTicketEditLoading(false);
    }
  };

  // Add this function to handle submitting the edited ticket
  const handleSubmitTicketEdit = async () => {
    if (!selectedTicket || !ticketEditData) return;
    
    setTicketEditLoading(true);
    setTicketUpdateSuccess(false);
    
    try {
      // Mock API call to update the ticket
      // In a real implementation, you would send the edited data to your backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      // Simulate successful update
      setTicketUpdateSuccess(true);
      
      // Refresh the tickets list after a successful update
      setTimeout(() => {
        fetchFreshdeskTickets();
        setSelectedTicket(null); // Close the dialog
      }, 1500);
    } catch (err) {
      console.error('Error updating ticket:', err);
      setTicketEditError('Failed to update ticket. Please try again.');
    } finally {
      setTicketEditLoading(false);
    }
  };

  // Update the typing animation logic
  useEffect(() => {
    if (!hasConversation) {
      const text = "Welcome to AI Support Assistant";
      let currentIndex = 0;
      
      const typingInterval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayedText(text.substring(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
        }
      }, 100);
      
      return () => clearInterval(typingInterval);
    }
  }, [hasConversation]);

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%)' }}>
      {/* Sidebar */}
      <StyledDrawer>
        <Box sx={{ p: 2, pt: 3 }}>
          <NewChatButton>
            <ListItemIcon sx={{ color: 'white', minWidth: 36 }}>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary="New Chat" primaryTypographyProps={{ fontWeight: 'medium' }} />
          </NewChatButton>
        </Box>
        <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }} />
        <List sx={{ px: 1, flexGrow: 1 }}>
          {[
            { text: 'Recent Chats', icon: <ChatIcon />, id: 'chat' },
            { text: 'API Diagnostics', icon: <DiagnosticsIcon />, id: 'diagnostics' },
            { text: 'Jira RCA Analysis', icon: <BugReportIcon />, id: 'jira' },
            { text: 'Freshdesk Fixer', icon: <SupportIcon />, id: 'freshdesk' },
            { text: 'Settings', icon: <SettingsIcon />, id: 'settings' }
          ].map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton 
                sx={{ 
                  borderRadius: 2, 
                  my: 0.5,
                  backgroundColor: activeTab === item.id ? 'rgba(156, 39, 176, 0.15)' : 'transparent',
                  '&:hover': {
                    backgroundColor: activeTab === item.id ? 'rgba(156, 39, 176, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                  },
                  transition: 'background-color 0.2s ease'
                }}
                onClick={() => handleTabClick(item.id)}
              >
                <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }} />
        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(5px)',
        }}>
          <Avatar sx={{ bgcolor: '#9c27b0', width: 32, height: 32 }}>A</Avatar>
          <Typography sx={{ ml: 2 }}>Avishek</Typography>
        </Box>
      </StyledDrawer>

      {/* Main content */}
      <Main>
        {activeTab === 'chat' && (
          <>
            <ChatContainer hasConversation={hasConversation}>
              {!hasConversation && (
                <>
                  <WelcomeText variant="h3" gutterBottom>
                    {displayedText}
                    {isTyping && <BlinkingCursor />}
                  </WelcomeText>
                  <Typography 
                    variant="subtitle1" 
                    color="text.secondary" 
                    sx={{ 
                      opacity: isTyping ? 0 : 0.8, 
                      mb: 2,
                      transition: 'opacity 0.5s ease',
                      transitionDelay: '0.3s'
                    }}
                  >
                    Hello Avishek Chatterjee, how can I help you today?
                  </Typography>
                  
                  {/* Default prompts - only show after typing is complete */}
                  <DefaultPromptsContainer sx={{ 
                    opacity: isTyping ? 0 : 1,
                    transition: 'opacity 0.5s ease',
                    transitionDelay: '0.5s'
                  }}>
                    {defaultPrompts.map((prompt, index) => (
                      <PromptChip
                        key={index}
                        label={prompt}
                        onClick={() => handlePromptClick(prompt)}
                        clickable
                        variant="outlined"
                        sx={{ 
                          '& .MuiChip-label': { 
                            px: 2,
                            py: 0.8,
                            fontSize: '0.9rem'
                          }
                        }}
                      />
                    ))}
                  </DefaultPromptsContainer>
                </>
              )}

              {hasConversation && (
                <Box sx={{ width: '100%', maxWidth: '800px', mb: 4, pb: 10 }}>
                  {conversation.map((msg, index) => (
                    <Box key={index} sx={{ mb: 2, p: 2, borderRadius: 2, background: 'rgba(255, 255, 255, 0.05)' }}>
                      <Typography>{msg}</Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </ChatContainer>

            <ChatInputContainer elevation={0}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  fullWidth
                  multiline
                  maxRows={4}
                  placeholder="Message..."
                  variant="outlined"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(30, 30, 40, 0.6)',
                      borderRadius: 24,
                      '&.Mui-focused': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(156, 39, 176, 0.5)',
                          borderWidth: 1,
                        },
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: '#f5f5f5',
                    },
                    margin: 0,
                  }}
                  InputProps={{
                    sx: { py: 1.5, borderRadius: 24 }
                  }}
                />
                <IconButton 
                  color="primary" 
                  sx={{ 
                    ml: 1,
                    bgcolor: 'rgba(156, 39, 176, 0.1)',
                    '&:hover': {
                      bgcolor: 'rgba(156, 39, 176, 0.2)',
                    },
                    '&.Mui-disabled': {
                      opacity: 0.3,
                    },
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                  }} 
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                >
                  <SendIcon />
                </IconButton>
              </Box>
            </ChatInputContainer>
          </>
        )}

        {activeTab === 'diagnostics' && (
          <Box sx={{ 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            p: 2,
            position: 'relative'
          }}>
            <Typography variant="h4" sx={{ 
              mb: 6, 
              mt: 2,
              color: '#fff',
              background: 'linear-gradient(90deg, #9c27b0, #7e57c2)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 600
            }}>
              API Diagnostics
            </Typography>
            
            {!systemsData ? (
              <Box sx={{ 
                width: '100%',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center'
              }}>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, fontSize: '1.1rem' }}>
                  Enter a trace ID to view API call flow and diagnostics
                </Typography>
                
                <Box sx={{ 
                  display: 'flex', 
                  width: '100%', 
                  maxWidth: 550,
                  gap: 1.5
                }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Enter Trace ID"
                    value={traceId}
                    onChange={(e) => setTraceId(e.target.value)}
                    onKeyDown={handleTraceIdKeyPress}
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(30, 30, 40, 0.6)',
                        borderRadius: 2.5,
                        height: 56,
                        '&.Mui-focused': {
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(156, 39, 176, 0.5)',
                            borderWidth: 1,
                          },
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(255, 255, 255, 0.1)',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                        },
                      },
                      '& .MuiInputBase-input': {
                        color: '#f5f5f5',
                        fontSize: '1.1rem',
                        padding: '14px 16px'
                      }
                    }}
                  />
                  <IconButton 
                    color="primary" 
                    sx={{ 
                      bgcolor: 'rgba(156, 39, 176, 0.1)',
                      '&:hover': {
                        bgcolor: 'rgba(156, 39, 176, 0.2)',
                      },
                      '&.Mui-disabled': {
                        opacity: 0.3,
                      },
                      width: 56,
                      height: 56,
                      borderRadius: 2.5,
                    }} 
                    onClick={handleTraceIdSubmit}
                    disabled={!traceId.trim() || isLoading}
                  >
                    {isLoading ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28 }}>
                        <Typography sx={{ fontSize: 28, animation: 'spin 2s linear infinite', '@keyframes spin': { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } } }}>
                          ⌛
                        </Typography>
                      </Box>
                    ) : (
                      <SendIcon sx={{ fontSize: 26 }} />
                    )}
                  </IconButton>
                </Box>
                
                {error && (
                  <Typography 
                    color="error" 
                    sx={{ 
                      mt: 3, 
                      p: 1.5, 
                      borderRadius: 1, 
                      background: 'rgba(231, 76, 60, 0.1)',
                      border: '1px solid rgba(231, 76, 60, 0.3)',
                      maxWidth: 550
                    }}
                  >
                    {error}
                  </Typography>
                )}
              </Box>
            ) : (
              <Box sx={{ width: '100%', maxWidth: '1000px' }}>
                {/* API Call Summary */}
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    mb: 4, 
                    p: 2, 
                    borderRadius: 2, 
                    background: 'rgba(255, 255, 255, 0.05)'
                  }}
                >
                  <Typography variant="subtitle1" color="text.secondary">
                    Trace ID: <Typography component="span" sx={{ color: 'primary.main' }}>{traceId}</Typography>
                  </Typography>
                  
                  <Box>
                    <Chip 
                      label={`OMS: ${systemsData.find(s => s.name === 'OMS')?.callCount || 0} calls`} 
                      sx={{ 
                        mx: 0.5, 
                        background: systemsData.find(s => s.name === 'OMS')?.status === 'failure' 
                          ? 'rgba(231, 76, 60, 0.2)' 
                          : 'rgba(255, 255, 255, 0.1)'
                      }} 
                    />
                    <Chip 
                      label={`CIMS: ${systemsData.find(s => s.name === 'CIMS')?.callCount || 0} calls`} 
                      sx={{ 
                        mx: 0.5, 
                        background: systemsData.find(s => s.name === 'CIMS')?.status === 'failure' 
                          ? 'rgba(231, 76, 60, 0.2)' 
                          : 'rgba(255, 255, 255, 0.1)'
                      }} 
                    />
                    <Chip 
                      label={`WMS: ${systemsData.find(s => s.name === 'WMS')?.callCount || 0} calls`} 
                      sx={{ 
                        mx: 0.5, 
                        background: systemsData.find(s => s.name === 'WMS')?.status === 'failure' 
                          ? 'rgba(231, 76, 60, 0.2)' 
                          : 'rgba(255, 255, 255, 0.1)'
                      }} 
                    />
                  </Box>
                  
                  <Button 
                    size="small" 
                    variant="outlined" 
                    onClick={() => setSystemsData(null)}
                    sx={{ 
                      ml: 2, 
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'text.secondary'
                    }}
                  >
                    New Search
                  </Button>
                </Box>
                
                <DiagnosticsContainer>
                  <DiagnosticsRow sx={{ position: 'relative' }}>
                    {['WMS', 'OMS', 'CIMS', 'Proxy', 'RMS'].map((name, index) => {
                      const system = systemsData.find(s => s.name === name);
                      if (!system) return null;
                      
                      const isProxy = name === 'Proxy';
                      
                      return (
                        <Box 
                          key={name} 
                          sx={{ position: 'relative', zIndex: 1 }} 
                          id={isProxy ? 'proxy-component' : undefined}
                        >
                          <StatusBox status={system.status}>
                            <Typography variant="h5" sx={{ mb: 1, fontWeight: 500 }}>
                              {system.name}
                            </Typography>
                            <Typography variant="body1" sx={{ 
                              color: 
                                system.status === 'success' ? 'rgb(46, 204, 113)' : 
                                system.status === 'failure' ? 'rgb(231, 76, 60)' : 
                                'rgb(149, 165, 166)',
                              fontWeight: 'bold'
                            }}>
                              {system.status === 'success' ? 'Success' : 
                               system.status === 'failure' ? 'Failed' : 
                               'No Calls'}
                            </Typography>
                            {system.callCount > 0 && (
                              <Chip 
                                label={`${system.callCount} calls`} 
                                size="small" 
                                sx={{ 
                                  mt: 1, 
                                  background: 'rgba(255, 255, 255, 0.1)', 
                                  color: 'text.secondary',
                                  fontSize: '0.7rem'
                                }} 
                              />
                            )}
                          </StatusBox>
                          
                          {index < 4 && (
                            <HorizontalConnector 
                              sx={{ 
                                position: 'absolute', 
                                top: '75px', 
                                right: '-20px',
                              }}
                            />
                          )}
                          
                          {/* Add vertical connector from Proxy */}
                          {isProxy && (
                            <Box 
                              sx={{ 
                                position: 'absolute',
                                top: '150px',
                                left: '100px',
                                width: '3px',
                                height: '50px',
                                backgroundColor: 'rgba(255, 255, 255, 0.4)',
                                zIndex: 0
                              }}
                            />
                          )}
                        </Box>
                      );
                    })}
                  </DiagnosticsRow>
                  
                  {/* Position Channel directly under Proxy */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    position: 'relative', 
                    mt: '0px', 
                    ml: '402px', /* Adjusted to align with Proxy */
                    zIndex: 1
                  }}>
                    <StatusBox status={systemsData.find(s => s.name === 'Channel')?.status || 'inactive'}>
                      <Typography variant="h5" sx={{ mb: 1, fontWeight: 500 }}>
                        Channel
                      </Typography>
                      <Typography variant="body1" sx={{ 
                        color: 
                          systemsData.find(s => s.name === 'Channel')?.status === 'success' ? 'rgb(46, 204, 113)' : 
                          systemsData.find(s => s.name === 'Channel')?.status === 'failure' ? 'rgb(231, 76, 60)' : 
                          'rgb(149, 165, 166)',
                        fontWeight: 'bold'
                      }}>
                        {systemsData.find(s => s.name === 'Channel')?.status === 'success' ? 'Success' : 
                         systemsData.find(s => s.name === 'Channel')?.status === 'failure' ? 'Failed' : 
                         'No Calls'}
                      </Typography>
                      {(systemsData.find(s => s.name === 'Channel')?.callCount || 0) > 0 && (
                        <Chip 
                          label={`${systemsData.find(s => s.name === 'Channel')?.callCount || 0} calls`} 
                          size="small" 
                          sx={{ 
                            mt: 1, 
                            background: 'rgba(255, 255, 255, 0.1)', 
                            color: 'text.secondary',
                            fontSize: '0.7rem'
                          }} 
                        />
                      )}
                    </StatusBox>
                  </Box>
                </DiagnosticsContainer>
              </Box>
            )}
          </Box>
        )}

        {activeTab === 'jira' && (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              overflow: 'auto',
              px: 2,
              py: 4,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Heading with icon */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <BugReportIcon sx={{ 
                fontSize: 38, 
                mr: 1, 
                background: 'linear-gradient(90deg, #9c27b0, #7e57c2)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 700
              }} />
              <Typography variant="h4" sx={{ 
                background: 'linear-gradient(90deg, #9c27b0, #7e57c2)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 700
              }}>
                Jira RCA Analysis
              </Typography>
            </Box>
            
            <Typography variant="subtitle1" sx={{ 
              color: 'text.secondary', 
              ml: 5, 
              maxWidth: '800px',
              lineHeight: 1.6,
            }}>
              🔍 Analyze Jira issues to extract root cause patterns and insights ⚡ Generate AI-powered summaries and RCA documentation to speed up troubleshooting and prevent recurring issues. 📊 Turn support tickets into actionable knowledge. 🚀
            </Typography>
            
            <JiraRcaAnalysis />
          </Box>
        )}

        {activeTab === 'freshdesk' && (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              overflow: 'auto',
              px: 2,
              py: 4,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Heading with icon and description */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <SupportIcon sx={{ 
                    fontSize: 38, 
                    mr: 1, 
                    background: 'linear-gradient(90deg, #9c27b0, #7e57c2)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 700
                  }} />
                  <Typography variant="h4" sx={{ 
                    background: 'linear-gradient(90deg, #9c27b0, #7e57c2)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 700
                  }}>
                    Freshdesk Fixer
                  </Typography>
                  
                  {/* Settings button */}
                  <IconButton 
                    onClick={() => setRulesDialogOpen(true)}
                    sx={{ 
                      ml: 2,
                      color: 'primary.main',
                      background: 'rgba(156, 39, 176, 0.08)',
                      '&:hover': {
                        background: 'rgba(156, 39, 176, 0.15)',
                      }
                    }}
                    title="Edit Rules"
                  >
                    <SettingsIcon />
                  </IconButton>
                </Box>
                
                <Typography variant="subtitle1" sx={{ 
                  color: 'text.secondary', 
                  ml: 5, 
                  maxWidth: '800px',
                  lineHeight: 1.6
                }}>
                  ✨ Automatically fix recently closed Freshdesk tickets with missing or incorrect fields ✅ Ensure proper data reconciliation for team-level analysis and reporting, eliminating manual review work. 🚀
                </Typography>
              </Box>
            </Box>
            
            {/* Freshdesk content */}
            {freshdeskLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 6 }}>
                <CircularProgress sx={{ color: 'primary.main' }} />
              </Box>
            ) : freshdeskTickets.length === 0 ? (
              <Box sx={{ textAlign: 'center', my: 6 }}>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                  No Freshdesk tickets found
                </Typography>
                <Button 
                  variant="outlined" 
                  startIcon={<RefreshIcon />} 
                  onClick={fetchFreshdeskTickets}
                  sx={{ 
                    borderColor: 'rgba(156, 39, 176, 0.5)',
                    color: 'primary.main',
                    '&:hover': {
                      borderColor: 'primary.main',
                      background: 'rgba(156, 39, 176, 0.08)',
                    }
                  }}
                >
                  Refresh Tickets
                </Button>
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                  gap: 3,
                  width: '100%',
                }}
              >
                {freshdeskTickets.map(ticket => (
                  <Card
                    key={ticket.id}
                    sx={{
                      background: 'rgba(18, 18, 30, 0.7)',
                      borderRadius: 2,
                      boxShadow: '0 4px 16px rgba(156,39,176,0.08)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: '#fff',
                      height: 260,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 24px rgba(156,39,176,0.15)',
                      },
                    }}
                    variant="outlined"
                    onClick={() => handleTicketClick(ticket)}
                  >
                    <CardHeader
                      title={
                        <Typography
                          variant="subtitle1"
                          sx={{
                            background: 'linear-gradient(90deg, #9c27b0, #7e57c2)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontWeight: 700,
                          }}
                        >
                          #{ticket.id} - {ticket.subject}
                        </Typography>
                      }
                      subheader={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                          <Chip
                            label={ticket.status === 2 ? 'Open' : ticket.status === 3 ? 'Pending' : ticket.status === 4 ? 'Resolved' : 'Closed'}
                            size="small"
                            sx={{
                              background: ticket.status === 2 ? 'rgba(231, 76, 60, 0.15)' : 
                                       ticket.status === 3 ? 'rgba(241, 196, 15, 0.15)' : 
                                       'rgba(46, 204, 113, 0.15)',
                              color: 'white',
                              fontWeight: 500,
                            }}
                          />
                          <Chip
                            label={ticket.priority === 1 ? 'Low' : ticket.priority === 2 ? 'Medium' : ticket.priority === 3 ? 'High' : 'Urgent'}
                            size="small"
                            sx={{
                              background: 'rgba(255,255,255,0.08)',
                              color: 'white',
                              fontWeight: 500,
                            }}
                          />
                          <Typography variant="caption" sx={{ color: 'text.secondary', ml: 'auto' }}>
                            {new Date(ticket.created_at).toLocaleDateString()}
                          </Typography>
                        </Box>
                      }
                      subheaderTypographyProps={{ sx: { color: '#fff', fontWeight: 500 } }}
                      sx={{ pb: 0 }}
                    />
                    <CardContent sx={{ pt: 1, flex: 1, display: 'flex', flexDirection: 'column' }}>
                      {/* Description - wrapped text with ellipsis */}
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'rgba(255,255,255,0.8)',
                          mb: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          fontSize: '0.9rem',
                        }}
                      >
                        {ticket.subject}
                      </Typography>
                      
                      <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between' }}>
                        <Box>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Client
                          </Typography>
                          <Typography variant="body2" sx={{ 
                            background: 'linear-gradient(90deg, #9c27b0, #7e57c2)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontWeight: 700,
                          }}>
                            {ticket.custom_fields.cf_client || 'Unknown'}
                          </Typography>
                        </Box>
                        
                        <Box>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Updated
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.primary' }}>
                            {new Date(ticket.updated_at).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                      
                      {ticket.custom_fields.cf_rca && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Root Cause
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: 'text.primary',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                            }}
                          >
                            {ticket.custom_fields.cf_rca}
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
            
            {/* Rules Dialog */}
            <Dialog
              open={rulesDialogOpen}
              onClose={() => setRulesDialogOpen(false)}
              maxWidth="md"
              fullWidth
              PaperProps={{
                sx: {
                  background: 'rgba(18, 18, 30, 0.95)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#fff',
                },
              }}
            >
              <DialogTitle sx={{ 
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <EditIcon sx={{ 
                    mr: 1.5, 
                    fontSize: 24,
                    color: 'primary.main'
                  }} />
                  <Typography sx={{ 
                    background: 'linear-gradient(90deg, #9c27b0, #7e57c2)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 700,
                    fontSize: '1.3rem'
                  }}>
                    Edit Ticket Processing Rules
                  </Typography>
                </Box>
                <IconButton 
                  onClick={() => setRulesDialogOpen(false)}
                  sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                >
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent sx={{ py: 3 }}>
                <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                  Define rules for automatically fixing Freshdesk tickets. Each rule should be on a new line.
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={10}
                  value={ticketRules}
                  onChange={(e) => setTicketRules(e.target.value)}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(30, 30, 40, 0.6)',
                      borderRadius: 2,
                      '&.Mui-focused': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(156, 39, 176, 0.5)',
                          borderWidth: 1,
                        },
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: '#f5f5f5',
                      fontFamily: 'monospace',
                      fontSize: '0.9rem',
                    },
                  }}
                />
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    onClick={() => setTicketRules(defaultTicketRules)}
                    sx={{
                      borderColor: 'rgba(156, 39, 176, 0.5)',
                      color: 'primary.main',
                      '&:hover': {
                        borderColor: 'primary.main',
                        background: 'rgba(156, 39, 176, 0.08)',
                      },
                    }}
                  >
                    Reset to Default
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => {
                      // Save rules and close dialog
                      localStorage.setItem('freshdesk-rules', ticketRules);
                      setRulesDialogOpen(false);
                    }}
                    sx={{
                      background: 'linear-gradient(90deg, #9c27b0, #7e57c2)',
                      '&:hover': {
                        background: 'linear-gradient(90deg, #8e24aa, #6a52b3)',
                      },
                    }}
                  >
                    Save Rules
                  </Button>
                </Box>
              </DialogContent>
            </Dialog>

            {/* Ticket Edit Dialog */}
            <Dialog
              open={!!selectedTicket}
              onClose={() => !ticketEditLoading && setSelectedTicket(null)}
              maxWidth="md" // Changed from "lg" to "md" to make it narrower
              fullWidth
              PaperProps={{
                sx: {
                  background: 'rgba(18, 18, 30, 0.95)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#fff',
                  maxWidth: '1000px', // Added explicit max width
                  margin: 'auto',
                },
              }}
            >
              {selectedTicket && (
                <>
                  <DialogTitle sx={{ 
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CompareArrowsIcon sx={{ 
                        mr: 1.5, 
                        fontSize: 24,
                        color: 'primary.main'
                      }} />
                      <Typography sx={{ 
                        background: 'linear-gradient(90deg, #9c27b0, #7e57c2)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: 700,
                        fontSize: '1.3rem'
                      }}>
                        AI Ticket Edit - #{selectedTicket.id}
                      </Typography>
                    </Box>
                    <IconButton 
                      onClick={() => !ticketEditLoading && setSelectedTicket(null)}
                      sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                      disabled={ticketEditLoading}
                    >
                      <CloseIcon />
                    </IconButton>
                  </DialogTitle>
                  <DialogContent sx={{ py: 3 }}>
                    {ticketEditLoading ? (
                      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                        {/* Updated Lottie Animation URL */}
                        <Box sx={{ width: 200, height: 200, mb: 3 }}>
                          <iframe 
                            src="https://lottie.host/embed/147e3a35-16bd-4fbe-840e-87679193ae24/xxKoZbh1uc.lottie"
                            width="100%" 
                            height="100%" 
                            frameBorder="0" 
                            allowFullScreen
                            title="AI Processing Animation"
                          ></iframe>
                        </Box>
                        
                        {/* Rotating Loading Messages */}
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            color: 'primary.main',
                            fontWeight: 500,
                            textAlign: 'center',
                            animation: 'fadeInOut 2s infinite ease-in-out',
                            '@keyframes fadeInOut': {
                              '0%': { opacity: 0 },
                              '20%': { opacity: 1 },
                              '80%': { opacity: 1 },
                              '100%': { opacity: 0 },
                            }
                          }}
                        >
                          <LoadingMessage />
                        </Typography>
                      </Box>
                    ) : ticketEditError ? (
                      <Box sx={{ 
                        p: 3, 
                        textAlign: 'center', 
                        background: 'rgba(231, 76, 60, 0.1)',
                        borderRadius: 2,
                        border: '1px solid rgba(231, 76, 60, 0.3)'
                      }}>
                        <Typography color="error">{ticketEditError}</Typography>
                        <Button 
                          variant="outlined" 
                          onClick={() => handleTicketClick(selectedTicket)}
                          sx={{ 
                            mt: 2,
                            borderColor: 'rgba(231, 76, 60, 0.5)',
                            color: '#e74c3c',
                            '&:hover': {
                              borderColor: '#e74c3c',
                              background: 'rgba(231, 76, 60, 0.08)',
                            }
                          }}
                        >
                          Try Again
                        </Button>
                      </Box>
                    ) : ticketUpdateSuccess ? (
                      <Box sx={{ 
                        p: 3, 
                        textAlign: 'center', 
                        background: 'rgba(46, 204, 113, 0.1)',
                        borderRadius: 2,
                        border: '1px solid rgba(46, 204, 113, 0.3)'
                      }}>
                        <CheckCircleIcon sx={{ fontSize: 48, color: '#2ecc71', mb: 2 }} />
                        <Typography variant="h6" sx={{ color: '#2ecc71', mb: 1 }}>
                          Ticket Updated Successfully!
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          The changes have been applied to the ticket.
                        </Typography>
                      </Box>
                    ) : ticketEditData ? (
                      <>
                        <Typography variant="subtitle1" sx={{ mb: 3, color: 'text.secondary' }}>
                          Review the AI-suggested changes to this ticket:
                        </Typography>
                        
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                          {/* Original Ticket */}
                          <Box sx={{ flex: 1 }}>
                            <Paper sx={{ 
                              p: 2, 
                              background: 'rgba(255, 255, 255, 0.03)', 
                              borderRadius: 2,
                              border: '1px solid rgba(255, 255, 255, 0.05)',
                              height: '100%'
                            }}>
                              <Typography variant="subtitle2" sx={{ 
                                mb: 2, 
                                color: 'text.secondary',
                                display: 'flex',
                                alignItems: 'center'
                              }}>
                                <AssignmentIcon sx={{ mr: 1, fontSize: 20 }} />
                                Original Ticket
                              </Typography>
                              
                              <Box sx={{ mb: 2 }}>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                  Subject
                                </Typography>
                                <Typography variant="body2">
                                  {ticketEditData.actual.subject}
                                </Typography>
                              </Box>
                              
                              <Box sx={{ mb: 2 }}>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                  Status
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Chip
                                    label={
                                      ticketEditData.actual.status === 2 ? 'Open' : 
                                      ticketEditData.actual.status === 3 ? 'Pending' : 
                                      ticketEditData.actual.status === 4 ? 'Resolved' : 'Closed'
                                    }
                                    size="small"
                                    sx={{
                                      mr: 1,
                                      background: ticketEditData.actual.status === 2 ? 'rgba(231, 76, 60, 0.15)' : 
                                                ticketEditData.actual.status === 3 ? 'rgba(241, 196, 15, 0.15)' : 
                                                'rgba(46, 204, 113, 0.15)',
                                      color: 'white',
                                      fontWeight: 500,
                                    }}
                                  />
                                  {ticketEditData.actual.status !== ticketEditData.edited.status && (
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                      <AutoFixHighIcon sx={{ color: 'primary.main', fontSize: 16, mr: 0.5 }} />
                                      <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 500 }}>
                                        Changed
                                      </Typography>
                                    </Box>
                                  )}
                                </Box>
                              </Box>
                              
                              <Box sx={{ mb: 2 }}>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                  Priority
                                </Typography>
                                <Chip
                                  label={
                                    ticketEditData.actual.priority === 1 ? 'Low' : 
                                    ticketEditData.actual.priority === 2 ? 'Medium' : 
                                    ticketEditData.actual.priority === 3 ? 'High' : 'Urgent'
                                  }
                                  size="small"
                                  sx={{
                                    ml: 1,
                                    background: 'rgba(255,255,255,0.08)',
                                    color: 'white',
                                    fontWeight: 500,
                                  }}
                                />
                              </Box>
                              
                              <Box sx={{ mb: 2 }}>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                  Type
                                </Typography>
                                <Typography variant="body2">
                                  {ticketEditData.actual.type || 'Not set'}
                                </Typography>
                              </Box>
                              
                              {ticketEditData.actual.custom_fields && (
                                <>
                                  <Box sx={{ mb: 2 }}>
                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                      Client
                                    </Typography>
                                    <Typography variant="body2">
                                      {ticketEditData.actual.custom_fields.cf_client || 'Not set'}
                                    </Typography>
                                  </Box>
                                  
                                  <Box sx={{ mb: 2 }}>
                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                      Root Cause
                                    </Typography>
                                    <Typography variant="body2">
                                      {ticketEditData.actual.custom_fields.cf_rca || 'Not set'}
                                    </Typography>
                                  </Box>
                                </>
                              )}
                            </Paper>
                          </Box>
                          
                          {/* Edited Ticket */}
                          <Box sx={{ flex: 1 }}>
                            <Paper sx={{ 
                              p: 2, 
                              background: 'rgba(156, 39, 176, 0.08)', 
                              borderRadius: 2,
                              border: '1px solid rgba(156, 39, 176, 0.2)',
                              height: '100%'
                            }}>
                              <Typography variant="subtitle2" sx={{ 
                                mb: 2, 
                                color: 'primary.main',
                                display: 'flex',
                                alignItems: 'center'
                              }}>
                                <AutoFixHighIcon sx={{ mr: 1, fontSize: 20 }} />
                                AI-Edited Ticket
                              </Typography>
                              
                              <Box sx={{ mb: 2 }}>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                  Subject
                                </Typography>
                                <Box sx={{ 
                                  ...(ticketEditData.edited.subject !== ticketEditData.actual.subject && {
                                    background: 'rgba(156, 39, 176, 0.15)',
                                    borderRadius: '20px',
                                    p: 1,
                                    pl: 2,
                                    pr: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    border: '1px solid rgba(156, 39, 176, 0.2)',
                                    mt: 0.5
                                  })
                                }}>
                                  <Typography variant="body2">
                                    {ticketEditData.edited.subject}
                                  </Typography>
                                  {ticketEditData.edited.subject !== ticketEditData.actual.subject && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                                      <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 500, mr: 0.5 }}>
                                        Changed
                                      </Typography>
                                      <AutoFixHighIcon sx={{ color: 'primary.main', fontSize: 18 }} />
                                    </Box>
                                  )}
                                </Box>
                              </Box>
                              
                              <Box sx={{ mb: 2 }}>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                  Status
                                </Typography>
                                <Box sx={{ 
                                  ...(ticketEditData.edited.status !== ticketEditData.actual.status && {
                                    background: 'rgba(156, 39, 176, 0.15)',
                                    borderRadius: '20px',
                                    p: 1,
                                    pl: 2,
                                    pr: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    border: '1px solid rgba(156, 39, 176, 0.2)',
                                    mt: 0.5
                                  })
                                }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Chip
                                      label={
                                        ticketEditData.edited.status === 2 ? 'Open' : 
                                        ticketEditData.edited.status === 3 ? 'Pending' : 
                                        ticketEditData.edited.status === 4 ? 'Resolved' : 'Closed'
                                      }
                                      size="small"
                                      sx={{
                                        mr: 1,
                                        background: ticketEditData.edited.status === 2 ? 'rgba(231, 76, 60, 0.15)' : 
                                                  ticketEditData.edited.status === 3 ? 'rgba(241, 196, 15, 0.15)' : 
                                                  'rgba(46, 204, 113, 0.15)',
                                        color: 'white',
                                        fontWeight: 500,
                                      }}
                                    />
                                  </Box>
                                  {ticketEditData.edited.status !== ticketEditData.actual.status && (
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                      <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 500, mr: 0.5 }}>
                                        Changed
                                      </Typography>
                                      <AutoFixHighIcon sx={{ color: 'primary.main', fontSize: 18 }} />
                                    </Box>
                                  )}
                                </Box>
                              </Box>
                              
                              <Box sx={{ mb: 2 }}>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                  Priority
                                </Typography>
                                <Box sx={{ 
                                  ...(ticketEditData.edited.priority !== ticketEditData.actual.priority && {
                                    background: 'rgba(156, 39, 176, 0.15)',
                                    borderRadius: '20px',
                                    p: 1,
                                    pl: 2,
                                    pr: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    border: '1px solid rgba(156, 39, 176, 0.2)',
                                    mt: 0.5
                                  })
                                }}>
                                  <Chip
                                    label={
                                      ticketEditData.edited.priority === 1 ? 'Low' : 
                                      ticketEditData.edited.priority === 2 ? 'Medium' : 
                                      ticketEditData.edited.priority === 3 ? 'High' : 'Urgent'
                                    }
                                    size="small"
                                    sx={{
                                      background: 'rgba(255,255,255,0.08)',
                                      color: 'white',
                                      fontWeight: 500,
                                    }}
                                  />
                                  {ticketEditData.edited.priority !== ticketEditData.actual.priority && (
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                      <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 500, mr: 0.5 }}>
                                        Changed
                                      </Typography>
                                      <AutoFixHighIcon sx={{ color: 'primary.main', fontSize: 18 }} />
                                    </Box>
                                  )}
                                </Box>
                              </Box>
                              
                              <Box sx={{ mb: 2 }}>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                  Type
                                </Typography>
                                <Box sx={{ 
                                  ...(ticketEditData.edited.type !== ticketEditData.actual.type && {
                                    background: 'rgba(156, 39, 176, 0.15)',
                                    borderRadius: '20px',
                                    p: 1,
                                    pl: 2,
                                    pr: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    border: '1px solid rgba(156, 39, 176, 0.2)',
                                    mt: 0.5
                                  })
                                }}>
                                  <Typography variant="body2">
                                    {ticketEditData.edited.type || 'Not set'}
                                  </Typography>
                                  {ticketEditData.edited.type !== ticketEditData.actual.type && (
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                      <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 500, mr: 0.5 }}>
                                        Changed
                                      </Typography>
                                      <AutoFixHighIcon sx={{ color: 'primary.main', fontSize: 18 }} />
                                    </Box>
                                  )}
                                </Box>
                              </Box>
                              
                              {ticketEditData.edited.custom_fields && (
                                <>
                                  <Box sx={{ mb: 2 }}>
                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                      Client
                                    </Typography>
                                    <Box sx={{ 
                                      ...(ticketEditData.edited.custom_fields.cf_client !== 
                                        ticketEditData.actual.custom_fields?.cf_client && {
                                        background: 'rgba(156, 39, 176, 0.15)',
                                        borderRadius: '20px',
                                        p: 1,
                                        pl: 2,
                                        pr: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        border: '1px solid rgba(156, 39, 176, 0.2)',
                                        mt: 0.5
                                      })
                                    }}>
                                      <Typography variant="body2">
                                        {ticketEditData.edited.custom_fields.cf_client || 'Not set'}
                                      </Typography>
                                      {ticketEditData.edited.custom_fields.cf_client !== 
                                        ticketEditData.actual.custom_fields?.cf_client && (
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                          <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 500, mr: 0.5 }}>
                                            Changed
                                          </Typography>
                                          <AutoFixHighIcon sx={{ color: 'primary.main', fontSize: 18 }} />
                                        </Box>
                                      )}
                                    </Box>
                                  </Box>
                                  
                                  <Box sx={{ mb: 2 }}>
                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                      Root Cause
                                    </Typography>
                                    <Box sx={{ 
                                      ...(ticketEditData.edited.custom_fields.cf_rca !== 
                                        ticketEditData.actual.custom_fields?.cf_rca && {
                                        background: 'rgba(156, 39, 176, 0.15)',
                                        borderRadius: '20px',
                                        p: 1,
                                        pl: 2,
                                        pr: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        border: '1px solid rgba(156, 39, 176, 0.2)',
                                        mt: 0.5
                                      })
                                    }}>
                                      <Typography variant="body2" sx={{ 
                                        maxHeight: '80px', 
                                        overflow: 'auto',
                                        flex: 1,
                                        pr: ticketEditData.edited.custom_fields.cf_rca !== 
                                          ticketEditData.actual.custom_fields?.cf_rca ? 1 : 0
                                      }}>
                                        {ticketEditData.edited.custom_fields.cf_rca || 'Not set'}
                                      </Typography>
                                      {ticketEditData.edited.custom_fields.cf_rca !== 
                                        ticketEditData.actual.custom_fields?.cf_rca && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                                          <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 500, mr: 0.5 }}>
                                            Changed
                                          </Typography>
                                          <AutoFixHighIcon sx={{ color: 'primary.main', fontSize: 18 }} />
                                        </Box>
                                      )}
                                    </Box>
                                  </Box>
                                </>
                              )}
                            </Paper>
                          </Box>
                        </Box>
                        
                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                          <Button
                            variant="outlined"
                            onClick={() => setSelectedTicket(null)}
                            sx={{
                              borderColor: 'rgba(255, 255, 255, 0.2)',
                              color: 'text.secondary',
                              '&:hover': {
                                borderColor: 'rgba(255, 255, 255, 0.3)',
                                background: 'rgba(255, 255, 255, 0.05)',
                              },
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="contained"
                            onClick={handleSubmitTicketEdit}
                            disabled={JSON.stringify(ticketEditData.actual) === JSON.stringify(ticketEditData.edited)}
                            startIcon={<SendIcon />}
                            sx={{
                              background: 'linear-gradient(90deg, #9c27b0, #7e57c2)',
                              '&:hover': {
                                background: 'linear-gradient(90deg, #8e24aa, #6a52b3)',
                              },
                              '&.Mui-disabled': {
                                background: 'rgba(255, 255, 255, 0.12)',
                                color: 'rgba(255, 255, 255, 0.3)',
                              }
                            }}
                          >
                            Apply Changes
                          </Button>
                        </Box>
                      </>
                    ) : (
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                        <Typography color="text.secondary">No edit data available</Typography>
                      </Box>
                    )}
                  </DialogContent>
                </>
              )}
            </Dialog>
          </Box>
        )}

        {activeTab === 'settings' && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Typography variant="h5" color="text.secondary">Settings Panel</Typography>
          </Box>
        )}
      </Main>
    </Box>
  );
}

// Add this component near your other component definitions
function LoadingMessage() {
  const messages = [
    "Performing magic ✨",
    "Analyzing ticket data 🔍",
    "Applying AI rules 🧠",
    "Finding improvements 🚀",
    "Sprinkling AI dust 🪄"
  ];
  
  const [messageIndex, setMessageIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  return <>{messages[messageIndex]}</>;
}
