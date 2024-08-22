// request

import { Link } from "react-router-dom";

const getData = async () => {
  const request = await fetch("https://dummyjson.com/products");

  const data = await request.json();

  return data;
};


async function products() {
  const { products } = await getData();
  return (
    <div className="grid grid-cols-4 gap-6">
      {products.map((product) => {
        return (
          <div className="flex" key={product.id}>
            <div className="border border-zinc-200 dark:border-zinc-800 mt-6 rounded-lg p-4 max-w-sm mx-auto hover:shadow-2xl shadow-xl">
              <img
                src={product.thumbnail}
                alt="Product Image"
                width={240}
                height={240}
                className="object-cover w-full rounded-lg mb-4"
              />
              <h1 className="font-bold text-green-600 text-2xl mb-2 ">
                {product.title}:
              </h1>
              <Link href={`/singleProduct/${product.id}`}>
                <h1 className="text-xl  hover:text-green-600">
                  Read more....
                </h1>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default products;