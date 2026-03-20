import React, { useEffect, useState } from "react";
import "./Homepage.scss";
import CloseIcon from "../../assets/Icons/CloseIcon";
import ImageAddIcon from "../../assets/Icons/ImageAddIcon";
import { useFormik } from "formik";
import megaSportAdminPanel from "../../Helpers/Helpers";
import url from "../../ApiUrls/Url";
import Swal from "sweetalert2";

const Homepage = () => {
  const [productSearchTerms, setProductSearchTerms] = useState({});
  const [productSearchResults, setProductSearchResults] = useState({});
  const [bestSellerSearchTerm, setBestSellerSearchTerm] = useState("");
  const [bestSellerSearchResults, setBestSellerSearchResults] = useState([]);
  const [catSearchTerms, setCatSearchTerms] = useState({});
  const [catSearchResults, setCatSearchResults] = useState({});
  const [isUpdate, setIsUpdate] = useState(false);

  const normalizeCategories = (categories) => {
    return categories.map(item => ({
      sortOrder: item.sortOrder,
      category: item.category || null,
      categoryId: item.category?.id || item.category?._id || item.categoryId
    }));
  };

  useEffect(() => {
    const getHomePageData = async () => {
      try {
        const res = await megaSportAdminPanel.api().get("internal/page-config/home");

        if (res?.data) {
          HomePage.setValues({
            ...res.data,
            homeFeaturedCategories: normalizeCategories(
              res.data.homeFeaturedCategories || []
            )
          });

          setIsUpdate(true);
        }
      } catch (error) {
        console.error(error);
        setIsUpdate(false);
      }
    };

    getHomePageData();
  }, []);

  const HomePage = useFormik({
    initialValues: {
      homeBanners: [
        {
          image: "",
          targetUrl: "",
          sortOrder: "",
        },
      ],
      homeNewCollections: {
        NAPAPIJRI: [],
        "THE NORTH FACE": [],
        TIMBERLAND: [],
      },
      homeBestSellers: {
        title: "Home Best Seller",
        products: [],
      },
      homeFeaturedCategories: [
        {
          category: null,
          sortOrder: 1,
        },
      ],
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const formattedValues = {
          ...values,

          // ✅ Featured Categories → only categoryId
          homeFeaturedCategories: values.homeFeaturedCategories.map((item) => ({
            categoryId: item.category?.id || item.categoryId,
            sortOrder: item.sortOrder
          })),

          // ✅ Best Sellers → only product IDs
          homeBestSellers: {
            ...values.homeBestSellers,
            products: (values.homeBestSellers.products || []).map(
              (p) => p._id || p.id || p
            )
          },

          // ✅ New Collections → brand üzrə only product IDs
          homeNewCollections: Object.entries(values.homeNewCollections || {}).map(
            ([brand, products]) => ({
              brandName: brand,
              products: (products || []).map(p => p._id || p.id || p)
            })
          )
        };

        const method = isUpdate ? "put" : "post";

        const res = await megaSportAdminPanel
          .api()[method]("internal/page-config/home", formattedValues)

        
          Swal.fire({
  icon: "success",
  title: isUpdate ? "Updated!" : "Added!",
  text: isUpdate 
    ? "Məlumat uğurla yeniləndi" 
    : "Məlumat uğurla əlavə edildi",
  confirmButtonText: "OK"
});
          setIsUpdate(true);
        
      } catch (error) {
        console.error(error);
      }
    }
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

  const handleChangeBannerImage = async (index, event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await megaSportAdminPanel
        .api()
        .post(url.fileUpload("page"), formData);
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
        .delete(url.fileDelete(imageName, "page"));
    } catch (error) {
      console.log(error);
    }
  };

  // const addProductToCollection = (brandName, product) => {
  //   const id = product?.id || product?._id;
  //   if (!id) return;

  //   const current = HomePage.values.homeNewCollections[brandName] || [];

  //   if (current.find((pr) => pr._id === id)) return;

  //   HomePage.setFieldValue(`homeNewCollections.${brandName}`, [
  //     ...current,
  //     product,
  //   ]);
  // };
  const addProductToCollection = (brandName, product) => {
  const id = getId(product);
  if (!id) return;

  const current = HomePage.values.homeNewCollections[brandName] || [];

  const exists = current.find((pr) => getId(pr) === id);

  let updated;

  if (exists) {
    // REMOVE
    updated = current.filter((pr) => getId(pr) !== id);
  } else {
    // ADD
    updated = [...current, product];
  }

  HomePage.setFieldValue(`homeNewCollections.${brandName}`, updated);
};

  const removeProductFromCollection = (brandName, idToRemove) => {
    const current = HomePage.values.homeNewCollections[brandName] || [];

    const updated = current.filter((pr) => pr._id !== idToRemove);

    HomePage.setFieldValue(`homeNewCollections.${brandName}`, updated);
  };
  const getId = (item) => {
    if (!item) return null;
    if (typeof item === "string") return item;
    return item._id || item.id;
  };
  const addProductToBestSeller = (product) => {
    const id = getId(product);
    if (!id) return;

    const current = HomePage.values.homeBestSellers.products || [];

    const exists = current.find((p) => getId(p) === id);

    let updated;

    if (exists) {
      updated = current.filter((p) => getId(p) !== id);
    } else {
      updated = [...current, product];
    }

    HomePage.setFieldValue("homeBestSellers.products", updated);
  };

  const removeProductFromBestSeller = (idToRemove) => {
    const current = HomePage.values.homeBestSellers.products || [];

    const updated = current.filter(
      (p) => getId(p) !== idToRemove
    );

    HomePage.setFieldValue("homeBestSellers.products", updated);
  };
  const handleAddCategoryRow = () => {
    const current = (HomePage.values.homeFeaturedCategories || []);
    HomePage.setFieldValue("homeFeaturedCategories", [
      ...current,
      { categoryId: "", sortOrder: current.length + 1 },
    ]);
  };

  const handleRemoveCategoryRow = (index) => {
    const current = (HomePage.values.homeFeaturedCategories || []);
    if (current.length === 1) return;
    const updated = current.filter((_, i) => i !== index);
    HomePage.setFieldValue("homeFeaturedCategories", updated);
  };

  const selectCategory = (index, category) => {
    HomePage.setFieldValue(`homeFeaturedCategories[${index}]`, {
      ...HomePage.values.homeFeaturedCategories[index],
      categoryId: category.id || category._id,
      category: category
    });
  };


  const handleGeneralSearch = async (searchTerm, index, type) => {
    const searchConfig = {
      product: {
        setTerm: setProductSearchTerms,
        setResults: setProductSearchResults,
        apiUrl: url.discountProductSearch(searchTerm)
      },
      bestSeller: {
        setTerm: setBestSellerSearchTerm,
        setResults: setBestSellerSearchResults,
        apiUrl: url.discountProductSearch(searchTerm)
      },
      category: {
        setTerm: setCatSearchTerms,
        setResults: setCatSearchResults,
        apiUrl: `internal/category/search/${searchTerm}`
      }
    };

    const config = searchConfig[type];
    config.setTerm((prev) => ({ ...prev, [index]: searchTerm }));

    const trimmed = searchTerm.trim();
    if (type === "bestSeller") {
      setBestSellerSearchTerm(searchTerm);

      const res = await megaSportAdminPanel.api().get(config.apiUrl);
      setBestSellerSearchResults(res.data.data || res.data || []);
      return;
    }
    if (!trimmed) {
      config.setResults((prev) => ({ ...prev, [index]: [] }));
      return;
    }

    try {
      const res = await megaSportAdminPanel.api().get(config.apiUrl);
      config.setResults((prev) => ({
        ...prev,
        [index]: res.data.data || res.data || [],
      }));
    } catch (error) {
      console.error(`${type} search error:`, error);
    }
  };

  return (
    <main>
      <section id="homePage">
        <form onSubmit={HomePage.handleSubmit}>
          <div className="row">
            <div className="borderDiv"></div>
            <button type="submit" className="submitButton">
              {isUpdate ? "Update Data" : "Add New Data"}
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
                      type="url"
                      id={`targetUrl-${index}`}
                      name={`homeBanners[${index}].targetUrl`}
                      value={banner.targetUrl ? banner.targetUrl : ""}
                      onChange={HomePage.handleChange}
                    />
                    <label htmlFor={`sortOrder-${index}`}>Sort Order</label>
                    <input
                      type="number"
                      id={`sortOrder-${index}`}
                      name={`homeBanners[${index}].sortOrder`}
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
                          src={`${megaSportAdminPanel.baseUrlImage}page/${banner.image}`}
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
              </div>

              {Object.keys(HomePage.values.homeNewCollections || {}).map((brand) => (
                <div key={brand} className="sectionsInputs">

                  <div className="collectionsInputs">

                    <h4>{brand}</h4>
                    <input
                      type="text"
                      placeholder="Search product..."
                      value={productSearchTerms[brand] || ""}
                      onChange={(e) =>
                        handleGeneralSearch(e.target.value, brand, "product")
                      }
                    />
                    {productSearchTerms && (
                      <div className="collectionsSearchResults">
                        {(productSearchResults[brand] || []).map((product) => {
                          const id = product._id || product.id;

                          return (
                            <div
                              key={id}
                              onClick={() => addProductToCollection(brand, product)}
                              className=""
                            >
                              <input
                                type="checkbox"
                                readOnly
                                checked={
                                  (HomePage.values.homeNewCollections[brand] || []).some(
                                   (pr) => getId(pr) === id

                                  )
                                }
                              />
                              {product.title?.az}
                            </div>
                          );
                        })}
                      </div>)}
                  </div>


                  {/* SELECTED PRODUCTS */}
                  <div className="collectionsResults">
                    {(HomePage.values.homeNewCollections[brand] || []).map((product) => (
                      <span
                        key={product._id}
                        onClick={() =>
                          removeProductFromCollection(brand, product._id)
                        }
                      >
                        {product.title?.az}
                        <CloseIcon />
                      </span>
                    ))}
                  </div>
                </div>
              ))}

            </div>
            <div className="miniSection">
              <div className="sectionHeader">
                <h3 className="sectionTitle">Home Best Sellers</h3>
              </div>

              <div className="sectionsInputs">
               
                  <div className="collectionsInputs">
                    <div className="searchInputs">
                      <label>Search & Select Products</label>
                      <input
                        type="text"
                        placeholder="Search Term"
                        value={bestSellerSearchTerm}
                        onChange={(e) => {
                          const val = e.target.value;
                          setBestSellerSearchTerm(val);
                          handleGeneralSearch(val, 0, "bestSeller"); // Burada 0-cı indeksi sabit saxlayırıq
                        }}
                      />
                    </div>

                    {bestSellerSearchTerm && (
                      <div className="productSearchResults">

                        {bestSellerSearchResults.map((product) => {
                          console.log(bestSellerSearchResults);

                          const id = product.id || product._id;

                          return (
                            <div
                              key={id}
                              className="selectionProductItem"
                              onClick={() => addProductToBestSeller(product)}
                            >
                              <input
                                type="checkbox"
                                readOnly
                                checked={
                                  (HomePage.values.homeBestSellers.products || []).some(
                                    (p) => (p._id || p.id || p) === id
                                  )
                                }
                              />
                              <span>{product.title?.az}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="collectionsResults">
                    {/* Seçilmiş ID-ləri göstəririk */}
                    {(HomePage.values.homeBestSellers?.products || []).map((pr) => (
                      <span
                        key={pr._id}
                        className="selectedProductItem"
                        onClick={() => removeProductFromBestSeller(pr._id)}
                      >
                        {pr.title.az} <CloseIcon/>
                      </span>
                    ))}
                  </div>
                
              </div>
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
                  <div key={index} className="selectedProducts" style={{ width: "100%" }}>

                    {/* Kateqoriya Axtarış Inputu */}
                    <div className="searchInputsArea categorySearch" >
                      <div className="searchInputs">

                        <label>Search Category</label>
                        <input
                          type="text"
                          placeholder="Type category name..."
                          value={catSearchTerms[index] || ""}
                          onChange={(e) => handleGeneralSearch(e.target.value, index, "category")}
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
                        <small style={{ color: "gray", display: "block", marginTop: "4px", fontSize: "16px" }}>
                          Selected : {cat?.category?.name?.az || "None"}
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