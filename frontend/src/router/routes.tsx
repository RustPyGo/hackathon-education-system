import MainLayout from '@/layouts/MainLayout';
import FlashCardPage from '@/pages/FLashCardPage';
import HomePage from '@/pages/HomePage';
import ProfilePage from '@/pages/ProfilePage';
import QuizPage from '@/pages/QuizPage';
import ResultPage from '@/pages/ResultPage';
import VideoSummaryPage from '@/pages/VideoSummaryPage';

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
                path: '/quiz',
                element: <QuizPage />,
            },
            {
                path: '/result',
                element: <ResultPage />,
            },
            {
                path: '/profile',
                element: <ProfilePage />,
            },
            {
                path: '/flash-card',
                element: <FlashCardPage />,
            },
            {
                path: '/video-summary',
                element: <VideoSummaryPage />,
            },
        ],
    },
];

export default routes;
