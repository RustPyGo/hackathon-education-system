import Button from '../Button';
import { LogIn, UserPlus } from 'lucide-react';

const UserSection = () => {
    return (
        <div className="flex items-center space-x-4">
            <Button mode="none" colorScheme="primary" size="medium">
                <LogIn className="w-4 h-4" />
                Đăng nhập
            </Button>
            <Button mode="contained" colorScheme="primary" size="medium">
                <UserPlus className="w-4 h-4" />
                Đăng ký
            </Button>
        </div>
    );
};

export default UserSection;
