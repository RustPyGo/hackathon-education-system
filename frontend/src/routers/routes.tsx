import MainLayout from '@/layouts/MainLayout';
import ColorDemoPage from '@/pages/ColorDemoPage';
import HomePage from '@/pages/HomePage';

const routes = [
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                path: '/',
                element: <HomePage />,
            },
            {
                path: '/color-demo',
                element: <ColorDemoPage />,
            },
        ],
    },
];

export default routes;
