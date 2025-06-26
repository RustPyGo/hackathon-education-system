// import LoginModal from '@/modals/LoginModal';
import AuthModalDemo from '@/modals/AuthModal/Demo';

const HomePage = () => {
    return (
        <div className="p-8 space-y-8">
            {/* <LoginModal isOpen={true} onClose={() => {}} /> */}
            <AuthModalDemo />
            <h1 className="text-3xl font-bold">HomePage</h1>
        </div>
    );
};

export default HomePage;
