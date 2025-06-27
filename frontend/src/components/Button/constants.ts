export const BUTTON_MODES = {
    CONTAINED: 'contained',
    OUTLINED: 'outlined',
    NONE: 'none',
} as const;

export const BUTTON_SIZES = {
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large',
} as const;

export const BUTTON_COLOR_SCHEMES = {
    PRIMARY: 'primary',
    SECONDARY: 'secondary',
    ERROR: 'error',
} as const;

export const BUTTON_DEFAULT_PROPS = {
    MODE: 'contained',
    SIZE: 'medium',
    COLOR_SCHEME: 'primary',
} as const;
