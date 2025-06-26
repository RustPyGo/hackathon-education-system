# AuthContext

AuthContext là một React Context wrapper cho features/auth, cung cấp interface đơn giản để quản lý authentication trong ứng dụng.

## Tính năng

-   **Tự động kiểm tra authentication**: Khi app load, AuthContext sẽ tự động gọi API để kiểm tra trạng thái đăng nhập
-   **HttpOnly Cookies**: Hoạt động với tokens được lưu trong httpOnly cookies (bảo mật cao)
-   **Error Handling**: Xử lý lỗi tốt hơn với wrapper functions
-   **Loading States**: Quản lý trạng thái loading cho từng action
-   **Type Safety**: TypeScript support đầy đủ

## Cách sử dụng

### 1. Wrap App với AuthProvider

```tsx
import { AuthProvider } from '@/contexts';

function App() {
    return (
        <AuthProvider>
            <YourApp />
        </AuthProvider>
    );
}
```

### 2. Sử dụng useAuthContext hook

```tsx
import { useAuthContext } from '@/contexts';

function MyComponent() {
    const {
        user,
        isAuthenticated,
        isLoading,
        isCheckingAuth,
        error,
        login,
        register,
        logout,
        forgotPassword,
        clearError,
    } = useAuthContext();

    // Kiểm tra trạng thái authentication
    if (isCheckingAuth) {
        return <div>Checking authentication...</div>;
    }

    if (!isAuthenticated) {
        return <LoginForm />;
    }

    return <UserDashboard user={user} />;
}
```

## API Reference

### State Properties

| Property          | Type             | Description                   |
| ----------------- | ---------------- | ----------------------------- |
| `user`            | `User \| null`   | Thông tin user hiện tại       |
| `isAuthenticated` | `boolean`        | Trạng thái đã đăng nhập       |
| `isLoading`       | `boolean`        | Đang thực hiện action         |
| `isCheckingAuth`  | `boolean`        | Đang kiểm tra trạng thái auth |
| `error`           | `string \| null` | Lỗi hiện tại                  |

### Action Methods

| Method           | Parameters                                                   | Returns            | Description                 |
| ---------------- | ------------------------------------------------------------ | ------------------ | --------------------------- |
| `login`          | `(email: string, password: string)`                          | `Promise<boolean>` | Đăng nhập                   |
| `register`       | `(name: string, email: string, password: string)`            | `Promise<boolean>` | Đăng ký                     |
| `logout`         | `()`                                                         | `Promise<void>`    | Đăng xuất                   |
| `forgotPassword` | `(email: string)`                                            | `Promise<boolean>` | Gửi email reset password    |
| `resetPassword`  | `(token: string, password: string, confirmPassword: string)` | `Promise<boolean>` | Reset password              |
| `refreshToken`   | `()`                                                         | `Promise<boolean>` | Refresh access token        |
| `getCurrentUser` | `()`                                                         | `Promise<boolean>` | Lấy thông tin user hiện tại |
| `verifyEmail`    | `(token: string)`                                            | `Promise<boolean>` | Xác thực email              |
| `clearError`     | `()`                                                         | `void`             | Xóa lỗi                     |
| `updateUser`     | `(userData: Partial<User>)`                                  | `void`             | Cập nhật thông tin user     |

## Ví dụ sử dụng

### Login Form

```tsx
function LoginForm() {
    const { login, isLoading, error, clearError } = useAuthContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();

        const success = await login(email, password);
        if (success) {
            console.log('Login successful');
        } else {
            console.log('Login failed');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && <div className="error">{error}</div>}
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
            </button>
        </form>
    );
}
```

### Protected Route

```tsx
function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isCheckingAuth } = useAuthContext();

    if (isCheckingAuth) {
        return <LoadingSpinner />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return <>{children}</>;
}
```

## Lưu ý

1. **HttpOnly Cookies**: AuthContext hoạt động với tokens được lưu trong httpOnly cookies, không cần localStorage
2. **Automatic Auth Check**: Khi app load, AuthContext sẽ tự động kiểm tra trạng thái authentication
3. **Error Handling**: Tất cả actions đều có error handling và trả về boolean để biết thành công hay thất bại
4. **Loading States**: Mỗi action có loading state riêng để UX tốt hơn

## Demo

Xem file `AuthContextDemo.tsx` để có ví dụ đầy đủ về cách sử dụng AuthContext.
