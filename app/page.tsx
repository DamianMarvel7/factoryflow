export default function HomePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
      <p className="text-gray-600">
        Welcome to <strong>FactoryFlow</strong> — monitor your factory operations in one place.
      </p>

      <div className="grid grid-cols-3 gap-6 mt-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">💰 Bills</h2>
          <p>Track payments, vendors, and due dates.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">📦 Inventory</h2>
          <p>Monitor stock, items, and usage trends.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">🎫 Tickets</h2>
          <p>Manage maintenance and issue tickets.</p>
        </div>
      </div>
    </div>
  );
}
