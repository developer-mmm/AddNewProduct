import axiosClient from "../utils/axios";
import { useEffect, useRef, useState } from "react";
import { FaEye, FaTrashAlt, FaPlus, FaTimes } from 'react-icons/fa'; // Import icons
function Home() {
  const titleRef = useRef();
  const priceRef = useRef();
  const [products, setProducts] = useState([]);
  const [productErrors, setProductErrors] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const currentUserId = window.localStorage.getItem("userId");

  useEffect(() => {
    axiosClient
      .get("/cars", {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setProducts(response.data.data);
      })
      .catch((error) => console.log(error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProduct = {
      title: titleRef.current.value,
      price: priceRef.current.value,
      userId: currentUserId,
    };

    axiosClient
      .post("/cars", newProduct, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setProducts((prevProducts) => [...prevProducts, response.data]);
        titleRef.current.value = "";
        priceRef.current.value = "";
        setCreateModalOpen(false); // Close create modal after submission
      })
      .catch((error) => console.log(error));
  };

  const handleDelete = (product) => {
    if (product.userId !== currentUserId) {
      setProductErrors((prevErrors) => ({
        ...prevErrors,
        [product.id]: "that's not yours",
      }));
      return;
    }

    axiosClient
      .delete(`/cars/${product.id}`, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        setProducts((prevProducts) =>
          prevProducts.filter((p) => p.id !== product.id)
        );
        setProductErrors((prevErrors) => ({
          ...prevErrors,
          [product.id]: null,
        }));
      })
      .catch((error) => console.log(error));
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };



  const closeModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
  };

  const openCreateModal = () => {
    setCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setCreateModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center mt-10 w-full ">
      <button
        onClick={openCreateModal}
        className="bg-purple-400 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded mb-8 flex items-center transition-all duration-300"
      >
        <FaPlus className="inline mr-2" /> Add New Product
      </button>

      <form
        onSubmit={handleSubmit}
        className={`bg-white p-8 rounded-lg shadow-lg mb-8 w-full max-w-lg ${createModalOpen ? 'block' : 'hidden'} transition-all duration-300 ease-in-out`}
      >
        <div className="mb-4">
          <label className="block text-gray-800 text-sm font-semibold mb-2">Product</label>
          <input
            type="text"
            ref={titleRef}
            className="shadow-sm appearance-none border rounded w-full py-2 px-3 bg-green-600 text-white leading-tight focus:outline-none focus:transition-all duration-300"
            placeholder="Enter product name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-800 text-sm font-semibold mb-2">Price</label>
          <input
            type="text"
            ref={priceRef}
            className="shadow-sm appearance-none border rounded w-full py-2 px-3 bg-green-600 text-white leading-tight focus:outline-none focus:transition-all duration-300"
            placeholder="Enter product price"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition-all duration-300"
        >
          Add
        </button>
        <button
          onClick={closeCreateModal}
          className="mt-4 bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition-all duration-300"
        >
          back
        </button>
      </form>

      <div className="w-full max-w-lg">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.id}
              className="bg-white p-6 rounded-lg shadow-lg mb-4 flex justify-between items-center border border-gray-300 transition-all duration-300"
            >
              <div>
                <h1 className=" font-semibold text-blue-800 text-3xl"><span className="text-black text-xl">Product:</span> {product.title}</h1>
                <h1 className="text-yellow-400 text-3xl"> <span className="text-black text-xl">Price:</span> ${product.price}</h1>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => openModal(product)}
                  className="bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center transition-all duration-300"
                >
                  <FaEye className="inline mr-2" /> show
                </button>
                <button
                  onClick={() => handleDelete(product)}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center transition-all duration-300"
                >
                  <FaTrashAlt className="inline mr-2" /> Delete
                </button>
                {productErrors[product.id] && (
                  <p className="text-red-600 mt-2 text-sm">{productErrors[product.id]}</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400">Not found products yet</p>
        )}
      </div>

      {/* Modal for product details */}
      {modalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full relative z-50">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
            <h2 className="text-xl font-semibold text-blue-600 mb-4">{selectedProduct.title}</h2>
            <p className="text-yellow-400 text-lg">${selectedProduct.price}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
