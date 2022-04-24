import moment from "moment";
import React from "react";
import { toast } from "react-toastify";
import { formatVndCurrency } from "../../helpers/Common";
import userApi from "../../requests/UserRequest";

function MyOrder() {
    const [orders, setOrders] = React.useState([]);

    const getUserOrders = async () => {
        try {
            const resp = await userApi.getUserOrders();
            setOrders(resp.data);
        } catch (e) {
            toast.error(
                e.response?.data?.error?.message ||
                    "Lấy danh sách đơn hàng thất bại, vui lòng thử lại sau."
            );
            console.error(e);
        }
    };
    React.useEffect(() => {
        getUserOrders();
    }, []);
    return (
        <>
            <div className="bg-white p-4">
                <h1 className="text-3xl font-semibold">Đơn hàng của bạn</h1>
                {orders.length > 0 ? (
                    <>
                        <table className="w-full table-fixed border-collapse mt-4">
                            <thead>
                                <tr>
                                    <th className="border border-slate-300 p-3 bg-gray-800 text-white">Ngày đặt</th>
                                    <th className="border border-slate-300 p-3 bg-gray-800 text-white">Trạng thái</th>
                                    <th className="border border-slate-300 p-3 bg-gray-800 text-white">Tổng tiền</th>
                                    <th className="border border-slate-300 p-3 bg-gray-800 text-white">Chi tiết</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((_order) => (
                                    <tr key={_order._id} className="hover:bg-gray-200">
                                        <td className="border border-slate-300 p-3">{moment(_order.createdAt).format("DD/MM/YYYY")}</td>
                                        <td className="border border-slate-300 p-3">{_order.status}</td>
                                        <td className="border border-slate-300 p-3">{formatVndCurrency(_order.totalPrice)}</td>
                                        <td className="border border-slate-300 p-3">
                                            <span className="cursor-pointer hover:underline hover:font-semibold">
                                                Xem chi tiết
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                ) : (
                    <>
                        <h2 className="text-xl">Bạn chưa mua hàng lần nào.</h2>
                    </>
                )}
            </div>
        </>
    );
}

export default MyOrder;
