import React, { useState, useEffect } from 'react';
import { User, LogOut, Users, FileImage, CalendarCheck, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
    const [currentDate, setCurrentDate] = useState('');
    const [greeting, setGreeting] = useState('Good Morning');
    const [dashboardData, setDashboardData] = useState({
        totalStudents: 0,
        totalSheetsProcessed: 0,
        latestSheetDate: null,
        presentLatest: 0,
        absentLatest: 0,
        latestAttendancePercentage: 0,
        weeklyAverage: []
    });
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_BACKEND_URL + '/api';

    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            const formattedDate = now.toLocaleDateString('en-US', {
                day: 'numeric', month: 'long', year: 'numeric', weekday: 'long'
            });
            const time = now.toLocaleTimeString('en-US', {
                hour: '2-digit', minute: '2-digit', hour12: true
            });
            setCurrentDate(`${formattedDate} - ${time}`);

            const hour = now.getHours();
            if (hour < 12) setGreeting('Good Morning');
            else if (hour < 18) setGreeting('Good Afternoon');
            else setGreeting('Good Evening');
        };

        updateDateTime();
        const interval = setInterval(updateDateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                toast.error('Please login first');
                navigate('/');
                return;
            }

            const res = await axios.get(`${API_URL}/dashboard/summary`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setDashboardData(res.data);
        } catch (error) {
            console.error('Fetch dashboard data error:', error);
            if (error.response?.status === 401 || error.response?.status === 403) {
                toast.error('Session expired. Please login again');
                setTimeout(() => navigate('/'), 2000);
            } else {
                toast.error('Could not load dashboard data');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to log out?')) {
            localStorage.removeItem('authToken');
            toast.success('Logged out successfully');
            navigate('/');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 p-4 md:p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
                    Student Attendance Dashboard
                </h1>

                <div className="flex items-center gap-4">
                    <span className="text-sm md:text-base text-slate-600">{currentDate}</span>
                    <button className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <User className="w-6 h-6 text-slate-700" />
                    </button>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors shadow-md flex items-center gap-2"
                    >
                        <LogOut className="w-4 h-4" />
                        Log out
                    </button>
                </div>
            </div>

            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-blue-800 to-blue-900 rounded-2xl p-8 md:p-12 mb-8 relative overflow-hidden shadow-xl">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">{greeting}</h2>
                <p className="text-blue-100 text-lg">
                    Latest processed sheet: {dashboardData.latestSheetDate || 'No sheets uploaded yet'}
                </p>
            </div>

            {/* Summary Cards */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Attendance Overview</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                        <Users className="w-12 h-12 text-white opacity-80 mb-3" />
                        <h3 className="text-lg font-semibold mb-1 text-white opacity-90">Total Students</h3>
                        <p className="text-4xl font-bold text-white">{dashboardData.totalStudents}</p>
                    </div>

                    <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                        <FileImage className="w-12 h-12 text-white opacity-80 mb-3" />
                        <h3 className="text-lg font-semibold mb-1 text-white opacity-90">Sheets Processed</h3>
                        <p className="text-4xl font-bold text-white">{dashboardData.totalSheetsProcessed}</p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                        <TrendingUp className="w-12 h-12 text-white opacity-80 mb-3" />
                        <h3 className="text-lg font-semibold mb-1 text-white opacity-90">Latest Attendance %</h3>
                        <p className="text-4xl font-bold text-white">{dashboardData.latestAttendancePercentage}%</p>
                    </div>

                    <div className="bg-gradient-to-br from-red-400 to-red-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                        <CalendarCheck className="w-12 h-12 text-white opacity-80 mb-3" />
                        <h3 className="text-lg font-semibold mb-1 text-white opacity-90">Latest Sheet</h3>
                        <p className="text-2xl font-bold text-white">
                            {dashboardData.presentLatest} present, {dashboardData.absentLatest} absent
                        </p>
                    </div>
                </div>
            </div>

            {/* Weekly Average Attendance Chart */}
            <div className="mb-8 bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Weekly Average Attendance</h2>
                {dashboardData.weeklyAverage.length === 0 ? (
                    <p className="text-slate-500">No attendance data yet — upload a signing sheet to get started.</p>
                ) : (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={dashboardData.weeklyAverage}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="week" />
                            <YAxis domain={[0, 100]} unit="%" />
                            <Tooltip formatter={(value) => [`${value}%`, 'Avg Attendance']} />
                            <Bar dataKey="averageAttendance" fill="#2563eb" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <button
                        className="bg-slate-300 hover:bg-slate-400 text-slate-800 text-xl font-bold py-8 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
                        onClick={() => navigate('/upload-sheet')}
                    >
                        <FileImage className="w-8 h-8 mx-auto mb-2" />
                        Upload Sheet
                    </button>

                    <button
                        className="bg-slate-300 hover:bg-slate-400 text-slate-800 text-xl font-bold py-8 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
                        onClick={() => navigate('/students')}
                    >
                        <Users className="w-8 h-8 mx-auto mb-2" />
                        All Students
                    </button>

                    <button
                        className="bg-slate-300 hover:bg-slate-400 text-slate-800 text-xl font-bold py-8 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
                        onClick={() => navigate('/attendance-report')}
                    >
                        <CalendarCheck className="w-8 h-8 mx-auto mb-2" />
                        Attendance Report
                    </button>

                    <button
                        className="bg-slate-300 hover:bg-slate-400 text-slate-800 text-xl font-bold py-8 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
                        onClick={() => navigate('/investigate')}
                    >
                        <TrendingUp className="w-8 h-8 mx-auto mb-2" />
                        Investigate Signature
                    </button>
                </div>
            </div>
        </div>
    );
}