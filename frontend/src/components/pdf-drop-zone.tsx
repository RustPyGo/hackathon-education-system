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

export function PdfDropZone({
    onFilesChange,
}: { onFilesChange?: (files: File[]) => void } = {}) {
    const [files, setFiles] = React.useState<File[]>([]);

    React.useEffect(() => {
        if (onFilesChange) onFilesChange(files);
    }, [files, onFilesChange]);

    const onFileValidate = React.useCallback(
        (file: File): string | null => {
            // Validate max files
            if (files.length >= 3) {
                return 'You can only upload up to 3 files';
            }

            // Validate file type (only PDF)
            if (file.type !== 'application/pdf') {
                return 'Only PDF files are allowed';
            }

            // Validate file size (max 8MB)
            const MAX_SIZE = 8 * 1024 * 1024; // 8MB
            if (file.size > MAX_SIZE) {
                return `File size must be less than ${
                    MAX_SIZE / (1024 * 1024)
                }MB`;
            }

            return null;
        },
        [files]
    );

    const onFileReject = React.useCallback((file: File, message: string) => {
        toast(message, {
            description: `"${
                file.name.length > 20
                    ? `${file.name.slice(0, 20)}...`
                    : file.name
            }" has been rejected`,
        });
    }, []);

    return (
        <FileUpload
            value={files}
            onValueChange={setFiles}
            onFileValidate={onFileValidate}
            onFileReject={onFileReject}
            accept="application/pdf"
            maxFiles={3}
            className="w-full"
            multiple
        >
            <FileUploadDropzone>
                <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center justify-center rounded-full border p-2.5">
                        <Upload className="size-6 text-muted-foreground" />
                    </div>
                    <p className="font-medium text-sm">
                        Drag & drop PDF files here
                    </p>
                    <p className="text-muted-foreground text-xs">
                        Or click to browse (max 3 files, 8MB each)
                    </p>
                </div>
                <FileUploadTrigger asChild>
                    <Button variant="outline" size="sm" className="mt-2 w-fit">
                        Browse files
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
                                onClick={() => {
                                    toast.success(
                                        `"${
                                            file.name.length > 20
                                                ? `${file.name.slice(0, 20)}...`
                                                : file.name
                                        }" has been removed`
                                    );
                                }}
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
