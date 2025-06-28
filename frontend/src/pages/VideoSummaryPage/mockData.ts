export interface VideoData {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    duration: string;
    channel: string;
    views: string;
    publishedAt: string;
    transcript: string;
}

export interface ChatMessage {
    id: string;
    type: 'user' | 'ai';
    content: string;
    timestamp: Date;
}

export const mockVideoData: VideoData = {
    id: 'dQw4w9WgXcQ',
    title: 'Machine Learning Tutorial for Beginners - 2023',
    description:
        'A comprehensive introduction to machine learning concepts, algorithms, and practical applications for beginners.',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    duration: '15:30',
    channel: 'Tech Academy',
    views: '1.2M',
    publishedAt: '2023-10-15',
    transcript: `Hello everyone, welcome to this comprehensive machine learning tutorial. Today we'll be covering the fundamentals of ML, including supervised learning, unsupervised learning, and neural networks.

Let's start with supervised learning. This is where we have labeled data and we train our model to make predictions. Common algorithms include linear regression, logistic regression, and support vector machines.

Next, we'll explore unsupervised learning. Here, we don't have labels, so the algorithm finds patterns on its own. Clustering and dimensionality reduction are key techniques.

Finally, we'll dive into neural networks and deep learning. These are powerful models that can learn complex patterns in data. We'll cover feedforward networks, backpropagation, and convolutional neural networks.

Remember, practice is key in machine learning. Try implementing these concepts on real datasets to solidify your understanding.`,
};

export const mockSummary = `Video này cung cấp một hướng dẫn toàn diện về Machine Learning cho người mới bắt đầu. Nội dung chính bao gồm:

**1. Supervised Learning (Học có giám sát)**
- Sử dụng dữ liệu có nhãn để huấn luyện mô hình
- Các thuật toán phổ biến: Linear Regression, Logistic Regression, Support Vector Machines
- Mục đích: Dự đoán kết quả dựa trên dữ liệu đầu vào

**2. Unsupervised Learning (Học không giám sát)**
- Không cần dữ liệu có nhãn
- Thuật toán tự tìm ra các mẫu trong dữ liệu
- Kỹ thuật chính: Clustering và Dimensionality Reduction

**3. Neural Networks & Deep Learning**
- Mô hình mạnh mẽ có thể học các mẫu phức tạp
- Bao gồm: Feedforward Networks, Backpropagation, Convolutional Neural Networks
- Ứng dụng rộng rãi trong computer vision, NLP, và nhiều lĩnh vực khác

**Điểm quan trọng:** Thực hành là chìa khóa để thành thạo Machine Learning. Nên áp dụng các khái niệm này trên các bộ dữ liệu thực tế.`;

export const mockChatMessages: ChatMessage[] = [
    {
        id: '1',
        type: 'ai',
        content:
            'Xin chào! Tôi đã sẵn sàng để trả lời các câu hỏi về nội dung video Machine Learning này. Bạn có thể hỏi bất kỳ điều gì!',
        timestamp: new Date(),
    },
];
