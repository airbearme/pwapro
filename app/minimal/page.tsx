export default function MinimalHomePage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold mb-4 text-green-400">
          ✅ Mobile Test Page
        </h1>
        <p className="text-xl mb-4">
          If you can see this, the issue is in components
        </p>
        <div className="border border-green-500 rounded p-4">
          <p>✅ HTML loads</p>
          <p>✅ CSS works</p>
          <p>✅ React renders</p>
          <p>✅ No JavaScript errors</p>
        </div>
      </div>
    </div>
  );
}
