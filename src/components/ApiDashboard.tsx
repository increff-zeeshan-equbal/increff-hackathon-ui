import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Grid, CircularProgress, 
  Card, CardContent, Chip, Divider, TextField, 
  MenuItem, Button, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, TablePagination,
  IconButton, Collapse, FormControl, InputLabel, Select
} from '@mui/material';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, LineChart, Line, PieChart, Pie, 
  Cell, Legend
} from 'recharts';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import DashboardIcon from '@mui/icons-material/Dashboard';

// Types
interface ApiSummary {
  totalApiCalls: number;
  apiUsageByEndpoint: Record<string, number>;
  avgExecutionTimeByEndpoint: Record<string, number>;
  totalTokensByEndpoint: Record<string, number>;
  totalTokensUsed: number;
  approximateCost: number;
  successRate: number;
}

interface ApiAudit {
  id: string;
  endpoint: string;
  method: string;
  timestamp: string;
  executionTimeMs: number;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  userId: string;
  requestParams: string;
  responseStatus: 'SUCCESS' | 'ERROR' | 'EXCEPTION';
  errorMessage: string | null;
}

interface TokenUsageTrend {
  dailyTokenUsage: Record<string, number>;
}

// Row component for expandable table
function Row(props: { row: ApiAudit }) {
  const { row } = props;
  const [open, setOpen] = useState(false);

  const getOperationFromEndpoint = (endpoint: string): string => {
    const operationMap: Record<string, string> = {
      '/api/tickets/prioritize': 'Prioritize Tickets',
      '/api/tickets/categorize': 'Categorize Tickets',
      '/api/issues/analyze': 'Analyze Issues',
      '/api/issues/summarize': 'Summarize Issues',
      '/api/jira/issues/recent': 'Recent Jira Issues',
      '/api/dashboard/audits': 'Audit Dashboard',
      '/api/dashboard/token-usage-trend': 'Token Usage Trend',
      '/api/jira/issues/{issueKey}/summarize': 'Summarize Jira Issue',
      '/api/freshdesk/tickets/all': 'All Freshdesk Tickets',
      '/api/dashboard/summary': 'Dashboard Summary',
      '/api/user/create': 'Create User',
      '/api/user/delete': 'Delete User',
      '/api/user/update': 'Update User',
      '/api/order/process': 'Process Order',
      '/api/order/cancel': 'Cancel Order',
      // Add more mappings as needed
    };

    return operationMap[endpoint] || 'Unknown Operation';
  };

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            size="small"
            onClick={() => setOpen(!open)}
            sx={{ color: 'primary.main' }}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {getOperationFromEndpoint(row.endpoint)}
        </TableCell>
        <TableCell>{row.method}</TableCell>
        <TableCell>{new Date(row.timestamp).toLocaleString()}</TableCell>
        <TableCell>{row.executionTimeMs}ms</TableCell>
        <TableCell>{row.totalTokens}</TableCell>
        <TableCell>
          <Chip 
            label={row.responseStatus} 
            size="small"
            sx={{
              backgroundColor: 
                row.responseStatus === 'SUCCESS' ? 'rgba(46, 204, 113, 0.15)' : 
                row.responseStatus === 'ERROR' ? 'rgba(231, 76, 60, 0.15)' : 
                'rgba(241, 196, 15, 0.15)',
              color: 'white',
              fontWeight: 500,
            }}
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1, p: 2, backgroundColor: 'rgba(156, 39, 176, 0.08)', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom component="div" sx={{ color: 'primary.main' }}>
                Request Details
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', fontSize: '0.85rem' }}>
                  {row.requestParams}
                </Typography>
              </Box>
              {row.errorMessage && (
                <>
                  <Typography variant="subtitle2" gutterBottom component="div" sx={{ color: 'error.main' }}>
                    Error Message
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'error.main', whiteSpace: 'pre-wrap', fontSize: '0.85rem' }}>
                    {row.errorMessage}
                  </Typography>
                </>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function ApiDashboard() {
  // State
  const [summary, setSummary] = useState<ApiSummary | null>(null);
  const [audits, setAudits] = useState<ApiAudit[]>([]);
  const [tokenTrend, setTokenTrend] = useState<TokenUsageTrend | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Filters
  const [showFilters, setShowFilters] = useState(false);
  const [endpointFilter, setEndpointFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [availableEndpoints, setAvailableEndpoints] = useState<string[]>([]);

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch summary
      const summaryResponse = await fetch('http://localhost:8080/api/dashboard/summary');
      if (!summaryResponse.ok) throw new Error('Failed to fetch summary data');
      const summaryData = await summaryResponse.json();
      setSummary(summaryData);
      
      // Extract available endpoints for filter
      setAvailableEndpoints(Object.keys(summaryData.apiUsageByEndpoint));
      
      // Fetch token trend
      const trendResponse = await fetch('http://localhost:8080/api/dashboard/token-usage-trend');
      if (!trendResponse.ok) throw new Error('Failed to fetch token trend data');
      const trendData = await trendResponse.json();
      setTokenTrend(trendData);
      
      // Fetch audits with filters
      let auditUrl = 'http://localhost:8080/api/dashboard/audits';
      const params = new URLSearchParams();
      
      if (endpointFilter) params.append('endpoint', endpointFilter);
      if (startDate && endDate) {
        const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        params.append('days', daysDiff.toString());
      }
      
      if (params.toString()) auditUrl += `?${params.toString()}`;
      
      const auditResponse = await fetch(auditUrl);
      if (!auditResponse.ok) throw new Error('Failed to fetch audit data');
      const auditData = await auditResponse.json();
      setAudits(auditData);
      
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  // Initial data load
  useEffect(() => {
    fetchData();
  }, []);
  
  // Apply filters
  const handleApplyFilters = () => {
    fetchData();
  };
  
  // Reset filters
  const handleResetFilters = () => {
    setEndpointFilter('');
    setStatusFilter('');
    setStartDate(null);
    setEndDate(null);
    fetchData();
  };
  
  // Handle pagination
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Prepare chart data
  const prepareBarChartData = () => {
    if (!summary) return [];
    return Object.entries(summary.apiUsageByEndpoint).map(([endpoint, count]) => ({
      endpoint: endpoint.split('/').pop() || endpoint,
      count
    }));
  };
  
  const prepareTokenTrendData = () => {
    if (!tokenTrend) return [];
    return Object.entries(tokenTrend.dailyTokenUsage).map(([date, tokens]) => ({
      date,
      tokens
    }));
  };
  
  const prepareExecutionTimeData = () => {
    if (!summary) return [];
    return Object.entries(summary.avgExecutionTimeByEndpoint).map(([endpoint, time]) => ({
      endpoint: endpoint.split('/').pop() || endpoint,
      time
    }));
  };
  
  const prepareStatusDistribution = () => {
    if (!audits.length) return [];
    
    const statusCounts = audits.reduce((acc, audit) => {
      acc[audit.responseStatus] = (acc[audit.responseStatus] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      value: count
    }));
  };
  
  // Status colors for pie chart
  const COLORS = ['#2ecc71', '#e74c3c', '#f1c40f'];
  
  // Loading state
  if (loading && !summary) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress sx={{ color: 'primary.main' }} />
      </Box>
    );
  }
  
  // Error state
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error" variant="h6">
          Error: {error}
        </Typography>
        <Button 
          variant="outlined" 
          onClick={fetchData} 
          startIcon={<RefreshIcon />}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, height: '100%', overflow: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', mb: 4 }}>
        <DashboardIcon sx={{fontSize: 38, 
                mr: 1, 
                background: 'linear-gradient(90deg, #9c27b0, #7e57c2)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 700}} /> 
        
        <Typography variant="h4" sx={{ 
                background: 'linear-gradient(90deg, #9c27b0, #7e57c2)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 700
              }}>
                API Usage Dashboard
              </Typography>
      </Box>
      
      {/* Summary Cards */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 2 }}>
        <Box sx={{ flex: '1 1 22%', maxWidth: '22%', mb: 2, height: 150 }}>
          <Card sx={{ 
            backgroundColor: 'rgba(30, 30, 40, 0.6)', 
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            border: '1px solid rgba(156, 39, 176, 0.2)',
            height: '100%'
          }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                📞 Total API Calls
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Total number of API calls made
              </Typography>
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 600 }}>
                {summary?.totalApiCalls.toLocaleString() || 0}
              </Typography>
            </CardContent>
          </Card>
        </Box>
        
        <Box sx={{ flex: '1 1 22%', maxWidth: '22%', mb: 2, height: 150 }}>
          <Card sx={{ 
            backgroundColor: 'rgba(30, 30, 40, 0.6)', 
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            border: '1px solid rgba(156, 39, 176, 0.2)',
            height: '100%'
          }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                ✅ Success Rate
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Percentage of successful API calls
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Typography variant="h4" sx={{ 
                  fontWeight: 600,
                  color: summary && summary.successRate > 95 ? '#2ecc71' : 
                         summary && summary.successRate > 85 ? '#f1c40f' : '#e74c3c'
                }}>
                  {summary ? `${summary.successRate.toFixed(1)}%` : '0%'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
        
        <Box sx={{ flex: '1 1 22%', maxWidth: '22%', mb: 2, height: 150 }}>
          <Card sx={{ 
            backgroundColor: 'rgba(30, 30, 40, 0.6)', 
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            border: '1px solid rgba(156, 39, 176, 0.2)',
            height: '100%'
          }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                💰 Total Tokens Used
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Total tokens used across all API calls
              </Typography>
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 600 }}>
                {summary?.totalTokensUsed.toLocaleString() || 0}
              </Typography>
            </CardContent>
          </Card>
        </Box>
        
        <Box sx={{ flex: '1 1 22%', maxWidth: '22%', mb: 2, height: 150 }}>
          <Card sx={{ 
            backgroundColor: 'rgba(30, 30, 40, 0.6)', 
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            border: '1px solid rgba(156, 39, 176, 0.2)',
            height: '100%'
          }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                💸 Approximate Cost
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Estimated cost based on token usage
              </Typography>
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 600 }}>
                ${summary?.approximateCost.toFixed(2) || '0.00'}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
      
      {/* Charts */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
        <Box sx={{ flex: '1 1 45%', maxWidth: '45%', mb: 2 }}>
          <Paper sx={{ 
            p: 2, 
            height: 300,
            backgroundColor: 'rgba(30, 30, 40, 0.6)',
            borderRadius: 2,
            border: '1px solid rgba(156, 39, 176, 0.2)',
          }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>📊 API Usage by Endpoint</Typography>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart
                data={prepareBarChartData()}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="endpoint" tick={{ fill: '#aaa' }} />
                <YAxis tick={{ fill: '#aaa' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(30, 30, 40, 0.9)',
                    border: '1px solid rgba(156, 39, 176, 0.3)',
                    borderRadius: '4px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="count" fill="#9c27b0" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Box>
        
        <Box sx={{ flex: '1 1 45%', maxWidth: '45%', mb: 2 }}>
          <Paper sx={{ 
            p: 2, 
            height: 300,
            backgroundColor: 'rgba(30, 30, 40, 0.6)',
            borderRadius: 2,
            border: '1px solid rgba(156, 39, 176, 0.2)',
          }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>🚀 Token Usage Trend</Typography>
            <ResponsiveContainer width="100%" height="85%">
              <LineChart
                data={prepareTokenTrendData()}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" tick={{ fill: '#aaa' }} />
                <YAxis tick={{ fill: '#aaa' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(30, 30, 40, 0.9)',
                    border: '1px solid rgba(156, 39, 176, 0.3)',
                    borderRadius: '4px',
                    color: '#fff'
                  }}
                />
                <Line type="monotone" dataKey="tokens" stroke="#7e57c2" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Box>
        
        <Box sx={{ flex: '1 1 45%', maxWidth: '45%', mb: 2 }}>
          <Paper sx={{ 
            p: 2, 
            height: 300,
            backgroundColor: 'rgba(30, 30, 40, 0.6)',
            borderRadius: 2,
            border: '1px solid rgba(156, 39, 176, 0.2)',
          }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>📈 Response Status Distribution</Typography>
            <ResponsiveContainer width="100%" height="85%">
              <PieChart>
                <Pie
                  data={prepareStatusDistribution()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {prepareStatusDistribution().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(30, 30, 40, 0.9)',
                    border: '1px solid rgba(156, 39, 176, 0.3)',
                    borderRadius: '4px',
                    color: '#fff'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Box>
        
        <Box sx={{ flex: '1 1 45%', maxWidth: '45%', mb: 2 }}>
          <Paper sx={{ 
            p: 2, 
            height: 300,
            backgroundColor: 'rgba(30, 30, 40, 0.6)',
            borderRadius: 2,
            border: '1px solid rgba(156, 39, 176, 0.2)',
          }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>⏱ Average Execution Time (ms)</Typography>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart
                data={prepareExecutionTimeData()}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="endpoint" tick={{ fill: '#aaa' }} />
                <YAxis tick={{ fill: '#aaa' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(30, 30, 40, 0.9)',
                    border: '1px solid rgba(156, 39, 176, 0.3)',
                    borderRadius: '4px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="time" fill="#7e57c2" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Box>
      </Box>
      
      {/* Filters */}
      <Paper sx={{ 
        p: 2, 
        mb: 3,
        backgroundColor: 'rgba(30, 30, 40, 0.6)',
        borderRadius: 2,
        border: '1px solid rgba(156, 39, 176, 0.2)',
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: showFilters ? 2 : 0 }}>
          <Typography variant="subtitle1">
            API Audit Logs
          </Typography>
          <Button 
            startIcon={<FilterListIcon />}
            onClick={() => setShowFilters(!showFilters)}
            sx={{ 
              color: 'primary.main',
            }}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </Box>
        
        {showFilters && (
          <>
            <Divider sx={{ my: 2, backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
              <Box sx={{ flex: '1 1 100%', maxWidth: '100%', mb: 3 }}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel id="endpoint-filter-label">Endpoint</InputLabel>
                  <Select
                    labelId="endpoint-filter-label"
                    value={endpointFilter}
                    onChange={(e) => setEndpointFilter(e.target.value)}
                    label="Endpoint"
                    sx={{
                      backgroundColor: 'rgba(30, 30, 40, 0.6)',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(156, 39, 176, 0.5)',
                      },
                    }}
                  >
                    <MenuItem value="">All Endpoints</MenuItem>
                    {availableEndpoints.map((endpoint) => (
                      <MenuItem key={endpoint} value={endpoint}>{endpoint}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              
              <Box sx={{ flex: '1 1 100%', maxWidth: '100%', mb: 3 }}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel id="status-filter-label">Status</InputLabel>
                  <Select
                    labelId="status-filter-label"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    label="Status"
                    sx={{
                      backgroundColor: 'rgba(30, 30, 40, 0.6)',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(156, 39, 176, 0.5)',
                      },
                    }}
                  >
                    <MenuItem value="">All Statuses</MenuItem>
                    <MenuItem value="SUCCESS">Success</MenuItem>
                    <MenuItem value="ERROR">Error</MenuItem>
                    <MenuItem value="EXCEPTION">Exception</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              
              <Box sx={{ flex: '1 1 100%', maxWidth: '100%', mb: 3 }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                    slotProps={{ 
                      textField: { 
                        size: 'small',
                        fullWidth: true,
                        sx: {
                          backgroundColor: 'rgba(30, 30, 40, 0.6)',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(255, 255, 255, 0.1)',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(255, 255, 255, 0.2)',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(156, 39, 176, 0.5)',
                          },
                        }
                      } 
                    }}
                  />
                </LocalizationProvider>
              </Box>
              
              <Box sx={{ flex: '1 1 100%', maxWidth: '100%', mb: 3 }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={(newValue) => setEndDate(newValue)}
                    slotProps={{ 
                      textField: { 
                        size: 'small',
                        fullWidth: true,
                        sx: {
                          backgroundColor: 'rgba(30, 30, 40, 0.6)',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(255, 255, 255, 0.1)',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(255, 255, 255, 0.2)',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(156, 39, 176, 0.5)',
                          },
                        }
                      } 
                    }}
                  />
                </LocalizationProvider>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button 
                variant="outlined" 
                onClick={handleResetFilters}
                sx={{ 
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'text.secondary',
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)'
                  }
                }}
              >
                Reset
              </Button>
              <Button 
                variant="contained" 
                onClick={handleApplyFilters}
                sx={{ 
                  background: 'linear-gradient(90deg, #9c27b0, #7e57c2)',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #8e24aa, #6a52b3)'
                  }
                }}
              >
                Apply Filters
              </Button>
            </Box>
          </>
        )}
      </Paper>
      
      {/* Data Table */}
      <TableContainer component={Paper} sx={{ 
        backgroundColor: 'rgba(30, 30, 40, 0.6)',
        borderRadius: 2,
        border: '1px solid rgba(156, 39, 176, 0.2)',
      }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width="60px"></TableCell>
              <TableCell>Operation</TableCell>
              <TableCell>Method</TableCell>
              <TableCell>Timestamp</TableCell>
              <TableCell>Execution Time (ms)</TableCell>
              <TableCell>Total Tokens</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {audits
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <Row key={row.id} row={row} />
              ))}
            {audits.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    No audit records found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={audits.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            color: 'text.secondary',
            '& .MuiTablePagination-select': {
              color: 'text.primary'
            }
          }}
        />
      </TableContainer>
    </Box>
  );
} 