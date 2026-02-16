import { RouterProvider } from 'react-router-dom';
import router from './router';
import AuthProvider from './contexts/AuthProvider';
import UserDataContextProvider from './contexts/UserDataProvider';
import './App.css';

function App() {
    return (
        <AuthProvider>
            <UserDataContextProvider>
                <RouterProvider router={router} />
            </UserDataContextProvider>
        </AuthProvider>
    );
};

export default App;