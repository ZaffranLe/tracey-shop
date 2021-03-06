import React from "react";
import productApi from "../../../requests/ProductRequest";
import categoryApi from "../../../requests/CategoryRequest";
import manufacturerApi from "../../../requests/ManufacturerRequest";
import UpdateProduct from "./update";
import { v1 as uuidv1 } from "uuid";
import { toast } from "react-toastify";
import { ConfirmModal } from "../../../components";
import { formatVndCurrency, getImageUrl } from "../../../helpers/Common";

function Products() {
    const [products, setProducts] = React.useState([]);
    const [categories, setCategories] = React.useState([]);
    const [manufacturers, setManufacturers] = React.useState([]);
    const [updateModal, setUpdateModal] = React.useState(false);
    const [updateProduct, setUpdateProduct] = React.useState(null);
    const [randomKey, setRandomKey] = React.useState(0);
    const [confirmModal, setConfirmModal] = React.useState({
        content: "",
        onClose: () => {},
        onConfirm: () => {},
        open: false,
        loading: false,
    });

    const fetchProducts = async () => {
        try {
            const resp = await productApi.getAllProduct();
            setProducts(resp.data);
        } catch (e) {
            console.error(e);
        }
    };

    const fetchCategories = async () => {
        try {
            const resp = await categoryApi.getAllCategory();
            setCategories(resp.data);
        } catch (e) {
            console.error(e);
        }
    };

    const fetchManufacturers = async () => {
        try {
            const resp = await manufacturerApi.getAllManufacturer();
            setManufacturers(resp.data);
        } catch (e) {
            console.error(e);
        }
    };

    React.useEffect(() => {
        fetchProducts();
        fetchCategories();
        fetchManufacturers();
    }, []);

    const handleOpenUpdateModal = (selectedProduct = null) => {
        setRandomKey(uuidv1());
        setUpdateModal(true);
        if (selectedProduct) {
            setUpdateProduct(selectedProduct);
        }
    };

    const handleCloseUpdateModal = () => {
        setUpdateModal(false);
        if (updateProduct) {
            setUpdateProduct(null);
        }
    };

    const handleSave = async (product) => {
        // try catch is in UpdateProduct
        if (updateProduct) {
            await productApi.updateProduct(updateProduct._id, product);
            toast.success("C???p nh???t s???n ph???m th??nh c??ng");
        } else {
            await productApi.createProduct(product);
            toast.success("T???o s???n ph???m th??nh c??ng");
        }
        await fetchProducts();
    };

    const handleDeleteTag = (product) => {
        setConfirmModal({
            content: `B???n c?? ch???c ch???n mu???n x??a danh m???c '${product.name}' kh??ng?`,
            open: true,
            loading: false,
            onClose: () => {
                setConfirmModal({ ...confirmModal, open: false });
            },
            onConfirm: async () => {
                setConfirmModal({ ...confirmModal, loading: true });
                try {
                    await productApi.deleteProduct(product._id);
                    toast.success("X??a s???n ph???m th??nh c??ng");
                    await fetchProducts();
                } catch (e) {
                    console.error(e);
                    toast.error("X??a s???n ph???m th???t b???i, vui l??ng th??? l???i sau.");
                } finally {
                    setConfirmModal({
                        ...confirmModal,
                        loading: false,
                        open: false,
                    });
                }
            },
        });
    };

    return (
        <>
            <div className="text-2xl font-bold">S???n ph???m</div>
            <button
                className="bg-transparent hover:underline hover:text-indigo-500 font-semibold px-2 py-1 mt-4"
                onClick={() => handleOpenUpdateModal()}
            >
                T???o m???i
            </button>
            <div className="border rounded mt-2">
                <table className="table-fixed w-full">
                    <thead>
                        <tr className="bg-gray-900 text-white">
                            <th className="text-center w-16">#</th>
                            <th>???nh</th>
                            <th>T??n</th>
                            <th>Gi?? ti???n</th>
                            <th>Gi?? khuy???n m??i</th>
                            <th>Danh m???c</th>
                            <th>H??ng s???n xu???t</th>
                            <th>T??c v???</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((_product, _idx) => (
                            <tr key={_product._id} className="border-t even:bg-slate-50">
                                <td className="text-center py-2">{_idx + 1}</td>
                                <td className="py-2">
                                    <img
                                        src={getImageUrl(_product.thumbnail?.fileName)}
                                        alt={_product.name}
                                    />
                                </td>
                                <td className="py-2">{_product.name}</td>
                                <td className="py-2">{formatVndCurrency(_product.price)}</td>
                                <td className="py-2">{formatVndCurrency(_product.sale)}</td>
                                <td className="py-2">{_product.category?.name}</td>
                                <td className="py-2">{_product.manufacturer?.name}</td>
                                <td className="py-2 divide-x">
                                    <button
                                        className="bg-transparent hover:underline hover:text-indigo-500 px-2 py-1"
                                        onClick={() => handleOpenUpdateModal(_product)}
                                    >
                                        Ch???nh s???a
                                    </button>
                                    <button
                                        className="bg-transparent hover:underline hover:text-indigo-500 px-2 py-1"
                                        onClick={() => handleDeleteTag(_product)}
                                    >
                                        X??a
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <UpdateProduct
                key={randomKey}
                open={updateModal}
                onClose={handleCloseUpdateModal}
                onSave={handleSave}
                updateProduct={updateProduct}
                categories={categories}
                manufacturers={manufacturers}
            />
            <ConfirmModal {...confirmModal} />
        </>
    );
}

export default Products;
