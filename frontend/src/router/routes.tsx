import DemoPage from '@/pages/DemoPage';
import MainLayout from '@/layouts/MainLayout';

const routes = [
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                path: '/',
                element: <DemoPage />,
            },
        ],
    },
];

export default routes;
