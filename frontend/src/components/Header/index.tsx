import Logo from '../Logo';
import MobileMenu from '../MobileMenu';
// import Navigation from '../Navigation';
import UserSection from '../UserSection';

const Header = () => {
    return (
        <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Logo />
                    {/* <Navigation /> */}
                    <div className="flex items-center space-x-4">
                        <UserSection />
                        <MobileMenu />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
