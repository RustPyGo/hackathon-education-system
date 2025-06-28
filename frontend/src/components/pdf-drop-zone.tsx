'use client';

import { Button } from '@/components/ui/button';
import {
    FileUpload,
    FileUploadDropzone,
    FileUploadItem,
    FileUploadItemDelete,
    FileUploadItemMetadata,
    FileUploadItemPreview,
    FileUploadList,
    FileUploadTrigger,
} from '@/components/ui/file-upload';
import { Upload, X } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';

// Function để validate file PDF
const validatePdfFile = (file: File): boolean => {
    // Kiểm tra MIME type
    const validMimeTypes = ['application/pdf'];
    if (!validMimeTypes.includes(file.type)) {
        return false;
    }

    // Kiểm tra extension
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.pdf')) {
        return false;
    }

    return true;
};

// Function để filter chỉ file PDF
const filterPdfFiles = (files: FileList | File[]): File[] => {
    const fileArray = Array.from(files);
    return fileArray.filter((file) => {
        const isValid = validatePdfFile(file);
        if (!isValid) {
            toast.error(`File "${file.name}" không phải là file PDF hợp lệ`);
        }
        return isValid;
    });
};

interface PdfDropZoneProps {
    onFileSelect?: (file: File) => void;
    onMultipleFileSelect?: (files: File[]) => void;
    isLoading?: boolean;
    disabled?: boolean;
    compact?: boolean;
}

export function PdfDropZone({
    onFileSelect,
    onMultipleFileSelect,
    isLoading = false,
    disabled = false,
    compact = false,
}: PdfDropZoneProps) {
    const [files, setFiles] = React.useState<File[]>([]);

    const handleValueChange = React.useCallback(
        (newFiles: File[]) => {
            // Filter chỉ file PDF hợp lệ
            const pdfFiles = filterPdfFiles(newFiles);

            // Loại bỏ file trùng (theo tên và size)
            const uniqueFiles = pdfFiles.filter(
                (file) =>
                    !files.some(
                        (f) => f.name === file.name && f.size === file.size
                    )
            );

            if (uniqueFiles.length === 0) {
                toast.info('Gỡ file PDF thành công');
                return;
            }

            const updatedFiles = [...files, ...uniqueFiles].slice(0, 3); // Giới hạn 3 file

            setFiles(updatedFiles);

            // Call the appropriate callback với file PDF đã được filter và loại trùng
            if (updatedFiles.length === 1 && onFileSelect) {
                onFileSelect(updatedFiles[0]);
            } else if (updatedFiles.length > 1 && onMultipleFileSelect) {
                onMultipleFileSelect(updatedFiles);
            } else if (updatedFiles.length > 0 && onMultipleFileSelect) {
                onMultipleFileSelect(updatedFiles);
            }
        },
        [onFileSelect, onMultipleFileSelect, files]
    );

    const onFileReject = React.useCallback((file: File, message: string) => {
        toast.error(message);
    }, []);

    return (
        <FileUpload
            maxFiles={3}
            maxSize={5 * 1024 * 1024}
            className="w-full"
            value={files}
            onValueChange={handleValueChange}
            onFileReject={onFileReject}
            multiple
            disabled={disabled || isLoading}
            accept=".pdf,application/pdf"
        >
            <FileUploadDropzone>
                <div className="flex flex-col items-center justify-center gap-1 text-center w-full">
                    <div className="flex items-center justify-center rounded-full border p-2.5">
                        <Upload className="size-6 text-muted-foreground" />
                    </div>
                    <p className="font-medium text-sm">
                        {compact ? 'Thêm file PDF' : 'Kéo thả file PDF vào đây'}
                    </p>
                    <p className="text-muted-foreground text-xs">
                        {compact
                            ? 'Hoặc click để chọn file PDF'
                            : 'Hoặc click để chọn (tối đa 3 file PDF, mỗi file dưới 5MB)'}
                    </p>
                </div>
                <FileUploadTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 w-fit mx-auto"
                        disabled={disabled || isLoading}
                    >
                        {isLoading ? 'Đang xử lý...' : 'Chọn file PDF'}
                    </Button>
                </FileUploadTrigger>
            </FileUploadDropzone>
            <FileUploadList>
                {files.map((file, index) => (
                    <FileUploadItem key={index} value={file}>
                        <FileUploadItemPreview />
                        <FileUploadItemMetadata />
                        <FileUploadItemDelete asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-7"
                            >
                                <X />
                            </Button>
                        </FileUploadItemDelete>
                    </FileUploadItem>
                ))}
            </FileUploadList>
        </FileUpload>
    );
}
