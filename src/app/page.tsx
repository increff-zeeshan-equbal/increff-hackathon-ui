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

        {activeTab === 'settings' && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Typography variant="h5" color="text.secondary">Settings Panel</Typography>
          </Box>
        )}
      </Main>
    </Box>
  );
}
