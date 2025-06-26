import React, { useState } from 'react';
import FormField from './index';
import Input from '../Input';
import Textarea from '../Textarea';
import Select from '../Select';
import Button from '../Button';

const FormFieldDemo: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
        category: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Tên là bắt buộc';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email là bắt buộc';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Tin nhắn là bắt buộc';
        }

        if (!formData.category) {
            newErrors.category = 'Danh mục là bắt buộc';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            alert('Form submitted successfully!');
            console.log('Form data:', formData);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                FormField Demo
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Text Input */}
                <FormField
                    label="Tên"
                    required
                    error={errors.name}
                    helperText="Nhập tên đầy đủ của bạn"
                >
                    <Input
                        type="text"
                        placeholder="Nhập tên"
                        value={formData.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleInputChange('name', e.target.value)
                        }
                        variant={errors.name ? 'error' : 'default'}
                    />
                </FormField>

                {/* Email Input */}
                <FormField
                    label="Email"
                    required
                    error={errors.email}
                    helperText="Nhập email hợp lệ"
                >
                    <Input
                        type="email"
                        placeholder="Nhập email"
                        value={formData.email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleInputChange('email', e.target.value)
                        }
                        variant={errors.email ? 'error' : 'default'}
                    />
                </FormField>

                {/* Textarea */}
                <FormField
                    label="Tin nhắn"
                    required
                    error={errors.message}
                    helperText="Nhập tin nhắn của bạn"
                >
                    <Textarea
                        placeholder="Nhập tin nhắn"
                        value={formData.message}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                            handleInputChange('message', e.target.value)
                        }
                        variant={errors.message ? 'error' : 'default'}
                        rows={4}
                    />
                </FormField>

                {/* Select */}
                <FormField
                    label="Danh mục"
                    required
                    error={errors.category}
                    helperText="Chọn danh mục phù hợp"
                >
                    <Select
                        value={formData.category}
                        onChange={(value: string) =>
                            handleInputChange('category', value)
                        }
                        variant={errors.category ? 'error' : 'default'}
                        options={[
                            { value: '', label: 'Chọn danh mục' },
                            { value: 'general', label: 'Tổng quan' },
                            { value: 'support', label: 'Hỗ trợ' },
                            { value: 'feedback', label: 'Phản hồi' },
                            { value: 'other', label: 'Khác' },
                        ]}
                    />
                </FormField>

                {/* Submit Button */}
                <Button
                    type="submit"
                    mode="contained"
                    colorScheme="primary"
                    className="w-full"
                >
                    Gửi
                </Button>
            </form>
        </div>
    );
};

export default FormFieldDemo;
