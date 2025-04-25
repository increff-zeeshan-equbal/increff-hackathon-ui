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

export default function HomePage() {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<string[]>([]);
  const hasConversation = conversation.length > 0;
  
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
          {['Recent Chats', 'Saved Conversations', 'Settings'].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton sx={{ 
                borderRadius: 2, 
                my: 0.5,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                },
                transition: 'background-color 0.2s ease'
              }}>
                <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                  {index === 0 ? <ChatIcon /> : index === 1 ? <HistoryIcon /> : <SettingsIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
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
        <ChatContainer hasConversation={hasConversation}>
          {!hasConversation && (
            <>
              <WelcomeText variant="h3" component="h1" gutterBottom>
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
      </Main>
    </Box>
  );
}
