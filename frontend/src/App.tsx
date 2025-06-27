import { BrowserRouter } from 'react-router-dom';
import AppRouter from './router/AppRouter';

const App = () => {
    return (
        <div>
            <BrowserRouter>
                <AppRouter />
            </BrowserRouter>
        </div>
    );
};

export default App;
