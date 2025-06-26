import Button from './Button';

export const ColorDemo = () => {
    return (
        <div className="p-8 space-y-8">
            <h1 className="text-3xl font-bold mb-8">
                Primary Color Palette Demo
            </h1>

            {/* Primary Color Shades */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Primary Color Shades</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-4">
                    <div className="space-y-2">
                        <div className="h-16 bg-primary-50 rounded-lg border"></div>
                        <p className="text-xs text-center">50</p>
                    </div>
                    <div className="space-y-2">
                        <div className="h-16 bg-primary-100 rounded-lg border"></div>
                        <p className="text-xs text-center">100</p>
                    </div>
                    <div className="space-y-2">
                        <div className="h-16 bg-primary-200 rounded-lg border"></div>
                        <p className="text-xs text-center">200</p>
                    </div>
                    <div className="space-y-2">
                        <div className="h-16 bg-primary-300 rounded-lg border"></div>
                        <p className="text-xs text-center">300</p>
                    </div>
                    <div className="space-y-2">
                        <div className="h-16 bg-primary-400 rounded-lg border"></div>
                        <p className="text-xs text-center">400</p>
                    </div>
                    <div className="space-y-2">
                        <div className="h-16 bg-primary-500 rounded-lg border"></div>
                        <p className="text-xs text-center">500</p>
                    </div>
                    <div className="space-y-2">
                        <div className="h-16 bg-primary-600 rounded-lg border"></div>
                        <p className="text-xs text-center">600</p>
                    </div>
                    <div className="space-y-2">
                        <div className="h-16 bg-primary-700 rounded-lg border"></div>
                        <p className="text-xs text-center">700</p>
                    </div>
                    <div className="space-y-2">
                        <div className="h-16 bg-primary-800 rounded-lg border"></div>
                        <p className="text-xs text-center">800</p>
                    </div>
                    <div className="space-y-2">
                        <div className="h-16 bg-primary-900 rounded-lg border"></div>
                        <p className="text-xs text-center">900</p>
                    </div>
                </div>
            </section>

            {/* Button Examples with Primary */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">
                    Button Examples with Primary Color
                </h2>

                {/* Contained Buttons */}
                <div className="space-y-2">
                    <h3 className="text-lg font-medium">Contained Buttons</h3>
                    <div className="flex flex-wrap gap-4">
                        <Button
                            mode="contained"
                            colorScheme="primary"
                            size="small"
                        >
                            Small Primary
                        </Button>
                        <Button
                            mode="contained"
                            colorScheme="primary"
                            size="medium"
                        >
                            Medium Primary
                        </Button>
                        <Button
                            mode="contained"
                            colorScheme="primary"
                            size="large"
                        >
                            Large Primary
                        </Button>
                    </div>
                </div>

                {/* Outlined Buttons */}
                <div className="space-y-2">
                    <h3 className="text-lg font-medium">Outlined Buttons</h3>
                    <div className="flex flex-wrap gap-4">
                        <Button
                            mode="outlined"
                            colorScheme="primary"
                            size="small"
                        >
                            Small Primary
                        </Button>
                        <Button
                            mode="outlined"
                            colorScheme="primary"
                            size="medium"
                        >
                            Medium Primary
                        </Button>
                        <Button
                            mode="outlined"
                            colorScheme="primary"
                            size="large"
                        >
                            Large Primary
                        </Button>
                    </div>
                </div>

                {/* Text Buttons */}
                <div className="space-y-2">
                    <h3 className="text-lg font-medium">Text Buttons</h3>
                    <div className="flex flex-wrap gap-4">
                        <Button mode="none" colorScheme="primary" size="small">
                            Small Primary
                        </Button>
                        <Button mode="none" colorScheme="primary" size="medium">
                            Medium Primary
                        </Button>
                        <Button mode="none" colorScheme="primary" size="large">
                            Large Primary
                        </Button>
                    </div>
                </div>
            </section>

            {/* Color Usage Examples */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Color Usage Examples</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Background Colors */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">
                            Background Colors
                        </h3>
                        <div className="space-y-2">
                            <div className="p-4 bg-primary-50 rounded-lg">
                                <p className="text-primary-900">
                                    Primary 50 Background
                                </p>
                            </div>
                            <div className="p-4 bg-primary-100 rounded-lg">
                                <p className="text-primary-900">
                                    Primary 100 Background
                                </p>
                            </div>
                            <div className="p-4 bg-primary-500 rounded-lg">
                                <p className="text-primary-50">
                                    Primary 500 Background
                                </p>
                            </div>
                            <div className="p-4 bg-primary-900 rounded-lg">
                                <p className="text-primary-50">
                                    Primary 900 Background
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Text Colors */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Text Colors</h3>
                        <div className="space-y-2">
                            <p className="text-primary-50 bg-gray-900 p-2 rounded">
                                Primary 50 Text
                            </p>
                            <p className="text-primary-100 bg-gray-900 p-2 rounded">
                                Primary 100 Text
                            </p>
                            <p className="text-primary-500 bg-white p-2 rounded border">
                                Primary 500 Text
                            </p>
                            <p className="text-primary-900 bg-white p-2 rounded border">
                                Primary 900 Text
                            </p>
                        </div>
                    </div>

                    {/* Border Colors */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Border Colors</h3>
                        <div className="space-y-2">
                            <div className="p-4 border-2 border-primary-200 rounded-lg">
                                <p>Primary 200 Border</p>
                            </div>
                            <div className="p-4 border-2 border-primary-500 rounded-lg">
                                <p>Primary 500 Border</p>
                            </div>
                            <div className="p-4 border-2 border-primary-800 rounded-lg">
                                <p>Primary 800 Border</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CSS Variables Usage */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">CSS Variables Usage</h2>
                <div className="bg-gray-100 p-6 rounded-lg">
                    <h3 className="text-lg font-medium mb-4">
                        Using CSS Variables
                    </h3>
                    <div className="space-y-2 text-sm">
                        <p>
                            <code>--primary: oklch(0.55 0.15 250)</code> - Main
                            primary color
                        </p>
                        <p>
                            <code>--primary-foreground: oklch(0.98 0 0)</code> -
                            Text on primary
                        </p>
                        <p>
                            <code>--ring: oklch(0.55 0.15 250)</code> - Focus
                            ring color
                        </p>
                    </div>
                    <div className="mt-4 p-4 bg-primary text-primary-foreground rounded">
                        <p>
                            This uses CSS variables:{' '}
                            <code>bg-primary text-primary-foreground</code>
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};
