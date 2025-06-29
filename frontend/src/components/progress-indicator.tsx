import { Progress } from '@/components/ui/progress';

interface ProgressIndicatorProps {
    steps: string[];
    currentStep: number;
    className?: string;
}

export default function ProgressIndicator({
    steps,
    currentStep,
    className = '',
}: ProgressIndicatorProps) {
    const progress = ((currentStep + 1) / steps.length) * 100;

    return (
        <div className={`space-y-4 ${className}`}>
            <div className="flex justify-between text-sm text-gray-600">
                <span>
                    Step {currentStep + 1} of {steps.length}
                </span>
                <span>{Math.round(progress)}% complete</span>
            </div>

            <Progress value={progress} className="h-2" />

            <div className="space-y-2">
                {steps.map((step, index) => (
                    <div
                        key={index}
                        className={`flex items-center gap-3 text-sm ${
                            index < currentStep
                                ? 'text-green-600'
                                : index === currentStep
                                ? 'text-blue-600 font-medium'
                                : 'text-gray-400'
                        }`}
                    >
                        <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                                index < currentStep
                                    ? 'bg-green-100 text-green-600'
                                    : index === currentStep
                                    ? 'bg-blue-100 text-blue-600'
                                    : 'bg-gray-100 text-gray-400'
                            }`}
                        >
                            {index < currentStep ? '✓' : index + 1}
                        </div>
                        <span>{step}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
