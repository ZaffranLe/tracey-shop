import React from "react";
import UpdateUser from "./update";
import { v1 as uuidv1 } from "uuid";
import { toast } from "react-toastify";
import userApi from "../../../requests/UserRequest";

function User() {
    const [users, setUsers] = React.useState([]);
    const [updateModal, setUpdateModal] = React.useState(false);
    const [randomKey, setRandomKey] = React.useState(0);

    const fetchUsers = async () => {
        try {
            const resp = await userApi.getAllUser();
            setUsers(resp.data);
        } catch (e) {
            console.error(e);
        }
    };

    React.useEffect(() => {
        fetchUsers();
    }, []);

    const handleOpenUpdateModal = () => {
        setRandomKey(uuidv1());
        setUpdateModal(true);
    };

    const handleCloseUpdateModal = () => {
        setUpdateModal(false);
    };

    const handleSave = async (userData) => {
        // try catch is in UpdateUser
        await userApi.createUserByAdmin(userData);
        toast.success("Tạo tài khoản thành công");
        await fetchUsers();
    };

    return (
        <>
            <div className="text-2xl font-bold">Tài khoản</div>
            <button
                className="bg-transparent hover:underline hover:text-indigo-500 font-semibold px-2 py-1 mt-4"
                onClick={handleOpenUpdateModal}
            >
                Tạo mới
            </button>
            <div className="border rounded mt-2">
                <table className="table-auto w-full">
                    <thead>
                        <tr className="bg-gray-900 text-white">
                            <th className="text-center w-16">#</th>
                            <th>Điện thoại</th>
                            <th>Họ tên</th>
                            <th>Email</th>
                            <th>Địa chỉ</th>
                            <th>Quản trị viên</th>
                            <th>Điểm tích lũy</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((_user, _idx) => (
                            <tr key={_user.id} className="border-t even:bg-slate-50">
                                <td className="text-center py-2">{_idx + 1}</td>
                                <td className="py-2">{_user.phone}</td>
                                <td className="py-2">{_user.name}</td>
                                <td className="py-2">{_user.email}</td>
                                <td className="py-2">{_user.address}</td>
                                <td className="py-2">
                                    <input type="checkbox" checked={_user.admin} />
                                </td>
                                <td className="py-2">{_user.point}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <UpdateUser
                key={randomKey}
                open={updateModal}
                onClose={handleCloseUpdateModal}
                onSave={handleSave}
            />
        </>
    );
}

export default User;
