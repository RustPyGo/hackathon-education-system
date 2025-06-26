# FormField Component

FormField là một component wrapper để tạo các form field với label, error handling và helper text.

## Cách sử dụng

### Basic Usage

```tsx
import { FormField, Input } from '@/components/ui/form';

<FormField label="Email" required>
    <Input type="email" placeholder="Enter your email" />
</FormField>;
```

### Với Error

```tsx
<FormField
    label="Email"
    required
    error="Email is required"
    helperText="We'll never share your email"
>
    <Input type="email" placeholder="Enter your email" />
</FormField>
```

### Với Textarea

```tsx
import { FormField, Textarea } from '@/components/ui/form';

<FormField label="Message" required>
    <Textarea placeholder="Enter your message" rows={4} />
</FormField>;
```

### Với Select

```tsx
import { FormField, Select } from '@/components/ui/form';

const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
];

<FormField label="Category" required>
    <Select options={options} onChange={(value) => console.log(value)} />
</FormField>;
```

## Props

### FormField Props

| Prop         | Type        | Default | Description                               |
| ------------ | ----------- | ------- | ----------------------------------------- |
| `label`      | `string`    | -       | Label hiển thị phía trên field            |
| `error`      | `string`    | -       | Error message hiển thị phía dưới          |
| `required`   | `boolean`   | `false` | Hiển thị dấu \* cho required field        |
| `className`  | `string`    | -       | Custom CSS classes                        |
| `children`   | `ReactNode` | -       | Input component (Input, Textarea, Select) |
| `helperText` | `string`    | -       | Helper text hiển thị phía dưới            |

### Input Props

| Prop      | Type                   | Default     | Description                 |
| --------- | ---------------------- | ----------- | --------------------------- |
| `variant` | `'default' \| 'error'` | `'default'` | Style variant               |
| `...`     | `HTMLInputElement`     | -           | Tất cả props của HTML input |

### Textarea Props

| Prop      | Type                   | Default     | Description                    |
| --------- | ---------------------- | ----------- | ------------------------------ |
| `variant` | `'default' \| 'error'` | `'default'` | Style variant                  |
| `...`     | `HTMLTextAreaElement`  | -           | Tất cả props của HTML textarea |

### Select Props

| Prop       | Type                      | Default     | Description                  |
| ---------- | ------------------------- | ----------- | ---------------------------- |
| `variant`  | `'default' \| 'error'`    | `'default'` | Style variant                |
| `options`  | `SelectOption[]`          | -           | Array of options             |
| `onChange` | `(value: string) => void` | -           | Change handler               |
| `...`      | `HTMLSelectElement`       | -           | Tất cả props của HTML select |

## Demo

Xem file `demo.tsx` để có ví dụ đầy đủ về cách sử dụng FormField với validation.
