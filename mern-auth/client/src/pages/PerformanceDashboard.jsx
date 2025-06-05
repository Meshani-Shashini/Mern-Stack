import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
    Card,
    CardContent,
    Typography,
    Grid,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';

const PerformanceDashboard = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [performanceData, setPerformanceData] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

    useEffect(() => {
        fetchPerformanceData();
    }, [selectedMonth, selectedYear]);

    const fetchPerformanceData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `/api/performance/employee/${user.employeeID}`,
                {
                    params: {
                        month: selectedMonth,
                        year: selectedYear
                    }
                }
            );
            setPerformanceData(response.data.data);
        } catch (error) {
            console.error('Error fetching performance data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h4" gutterBottom>
                        Performance Dashboard
                    </Typography>
                </Grid>

                {/* Month and Year Selection */}
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                        <InputLabel>Month</InputLabel>
                        <Select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                        >
                            {months.map((month, index) => (
                                <MenuItem key={month} value={index + 1}>
                                    {month}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                        <InputLabel>Year</InputLabel>
                        <Select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                        >
                            {years.map((year) => (
                                <MenuItem key={year} value={year}>
                                    {year}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                {/* Performance Summary Cards */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Monthly Progress
                            </Typography>
                            <Typography variant="h4">
                                {performanceData?.monthlyProgress.toFixed(1)}%
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Total Points
                            </Typography>
                            <Typography variant="h4">
                                {performanceData?.totalPoints}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Target Points
                            </Typography>
                            <Typography variant="h4">
                                24,000
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Daily Performance Table */}
                <Grid item xs={12}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell align="right">Daily Points</TableCell>
                                    <TableCell align="right">Daily Target</TableCell>
                                    <TableCell align="right">Daily Progress</TableCell>
                                    <TableCell align="right">Ratio</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {performanceData?.performances.map((performance) => (
                                    <TableRow key={performance._id}>
                                        <TableCell>
                                            {new Date(performance.date).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell align="right">
                                            {performance.dailyPoints}
                                        </TableCell>
                                        <TableCell align="right">
                                            {performance.dailyTarget.toFixed(0)}
                                        </TableCell>
                                        <TableCell align="right">
                                            {performance.dailyProgress.toFixed(1)}%
                                        </TableCell>
                                        <TableCell align="right">
                                            {performance.ratio.toFixed(1)}%
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </div>
    );
};

export default PerformanceDashboard; 