import React from 'react';
import Button from './index.tsx';

const ButtonDemo = () => {
    return (
        <div className="p-8 space-y-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
                Button Component Demo
            </h1>

            {/* Modes */}
            <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Modes
                </h2>
                <div className="flex flex-wrap gap-4">
                    <Button mode="contained" colorScheme="primary">
                        Contained Primary
                    </Button>
                    <Button mode="outlined" colorScheme="primary">
                        Outlined Primary
                    </Button>
                    <Button mode="none" colorScheme="primary">
                        None Primary
                    </Button>
                </div>
            </section>

            {/* Sizes */}
            <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Sizes
                </h2>
                <div className="flex flex-wrap items-center gap-4">
                    <Button size="small" mode="contained" colorScheme="primary">
                        Small
                    </Button>
                    <Button
                        size="medium"
                        mode="contained"
                        colorScheme="primary"
                    >
                        Medium
                    </Button>
                    <Button size="large" mode="contained" colorScheme="primary">
                        Large
                    </Button>
                </div>
            </section>

            {/* Color Schemes */}
            <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Color Schemes
                </h2>
                <div className="space-y-4">
                    <div className="flex flex-wrap gap-4">
                        <Button mode="contained" colorScheme="primary">
                            Primary
                        </Button>
                        <Button mode="contained" colorScheme="secondary">
                            Secondary
                        </Button>
                        <Button mode="contained" colorScheme="error">
                            Error
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <Button mode="outlined" colorScheme="primary">
                            Primary
                        </Button>
                        <Button mode="outlined" colorScheme="secondary">
                            Secondary
                        </Button>
                        <Button mode="outlined" colorScheme="error">
                            Error
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <Button mode="none" colorScheme="primary">
                            Primary
                        </Button>
                        <Button mode="none" colorScheme="secondary">
                            Secondary
                        </Button>
                        <Button mode="none" colorScheme="error">
                            Error
                        </Button>
                    </div>
                </div>
            </section>

            {/* States */}
            <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    States
                </h2>
                <div className="flex flex-wrap gap-4">
                    <Button mode="contained" colorScheme="primary">
                        Normal
                    </Button>
                    <Button mode="contained" colorScheme="primary" disabled>
                        Disabled
                    </Button>
                    <Button mode="contained" colorScheme="primary">
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                        </svg>
                        With Icon
                    </Button>
                </div>
            </section>

            {/* Interactive Demo */}
            <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Interactive Demo
                </h2>
                <div className="flex flex-wrap gap-4">
                    <Button
                        mode="contained"
                        colorScheme="primary"
                        onClick={() => alert('Primary button clicked!')}
                    >
                        Click Me
                    </Button>
                    <Button
                        mode="outlined"
                        colorScheme="secondary"
                        onClick={() => alert('Secondary button clicked!')}
                    >
                        Click Me Too
                    </Button>
                </div>
            </section>
        </div>
    );
};

export default ButtonDemo;
