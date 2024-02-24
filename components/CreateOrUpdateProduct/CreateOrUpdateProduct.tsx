import React, { useEffect, useState } from "react";
import {
  CreateCategoryPopup,
  CreateProviderPopup,
  ConfirmButton,
  CancelButton,
  OpenDialogButton,
  FormInput,
  ConfirmCancelPopup,
} from "@/components";
import { getProvidersMock, getCategoriesMock, addProductMock } from "@/mocks";
import { ICategory, IProduct, IProvider } from "@/interfaces";

interface CreateOrUpdateProductProps {
  show: boolean;
  onCancel: () => void;
  product?: IProduct;
}

const emptyProduct = {
  nombre: "",
  descripcion: "",
  precio: 0,
  stockActual: 0,
  categoria: null,
  proveedor: null,
};

export default function CreateOrUpdateProduct({
  show,
  onCancel,
  product: productToUpdate,
}: CreateOrUpdateProductProps) {
  const [product, setProduct] = useState<IProduct>(emptyProduct);

  useEffect(() => {
    if (productToUpdate) {
      console.log("productToUpdate");
      fetchCategories();
      fetchProviders();
      setProduct(productToUpdate);
    } else {
      console.log("emptyProduct");
      setProduct(emptyProduct);
      setCategories([]);
      setProviders([]);
    }
  }, [productToUpdate, show]);

  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isCreatingProvider, setIsCreatingProvider] = useState(false);
  const [providers, setProviders] = useState<IProvider[]>([]);
  const [isCanceling, setIsCanceling] = useState(false);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);

  const fetchCategories = async () => {
    // Here you can call your API to fetch the providers
    // const res = await fetch("http://localhost/api/categorias");
    console.log("Fetching categories...");
    const res = await getCategoriesMock();
    // const data = await res.json();
    const data = res;
    if (!data) {
      return {
        notFound: true,
      };
    }
    console.log(data);
    setCategories(data);
  };

  const fetchProviders = async () => {
    // Here you can call your API to fetch the providers
    // const res = await fetch("http://localhost/api/proveedores");
    console.log("Fetching providers...");
    const res = await getProvidersMock();
    // const data = await res.json();
    const data = res;
    if (!data) {
      return {
        notFound: true,
      };
    }
    console.log(data);
    setProviders(data);
  };

  const handleCancel = (event: React.MouseEvent) => {
    event.preventDefault();
    setProduct(emptyProduct);
    setIsCanceling(false);
    setIsCreatingCategory(false);
    setIsCreatingProvider(false);
    console.log("Cancelando...");
    onCancel();
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    setIsCreatingProduct(true);
    // Here you can call your API to create the provider
    console.log(`Producto ${productToUpdate ? "actualizado" : "creado"}!`);
    addProductMock(product).then((data) => {
      console.log(data);
      setIsCreatingProduct(false);
      handleCancel(event);
    });
  };

  const allInputsAreValid = () => {
    return (
      product.nombre.length < 50 &&
      product.descripcion.length < 100 &&
      product.precio >= 0 &&
      product.precio <= 10000 &&
      product.stockActual >= 0 &&
      product.stockActual <= 1000 &&
      product.categoria &&
      product.proveedor
    );
  };

  const isPopupOpen = isCreatingCategory || isCreatingProvider || isCanceling;

  if (!show) {
    return null;
  }

  return (
    <div className="relative flex flex-grow items-center justify-center">
      <div
        className={`flex flex-col items-center justify-center ${
          isPopupOpen ? "opacity-50" : ""
        }`}
      >
        <h1 className="text-2xl font-bold">Crear producto</h1>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <FormInput
            type="text"
            placeholder="Nombre del producto"
            value={product.nombre}
            required
            onChange={(e) => setProduct({ ...product, nombre: e.target.value })}
          />
          <FormInput
            type="text"
            placeholder="Descripción del producto"
            value={product.descripcion}
            required
            onChange={(e) =>
              setProduct({ ...product, descripcion: e.target.value })
            }
          />

          <div className="flex items-center">
            <span>$</span>
            <FormInput
              type="number"
              placeholder="Precio del producto"
              min="0"
              className="flex-grow"
              value={product.precio}
              required
              onChange={(e) =>
                setProduct({ ...product, precio: parseInt(e.target.value) })
              }
            />
          </div>
          <FormInput
            type="number"
            placeholder="Stock inicial"
            min="0"
            value={product.stockActual}
            required
            onChange={(e) =>
              setProduct({ ...product, stockActual: parseInt(e.target.value) })
            }
          />
          {/* I need two list one with categories and another with providers for user to select */}
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center">
              <select
                className="border-2 border-gray-300 p-2 m-2"
                value={product.categoria?.id}
                onFocus={fetchCategories}
                required
                onChange={(e) =>
                  setProduct({
                    ...product,
                    categoria: categories.find(
                      (category) => category.id === parseInt(e.target.value)
                    ),
                  })
                }
              >
                <option value="" hidden>
                  Seleccione una categoría
                </option>
                {categories.map((category: ICategory) => (
                  <option key={category.id} value={category.id}>
                    {category.nombre} (id={category.id})
                  </option>
                ))}
              </select>
              <OpenDialogButton
                type="button"
                onClick={() => setIsCreatingCategory(true)}
              >
                + Crear categoría
              </OpenDialogButton>
            </div>
            <div className="flex items-center">
              <select
                className="border-2 border-gray-300 p-2 m-2"
                value={product.proveedor?.id}
                onFocus={fetchProviders}
                required
                onChange={(e) =>
                  setProduct({
                    ...product,
                    proveedor: providers.find(
                      (provider) => provider.id === parseInt(e.target.value)
                    ),
                  })
                }
              >
                <option value="" hidden>
                  Seleccione un proveedor
                </option>
                {providers.map((provider: IProvider) => (
                  <option key={provider.id} value={provider.id}>
                    {provider.nombre} (id={provider.id})
                  </option>
                ))}
              </select>
              <OpenDialogButton
                type="button"
                onClick={() => setIsCreatingProvider(true)}
              >
                + Crear proveedor
              </OpenDialogButton>
            </div>
          </div>
          <footer className="flex justify-around mt-5">
            <CancelButton
              type="button"
              onClick={(event) =>
                productToUpdate ? handleCancel(event) : setIsCanceling(true)
              }
            >
              Cancelar
            </CancelButton>
            <ConfirmButton
              type="submit"
              disabled={!allInputsAreValid() || isCreatingProduct}
            >
              {productToUpdate
                ? isCreatingProduct
                  ? "Actualizando..."
                  : "Actualizar"
                : isCreatingProduct
                ? "Creando..."
                : "Crear"}
            </ConfirmButton>
          </footer>
        </form>
      </div>

      {isPopupOpen && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <CreateCategoryPopup
            show={isCreatingCategory}
            onCancel={() => setIsCreatingCategory(false)}
          />
          <CreateProviderPopup
            show={isCreatingProvider}
            onCancel={() => setIsCreatingProvider(false)}
          />
          <ConfirmCancelPopup
            show={isCanceling}
            onCancel={() => setIsCanceling(false)}
            onConfirm={handleCancel}
            messageTitle="¿Desea cancelar la creación del producto?"
          />
        </div>
      )}
    </div>
  );
}
