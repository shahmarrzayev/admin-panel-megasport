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
  const [bestSellerSearchTerms, setBestSellerSearchTerms] = useState({});
  const [bestSellerSearchResults, setBestSellerSearchResults] = useState({});
  const [catSearchTerms, setCatSearchTerms] = useState({});
  const [catSearchResults, setCatSearchResults] = useState({});
  const targetBrandDatas = [
    {
      id: 1,
      name: "TİMBERLAND"
    },
    {
      id: 2,
      name: "NAPAPIJRI"
    },
    {
      id: 3,
      name: "THE NORTH FACE"
    },

  ]

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
      homeBestSellers: [
        {
          title: "",
          products: [],
        },
      ],
      homeFeaturedCategories: [
        {
          categoryId: "",
          sortOrder: 1,
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
      console.log(productSearchResults);

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

  // Best Seller üçün ayrıca axtarış funksiyası
  const searchBestSellerProducts = async (searchTerm, index) => {
    const trimmed = searchTerm.trim();
    setBestSellerSearchTerms((prev) => ({
      ...prev,
      [index]: searchTerm,
    }));

    if (!trimmed) {
      setBestSellerSearchResults((prev) => ({
        ...prev,
        [index]: [],
      }));
      return;
    }

    try {
      const res = await megaSportAdminPanel
        .api()
        .get(url.discountProductSearch(trimmed));
      setBestSellerSearchResults((prev) => ({
        ...prev,
        [index]: res.data.data || [],
      }));
    } catch (error) {
      console.log(error);
    }
  };

  // Best Seller üçün məhsul əlavə etmə və silmə funksiyaları
  const addProductToBestSeller = (bestSellerIndex, product) => {
    const id = product?.id || product?._id;
    if (!id) return;

    const current = (HomePage.values.homeBestSellers || []).map((b) => ({
      ...b,
      products: [...(b.products || [])],
    }));

    const existing = current[bestSellerIndex].products || [];
    if (existing.includes(id)) return;

    current[bestSellerIndex].products = [...existing, id];
    HomePage.setFieldValue("homeBestSellers", current);
  };

  const removeProductFromBestSeller = (bestSellerIndex, idToRemove) => {
    const current = (HomePage.values.homeBestSellers || []).map((b) => ({
      ...b,
      products: [...(b.products || [])],
    }));

    current[bestSellerIndex].products = current[bestSellerIndex].products.filter(
      (id) => id !== idToRemove
    );

    HomePage.setFieldValue("homeBestSellers", current);
  };

  // Kateqoriya sətiri əlavə et
  const handleAddCategoryRow = () => {
    const current = (HomePage.values.homeFeaturedCategories || []);
    HomePage.setFieldValue("homeFeaturedCategories", [
      ...current,
      { categoryId: "", sortOrder: current.length + 1 },
    ]);
  };

  // Kateqoriya sətiri sil
  const handleRemoveCategoryRow = (index) => {
    const current = (HomePage.values.homeFeaturedCategories || []);
    if (current.length === 1) return;
    const updated = current.filter((_, i) => i !== index);
    HomePage.setFieldValue("homeFeaturedCategories", updated);
  };

  // Kateqoriya axtarışı (API: internal/category/search/:searchTerm)
  const searchCategories = async (searchTerm, index) => {
    setCatSearchTerms((prev) => ({ ...prev, [index]: searchTerm }));
    const trimmed = searchTerm.trim();

    if (!trimmed) {
      setCatSearchResults((prev) => ({ ...prev, [index]: [] }));
      return;
    }

    try {
      // API URL-nizə uyğun olaraq tənzimləyin
      const res = await megaSportAdminPanel.api().get(`internal/category/search/${trimmed}`);
      console.log(res.data.data);

      setCatSearchResults((prev) => ({
        ...prev,
        [index]: res.data.data || [], // API-nin qaytardığı struktura görə
      }));
    } catch (error) {
      console.error("Category search error:", error);
    }
  };

  // Kateqoriya seçildikdə ID-ni Formik-ə yaz
  const selectCategory = (index, category) => {
    const id = category.id || category._id;
    HomePage.setFieldValue(`homeFeaturedCategories[${index}].categoryId`, id);

    // Axtarış nəticələrini təmizlə və inputa adı yaz (vizual olaraq)
    setCatSearchTerms((prev) => ({ ...prev, [index]: category.title?.az || category.name }));
    setCatSearchResults((prev) => ({ ...prev, [index]: [] }));
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
                    <CloseIcon />
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
                      <select
                        id={`brandName-${index}`}
                        name={`homeNewCollections[${index}].brandName`}
                        value={collections.brandName || ""}
                        onChange={HomePage.handleChange}
                      >
                        <option value="">Select Brand</option>

                        {targetBrandDatas.map((brand) => (
                          <option key={brand.id} value={brand.name}>
                            {brand.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="selectedProducts">
                      <div className="searchInputsArea">
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
                        {productSearchTerms[index] && (
                          <div className="productSearchResults">
                            {(productSearchResults[index] || []).map((product) => {
                              const id = product.id || product._id;

                              return (
                                <div
                                  key={id}
                                  className="selectionProductItem"
                                  onClick={() => addProductToCollection(index, product)}
                                >
                                  <input
                                    type="checkbox"
                                    readOnly
                                    checked={(collections.products || []).includes(id)}
                                  />
                                  <span>{product.title.az}</span>
                                </div>
                              );
                            })}
                          </div>
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
                      <CloseIcon />
                    </button>
                  </div>
                )
              )}

            </div>
            <div className="miniSection">
              <div className="sectionHeader">
                <h3 className="sectionTitle">Home Best Sellers</h3>

              </div>

              {(HomePage.values.homeBestSellers || []).map((bestSeller, index) => (
                <div key={index} className="sectionsInputs">


                  <div className="selectedProducts">
                    <div className="searchInputsArea">
                      <div className="searchInputs">
                        <label>Search & Select Products</label>
                        <input
                          type="text"
                          placeholder="Search Term"
                          value={bestSellerSearchTerms[index] || ""}
                          onChange={(e) =>
                            searchBestSellerProducts(e.target.value, index)
                          }
                        />
                      </div>

                      {bestSellerSearchTerms[index] && (
                        <div className="productSearchResults">
                          {(bestSellerSearchResults[index] || []).map((product) => {
                            const id = product.id || product._id;

                            return (
                              <div
                                key={id}
                                className="selectionProductItem"
                                onClick={() => addProductToBestSeller(index, product)}
                              >
                                <input
                                  type="checkbox"
                                  readOnly
                                  checked={(bestSeller.products || []).includes(id)}
                                />
                                <span>{product.title?.az || "Adsız Məhsul"}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div className="selectedProductsList">
                      {(bestSeller.products || []).map((id) => (
                        <span
                          key={id}
                          className="selectedProductItem"
                          onClick={() => removeProductFromBestSeller(index, id)}
                        >
                          {id}
                        </span>
                      ))}
                    </div>
                  </div>


                </div>
              ))}
            </div>
            <div className="miniSection">
              <div className="sectionHeader">
                <h3 className="sectionTitle">Featured Categories</h3>
                <button type="button" onClick={handleAddCategoryRow}>
                  Add Category Row
                </button>
              </div>

              {(HomePage.values.homeFeaturedCategories || []).map((cat, index) => (
                <div key={index} className="sectionsInputs">
                  <div key={index}className="selectedProducts" style={{width:"100%"}}>

                    {/* Kateqoriya Axtarış Inputu */}
                    <div className="searchInputsArea categorySearch" >
                      <div className="searchInputs">

                      <label>Search Category</label>
                      <input
                        type="text"
                        placeholder="Type category name..."
                        value={catSearchTerms[index] || ""}
                        onChange={(e) => searchCategories(e.target.value, index)}
                      />
                      </div>

                      {/* Axtarış Nəticələri Dropdown */}
                      <div className="dropdown">

                      {catSearchResults[index] && catSearchResults[index].length > 0 && (
                        <div className="productSearchResults" >
                          {catSearchResults[index].map((category) => (
                            <div
                              key={category.id || category._id}
                              className="selectionProductItem"
                              onClick={() => selectCategory(index, category)}
                            >
                              <span>{category.title?.az || category.name.az}</span>
                            </div>
                          ))}
                          
                        </div>
                      )}
                       <small style={{ color: "gray", display: "block", marginTop: "4px",fontSize:"16px" }}>
                        Selected ID: {cat?.categoryId || "None"}
                      </small>
                      </div>
                     
                     
                    </div>

                    <div className="inputItem" >
                      <label>Sort Order</label>
                      <input
                        type="number"
                        name={`homeFeaturedCategories[${index}].sortOrder`}
                        value={cat.sortOrder}
                        onChange={HomePage.handleChange}
                      />
                    </div>

              
                    <button
                      type="button"
                      className="removeBannerButton"
                      onClick={() => handleRemoveCategoryRow(index)}
                    >
                      <CloseIcon />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </form>
      </section>
    </main>
  );
};

export default Homepage;