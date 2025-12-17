import { useState, useEffect } from "react";
import {
    Users,
    UserCheck,
    Calendar,
    TrendingUp,
    Search,
    Filter,
    Download,
    MoreVertical,
    Circle,
    X,
    Mail,
    Clock,
    Zap
} from "lucide-react";
import { db } from "../firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { motion } from "framer-motion";

// --- Simple Chart Components (Reused/Adapted) ---

const LineChartCallback = ({ data, color = "#10B981" }) => {
    if (!data || data.length === 0) return null;

    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    const range = maxValue - minValue || 1;

    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - ((d.value - minValue) / range) * 100; // Normalize to 0-100
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="h-64 w-full">
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                {/* Grid Lines */}
                {[0, 25, 50, 75, 100].map(y => (
                    <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#e5e7eb" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
                ))}

                {/* Line */}
                <polyline
                    points={points}
                    fill="none"
                    stroke={color}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                />

                {/* Area under line (optional, for gradient effect) */}
                <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>
                <polygon
                    points={`0,100 ${points} 100,100`}
                    fill="url(#chartGradient)"
                />

                {/* Points */}
                {data.map((d, i) => {
                    const x = (i / (data.length - 1)) * 100;
                    const y = 100 - ((d.value - minValue) / range) * 100;
                    return (
                        <circle
                            key={i}
                            cx={x}
                            cy={y}
                            r="4"
                            fill="white"
                            stroke={color}
                            strokeWidth="2"
                            vectorEffect="non-scaling-stroke"
                            className="hover:scale-150 transition-transform cursor-pointer"
                        >
                            <title>{`${d.label}: ${d.value}`}</title>
                        </circle>
                    );
                })}
            </svg>
            {/* X-Axis Labels */}
            <div className="flex justify-between mt-4 text-xs text-gray-400 font-medium">
                {data.map((d, i) => (
                    <span key={i}>{d.label}</span>
                ))}
            </div>
        </div>
    );
};

