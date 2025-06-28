import type { UserProfile } from '../mockData';
import { Edit, Save, X, Calendar, Clock } from 'lucide-react';

interface ProfileHeaderProps {
    userProfile: UserProfile;
    isEditing: boolean;
    formatDate: (dateString: string) => string;
    onEdit: () => void;
    onSave: () => void;
    onCancel: () => void;
}

const ProfileHeader = ({
    userProfile,
    isEditing,
    formatDate,
    onEdit,
    onSave,
    onCancel,
}: ProfileHeaderProps) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-6">
                        {/* Avatar */}
                        <div className="relative">
                            <img
                                src={
                                    userProfile.avatar || '/default-avatar.png'
                                }
                                alt={userProfile.fullName}
                                className="w-24 h-24 rounded-full object-cover border-4 border-gray-100"
                            />
                            {isEditing && (
                                <button className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 transition-colors">
                                    <Edit className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* User Info */}
                        <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {userProfile.fullName}
                                </h1>
                                <span className="text-sm text-gray-500">
                                    @{userProfile.username}
                                </span>
                            </div>

                            {userProfile.bio && (
                                <p className="text-gray-600 mb-3 max-w-2xl">
                                    {userProfile.bio}
                                </p>
                            )}

                            <div className="flex items-center space-x-6 text-sm text-gray-500">
                                <div className="flex items-center space-x-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>
                                        Joined{' '}
                                        {formatDate(userProfile.joinDate)}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Clock className="w-4 h-4" />
                                    <span>
                                        Last active{' '}
                                        {formatDate(userProfile.lastActive)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                        {!isEditing ? (
                            <button
                                onClick={onEdit}
                                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 border border-primary-200 rounded-lg hover:bg-primary-100 transition-colors"
                            >
                                <Edit className="w-4 h-4" />
                                <span>Edit Profile</span>
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={onSave}
                                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
                                >
                                    <Save className="w-4 h-4" />
                                    <span>Save</span>
                                </button>
                                <button
                                    onClick={onCancel}
                                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                    <span>Cancel</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Contact Info */}
                <div className="border-t pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <p className="text-gray-900">{userProfile.email}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Username
                            </label>
                            <p className="text-gray-900">
                                @{userProfile.username}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;
