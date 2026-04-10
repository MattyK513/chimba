import { RouterProvider } from 'react-router-dom';
import router from './router';
import AuthProvider from './contexts/AuthProvider';
import UserDataContextProvider from './contexts/UserDataProvider';
import './App.css';

function App() {
    return (
        <AuthProvider>
            {/* Exposes the authenticated user and auth actions throughout the app. */}
            <UserDataContextProvider>
                {/* Lazily manages Firestore-backed user data subscriptions for active modules. */}
                <RouterProvider router={router} />
            </UserDataContextProvider>
        </AuthProvider>
    );
};

export default App;
