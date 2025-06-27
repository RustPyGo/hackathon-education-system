Hãy tạo code theo cấu trúc chuẩn sau:

📁 COMPONENTS:

-   Tất cả component nằm trong thư mục `components/`.
-   Mỗi component là một thư mục riêng, viết hoa chữ cái đầu (PascalCase).
-   Trong thư mục mỗi component có file chính `index.tsx`.
-   Các component con cũng nằm cùng cấp trong `components/`, không được lồng thư mục.
-   Component phức tạp có thể đi kèm thêm các file: `constants.ts`, `types.ts`, `helpers.ts`, `configs.ts`.

📁 HOOKS:

-   Tất cả custom hooks nằm trong thư mục `hooks/`, không chia theo tính năng.
-   Mỗi hook là một file `.ts` hoặc folder riêng nếu phức tạp.
-   Đặt tên file theo chuẩn `useXyz.ts`.

📁 PAGES:

-   Thư mục `pages/` chứa các màn hình chính (pages) của ứng dụng.
-   Mỗi page là một thư mục riêng, viết hoa chữ cái đầu, có `index.tsx` làm entry.
-   Không viết logic UI trực tiếp trong `pages/` — sử dụng component từ `components/`.

📁 MODALS:

-   Tất cả các modal đặt trong thư mục `modals/`.
-   Mỗi modal là một thư mục riêng, có `index.tsx` là file chính.
-   Có thể chia nhỏ nếu phức tạp bằng các file phụ tương tự như component.

📁 LAYOUTS:

-   Thư mục `layouts/` chứa các layout chính của ứng dụng (VD: `MainLayout`, `AuthLayout`,…).
-   Mỗi layout là một thư mục riêng, có `index.tsx` là entry chính.
-   Layout cũng được tổ chức như components (có thể có constants, helpers, types…).
-   Layout có thể wrap children, inject context hoặc chứa header/sidebar/navigation.

📁 CONTEXT:

-   Tất cả các React context đặt trong thư mục `context/`.
-   Mỗi context là một thư mục riêng, tên PascalCase (VD: `AuthContext`).
-   Mỗi context folder chứa các file:
    -   `index.tsx` hoặc `AuthProvider.tsx`: code tạo context + provider.
    -   `types.ts`: các kiểu dữ liệu liên quan.
    -   `useAuth.ts`: custom hook nếu cần sử dụng context tiện lợi.
-   Không đặt logic context trong component hay layout, phải tách ra.

📁 features/

-   Chứa các logic state liên quan đến Redux Toolkit.
-   Mỗi feature là 1 thư mục snake_case theo tính năng (VD: `auth`, `user_profile`...).
-   Mỗi thư mục feature có thể bao gồm:
    -   `slice.ts` – định nghĩa Redux slice
    -   `thunks.ts` – chứa async thunk (nếu có)
    -   `types.ts` – định nghĩa types
    -   `selectors.ts` – các selector (nếu có)
    -   `service.ts` – các hàm gọi API (nếu cần)
    -   `index.ts` – export mọi thứ ra ngoài cho dễ import
-   Không viết logic redux bên ngoài `features/`.

📁 store/

-   Chứa file cấu hình store `store.ts` và middleware nếu có.
-   Có thể có file `rootReducer.ts` nếu dùng combineReducer thủ công.

📁 utils/

-   Chứa các hàm helper không phụ thuộc UI (validate, format, math...).

📁 assets/

-   Chứa hình ảnh, icon, fonts, v.v.

📁 constants/

-   Các hằng số toàn cục dùng xuyên suốt app.

📁 types/

-   Định nghĩa các types toàn cục nếu không thuộc feature nào.

📁 CÁC QUY TẮC CHUNG:

-   Không tạo thư mục lồng nhau trong `components/`, `modals/`, `pages/`, `layouts/`, `hooks/`.
-   Ưu tiên **tái sử dụng** và **chia nhỏ hợp lý**.
-   Sử dụng `import` rõ ràng, theo alias (nếu có, ví dụ: `@/components/Button`).
-   Đặt tên rõ nghĩa, viết hoa chữ cái đầu cho thư mục chính (PascalCase).
