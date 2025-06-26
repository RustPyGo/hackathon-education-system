import AppRouter from './routers/AppRouter';
import { BrowserRouter } from 'react-router-dom';
import Modal from 'react-modal';
import { AuthProvider } from '@/contexts';
import { Provider } from 'react-redux';
import store from '@/app/store';

Modal.setAppElement('#root');

const App = () => {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <AuthProvider>
                    <AppRouter />
                </AuthProvider>
            </BrowserRouter>
        </Provider>
    );
};

export default App;
