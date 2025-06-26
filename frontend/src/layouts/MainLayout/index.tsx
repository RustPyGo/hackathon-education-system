import { Outlet } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { AuthModal, useAuthModal } from '@/modals';

const MainLayout = () => {
    const { isOpen, closeModal } = useAuthModal();

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="flex-1">
                <Outlet />
            </main>

            {/* AuthModal - Available throughout the app */}
            <AuthModal
                isOpen={isOpen}
                onClose={closeModal}
                defaultTab="login"
            />
        </div>
    );
};

export default MainLayout;
