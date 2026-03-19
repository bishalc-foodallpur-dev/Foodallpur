export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      
      {/* Navbar */}
      <nav className="bg-green-600 text-white p-4 flex justify-between">
        <h1 className="text-xl font-bold">FoodAllpur</h1>
        <div>
          <button className="mr-4">Login</button>
          <button className="bg-white text-green-600 px-3 py-1 rounded">
            Signup
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="text-center py-20">
        <h2 className="text-4xl font-bold mb-4">
          Order Food Anytime 
        </h2>
        <p className="text-gray-600 mb-6">
          Fast delivery from your favorite restaurants
        </p>
        <button className="bg-green-600 text-white px-6 py-2 rounded">
          Order Now
        </button>
      </section>

      {/* Food Items */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        {["Pizza", "Burger", "Momo"].map((item, i) => (
          <div key={i} className="bg-white p-4 rounded shadow">
            <h3 className="text-xl font-semibold">{item}</h3>
            <p className="text-gray-500">Delicious {item}</p>
            <button className="mt-3 bg-green-600 text-white px-4 py-1 rounded">
              Order
            </button>
          </div>
        ))}
      </section>

    </main>
  );
}