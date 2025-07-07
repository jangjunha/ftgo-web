import { useState } from "react";
import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Route } from "./+types/create";
import { restaurants } from "@ftgo/util";
import { Button } from "@ftgo/ui";
import { RestaurantLayout } from "../../components/RestaurantLayout";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Create Restaurant - FTGO Restaurant" },
    { name: "description", content: "Create a new restaurant" },
  ];
}

export default function CreateRestaurant() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [menuItems, setMenuItems] = useState([{ id: "", name: "", price: "" }]);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createRestaurantMutation = useMutation({
    mutationFn: restaurants.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
      navigate(`/restaurants/${data.id}`);
    },
  });

  const updateMenuItem = (index: number, field: string, value: string) => {
    const updated = [...menuItems];
    updated[index] = { ...updated[index], [field]: value };
    setMenuItems(updated);
  };

  const removeMenuItem = (index: number) => {
    setMenuItems(menuItems.filter((_, i) => i !== index));
  };

  const addMenuItem = () => {
    setMenuItems([...menuItems, { id: "", name: "", price: "" }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createRestaurantMutation.mutate({
      name,
      address,
      menu_items: menuItems.filter(item => item.id && item.name && item.price),
    });
  };

  return (
    <RestaurantLayout>
      <div className="m-4 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Create Restaurant</h1>
          <Button
            onClick={() => navigate('/restaurants')}
            variant="secondary"
          >
            Cancel
          </Button>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Restaurant Information</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Restaurant Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  id="address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Menu Items
                  </label>
                  <Button
                    type="button"
                    onClick={addMenuItem}
                    variant="secondary"
                    size="sm"
                  >
                    Add Item
                  </Button>
                </div>
                <div className="space-y-3">
                  {menuItems.map((item, index) => (
                    <div key={index} className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Item ID"
                        value={item.id}
                        onChange={(e) => updateMenuItem(index, "id", e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Item Name"
                        value={item.name}
                        onChange={(e) => updateMenuItem(index, "name", e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Price"
                        value={item.price}
                        onChange={(e) => updateMenuItem(index, "price", e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      {menuItems.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeMenuItem(index)}
                          variant="danger"
                          size="sm"
                          className="px-3 py-2"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate('/restaurants')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createRestaurantMutation.isPending}
                >
                  {createRestaurantMutation.isPending ? "Creating..." : "Create Restaurant"}
                </Button>
              </div>
            </form>
        </div>
      </div>
    </RestaurantLayout>
  );
}