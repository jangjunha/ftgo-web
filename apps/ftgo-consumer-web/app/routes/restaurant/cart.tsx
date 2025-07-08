import { Link, useParams } from "react-router";
import type { Route } from "./+types/cart";
import { useCart } from "~/lib/cart-context";

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `Cart - Restaurant ${params.restaurantId}` },
    { name: "description", content: "Your cart items" },
  ];
}

export default function Cart() {
  const {
    items,
    getTotalItems,
    getTotalPrice,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Cart</h1>

      <div className="mb-4">
        <p>Total Items: {getTotalItems().toLocaleString()}</p>
        <p>Total Price: ${getTotalPrice().toLocaleString()}</p>
      </div>

      {items.length === 0 ? (
        <>
          <p>Your cart is empty</p>
          <Link to=".." className="text-blue-500">
            Go to explore menu
          </Link>
        </>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.menuItemId} className="">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold">{item.name}</h3>
                  <p>${item.price.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(item.menuItemId, item.quantity - 1)
                    }
                    className="px-2 py-1 bg-gray-200 rounded"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(item.menuItemId, item.quantity + 1)
                    }
                    className="px-2 py-1 bg-gray-200 rounded"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(item.menuItemId)}
                    className="px-2 py-1 bg-red-500 text-white rounded ml-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={clearCart}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Clear Cart
          </button>
        </div>
      )}
    </div>
  );
}
