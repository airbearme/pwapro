"use client";

export default function DebugHomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-lime-950 to-amber-950 text-white">
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <h1 className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-emerald-600 via-lime-500 to-amber-500 bg-clip-text text-transparent">
          AirBear Debug Page
        </h1>
        <div className="max-w-2xl text-center space-y-4">
          <p className="text-xl mb-8">✅ Testing with Analytics only</p>
          <div className="border border-emerald-500 rounded-lg p-6 bg-black/20 backdrop-blur-sm">
            <h2 className="text-2xl font-semibold mb-4 text-emerald-400">
              Component Test Status:
            </h2>
            <div className="space-y-2 text-left">
              <p>✅ Layout loads</p>
              <p>✅ Fonts load</p>
              <p>✅ Analytics enabled</p>
              <p>⚠️ Testing components one by one</p>
            </div>
          </div>
          <div className="mt-8 p-4 border border-yellow-500 rounded-lg bg-yellow-500/10">
            <p className="text-yellow-300">
              If this page stays visible, Analytics is not the issue
            </p>
            <p className="text-yellow-300">Next: Add ThemeProvider</p>
          </div>
        </div>
      </div>
    </div>
  );
}
