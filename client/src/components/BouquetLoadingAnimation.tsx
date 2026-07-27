/**
 * Lightweight loading animation for bouquet generation
 * Uses pure CSS animation - no React state updates
 */
export default function BouquetLoadingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-8">
      <div className="text-center">
        <p className="text-lg font-semibold text-gray-800 mb-2">AI ქმნის თქვენს თაიგულს...</p>
        <p className="text-sm text-gray-600">ოდნახ მოითმინეთ</p>
      </div>

      {/* Animated bouquet flowers */}
      <div className="relative w-24 h-32 flex items-center justify-center">
        {/* Flower 1 */}
        <div
          className="absolute text-4xl"
          style={{
            animation: 'float 3s ease-in-out infinite',
            animationDelay: '0s',
          }}
        >
          🌹
        </div>

        {/* Flower 2 */}
        <div
          className="absolute text-4xl"
          style={{
            animation: 'float 3s ease-in-out infinite',
            animationDelay: '0.5s',
          }}
        >
          🌷
        </div>

        {/* Flower 3 */}
        <div
          className="absolute text-4xl"
          style={{
            animation: 'float 3s ease-in-out infinite',
            animationDelay: '1s',
          }}
        >
          🌸
        </div>

        {/* Flower 4 */}
        <div
          className="absolute text-4xl"
          style={{
            animation: 'float 3s ease-in-out infinite',
            animationDelay: '1.5s',
          }}
        >
          🌼
        </div>
      </div>

      {/* Loading dots */}
      <div className="flex gap-1">
        <div
          className="w-2 h-2 bg-orange-600 rounded-full"
          style={{
            animation: 'pulse 1.5s ease-in-out infinite',
            animationDelay: '0s',
          }}
        />
        <div
          className="w-2 h-2 bg-orange-600 rounded-full"
          style={{
            animation: 'pulse 1.5s ease-in-out infinite',
            animationDelay: '0.3s',
          }}
        />
        <div
          className="w-2 h-2 bg-orange-600 rounded-full"
          style={{
            animation: 'pulse 1.5s ease-in-out infinite',
            animationDelay: '0.6s',
          }}
        />
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.7;
          }
          25% {
            transform: translateY(-15px) translateX(-20px);
            opacity: 1;
          }
          50% {
            transform: translateY(-30px) translateX(0px);
            opacity: 0.7;
          }
          75% {
            transform: translateY(-15px) translateX(20px);
            opacity: 1;
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  );
}
