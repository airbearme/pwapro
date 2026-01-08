"use client";

export default function TestPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Mobile Test Page</h1>
        <p className="text-xl">If you can see this, mobile rendering works!</p>
        <div className="mt-8 p-4 border border-green-500 rounded">
          <p>✅ Page loaded successfully</p>
          <p>✅ CSS is working</p>
          <p>✅ JavaScript is working</p>
        </div>
      </div>
    </div>
  );
}
