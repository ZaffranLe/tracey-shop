import React from 'react';
import Modal from '../../components/Modal';
import { formatVndCurrency, getImageUrl } from '../../helpers/Common';

function OrderDetailModal({ open, onClose, orderDetail }) {
  return (
    <>
      {orderDetail && (
        <Modal dimmer={true} onClose={onClose} open={open}>
          <div className="w-2/3 bg-white border rounded-xl p-4">
            <p className="text-xl font-semibold">Thông tin đơn hàng</p>
            <div className="grid grid-cols-3">
              <div>
                <div className="font-semibold">Họ tên người mua:</div>
                <div>{orderDetail.name}</div>
              </div>
              <div>
                <div className="font-semibold">SĐT:</div>
                <div>{orderDetail.phone}</div>
              </div>
              <div>
                <div className="font-semibold">Địa chỉ giao hàng:</div>
                <div>{orderDetail.address}</div>
              </div>
            </div>
            <table className="w-full border-collapse mt-4">
              <thead>
                <tr>
                  <th className="text-white bg-gray-800 text-center">STT</th>
                  <th className="text-white bg-gray-800">Ảnh</th>
                  <th className="text-white bg-gray-800">Tên sản phẩm</th>
                  <th className="text-white bg-gray-800 text-center w-px">
                    Số lượng
                  </th>
                  <th className="text-white bg-gray-800 text-center">
                    Đơn giá
                  </th>
                  <th className="text-white bg-gray-800 text-center">
                    Tổng tiền
                  </th>
                </tr>
              </thead>
              <tbody>
                {orderDetail.products.map((_data, _idx) => (
                  <tr key={_data.product._id}>
                    <td className="border border-slate-300 text-center">
                      {_idx + 1}
                    </td>
                    <td className="border border-slate-300 w-64">
                      <img
                        src={getImageUrl(_data.product.thumbnail.fileName)}
                        alt={_data.product.name}
                      />
                    </td>
                    <td className="border border-slate-300">
                      {_data.product.name}
                    </td>
                    <td className="border border-slate-300 text-center">
                      {_data.quantity}
                    </td>
                    <td className="border border-slate-300 text-center">
                      {formatVndCurrency(_data.price)}
                    </td>
                    <td className="border border-slate-300 text-center font-semibold text-red-500">
                      {formatVndCurrency(_data.quantity * _data.price)}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={5} className="text-right font-semibold">
                    Tổng tiền:
                  </td>
                  <td className="text-center text-red-500 font-bold">
                    {formatVndCurrency(orderDetail.totalPrice)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Modal>
      )}
    </>
  );
}

export default OrderDetailModal;
