import { BrowserRouter } from 'react-router-dom';
import AppRouter from './router/AppRouter';

const App = () => {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center">
            <BrowserRouter>
                <AppRouter />
            </BrowserRouter>
        </div>
    );
};

export default App;
