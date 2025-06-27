const Navigation = () => {
    return (
        <nav className="hidden md:flex space-x-6">
            <a href="/" className="text-gray-700 hover:text-primary-600">
                Trang chủ
            </a>
            <a
                href="/create-exam"
                className="text-gray-700 hover:text-primary-600"
            >
                Tạo đề mới
            </a>
            <a
                href="/practice"
                className="text-gray-700 hover:text-primary-600"
            >
                Luyệt tập
            </a>
            <a href="/contact" className="text-gray-700 hover:text-primary-600">
                Liên hệ
            </a>
        </nav>
    );
};

export default Navigation;
