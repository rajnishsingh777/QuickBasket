import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext'; // Adjust path if needed

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const { currency, axios, user } = useAppContext();

  const fetchMyOrders = async () => {
    try {
      const { data } = await axios.post(`/api/order/user`, {
  userId: user._id
});


      if (data.success) {
        setMyOrders(data.orders);
      }
    } catch (error) {
      console.log("Error fetching orders:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyOrders();
    }
  }, [user]);

  return (
    <div className='mt-16 pb-16'>
      <div className='flex flex-col items-end w-max mb-8'>
        <p className='text-2xl font-medium uppercase'>My Orders</p>
        <div className='w-16 h-0.5 bg-primary rounded-full'></div>
      </div>

      {myOrders.length === 0 ? (
        <p className='text-gray-500'>You have no orders yet.</p>
      ) : (
        myOrders.map((order, index) => (
          <div key={index} className='border border-gray-300 rounded-lg mb-10 p-4 max-w-4xl w-full'>
            {/* Top Row */}
            <div className='flex justify-between text-sm text-gray-500 mb-4'>
              <span>OrderId: {order._id}</span>
              <span>Payment: {order.paymentType}</span>
              <span>Total Amount: {currency} {order.amount}</span>
            </div>

            {/* Items */}
            {order.items?.map((item, i) => {
              const product = item?.product;
              const image = product?.image?.[0];

              return (
                <div
                  key={i}
                  className={`flex justify-between items-center py-4 ${i !== order.items.length - 1 ? 'border-b border-gray-200' : ''}`}
                >
                  {/* Left: Image + Name + Category */}
                  <div className='flex items-center gap-4'>
                    <div className='bg-primary/10 p-2 rounded-lg'>
                      {image ? (
                        <img src={image} alt={product.name} className='w-16 h-16 object-cover rounded' />
                      ) : (
                        <div className='w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500'>
                          No Image
                        </div>
                      )}
                    </div>
                    <div>
                      <h2 className='text-lg font-semibold text-gray-800'>{product?.name || 'Unnamed Product'}</h2>
                      <p className='text-sm text-gray-500'>Category: {product?.category || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Right: Quantity, Status, Date, Amount */}
                  <div className='text-primary text-sm text-right space-y-1'>
                    <p>Quantity: {item.quantity || 1}</p>
                    <p>Status: {order.status}</p>
                    <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                    <p className='font-medium'>
                      Amount: {currency} {product?.offerPrice ? product.offerPrice * (item.quantity || 1) : 'N/A'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ))
      )}
    </div>
  );
};

export default MyOrders;
