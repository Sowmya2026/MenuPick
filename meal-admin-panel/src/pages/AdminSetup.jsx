import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminSetup = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [registering, setRegistering] = useState(false);
  const [checking, setChecking] = useState(true);
  const [isAlreadyAdmin, setIsAlreadyAdmin] = useState(false);

  useEffect(() => {
    if (authLoading) return; // Wait for auth to settle

    if (!currentUser) {
      navigate('/login');
      return;
    }

    checkIfAlreadyAdmin();
  }, [currentUser, authLoading, navigate]);

  const checkIfAlreadyAdmin = async () => {
    if (!currentUser) return;

    try {
      const adminDocRef = doc(db, 'adminUsers', currentUser.uid);
      const adminDoc = await getDoc(adminDocRef);

      if (adminDoc.exists()) {
        setIsAlreadyAdmin(true);
        toast.success('You are already registered as an admin!');
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
    } finally {
      setChecking(false);
    }
  };

  const handleRegisterAsAdmin = async () => {
    if (!currentUser) {
      toast.error('No user logged in');
      return;
    }

    setRegistering(true);

    try {
      // Create admin user document
      const adminData = {
        uid: currentUser.uid,
        email: currentUser.email,
        name: currentUser.displayName || currentUser.email.split('@')[0],
        role: 'admin',
        createdAt: new Date(),
        permissions: {
          meals: true,
          feedback: true,
          analytics: true,
          users: true
        }
      };

      await setDoc(doc(db, 'adminUsers', currentUser.uid), adminData);

      toast.success('Successfully registered as admin!');
      setTimeout(() => {
        navigate('/dashboard');
        window.location.reload(); // Reload to refresh permissions
      }, 1500);
    } catch (error) {
      console.error('Error registering admin:', error);
      toast.error('Error: ' + error.message);
    } finally {
      setRegistering(false);
    }
  };

  // Show loading spinner if auth is loading or if we are checking admin status (and have a user)
  if (authLoading || (currentUser && checking)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 via-emerald-100 to-lime-100 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Checking admin status...</p>
        </div>
      </div>
    );
  }

  // If we settled and have no currentUser, we return null because useEffect is redirecting
  if (!currentUser) {
    return null;
  }

  if (isAlreadyAdmin) {
    // If somehow land here but already admin, just go to dashboard
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-emerald-100 to-lime-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="bg-yellow-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <AlertCircle className="h-10 w-10 text-yellow-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Setup Required</h1>
          <p className="text-gray-600">Complete the setup to access the admin panel</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-blue-900 mb-3">Why is this needed?</h3>
          <p className="text-sm text-blue-800 mb-3">
            For security, only registered admins can manage meals, view feedback, and access analytics.
          </p>
          <p className="text-sm text-blue-800">
            This one-time setup will register your account as an admin in the database.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Your Account Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium text-gray-900">{currentUser?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">User ID:</span>
              <span className="font-mono text-xs text-gray-900">{currentUser?.uid}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Role:</span>
              <span className="font-medium text-green-600">Admin</span>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-green-900 mb-2">✨ Admin Permissions</h4>
          <ul className="text-sm text-green-800 space-y-1">
            <li>✅ Create, edit, and delete meals</li>
            <li>✅ View and respond to feedback</li>
            <li>✅ Access analytics and reports</li>
            <li>✅ Manage student data</li>
            <li>✅ Export data to Excel</li>
          </ul>
        </div>

        <button
          onClick={handleRegisterAsAdmin}
          disabled={registering}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-wait flex items-center justify-center"
        >
          {registering ? (
            <>
              <Loader className="h-5 w-5 animate-spin mr-2" />
              Registering...
            </>
          ) : (
            'Register as Admin'
          )}
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          By registering, you confirm that you have authorization to access this admin panel.
        </p>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <details className="text-sm">
            <summary className="cursor-pointer text-gray-600 hover:text-gray-900 font-medium">
              🔧 Technical Details
            </summary>
            <div className="mt-3 text-xs text-gray-600 space-y-2">
              <p>This will create a document in the <code className="bg-gray-100 px-1 rounded">adminUsers</code> collection with your UID.</p>
              <p>The Firestore security rules check this collection to verify admin permissions.</p>
              <p className="text-red-600">⚠️ Make sure you've deployed the firestore.rules file to Firebase!</p>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
};

export default AdminSetup;
