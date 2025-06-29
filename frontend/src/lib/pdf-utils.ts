export function extractPdfTitle(fileName: string): string {
    // Remove file extension and clean up the name
    return fileName
        .replace(/\.[^/.]+$/, '') // Remove extension
        .replace(/[-_]/g, ' ') // Replace hyphens and underscores with spaces
        .replace(/\b\w/g, (l) => l.toUpperCase()); // Capitalize first letter of each word
}

export function validatePdfFile(file: File): boolean {
    // Check if it's a PDF file
    return (
        file.type === 'application/pdf' ||
        file.name.toLowerCase().endsWith('.pdf')
    );
}

export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return (
        Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    );
}

export function createPdfPreviewUrl(file: File): string {
    return URL.createObjectURL(file);
}
