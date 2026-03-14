import React, { useState } from "react";
import "./Homepage.scss";
import CloseIcon from "../../assets/Icons/CloseIcon";
import ImageAddIcon from "../../assets/Icons/ImageAddIcon";
import { useFormik } from "formik";
import megaSportAdminPanel from "../../Helpers/Helpers";
import url from "../../ApiUrls/Url";

const Homepage = () => {
  const [productSearchTerms, setProductSearchTerms] = useState({});
  const [productSearchResults, setProductSearchResults] = useState({});

  const HomePage = useFormik({
    initialValues: {
      homeBanners: [
        {
          image: "",
          targetUrl: "",
          sortOrder: "",
        },
      ],
      homeNewCollections: [
        {
          brandName: "",
          products: [],
        },
      ],
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      // TODO: Ana səhifə üçün API endpoint əlavə olunanda burada istifadə et
      console.log("Homepage values:", values);
    },
  });

  const handleAddBannerRow = () => {
    const current = (HomePage.values.homeBanners || []).map((b) => ({
      ...b,
    }));
    HomePage.setFieldValue("homeBanners", [
      ...current,
      { image: "", targetUrl: "", sortOrder: "" },
    ]);
  };

  const handleRemoveBannerRow = (index) => {
    const current = (HomePage.values.homeBanners || []).map((b) => ({
      ...b,
    }));
    if (current.length === 1) return;
    const updated = current.filter((_, i) => i !== index);
    HomePage.setFieldValue("homeBanners", updated);
  };

  const handleAddCollectionRow = () => {
    const current = (HomePage.values.homeNewCollections || []).map((c) => ({
      ...c,
      products: [...(c.products || [])],
    }));
    HomePage.setFieldValue("homeNewCollections", [
      ...current,
      { brandName: "", products: [] },
    ]);
  };

  const handleRemoveCollectionRow = (index) => {
    const current = (HomePage.values.homeNewCollections || []).map((c) => ({
      ...c,
      products: [...(c.products || [])],
    }));
    if (current.length === 1) return;
    const updated = current.filter((_, i) => i !== index);
    HomePage.setFieldValue("homeNewCollections", updated);
  };

  const handleChangeBannerImage = async (index, event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await megaSportAdminPanel
        .api()
        .post(url.fileUpload("category"), formData);
      if (res?.data?.name) {
        const current = (HomePage.values.homeBanners || []).map((b) => ({
          ...b,
        }));
        current[index] = {
          ...current[index],
          image: res.data.name,
        };
        HomePage.setFieldValue("homeBanners", current);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteBannerImage = async (index) => {
    const current = (HomePage.values.homeBanners || []).map((b) => ({
      ...b,
    }));
    const imageName = current[index]?.image;
    if (!imageName) return;
    try {
      current[index] = {
        ...current[index],
        image: "",
      };
      HomePage.setFieldValue("homeBanners", current);
      await megaSportAdminPanel
        .api()
        .delete(url.fileDelete(imageName, "category"));
    } catch (error) {
      console.log(error);
    }
  };

  const searchProducts = async (searchTerm, index) => {
    const trimmed = searchTerm.trim();
    setProductSearchTerms((prev) => ({
      ...prev,
      [index]: searchTerm,
    }));

    if (!trimmed) {
      setProductSearchResults((prev) => ({
        ...prev,
        [index]: [],
      }));
      return;
    }

    try {
      const res = await megaSportAdminPanel
        .api()
        .get(url.discountProductSearch(trimmed));
      setProductSearchResults((prev) => ({
        ...prev,
        [index]: res.data.data || [],
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const addProductToCollection = (collectionIndex, product) => {
    const id = product?.id || product?._id;
    if (!id) return;

    const current = (HomePage.values.homeNewCollections || []).map((c) => ({
      ...c,
      products: [...(c.products || [])],
    }));

    const existing = current[collectionIndex].products || [];
    if (existing.includes(id)) return;

    current[collectionIndex].products = [...existing, id];
    HomePage.setFieldValue("homeNewCollections", current);
  };

  const removeProductFromCollection = (collectionIndex, idToRemove) => {
    const current = (HomePage.values.homeNewCollections || []).map((c) => ({
      ...c,
      products: [...(c.products || [])],
    }));

    current[collectionIndex].products = current[collectionIndex].products.filter(
      (id) => id !== idToRemove
    );

    HomePage.setFieldValue("homeNewCollections", current);
  };

  const getProductTitle = (product) => {
    const id = product?.id || product?._id || "";

    // title sahəsi string ola da bilər, object də
    if (typeof product?.title === "string") {
      return product.title;
    }
    if (product?.title && typeof product.title === "object") {
      return product.title.az || product.title.en || product.title.ru || id;
    }

    // name sahəsi də çox vaxt { az, en, ru } strukturunda olur
    if (typeof product?.name === "string") {
      return product.name;
    }
    if (product?.name && typeof product.name === "object") {
      return product.name.az || product.name.en || product.name.ru || id;
    }

    return id;
  };

  return (
        <main>
            <section id="homePage">
                <form onSubmit={HomePage.handleSubmit}>
                    <div className="row">
                        <div className="borderDiv"></div>
                        <button type="submit" className="submitButton">
                            Add New Data
                        </button>
                    </div>
                    <div className="formDatas">
                        <div className="miniSection">
                            <div className="sectionHeader">
                                <h3 className="sectionTitle">Home Banners</h3>
                                <button type="button" onClick={handleAddBannerRow}>
                                    Add Banner Row
                                </button>
                            </div>

                            {(HomePage.values.homeBanners || []).map((banner, index) => (
                                <div key={index} className="sectionsInputs">
                                    <div className="inputsArea">
                                        <label htmlFor={`targetUrl-${index}`}>Target Url</label>
                                        <input
                                            type="text"
                                            id={`targetUrl-${index}`}
                                            name='targetUrl'
                                            value={banner.targetUrl}
                                            onChange={HomePage.handleChange}
                                        />
                                        <label htmlFor={`sortOrder-${index}`}>Sort Order</label>
                                        <input
                                            type="number"
                                            id={`sortOrder-${index}`}
                                            name='sortOrder'
                                            value={banner.sortOrder ? banner.sortOrder : 1}
                                            onChange={HomePage.handleChange}
                                        />
                                    </div>
                                    <div className="imgAddAreaWrapper">
                                        <span className="inputName">
                                            {banner.image ? "Banner Image" : "Image Upload"}
                                        </span>
                                        {banner.image ? (
                                            <div className="categoryImageWrapper">
                                                <img
                                                    src={`${megaSportAdminPanel.baseUrlImage}category/${banner.image}`}
                                                    alt="banner"
                                                />
                                                <span
                                                    className="deleteIcon"
                                                    onClick={() => deleteBannerImage(index)}
                                                >
                                                    <CloseIcon />
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="imgAddWrapper">
                                                <input
                                                    type="file"
                                                    onChange={(e) => handleChangeBannerImage(index, e)}
                                                    className="imgInput"
                                                />
                                                <ImageAddIcon />
                                                Image Upload
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        className="removeBannerButton"
                                        onClick={() => handleRemoveBannerRow(index)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}

                        </div>
                        <div className="miniSection">
                            <div className="sectionHeader">
                                <h3 className="sectionTitle">Home New Collections</h3>
                                <button type="button" onClick={handleAddCollectionRow}>
                                    Add Collections Row
                                </button>
                            </div>

                            {(HomePage.values.homeNewCollections || []).map(
                              (collections, index) => (
                                <div key={index} className="sectionsInputs">
                                  <div className="inputsArea">
                                    <label htmlFor={`brandName-${index}`}>
                                      Brand Name
                                    </label>
                                    <input
                                      type="text"
                                      id={`brandName-${index}`}
                                      name="brandName"
                                      value={collections.brandName}
                                      onChange={HomePage.handleChange}
                                    />
                                  </div>
                                  <div className="selectedProducts">
                                    <div className="searchInputs">
                                      <label htmlFor="">
                                        Selected Products
                                      </label>
                                      <input
                                        type="text"
                                        placeholder="Search Term "
                                        value={productSearchTerms[index] || ""}
                                        onChange={(e) =>
                                          searchProducts(e.target.value, index)
                                        }
                                      />
                                    </div>
                                    <div className="selectionProducts">
                                      {(productSearchResults[index] || []).map(
                                        (product) => {
                                          const id =
                                            product.id || product._id;
                                          const title = getProductTitle(
                                            product
                                          );
                                          return (
                                            <div
                                              key={id}
                                              className="selectionProductItem"
                                              onClick={() =>
                                                addProductToCollection(
                                                  index,
                                                  product
                                                )
                                              }
                                            >
                                              <input
                                                type="checkbox"
                                                readOnly
                                                checked={(
                                                  collections.products || []
                                                ).includes(id)}
                                              />
                                              <span>{title}</span>
                                            </div>
                                          );
                                        }
                                      )}
                                    </div>
                                    <div className="selectedProductsList">
                                      {(collections.products || []).map(
                                        (id) => (
                                          <span
                                            key={id}
                                            className="selectedProductItem"
                                            onClick={() =>
                                              removeProductFromCollection(
                                                index,
                                                id
                                              )
                                            }
                                          >
                                            {id}
                                          </span>
                                        )
                                      )}
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    className="removeBannerButton"
                                    onClick={() =>
                                      handleRemoveCollectionRow(index)
                                    }
                                  >
                                    Remove
                                  </button>
                                </div>
                              )
                            )}

                        </div>
                    </div>
                </form>
            </section>
        </main>
    );
};

export default Homepage;