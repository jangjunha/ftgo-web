import React from "react";
import RestaurantSection from "./components/RestaurantSection";
import CustomerSection from "./components/CustomerSection";
import PlaceOrderSection from "./components/PlaceOrderSection";

const App = (): React.ReactElement => {
  return (
    <div className="flex">
      <div>
        <h2 className="font-bold text-2xl text-center">매장 관리</h2>
        <RestaurantSection />
      </div>
      <div>
        <h2 className="font-bold text-2xl text-center">고객 관리</h2>
        <CustomerSection />
      </div>
      <div>
        <h2 className="font-bold text-2xl text-center">주문하기</h2>
        <PlaceOrderSection />
      </div>
    </div>
  );
};

export default App;
