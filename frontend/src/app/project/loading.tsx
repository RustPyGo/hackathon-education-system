import { Card, CardContent } from '@/components/ui/card';

export default function Loading() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-12">
                    <div className="mx-auto space-y-3">
                        <div className="mx-auto h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-80 animate-pulse" />
                        <div className="mx-auto h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-48 animate-pulse" />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(6)].map((_, i) => (
                        <Card
                            key={i}
                            className="animate-pulse border-0 shadow-lg overflow-hidden"
                        >
                            <div className="aspect-video bg-gradient-to-r from-gray-200 to-gray-300" />
                            <CardContent className="p-6 space-y-4">
                                <div className="h-5 bg-gray-200 rounded w-3/4" />
                                <div className="h-4 bg-gray-200 rounded w-full" />
                                <div className="h-4 bg-gray-200 rounded w-2/3" />
                                <div className="flex gap-2 pt-2">
                                    <div className="h-6 bg-gray-200 rounded-full w-16" />
                                    <div className="h-6 bg-gray-200 rounded-full w-16" />
                                    <div className="h-6 bg-gray-200 rounded-full w-16" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