const UserActives = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalRegistered: 0,
        currentRegisteredActive: 0,
        dailyActive: 0,
        monthlyActive: 0,
        newUsersToday: 0,
        totalInstalls: 0,
        currentGuestActive: 0,
        dailyGuestActive: 0,
        monthlyGuestActive: 0
    });
    const [selectedUser, setSelectedUser] = useState(null);

    // Mock Data for Charts (Needs backend history to be real, keeping mock for UI demo)
    const activityData = [
        { label: "Mon", value: 145 },
        { label: "Tue", value: 230 },
        { label: "Wed", value: 198 },
        { label: "Thu", value: 310 },
        { label: "Fri", value: 280 },
        { label: "Sat", value: 240 },
        { label: "Sun", value: 180 },
    ];

    const monthlyTrendData = [
        { label: "Week 1", value: 1400 },
        { label: "Week 2", value: 1650 },
        { label: "Week 3", value: 1550 },
        { label: "Week 4", value: 1890 },
    ];

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const querySnapshot = await getDocs(collection(db, "users"));

            // Fetch system stats for installs
            let installCount = 0;
            try {
                const statsSnap = await getDoc(doc(db, "stats", "system"));
                if (statsSnap.exists()) {
                    installCount = statsSnap.data().totalInstalls || 0;
                }
            } catch (err) {
                console.error("Error fetching stats:", err);
            }

            // Fetch Guest Sessions
            let currentGuestCount = 0;
            let dailyGuestCount = 0;
            let monthlyGuestCount = 0;
            try {
                const guestSnapshot = await getDocs(collection(db, "guest_sessions"));
                const now = new Date();
                const fifteenMinutesAgo = new Date(now.getTime() - (15 * 60 * 1000));
                const oneDayAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
                const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));

                guestSnapshot.forEach(doc => {
                    const data = doc.data();
                    if (data.lastActive) {
                        const lastActiveDate = data.lastActive.toDate ? data.lastActive.toDate() : new Date(data.lastActive);
                        if (lastActiveDate > fifteenMinutesAgo) currentGuestCount++;
                        if (lastActiveDate > oneDayAgo) dailyGuestCount++;
                        if (lastActiveDate > thirtyDaysAgo) monthlyGuestCount++;
                    }
                });
            } catch (err) {
                console.error("Error fetching guest stats:", err);
            }

            const userList = [];
            let studentCount = 0;
            let currentRegisteredCount = 0;
            let dailyActiveCount = 0;
            let monthlyActiveCount = 0;
            let newUsersCount = 0;

            const now = new Date();
            const fifteenMinutesAgo = new Date(now.getTime() - (15 * 60 * 1000));
            const oneDayAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
            const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
            const startOfToday = new Date();
            startOfToday.setHours(0, 0, 0, 0);

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                // Assuming we only care about students or general users
                if (data.role === 'student' || !data.role) {
                    studentCount++;

                    let lastActiveDate = null;
                    let lastActiveString = "Never";
                    let status = "Offline";

                    // Check real lastActive timestamp
                    if (data.lastActive) {
                        // Handle Firestore Timestamp or Date string
                        lastActiveDate = data.lastActive.toDate ? data.lastActive.toDate() : new Date(data.lastActive);

                        if (!isNaN(lastActiveDate.getTime())) {
                            lastActiveString = lastActiveDate.toLocaleString();

                            // Check Current Active
                            if (lastActiveDate > fifteenMinutesAgo) {
                                currentRegisteredCount++;
                                status = "Online";
                            }

                            // Check Daily Active
                            if (lastActiveDate > oneDayAgo) {
                                dailyActiveCount++;
                                if (status !== "Online") status = "Active";
                            }

                            // Check Monthly Active
                            if (lastActiveDate > thirtyDaysAgo) {
                                monthlyActiveCount++;
                            }
                        }
                    }

                    // Check New Users (created/registered today)
                    if (data.createdAt) {
                        const createdDate = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
                        if (!isNaN(createdDate.getTime()) && createdDate >= startOfToday) {
                            newUsersCount++;
                        }
                    }

                    userList.push({
                        id: doc.id,
                        name: data.displayName || data.name || "Unknown User",
                        email: data.email,
                        role: data.role || "Student",
                        status: status,
                        lastActive: lastActiveString,
                        lastActiveDate: lastActiveDate, // for sorting
                        avatar: data.photoURL
                    });
                }
            });

            // Sort users by last active descending
            userList.sort((a, b) => {
                const dateA = a.lastActiveDate || new Date(0);
                const dateB = b.lastActiveDate || new Date(0);
                return dateB - dateA; // Descending
            });

            setUsers(userList);

            setStats({
                totalRegistered: studentCount,
                currentRegisteredActive: currentRegisteredCount,
                dailyActive: dailyActiveCount,
                monthlyActive: monthlyActiveCount,
                newUsersToday: newUsersCount,
                totalInstalls: installCount,
                currentGuestActive: currentGuestCount,
                dailyGuestActive: dailyGuestCount,
                monthlyGuestActive: monthlyGuestCount
            });

        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        if (status === 'Online') return 'bg-green-100 text-green-700 border-green-200';
        return status === 'Active'
            ? 'bg-blue-100 text-blue-700 border-blue-200'
            : 'bg-gray-100 text-gray-700 border-gray-200';
    };

    return (
        <div className="p-6 space-y-6 bg-gradient-to-br from-green-100 via-emerald-100 to-lime-100 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-green-900">User Activities</h1>
                    <p className="text-green-700 text-sm">Monitor user engagement and active sessions</p>
                </div>
                <button
                    onClick={fetchUsers}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                >
                    <span className="animate-spin-slow" hidden={!loading}>↻</span> Refresh Data
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                <StatsCard
                    title="Current Active Accts"
                    value={stats.currentRegisteredActive}
                    icon={Zap}
                    color="green"
                    trend="Live"
                />
                <StatsCard
                    title="Daily Active Users"
                    value={stats.dailyActive}
                    icon={UserCheck}
                    color="green"
                    trend="+5.2%"
                />
                <StatsCard
                    title="Monthly Active Users"
                    value={stats.monthlyActive}
                    icon={Calendar}
                    color="purple"
                    trend="+2.1%"
                />
                <StatsCard
                    title="Total Registered"
                    value={stats.totalRegistered}
                    icon={Users}
                    color="blue"
                    trend="+12%"
                />

                <StatsCard
                    title="Current Active Guests"
                    value={stats.currentGuestActive}
                    icon={Zap}
                    color="orange"
                    trend="Live"
                />
                <StatsCard
                    title="Daily Active Guests"
                    value={stats.dailyGuestActive}
                    icon={UserCheck}
                    color="orange"
                    trend="Active"
                />
                <StatsCard
                    title="Monthly Active Guests"
                    value={stats.monthlyGuestActive}
                    icon={Calendar}
                    color="purple"
                    trend="Active"
                />
                <StatsCard
                    title="New Users Today"
                    value={stats.newUsersToday}
                    icon={TrendingUp}
                    color="orange"
                    trend="+8%"
                />

                <StatsCard
                    title="Total App Installs"
                    value={stats.totalInstalls}
                    icon={Download}
                    color="blue"
                    trend="Lifetime"
                    className="col-span-2 lg:col-span-1"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily Activity Trend */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-gray-900">Weekly User Activity</h3>
                        <select className="text-xs bg-gray-50 border border-gray-200 rounded-md px-2 py-1 outline-none">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                    </div>
                    <LineChartCallback data={activityData} color="#10B981" />
                </div>

                {/* Monthly Trend */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-gray-900">Monthly Engagement</h3>
                        <button className="text-gray-400 hover:text-gray-600">
                            <Download size={18} />
                        </button>
                    </div>
                    <LineChartCallback data={monthlyTrendData} color="#8B5CF6" />
                </div>
            </div>

            {/* Detailed User Table - Desktop */}
            <div className="hidden md:block bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h3 className="font-bold text-gray-900">Active Users List</h3>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-500/50 w-full sm:w-64"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Active</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">Loading users...</td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">No users found.</td>
                                </tr>
                            ) : (
                                users.slice(0, 10).map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-xs uppercase">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                                    <p className="text-xs text-gray-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-md border border-gray-200">
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Online' ? 'bg-green-500' : user.status === 'Active' ? 'bg-blue-500' : 'bg-gray-400'}`} />
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {user.lastActive}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => setSelectedUser(user)}
                                                className="text-gray-400 hover:text-gray-600"
                                            >
                                                <MoreVertical size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {!loading && users.length > 10 && (
                    <div className="p-4 bg-white border-t border-gray-200 text-center">
                        <button className="text-sm text-green-600 font-medium hover:text-green-700">View All Users</button>
                    </div>
                )}
            </div>

            {/* Mobile User Cards */}
            <div className="md:hidden space-y-4">
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-500/50 w-full"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-500">
                        Loading users...
                    </div>
                ) : users.length === 0 ? (
                    <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-500">
                        No users found.
                    </div>
                ) : (
                    users.slice(0, 10).map((user) => (
                        <motion.div
                            key={user.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                            onClick={() => setSelectedUser(user)}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3 flex-1">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm uppercase flex-shrink-0">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                    </div>
                                </div>
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.status)} flex-shrink-0`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Online' ? 'bg-green-500' : user.status === 'Active' ? 'bg-blue-500' : 'bg-gray-400'}`} />
                                    {user.status}
                                </span>
                            </div>

                            <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded-md border border-gray-200">
                                    {user.role}
                                </span>
                                <span className="text-gray-500 flex items-center gap-1">
                                    <Clock size={12} />
                                    {user.lastActive}
                                </span>
                            </div>
                        </motion.div>
                    ))
                )}

                {!loading && users.length > 10 && (
                    <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
                        <button className="text-sm text-green-600 font-medium hover:text-green-700">View All Users</button>
                    </div>
                )}
            </div>

            {/* User Detail Modal */}
            {selectedUser && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedUser(null)}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-t-2xl">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-2xl uppercase border-2 border-white/30">
                                        {selectedUser.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{selectedUser.name}</h3>
                                        <p className="text-green-100 text-sm">{selectedUser.role}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedUser(null)}
                                    className="text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-4">
                            {/* Status */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <span className="text-sm font-medium text-gray-700">Status</span>
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(selectedUser.status)}`}>
                                    <div className={`w-2 h-2 rounded-full ${selectedUser.status === 'Online' ? 'bg-green-500' : selectedUser.status === 'Active' ? 'bg-blue-500' : 'bg-gray-400'}`} />
                                    {selectedUser.status}
                                </span>
                            </div>

                            {/* Email */}
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <div className="flex items-center gap-2 text-gray-500 mb-1">
                                    <Mail size={16} />
                                    <span className="text-xs font-medium uppercase tracking-wider">Email</span>
                                </div>
                                <p className="text-sm font-medium text-gray-900">{selectedUser.email}</p>
                            </div>

                            {/* Last Active */}
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <div className="flex items-center gap-2 text-gray-500 mb-1">
                                    <Clock size={16} />
                                    <span className="text-xs font-medium uppercase tracking-wider">Last Active</span>
                                </div>
                                <p className="text-sm font-medium text-gray-900">{selectedUser.lastActive}</p>
                            </div>

                            {/* Actions */}
                            <div className="pt-4 space-y-2">
                                <button className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors">
                                    Send Message
                                </button>
                                <button className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors">
                                    View Activity Log
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

// Helper Sub-component for Stats
const StatsCard = ({ title, value, icon: Icon, color, trend, className = "" }) => {
    const colors = {
        blue: { bg: 'bg-blue-50', text: 'text-blue-600', iconBg: 'bg-blue-100' },
        green: { bg: 'bg-green-50', text: 'text-green-600', iconBg: 'bg-green-100' },
        purple: { bg: 'bg-purple-50', text: 'text-purple-600', iconBg: 'bg-purple-100' },
        orange: { bg: 'bg-orange-50', text: 'text-orange-600', iconBg: 'bg-orange-100' },
    };

    const activeColor = colors[color] || colors.blue;

    return (
        <div className={`bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow ${className}`}>
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${activeColor.iconBg} ${activeColor.text}`}>
                    <Icon size={24} />
                </div>
                <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    <TrendingUp size={12} /> {trend}
                </span>
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            </div>
        </div>
    );
};

export default UserActives;
