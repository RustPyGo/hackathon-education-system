import { useState } from 'react';
import { Menu } from 'lucide-react';

const MobileMenu = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="md:hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-700 hover:text-primary-600 flex items-center justify-center cursor-pointer"
            >
                <Menu className="w-6 h-6" />
            </button>

            {isOpen && (
                <div className="absolute top-16 left-0 right-0 bg-white shadow-lg p-4">
                    <nav className="flex flex-col space-y-4">
                        <a
                            href="/"
                            className="text-gray-700 hover:text-primary-600"
                        >
                            Home
                        </a>
                        <a
                            href="/courses"
                            className="text-gray-700 hover:text-primary-600"
                        >
                            Courses
                        </a>
                        <a
                            href="/about"
                            className="text-gray-700 hover:text-primary-600"
                        >
                            About
                        </a>
                        <a
                            href="/contact"
                            className="text-gray-700 hover:text-primary-600"
                        >
                            Contact
                        </a>
                    </nav>
                </div>
            )}
        </div>
    );
};

export default MobileMenu;
