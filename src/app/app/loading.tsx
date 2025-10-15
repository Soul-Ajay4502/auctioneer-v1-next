// app/loading.tsx
export default function Loading() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
                {/* Spinner */}
                <div className="relative">
                    <div className="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin border-t-blue-600"></div>
                    <div className="absolute inset-0 w-12 h-12 border-4 border-transparent rounded-full animate-ping border-t-blue-400 opacity-20"></div>
                </div>

                {/* Loading text */}
                <div className="text-center">
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">Loading</h2>
                    <p className="text-sm text-gray-500">Please wait while we prepare your content</p>
                </div>

                {/* Progress dots */}
                <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
            </div>
        </div>
    )
}
