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
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import Modal from '@mui/material/Modal';
import BugReportIcon from '@mui/icons-material/BugReport';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import CloseIcon from '@mui/icons-material/Close';
import ArticleIcon from '@mui/icons-material/Article';
import LinkIcon from '@mui/icons-material/Link';

const drawerWidth = 340;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%)',
    position: 'relative',
    marginLeft: theme.spacing(2),
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
  height: '120px',
  width: '160px',
  padding: theme.spacing(1.5),
  margin: theme.spacing(1.5),
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

// Styled component for API logs list
const ApiLogsList = styled(Paper)(({ theme }) => ({
  width: '100%',
  maxWidth: '900px',
  marginTop: theme.spacing(4),
  backgroundColor: 'rgba(30, 30, 40, 0.6)',
  borderRadius: theme.spacing(1),
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  maxHeight: '600px',
  transition: 'max-width 0.3s ease',
}));

// Styled component for API log details
const ApiLogDetails = styled(Paper)(({ theme }) => ({
  width: '100%',
  maxWidth: '530px',
  marginTop: theme.spacing(4),
  marginLeft: theme.spacing(2),
  backgroundColor: 'rgba(30, 30, 40, 0.6)',
  borderRadius: theme.spacing(1),
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  maxHeight: '600px',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: '4px',
  }
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

interface JiraIssue {
  issueKey: string;
  summary: string;
  description: string;
  extractedRCA: string | null;
  status: string;
  issueType: string;
  similarityScore: number;
}

interface SearchResponse {
  status: string;
  code: number;
  message: string;
  data: {
    query: string;
    totalResults: number;
    results: JiraIssue[];
  };
}

interface RcaResponse {
  status: string;
  code: number;
  message: string;
  data: {
    query: string;
    rca: string;
    issuesUsed: {
      issueKey: string;
      summary: string;
      similarityScore: number;
    }[];
    totalIssuesUsed: number;
  };
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
  
  // Add state for API logs
  const [apiLogs, setApiLogs] = useState<Record<string, ApiCallLog[]>>({});
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [selectedLog, setSelectedLog] = useState<ApiCallLog | null>(null);
  const [isOpeningLog, setIsOpeningLog] = useState(false);
  
  // Add state for RCA modal
  const [rcaModalOpen, setRcaModalOpen] = useState(false);
  const [similarJiraIssues, setSimilarJiraIssues] = useState<JiraIssue[]>([]);
  const [generatedRca, setGeneratedRca] = useState<string>('');
  const [isLoadingRca, setIsLoadingRca] = useState(false);
  const [rcaError, setRcaError] = useState<string | null>(null);
  
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

    // Store the API logs
    setApiLogs({
      OMS: data.oms,
      CIMS: data.cims,
      WMS: data.wms
    });
    
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

  // Handle component click to show logs
  const handleComponentClick = (componentName: string) => {
    const logs = apiLogs[componentName];
    if (logs && logs.length > 0) {
      setSelectedComponent(componentName);
      setSelectedLog(null);
    }
  };

  // Handle log click to show details
  const handleLogClick = (log: ApiCallLog) => {
    setSelectedLog(log);
  };

  // Update the StatusBox component to be clickable when it has logs
  const renderStatusBox = (system: SystemStatus) => {
    const hasLogs = system.callCount > 0;
    
    return (
      <StatusBox 
        status={system.status} 
        onClick={() => hasLogs && handleComponentClick(system.name)}
        sx={{ cursor: hasLogs ? 'pointer' : 'default' }}
      >
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
    );
  };

  // Function to handle trace ID submission
  const handleTraceIdSubmit = async () => {
    if (traceId.trim()) {
      setIsLoading(true);
      setError(null);
      
      try {
        // Make real API call to the provided endpoint
        const response = await fetch(`http://127.0.0.1:3005/api/trace?traceId=${traceId}`);
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data: TraceResponse = await response.json();
        
        // Check if all components have empty data
        if (data.oms.length === 0 && data.cims.length === 0 && data.wms.length === 0) {
          setError("No trace data found for the provided trace ID. Please verify the ID and try again.");
          setSystemsData(null);
        } else {
          // Process the API response data
          const processedSystems = processApiResponse(data);
          setSystemsData(processedSystems);
        }
      } catch (err) {
        console.error("Error fetching trace data:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch trace data. Please try again.");
        setSystemsData(null);
      } finally {
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

  // Function to open log in a new tab
  const handleOpenLogDocument = async (logId: string) => {
    if (isOpeningLog) return;
    
    setIsOpeningLog(true);
    try {
      const response = await fetch(`http://127.0.0.1:3005/api/log?id=${logId}`);
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.url) {
        window.open(data.url, '_blank');
      } else {
        console.error('No URL returned from API');
      }
    } catch (err) {
      console.error('Error fetching log document URL:', err);
    } finally {
      setIsOpeningLog(false);
    }
  };

  // Function to handle RCA button click
  const handleRcaButtonClick = async () => {
    if (!selectedLog?.responseBody) return;
    
    setRcaModalOpen(true);
    setIsLoadingRca(true);
    setRcaError(null);
    setSimilarJiraIssues([]);
    setGeneratedRca('');
    
    try {
      //console.log(selectedLog.responseBody);
      
      // Pre-process JSON string to handle NaN values before parsing
      const processedJsonString = selectedLog.responseBody
        .replace(/:NaN,/g, ':null,')
        .replace(/:NaN}/g, ':null}');
      
      let query = "";
      try {
        const responseJson = JSON.parse(processedJsonString);
        query = responseJson.message || responseJson.responseBody?.substring(0, 100) || selectedLog.responseBody.substring(0, 100);
      } catch (parseError) {
        console.warn("Failed to parse response JSON, using raw text:", parseError);
        query = selectedLog.responseBody.substring(0, 100);
      }
      
      console.log(query);
      
      // Call first API to get similar JIRA issues
      const similarIssuesResponse = await fetch('http://127.0.0.1:5001/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query,
          limit: 3
        })
      });
      
      if (!similarIssuesResponse.ok) {
        throw new Error(`Error fetching similar issues: ${similarIssuesResponse.status}`);
      }

      const similarIssuesData: SearchResponse = await similarIssuesResponse.json();
      setSimilarJiraIssues(similarIssuesData.data.results);
      
      // Call second API to get generated RCA
      const rcaResponse = await fetch('http://127.0.0.1:5001/api/generate-rca', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query,
          limit: 3
        })
      });

      if (!rcaResponse.ok) {
        throw new Error(`Error generating RCA: ${rcaResponse.status}`);
      }
      
      const rcaData: RcaResponse = await rcaResponse.json();
      setGeneratedRca(rcaData.data.rca);
      
    } catch (err) {
      console.error('Error in RCA process:', err);
      setRcaError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoadingRca(false);
    }
  };

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
                    How can I help you today?
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
            pt: 1,
            position: 'relative'
          }}>
            <Typography variant="h4" sx={{ 
              mb: 4, 
              mt: 1,
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
              <Box sx={{ width: '100%', maxWidth: '1000px', mt: -1 }}>
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
                  <DiagnosticsRow sx={{ position: 'relative', mt: -1 }}>
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
                          {renderStatusBox(system)}
                          
                          {index < 4 && (
                            <HorizontalConnector 
                              key={`connector-${name}`}
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
                              key={`vertical-connector-${name}`}
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
                    ml: '322px', /* Adjusted to align with Proxy after making boxes smaller */
                    zIndex: 1
                  }}>
                    {renderStatusBox(systemsData.find(s => s.name === 'Channel') || { 
                      name: 'Channel', 
                      status: 'inactive', 
                      callCount: 0 
                    })}
                  </Box>

                  {/* API Logs list and details side by side */}
                  {selectedComponent && apiLogs[selectedComponent]?.length > 0 && (
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'row',
                      width: '100%',
                      maxWidth: '900px',
                      flexWrap: 'wrap',
                      gap: { xs: 2, md: 0 },
                      height: '500px',
                      mt: 1,
                      mb: 5,
                      pb: 2
                    }}>
                      <ApiLogsList sx={{ 
                        maxWidth: selectedLog ? '350px' : '900px', 
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                      }}>
                        <Typography variant="h6" sx={{ mb: 2, flexShrink: 0 }}>
                          {selectedComponent} API Call Logs ({apiLogs[selectedComponent].length})
                        </Typography>
                        <Box sx={{ 
                          overflowY: 'auto', 
                          flex: '1 1 auto',
                          '&::-webkit-scrollbar': {
                            width: '8px',
                          },
                          '&::-webkit-scrollbar-thumb': {
                            backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                            borderRadius: '4px'
                          },
                          '&::-webkit-scrollbar-track': {
                            backgroundColor: 'rgba(0, 0, 0, 0.1)',
                            borderRadius: '4px'
                          }
                        }}>
                          <List>
                            {apiLogs[selectedComponent].map((log) => (
                              <ListItem 
                                key={log._id} 
                                onClick={() => handleLogClick(log)} 
                                sx={{ 
                                  cursor: 'pointer',
                                  borderLeft: `4px solid ${log.status === 'SUCCESS' ? 'rgb(46, 204, 113)' : 'rgb(231, 76, 60)'}`,
                                  mb: 1,
                                  backgroundColor: selectedLog?._id === log._id ? 'rgba(156, 39, 176, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                                  borderRadius: '0 4px 4px 0',
                                  '&:hover': {
                                    backgroundColor: selectedLog?._id === log._id ? 'rgba(156, 39, 176, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                                  }
                                }}
                              >
                                <ListItemText
                                  primary={
                                    <Typography 
                                      color={log.status === 'SUCCESS' ? 'rgb(46, 204, 113)' : 'rgb(231, 76, 60)'}
                                      sx={{ fontWeight: 'bold' }}
                                    >
                                      {log.request_name || log.url.split('/').pop() || 'API Call'}
                                    </Typography>
                                  }
                                  secondary={
                                    <>
                                      <Typography component="span" variant="body2" sx={{ display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {log.http_method} {log.url}
                                      </Typography>
                                      <Typography component="span" variant="body2" sx={{ display: 'block' }}>
                                        Status: {log.http_status} • {log.duration_millis}ms
                                      </Typography>
                                    </>
                                  }
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      </ApiLogsList>

                      {/* API Log Details */}
                      {selectedLog && (
                        <ApiLogDetails sx={{ 
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          overflowY: 'auto'
                        }}>
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            mb: 1,
                            flexShrink: 0
                          }}>
                            <Typography variant="h6">API Call Details</Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              {selectedLog && selectedLog.status !== 'SUCCESS' && (
                                <Tooltip title="Analyze Root Cause">
                                  <IconButton 
                                    size="small"
                                    color="primary"
                                    onClick={handleRcaButtonClick}
                                    sx={{
                                      backgroundColor: 'rgba(231, 76, 60, 0.15)',
                                      '&:hover': {
                                        backgroundColor: 'rgba(231, 76, 60, 0.25)'
                                      }
                                    }}
                                  >
                                    <AnalyticsIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                              <Tooltip title="Open log document in new tab">
                                <div>
                                  <IconButton 
                                    size="small"
                                    color="primary"
                                    onClick={() => handleOpenLogDocument(selectedLog._id)}
                                    disabled={isOpeningLog}
                                    sx={{
                                      backgroundColor: 'rgba(156, 39, 176, 0.1)',
                                      '&:hover': {
                                        backgroundColor: 'rgba(156, 39, 176, 0.2)'
                                      }
                                    }}
                                  >
                                    {isOpeningLog ? 
                                      <CircularProgress size={20} color="inherit" /> : 
                                      <OpenInNewIcon fontSize="small" />
                                    }
                                  </IconButton>
                                </div>
                              </Tooltip>
                            </Box>
                          </Box>
                          
                          <Box sx={{ 
                            display: 'flex', 
                            flexWrap: 'wrap', 
                            gap: 1.5, 
                            overflowY: 'auto',
                            flex: '1 1 auto',
                            pr: 1
                          }}>
                            <Box sx={{ flex: '1 1 45%', minWidth: '200px' }}>
                              <Typography variant="subtitle2" color="text.secondary">ID</Typography>
                              <Tooltip title={selectedLog._id}>
                                <Typography noWrap sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{selectedLog._id}</Typography>
                              </Tooltip>
                            </Box>
                            <Box sx={{ flex: '1 1 45%', minWidth: '200px' }}>
                              <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                              <Typography 
                                color={selectedLog.status === 'SUCCESS' ? 'rgb(46, 204, 113)' : 'rgb(231, 76, 60)'}
                                sx={{ fontWeight: 'bold' }}
                              >
                                {selectedLog.status} ({selectedLog.http_status})
                              </Typography>
                            </Box>
                            <Box sx={{ flex: '1 1 100%' }}>
                              <Typography variant="subtitle2" color="text.secondary">URL</Typography>
                              <Tooltip title={`${selectedLog.http_method} ${selectedLog.url}`}>
                                <Typography sx={{ wordBreak: 'break-all' }}>{selectedLog.http_method} {selectedLog.url}</Typography>
                              </Tooltip>
                            </Box>
                            <Box sx={{ flex: '1 1 31%', minWidth: '150px', maxWidth: '250px' }}>
                              <Typography variant="subtitle2" color="text.secondary">Request Name</Typography>
                              <Tooltip title={selectedLog.request_name || 'N/A'}>
                                <Typography noWrap sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{selectedLog.request_name || 'N/A'}</Typography>
                              </Tooltip>
                            </Box>
                            <Box sx={{ flex: '0 1 31%', minWidth: '120px', maxWidth: '150px' }}>
                              <Typography variant="subtitle2" color="text.secondary">Duration</Typography>
                              <Tooltip title={`${selectedLog.duration_millis}ms`}>
                                <Typography noWrap>{selectedLog.duration_millis}ms</Typography>
                              </Tooltip>
                            </Box>
                            <Box sx={{ flex: '1 1 31%', minWidth: '150px' }}>
                              <Typography variant="subtitle2" color="text.secondary">Timestamp</Typography>
                              <Tooltip title={new Date(selectedLog.timestamp || '').toLocaleString()}>
                                <Typography noWrap sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{new Date(selectedLog.timestamp || '').toLocaleString()}</Typography>
                              </Tooltip>
                            </Box>
                            
                            {selectedLog.requestBody && (
                              <Box sx={{ flex: '1 1 100%' }}>
                                <Typography variant="subtitle2" color="text.secondary">Request Body</Typography>
                                <Paper 
                                  sx={{ 
                                    p: 1.5, 
                                    backgroundColor: 'rgba(0,0,0,0.3)', 
                                    maxHeight: '120px', 
                                    overflow: 'auto',
                                    fontFamily: 'monospace',
                                    fontSize: '0.85rem',
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-all'
                                  }}
                                >
                                  {selectedLog.requestBody}
                                </Paper>
                              </Box>
                            )}
                            
                            {selectedLog.responseBody && (
                              <Box sx={{ flex: '1 1 100%' }}>
                                <Typography variant="subtitle2" color="text.secondary">Response Body</Typography>
                                <Paper 
                                  sx={{ 
                                    p: 1.5, 
                                    backgroundColor: 'rgba(0,0,0,0.3)', 
                                    maxHeight: '120px', 
                                    overflow: 'auto',
                                    fontFamily: 'monospace',
                                    fontSize: '0.85rem',
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-all'
                                  }}
                                >
                                  {selectedLog.responseBody}
                                </Paper>
                              </Box>
                            )}
                            
                            {selectedLog.http_headers && (
                              <Box sx={{ flex: '1 1 100%' }}>
                                <Typography variant="subtitle2" color="text.secondary">HTTP Headers</Typography>
                                <Paper 
                                  sx={{ 
                                    p: 1.5, 
                                    backgroundColor: 'rgba(0,0,0,0.3)', 
                                    maxHeight: '120px', 
                                    overflow: 'auto',
                                    fontFamily: 'monospace',
                                    fontSize: '0.85rem',
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-all'
                                  }}
                                >
                                  {selectedLog.http_headers}
                                </Paper>
                              </Box>
                            )}
                          </Box>
                        </ApiLogDetails>
                      )}
                    </Box>
                  )}
                </DiagnosticsContainer>
              </Box>
            )}
          </Box>
        )}

        {activeTab === 'settings' && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Typography variant="h5" color="text.secondary">Settings Panel</Typography>
          </Box>
        )}
      </Main>

      {/* Add the RCA Modal */}
      <Modal
        open={rcaModalOpen}
        onClose={() => setRcaModalOpen(false)}
        aria-labelledby="rca-modal-title"
        aria-describedby="rca-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          maxWidth: 900,
          maxHeight: '90vh',
          bgcolor: 'rgba(30, 30, 40, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            borderRadius: '4px',
          }
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography id="rca-modal-title" variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
              Root Cause Analysis
            </Typography>
            <IconButton 
              onClick={() => setRcaModalOpen(false)}
              sx={{ color: 'white' }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {isLoadingRca ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 4 }}>
              <CircularProgress />
              <Typography sx={{ ml: 2 }}>Analyzing and generating RCA...</Typography>
            </Box>
          ) : rcaError ? (
            <Paper sx={{ p: 2, bgcolor: 'rgba(231, 76, 60, 0.1)', color: 'rgb(231, 76, 60)', mb: 3 }}>
              <Typography>{rcaError}</Typography>
            </Paper>
          ) : (
            <>
              {/* Similar JIRA Issues Section */}
              {similarJiraIssues.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <BugReportIcon sx={{ mr: 1 }} /> Similar JIRA Issues
                  </Typography>
                  
                  {similarJiraIssues.map((issue) => (
                    <Paper 
                      key={issue.issueKey} 
                      sx={{ 
                        p: 2, 
                        mb: 2, 
                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: 1
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Chip 
                            label={issue.issueKey} 
                            sx={{ 
                              mr: 2, 
                              bgcolor: 'rgba(103, 58, 183, 0.2)', 
                              fontWeight: 'bold',
                              '& .MuiChip-label': { px: 1 }
                            }}
                            onClick={() => window.open(`https://increff.atlassian.net/browse/${issue.issueKey}`, '_blank')}
                            icon={<LinkIcon style={{ fontSize: '14px' }} />}
                            clickable
                          />
                          <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                            {issue.summary}
                          </Typography>
                        </Box>
                        <Chip 
                          label={issue.status} 
                          size="small" 
                          sx={{ 
                            bgcolor: issue.status === 'Closed' ? 
                              'rgba(46, 204, 113, 0.2)' : 'rgba(230, 126, 34, 0.2)',
                            '& .MuiChip-label': { px: 1 }
                          }} 
                        />
                      </Box>
                      
                      <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                        Type: {issue.issueType} • Similarity: {(issue.similarityScore * 100).toFixed(1)}%
                      </Typography>
                      
                      {issue.extractedRCA && (
                        <Box sx={{ mt: 1, p: 1.5, bgcolor: 'rgba(52, 152, 219, 0.1)', borderRadius: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                            <ArticleIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'text-top' }} />
                            Extracted RCA:
                          </Typography>
                          <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                            {issue.extractedRCA}
                          </Typography>
                        </Box>
                      )}

                      {/* Add Link icon button for mobile/touch devices */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, justifyContent: 'flex-end' }}>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<OpenInNewIcon />}
                          onClick={() => window.open(`https://increff.atlassian.net/browse/${issue.issueKey}`, '_blank')}
                          sx={{ 
                            fontSize: '0.7rem',
                            borderColor: 'rgba(103, 58, 183, 0.3)',
                            color: 'rgb(103, 58, 183)',
                            '&:hover': {
                              borderColor: 'rgba(103, 58, 183, 0.8)',
                              backgroundColor: 'rgba(103, 58, 183, 0.08)'
                            }
                          }}
                        >
                          Open in JIRA
                        </Button>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              )}
              
              {/* Generated RCA Section */}
              {generatedRca && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <AnalyticsIcon sx={{ mr: 1 }} /> Generated Root Cause Analysis
                  </Typography>
                  <Paper 
                    sx={{ 
                      p: 3, 
                      bgcolor: 'rgba(26, 188, 156, 0.08)', 
                      border: '1px solid rgba(26, 188, 156, 0.2)',
                      borderRadius: 1
                    }}
                  >
                    <Typography sx={{ whiteSpace: 'pre-line', lineHeight: 1.7 }}>
                      {generatedRca}
                    </Typography>
                  </Paper>
                </Box>
              )}
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
}
