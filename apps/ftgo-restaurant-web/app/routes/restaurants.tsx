import { useState } from "react";
import { useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Route } from "./+types/restaurants";
import { restaurants } from "@ftgo/util";
import { useAuth } from "../lib/auth-context";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Select Restaurant - FTGO Restaurant" },
    { name: "description", content: "Select or create a restaurant" },
  ];
}

export default function Restaurants() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [menuItems, setMenuItems] = useState([{ id: "", name: "", price: "" }]);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, logout } = useAuth();

  const restaurantsQuery = useQuery({
    queryKey: ["restaurants"],
    queryFn: restaurants.list,
  });

  const createRestaurantMutation = useMutation({
    mutationFn: restaurants.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
      navigate(`/restaurants/${data.id}`);
    },
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validMenuItems = menuItems.filter(
      item => item.id && item.name && item.price
    );

    if (validMenuItems.length === 0) {
      alert("Please add at least one menu item");
      return;
    }

    createRestaurantMutation.mutate({
      name,
      address,
      menu_items: validMenuItems,
    });
  };

  const addMenuItem = () => {
    setMenuItems([...menuItems, { id: "", name: "", price: "" }]);
  };

  const updateMenuItem = (index: number, field: string, value: string) => {
    const updated = [...menuItems];
    updated[index] = { ...updated[index], [field]: value };
    setMenuItems(updated);
  };

  const removeMenuItem = (index: number) => {
    setMenuItems(menuItems.filter((_, i) => i !== index));
  };

  if (restaurantsQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading restaurants...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-semibold">FTGO Restaurant</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {user?.username}</span>
              <button
                onClick={logout}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Restaurants</h2>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              {showCreateForm ? "Cancel" : "Create Restaurant"}
            </button>
          </div>

          {showCreateForm && (
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Restaurant</h3>
              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Restaurant Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Menu Items
                  </label>
                  {menuItems.map((item, index) => (
                    <div key={index} className="flex space-x-2 mb-2">
                      <input
                        type="text"
                        placeholder="Item ID"
                        className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={item.id}
                        onChange={(e) => updateMenuItem(index, "id", e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Item Name"
                        className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={item.name}
                        onChange={(e) => updateMenuItem(index, "name", e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Price"
                        className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={item.price}
                        onChange={(e) => updateMenuItem(index, "price", e.target.value)}
                      />
                      {menuItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMenuItem(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addMenuItem}
                    className="text-indigo-600 hover:text-indigo-800 text-sm"
                  >
                    Add Menu Item
                  </button>
                </div>
                {createRestaurantMutation.error && (
                  <div className="text-red-600 text-sm">
                    Error: {createRestaurantMutation.error.message}
                  </div>
                )}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={createRestaurantMutation.isPending}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                  >
                    {createRestaurantMutation.isPending ? "Creating..." : "Create Restaurant"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {restaurantsQuery.error && (
            <div className="text-red-600 text-sm mb-4">
              Error loading restaurants: {restaurantsQuery.error.message}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {restaurantsQuery.data?.restaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/restaurants/${restaurant.id}`)}
              >
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900">{restaurant.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{restaurant.address}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {restaurant.menu_items.length} menu items
                  </p>
                </div>
              </div>
            ))}
          </div>

          {restaurantsQuery.data?.restaurants.length === 0 && !showCreateForm && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900">No restaurants yet</h3>
              <p className="text-sm text-gray-500 mt-1">
                Create your first restaurant to get started.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}