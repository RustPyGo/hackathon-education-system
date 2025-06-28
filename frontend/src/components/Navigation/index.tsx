const Navigation = () => {
    return (
        <nav className="hidden md:flex space-x-6">
            <a href="/" className="text-gray-700 hover:text-primary-600">
                Trang chủ
            </a>
            <a href="/quiz" className="text-gray-700 hover:text-primary-600">
                Quiz
            </a>
            <a
                href="/flash-card"
                className="text-gray-700 hover:text-primary-600"
            >
                Flash Card
            </a>
            <a
                href="/video-summary"
                className="text-gray-700 hover:text-primary-600"
            >
                Video Summary
            </a>
            <a href="/profile" className="text-gray-700 hover:text-primary-600">
                Profile
            </a>
        </nav>
    );
};

export default Navigation;
