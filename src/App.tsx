import { RouterProvider } from 'react-router-dom';
import router from './router';
import AuthProvider from './contexts/AuthProvider';
import UserDataContextProvider from './contexts/UserDataProvider';
import './App.css';

function App() {
    return (
        <AuthProvider>
            {/*
                Provides auth-related actions and authenticated user state to downstream components
            */}
            <UserDataContextProvider>
                {/*
                    Manages Firestore subscription-based user data for different app modules.
                    Designed to lazily subscribe and unsubscribe based on component usage to limit
                    unnecessary Firestore reads.
                */}
                <RouterProvider router={router} />
            </UserDataContextProvider>
        </AuthProvider>
    );
};

export default App;