import React from 'react';
import { Card, CardContent } from './ui/card';

const KeyBoardShortCut = () => {
    return (
        <Card className="bg-gray-50">
            <CardContent className="p-4">
                <h4 className="font-medium text-gray-900 mb-2">
                    Keyboard Shortcuts
                </h4>
                <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                        <kbd className="px-2 py-1 bg-white rounded border text-xs">
                            Space
                        </kbd>
                        <span className="ml-2">Flip card</span>
                    </div>
                    <div>
                        <kbd className="px-2 py-1 bg-white rounded border text-xs">
                            ←
                        </kbd>
                        <span className="ml-2">Previous</span>
                    </div>
                    <div>
                        <kbd className="px-2 py-1 bg-white rounded border text-xs">
                            →
                        </kbd>
                        <span className="ml-2">Next</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default KeyBoardShortCut;
