// pages/dashboard.tsx or app/dashboard/page.tsx (if using App Router)

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex bg-[#fff8f4]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#fff1e8] p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#ff7020] mb-10">oneBlok.</h1>
          <nav className="space-y-4">
            <button className="w-full flex items-center gap-3 px-4 py-2 bg-[#ff7020] text-white rounded-md">
                Projects
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2 bg-[#ff7020]/80 text-white rounded-md">
                Marketplace
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2 bg-[#ff7020]/80 text-white rounded-md">
                Community
            </button>
          </nav>
        </div>

        {/* User */}
        <div className="flex items-center justify-between p-2 bg-[#ff7020] text-white rounded-md cursor-pointer">
          <span> John Doe</span>
          <span>back</span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-700">Projects</h2>
            <p className="text-sm text-gray-500">Manage your projects here</p>
          </div>

          {/* Search and Create */}
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search..."
              className="border border-gray-300 px-3 py-1.5 rounded-md text-sm"
            />
            <button className="flex items-center gap-2 px-4 py-2 bg-[#ff7020] text-white rounded-md">
               Create New
            </button>
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="h-40 rounded-md border border-gray-200 bg-[#fff1e8]"
            ></div>
          ))}
        </div>
      </main>
    </div>
  );
}
