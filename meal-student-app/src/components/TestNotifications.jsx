// components/TestNotifications.js
import { useState, useEffect } from "react";
import { useNotification } from "../context/NotificationContext";
import { useAuth } from "../context/AuthContext";
import { 
  Bell, 
  TestTube, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Play, 
  Square, // Changed from Stop to Square
  Clock,
  Zap,
  Settings
} from "lucide-react";

const TestNotifications = () => {
  const { 
    currentUser 
  } = useAuth();
  const {
    activeNotifications,
    clearNotification,
    clearAllNotifications,
    showNotification,
    currentNotification,
    hasPermission,
    permissionStatus,
    fcmToken,
    requestNotificationPermission,
    togglePushNotifications,
    checkPermissionStatus
  } = useNotification();

  const [testResults, setTestResults] = useState([]);
  const [isTesting, setIsTesting] = useState(false);
  const [isIntervalRunning, setIsIntervalRunning] = useState(false);
  const [intervalCounter, setIntervalCounter] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [intervalSettings, setIntervalSettings] = useState({
    enabled: false,
    duration: 60000, // 1 minute in milliseconds
    maxNotifications: 10,
    currentCount: 0
  });

  // Add global functions to window for console access
  useEffect(() => {
    // Test notification function
    window.testNotification = () => {
      triggerTestNotification("console");
    };

    // Start interval function
    window.startTestInterval = (customDuration = 60000) => {
      startIntervalNotifications(customDuration);
    };

    // Stop interval function
    window.stopTestInterval = () => {
      stopIntervalNotifications();
    };

    // Cleanup on unmount
    return () => {
      stopIntervalNotifications();
      delete window.testNotification;
      delete window.startTestInterval;
      delete window.stopTestInterval;
    };
  }, []);

  const addTestResult = (testName, status, message) => {
    setTestResults(prev => [...prev, {
      id: Date.now(),
      name: testName,
      status, // 'success', 'warning', 'error'
      message,
      timestamp: new Date()
    }]);
  };

  // Start 1-minute interval notifications
  const startIntervalNotifications = (customDuration = 60000) => {
    if (isIntervalRunning) {
      addTestResult(
        "Interval Test",
        "warning",
        "Interval notifications are already running"
      );
      return;
    }

    stopIntervalNotifications(); // Clear any existing interval

    const duration = customDuration;
    let counter = 1;

    addTestResult(
      "Interval Test",
      "success",
      `Starting automated notifications every ${duration/1000} seconds`
    );

    const id = setInterval(() => {
      const testNotification = {
        id: Date.now(),
        type: "interval_test",
        subType: "auto", 
        title: `🔄 Automated Test #${counter}`,
        message: `This is automated test notification #${counter}. Time: ${new Date().toLocaleTimeString()}`,
        timestamp: new Date(),
        data: { 
          test: true, 
          counter, 
          interval: duration,
          source: "auto_interval",
          totalDuration: `${(duration * counter) / 1000} seconds elapsed`
        },
        isPush: false,
        colorTheme: {
          border: "border-orange-200",
          gradient: "from-orange-500 to-orange-600",
          text: "text-orange-600"
        },
        messType: "veg",
        timing: `Auto: ${duration/1000}s interval`
      };

      // Trigger the notification
      const event = new CustomEvent('test-notification', { 
        detail: testNotification 
      });
      window.dispatchEvent(event);

      // Update state
      setIntervalCounter(counter);
      setIntervalSettings(prev => ({
        ...prev,
        currentCount: counter
      }));

      console.log(`✅ Auto-test #${counter} sent at ${new Date().toLocaleTimeString()}`);
      
      // Stop after max notifications if set
      if (intervalSettings.maxNotifications > 0 && counter >= intervalSettings.maxNotifications) {
        stopIntervalNotifications();
        addTestResult(
          "Interval Test",
          "success",
          `Completed ${counter} automated notifications`
        );
        return;
      }

      counter++;
    }, duration);

    setIntervalId(id);
    setIsIntervalRunning(true);
    setIntervalSettings(prev => ({
      ...prev,
      enabled: true,
      duration: duration
    }));

    addTestResult(
      "Interval Test",
      "success",
      `Interval notifications started (${duration/1000}s)`
    );
  };

  // Stop interval notifications
  const stopIntervalNotifications = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setIsIntervalRunning(false);
    setIntervalCounter(0);
    setIntervalSettings(prev => ({
      ...prev,
      enabled: false,
      currentCount: 0
    }));

    addTestResult(
      "Interval Test",
      "info",
      "Interval notifications stopped"
    );
  };

  // Trigger single test notification
  const triggerTestNotification = (source = "manual") => {
    try {
      if (permissionStatus === "granted") {
        const testNotification = {
          id: Date.now(),
          type: "manual_test",
          subType: source, 
          title: source === "console" ? "🎉 Console Test" : "🧪 Manual Test",
          message: source === "console" 
            ? "This is a test notification triggered from browser console!" 
            : "This is a manual test notification from the test suite!",
          timestamp: new Date(),
          data: { 
            test: true, 
            source: source,
            user: currentUser?.email 
          },
          isPush: false,
          colorTheme: {
            border: "border-blue-200",
            gradient: "from-blue-500 to-blue-600",
            text: "text-blue-600"
          },
          messType: "veg",
          timing: "Now"
        };

        // Trigger the notification
        const event = new CustomEvent('test-notification', { 
          detail: testNotification 
        });
        window.dispatchEvent(event);

        addTestResult(
          "Manual Test",
          "success",
          `Test notification triggered (${source})`
        );

        return true;
      } else {
        addTestResult(
          "Manual Test",
          "warning",
          "Cannot test notifications without permission"
        );
        return false;
      }
    } catch (error) {
      addTestResult(
        "Manual Test",
        "error",
        `Failed to trigger notification: ${error.message}`
      );
      return false;
    }
  };

  const runAllTests = async () => {
    setIsTesting(true);
    setTestResults([]);
    
    // Test 1: Browser Support
    await testBrowserSupport();
    
    // Test 2: Permission Status
    await testPermissionStatus();
    
    // Test 3: FCM Token
    await testFCMToken();
    
    // Test 4: Manual Notification
    await testManualNotification();
    
    // Test 5: Service Worker
    await testServiceWorker();

    // Test 6: Interval Notification (quick test)
    await testIntervalFunctionality();
    
    setIsTesting(false);
  };

  const testBrowserSupport = async () => {
    if ("Notification" in window) {
      addTestResult(
        "Browser Support",
        "success",
        "Browser supports notifications API"
      );
    } else {
      addTestResult(
        "Browser Support",
        "error",
        "Browser does not support notifications API"
      );
    }
  };

  const testPermissionStatus = async () => {
    const status = checkPermissionStatus();
    addTestResult(
      "Permission Status",
      status === "granted" ? "success" : status === "denied" ? "error" : "warning",
      `Notification permission: ${status}`
    );
  };

  const testFCMToken = async () => {
    if (fcmToken) {
      addTestResult(
        "FCM Token",
        "success",
        `Token generated: ${fcmToken.substring(0, 20)}...`
      );
    } else {
      addTestResult(
        "FCM Token",
        "warning",
        "No FCM token found. Request permission first."
      );
    }
  };

  const testManualNotification = async () => {
    const success = triggerTestNotification("auto_test");
    if (success) {
      addTestResult(
        "Manual Notification",
        "success",
        "Test notification triggered successfully"
      );
    }
  };

  const testServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          addTestResult(
            "Service Worker",
            "success",
            "Service Worker is registered and active"
          );
        } else {
          addTestResult(
            "Service Worker",
            "warning",
            "No Service Worker registered"
          );
        }
      } catch (error) {
        addTestResult(
          "Service Worker",
          "error",
          `Service Worker error: ${error.message}`
        );
      }
    } else {
      addTestResult(
        "Service Worker",
        "error",
        "Service Workers not supported in this browser"
      );
    }
  };

  const testIntervalFunctionality = async () => {
    // Test a quick interval (5 seconds) to verify functionality
    const quickTestId = setTimeout(() => {
      const quickNotification = {
        id: Date.now(),
        type: "quick_test",
        subType: "quick_interval", 
        title: "⚡ Quick Interval Test",
        message: "This verifies interval functionality works!",
        timestamp: new Date(),
        isPush: false,
        colorTheme: {
          border: "border-green-200",
          gradient: "from-green-500 to-green-600",
          text: "text-green-600"
        },
        messType: "veg",
        timing: "Quick test"
      };

      const event = new CustomEvent('test-notification', { 
        detail: quickNotification 
      });
      window.dispatchEvent(event);

      addTestResult(
        "Interval Test",
        "success",
        "Quick interval test completed successfully"
      );
    }, 5000);

    addTestResult(
      "Interval Test",
      "info",
      "Quick interval test started (5 seconds)"
    );

    // Cleanup
    return () => clearTimeout(quickTestId);
  };

  const requestPermissionTest = async () => {
    try {
      const result = await requestNotificationPermission();
      addTestResult(
        "Permission Request",
        result === "permission_denied" ? "error" : "success",
        `Permission request result: ${result}`
      );
    } catch (error) {
      addTestResult(
        "Permission Request",
        "error",
        `Permission request failed: ${error.message}`
      );
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return <CheckCircle size={16} />;
      case 'warning': return <AlertTriangle size={16} />;
      case 'error': return <XCircle size={16} />;
      case 'info': return <Bell size={16} />;
      default: return <Bell size={16} />;
    }
  };

  // Quick interval controls
  const quickIntervals = [
    { label: "10 seconds", value: 10000 },
    { label: "30 seconds", value: 30000 },
    { label: "1 minute", value: 60000 },
    { label: "2 minutes", value: 120000 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <TestTube size={32} className="text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">
              Notification Test Suite
            </h1>
          </div>
          <p className="text-gray-600">
            Test and debug your push notification system with automated intervals
          </p>
        </div>

        {/* Interval Status */}
        {isIntervalRunning && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Zap size={20} className="text-orange-600 mr-2" />
                <span className="font-semibold text-orange-800">
                  Automated Tests Running
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-orange-700">
                  Count: <strong>{intervalCounter}</strong>
                </span>
                <span className="text-orange-700">
                  Interval: <strong>{intervalSettings.duration/1000}s</strong>
                </span>
                <button
                  onClick={stopIntervalNotifications}
                  className="bg-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-orange-700 transition-colors"
                >
                  Stop
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow border">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Permission</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                permissionStatus === 'granted' 
                  ? 'bg-green-100 text-green-800'
                  : permissionStatus === 'denied'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {permissionStatus}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow border">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">FCM Token</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                fcmToken ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {fcmToken ? 'Present' : 'Missing'}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow border">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Active Notifs</span>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {activeNotifications.length}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow border">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Auto Tests</span>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                {intervalCounter}
              </span>
            </div>
          </div>
        </div>

        {/* Test Controls */}
        <div className="bg-white rounded-lg p-6 shadow border mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Test Controls
          </h2>
          
          {/* Main Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <button
              onClick={runAllTests}
              disabled={isTesting}
              className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isTesting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
              ) : (
                <Play size={16} className="mr-2" />
              )}
              Run All Tests
            </button>

            <button
              onClick={() => triggerTestNotification("manual")}
              disabled={permissionStatus !== 'granted'}
              className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              <Bell size={16} className="mr-2" />
              Test Single Notification
            </button>

            <button
              onClick={requestPermissionTest}
              disabled={permissionStatus === 'granted'}
              className="flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              <CheckCircle size={16} className="mr-2" />
              Request Permission
            </button>
          </div>

          {/* Interval Controls */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Clock size={18} className="mr-2" />
              Automated Interval Testing
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {quickIntervals.map((interval) => (
                <button
                  key={interval.value}
                  onClick={() => startIntervalNotifications(interval.value)}
                  disabled={isIntervalRunning}
                  className="flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors text-sm"
                >
                  <Zap size={14} className="mr-2" />
                  {interval.label}
                </button>
              ))}
            </div>

            {isIntervalRunning && (
              <div className="flex items-center justify-center">
                <button
                  onClick={stopIntervalNotifications}
                  className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Square size={16} className="mr-2" /> {/* Changed from Stop to Square */}
                  Stop Automated Tests
                </button>
              </div>
            )}
          </div>

          {/* Console Commands Info */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Settings size={18} className="mr-2" />
              Console Commands
            </h3>
            <div className="bg-gray-800 text-green-400 p-4 rounded-lg font-mono text-sm">
              <div className="mb-2">
                <span className="text-gray-400">// Single test notification</span><br/>
                <span>testNotification()</span>
              </div>
              <div className="mb-2">
                <span className="text-gray-400">// Start 1-minute intervals</span><br/>
                <span>startTestInterval(60000)</span>
              </div>
              <div>
                <span className="text-gray-400">// Stop intervals</span><br/>
                <span>stopTestInterval()</span>
              </div>
            </div>
          </div>
        </div>

        {/* Test Results */}
        <div className="bg-white rounded-lg p-6 shadow border mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Test Results</h2>
            {testResults.length > 0 && (
              <button
                onClick={() => setTestResults([])}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Clear Results
              </button>
            )}
          </div>

          {testResults.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <TestTube size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No test results yet. Run tests to see results.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {testResults.map((result) => (
                <div
                  key={result.id}
                  className={`flex items-start p-4 rounded-lg border ${getStatusColor(result.status)}`}
                >
                  <div className="flex-shrink-0 mt-0.5 mr-3">
                    {getStatusIcon(result.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm">{result.name}</h3>
                      <span className="text-xs text-gray-500">
                        {result.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm mt-1">{result.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Notifications */}
        <div className="bg-white rounded-lg p-6 shadow border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Active Notifications ({activeNotifications.length})
            </h2>
            {activeNotifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Clear All
              </button>
            )}
          </div>

          {activeNotifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No active notifications</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {activeNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-sm text-gray-900">
                        {notification.title}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {new Date(notification.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Type: {notification.type}</span>
                      <span>Push: {notification.isPush ? 'Yes' : 'No'}</span>
                      <span>Source: {notification.data?.source || 'manual'}</span>
                      {notification.data?.counter && (
                        <span>#: {notification.data.counter}</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => clearNotification(notification.id)}
                    className="ml-4 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <XCircle size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestNotifications;