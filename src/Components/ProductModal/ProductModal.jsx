import styles from "./ProductModal.module.scss";
import { UseGlobalContext } from "../../Context/GlobalContext";
import CloseIcon from "../../assets/Icons/CloseIcon";
import ImageAddIcon from "../../assets/Icons/ImageAddIcon";
import InputComponent from "../InputComponent/InputComponent";
import DescriptionOrTextArea from "../DescriptionOrTextArea/DescriptionOrTextArea";
import { Switch, Table } from "antd";
import EditIcon from "../../assets/Icons/EditIcon";
import DeleteIcon from "../../assets/Icons/DeleteIcon";
import ProductVariantModal from "../ProductOptionModal/ProductOptionModal";
import { useEffect, useState } from "react";
import megaSportAdminPanel from "../../Helpers/Helpers";
import url from "../../ApiUrls/Url";

export default function ProductModal({
  modalInputsData,
  modalActivePage,
  modalPageNameList,
  addProductImages,
  onClickChangeModalPage,
  activeLang,
  setActiveLang,
  submitFunc,
  productFormik,
  findProductItem,
}) {
  const {
    closeOpenModalFunc,
    secondShowHiddenModal,
    closeOpenSecondModalFunc,
  } = UseGlobalContext();

  const [findProductVariantItem, setfindProductVariantItem] = useState({});
  const [categorySearchData, setCategorySearchData] = useState([]);
  const [searchInpValue, setSearchInpValue] = useState("");
  const [showCategoryResultArea, setShowCategoryResultArea] = useState(false);
  const [colorImageForm, setColorImageForm] = useState({
    color: "",
    colorCode: "",
    images: [],
  });
  const [editingColorImageIndex, setEditingColorImageIndex] = useState(null);

  const categorySearchFunc = async (data) => {
    try {
      const resData = await megaSportAdminPanel
        .api()
        .get(url.categorySearch(data, findProductItem?.id));
      setCategorySearchData(resData.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // console.log("category inp search value=", searchInpValue);
  // console.log("category search result=", categorySearchData);

  const findProductVariantFunc = (variantId) => {
    if (!variantId) {
      setfindProductVariantItem({});
      return;
    }
    const findProductVariant = productFormik.values.variants.find(
      (variant) => variant.id === variantId 
    );
    setfindProductVariantItem(findProductVariant);
  };

  const handleProductVariantChange = (field, value) => {
    setfindProductVariantItem((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetColorImageForm = () => {
    setColorImageForm({
      color: "",
      colorCode: "",
      images: [],
    });
    setEditingColorImageIndex(null);
  };

  const handleColorImageChange = (field, value) => {
    setColorImageForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addColorImages = async (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await megaSportAdminPanel
          .api()
          .post(url.fileUpload("product"), formData);

        if (res?.data?.name) {
          setColorImageForm((prev) => ({
            ...prev,
            images: [...(prev.images || []), res.data.name],
          }));
        }
      } catch (error) {
        console.error("Upload error:", error);
      }
    }
  };

  const deleteColorImageFromForm = async (imageName) => {
    try {
      await megaSportAdminPanel
        .api()
        .delete(url.fileDelete(imageName, "product"));

      setColorImageForm((prev) => ({
        ...prev,
        images: prev.images.filter((img) => img !== imageName),
      }));
    } catch (error) {
      console.log("Delete image error:", error);
    }
  };

  const saveColorImage = () => {
    const cleanedImages = (colorImageForm.images || []).filter(
      (img) => img && img.trim().length > 0
    );

    if (!colorImageForm.color || !colorImageForm.colorCode || !cleanedImages.length) {
      return;
    }

    const newItem = {
      color: colorImageForm.color,
      colorCode: colorImageForm.colorCode,
      images: cleanedImages,
    };

    const current = productFormik.values.colorImages || [];

    if (editingColorImageIndex !== null) {
      const updated = [...current];
      updated[editingColorImageIndex] = newItem;
      productFormik.setFieldValue("colorImages", updated);
    } else {
      productFormik.setFieldValue("colorImages", [...current, newItem]);
    }

    resetColorImageForm();
  };

  const editColorImage = (index) => {
    const item = productFormik.values.colorImages?.[index];
    if (!item) return;

    setColorImageForm({
      color: item.color || "",
      colorCode: item.colorCode || "",
      images: item.images && item.images.length ? [...item.images] : [],
    });
    setEditingColorImageIndex(index);
  };

  const deleteColorImage = (index) => {
    const current = productFormik.values.colorImages || [];
    const updated = current.filter((_, i) => i !== index);
    productFormik.setFieldValue("colorImages", updated);

    if (editingColorImageIndex === index) {
      resetColorImageForm();
    }
  };

  useEffect(() => {
    if (findProductItem) {
      setSearchInpValue(findProductItem.category || "");
      productFormik.setFieldValue("category", findProductItem.categoryId || "");
    } else {
      setSearchInpValue("");
      productFormik.setFieldValue("category", "");
    }
  }, [findProductItem]);


  const modalVariantsAreaInputsDatas = [
    {
      id: 7,
      label: "Color",
      inputType: "text",
      name: "color",
      inpValue: findProductVariantItem?.color || "",
      onChange: (e) => handleProductVariantChange("color", e.target.value),
    },
    {
      id: 77,
      label: "colorCode",
      inputType: "text",
      name: "colorCode",
      inpValue: findProductVariantItem?.colorCode || "",
      onChange: (e) => handleProductVariantChange("colorCode", e.target.value),
    },
    {
      id: 8,
      label: "size",
      inputType: "text",
      name: "size",
      inpValue: findProductVariantItem?.size || "",
      onChange: (e) => handleProductVariantChange("size", e.target.value),
    },

    {
      id: 10,
      label: "Stock",
      inputType: "text",
      name: "stock",
      inpValue: findProductVariantItem?.stock || "",
      onChange: (e) => handleProductVariantChange("stock", e.target.value),
    },
    {
      id: 20,
      label: "sku",
      inputType: "text",
      name: "sku",
      inpValue: findProductVariantItem?.sku || "",
      onChange: (e) => handleProductVariantChange("sku", e.target.value),
    },
    {
      id: 21,
      label: "barcode",
      inputType: "text",
      name: "barcode",
      inpValue: findProductVariantItem?.barcode || "",
      onChange: (e) => handleProductVariantChange("barcode", e.target.value),
    },
     {
      id:22,
      label: "Status",
      inputType:"switch",
      name: "isActive",
    },
  ];
  const productVariantsTable = [
    {
      title: "Color",
      dataIndex: "color",
      key: "color",
    },
    {
      title: "Color Code",
      dataIndex: "colorCode",
      key: "colorCode",
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
    },
    
    {
      title: "Actions",
      key: "actions",
      render: (_, record, index) => (
        <div className="icon-list">
          <span
            onClick={() => {
              closeOpenSecondModalFunc();
              // Eğer id varsa id'ye göre bul, yoksa index'e göre kullan
              if (record?.id) {
                findProductVariantFunc(record.id);
              } else {
                const currentVariant =
                  productFormik.values.variants?.[index] || {};
                setfindProductVariantItem(currentVariant);
              }
            }}
          >
            <EditIcon />
          </span>
          <span
            onClick={() => {
              const variants = productFormik.values.variants || [];
              let filteredVariants = variants;

              if (record?.id) {
                // Backend'den gelen id varsa ona göre sil
                filteredVariants = variants.filter(
                  (option) => option.id !== record.id
                );
              } else {
                // Henüz id yoksa index'e göre sil
                filteredVariants = variants.filter((_, i) => i !== index);
              }

              productFormik.setFieldValue("variants", filteredVariants);
            }}
          >
            <DeleteIcon />
          </span>
        </div>
      ),
    },
  ];

  const colorImagesTable = [
    {
      title: "Color",
      dataIndex: "color",
      key: "color",
    },
    {
      title: "Color Code",
      dataIndex: "colorCode",
      key: "colorCode",
    },
    {
      title: "Images Count",
      key: "imagesCount",
      render: (record) => record?.images?.length || 0,
    },
  {
  title: "Images",
  key: "images",
  render: (_, record) => (
    <div className="icon-list">
      {record.images?.map((img, index) => (
       <img
       key={index}
       style={{width:"30px",height:"30px"}}
                          src={`${megaSportAdminPanel.baseUrlImage}/product/${img}`}
                          alt=""
                        />
      ))}
    </div>
  ),
},
    {
      title: "Actions",
      key: "actions",
      render: (_, __, index) => (
        <div className="icon-list">
          <span
            onClick={() => {
              editColorImage(index);
            }}
          >
            <EditIcon />
          </span>
          <span
            onClick={() => {
              deleteColorImage(index);
            }}
          >
            <DeleteIcon />
          </span>
        </div>
      ),
    },
  ];
  // console.log("find product item --", findProductItem);

  return (
    <div className={styles.modal}>
      <div onClick={closeOpenModalFunc} className="overlay"></div>
      <div className={styles.modalContent}>
        <h4 className="pageTitle">Add New Products</h4>
        <span onClick={closeOpenModalFunc} className={styles.closeIcon}>
          <CloseIcon />
        </span>
        <div className={styles.modalPageList}>
          {modalPageNameList.map((pageName, index) => (
            <span
              className={`${styles.modalPageName} ${
                modalActivePage === pageName ? styles.activePage : ""
              }`}
              onClick={() => onClickChangeModalPage(pageName)}
              key={index}
            >
              {pageName}
            </span>
          ))}
        </div>
        <form className={styles.form} onSubmit={submitFunc}>
          {modalActivePage === "Add Product" && (
            <div className={styles.modalAddProductArea}>
              <div className={styles.addProductForm}>
                <div className={styles.nameSlugCategoryInputs}>
                  <InputComponent
                    inputData={modalInputsData.productName}
                    activeLang={activeLang}
                    setActiveLang={setActiveLang}
                  />
                  <InputComponent inputData={modalInputsData.slug} />
                  <div className={styles.categoryInpWrapper}>
                    <span className="inputName">Category</span>
                    <input 
                    readOnly
                      className="input"
                      placeholder="Kateqoriya axtarın"
                      value={searchInpValue}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSearchInpValue(val);
                        if (val.trim().length > 0) {
                          categorySearchFunc(val);
                          setShowCategoryResultArea(true);
                        } else {
                          setCategorySearchData([]);
                          setShowCategoryResultArea(false);
                          productFormik.setFieldValue("category", "");
                        }
                      }}
                    />
                    {searchInpValue.length > 0 && (
                      <span
                        onClick={() => {
                          setSearchInpValue(""),
                            setShowCategoryResultArea(false);
                        }}
                        className={styles.resetInput}
                      >
                        <CloseIcon />
                      </span>
                    )}
                    {showCategoryResultArea && (
                      <div className={styles.categorySearchResultArea}>
                        {(() => {
                          // if (
                          //   findProductItem &&
                          //   searchInpValue ===
                          //     (findProductItem?.title?.az || "")
                          // ) {
                          //   return null;
                          // }
                          if (
                            searchInpValue.length > 0 &&
                            categorySearchData.length > 0
                          ) {
                            return categorySearchData.map((item) => (
                              <span
                                key={item.id}
                                className={styles.categoryName}
                                onClick={() => {
                                  setSearchInpValue(item?.name?.az || "");
                                  productFormik.setFieldValue(
                                    "category",
                                    item.id
                                  );
                                  setShowCategoryResultArea(false);
                                }}
                              >
                                {item?.name?.az}
                              </span>
                            ));
                          }
                          if (
                            searchInpValue.length > 0 &&
                            categorySearchData.length === 0
                          ) {
                            return (
                              <div className={styles.noCategory}>
                                <span
                                  style={{
                                    color: "red",
                                    paddingLeft: "10px",
                                    fontWeight: "800",
                                  }}
                                >
                                  {searchInpValue}
                                </span>
                                adında kateqoriya yoxdur
                              </div>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    )}
                  </div>
                </div>
                <DescriptionOrTextArea
                  descriptionDatas={modalInputsData.description}
                  activeLang={activeLang}
                  setActiveLang={setActiveLang}
                />
                <span className="inputName">isActive</span>
                {/* <Switch
                  checked={productFormik.isActive}
                  onChange={(checked) =>
                    productFormik.setFieldValue("isActive", checked)
                  }
                /> */}
                <Switch
                  checked={productFormik.values.isActive}
                  onChange={(checked) =>
                    productFormik.setFieldValue("isActive", checked)
                  }
                />

{/* Add products images */}
                {/* <div className={styles.imgAddAreaWrapper}>
                  <label>Image Upload</label>
                  <div className={styles.imgAddWrapper}>
                    <input
                      type="file"
                      onChange={addProductImages}
                      className={styles.imgInput}
                    />
                    <ImageAddIcon />
                    Image Upload
                  </div>
                
                </div> */}
                  {/* <div className={styles.productImagesArea}>
                    {productFormik.values.images.map((img, index) => (
                      <div key={index} className={styles.productImageWrapper}>
                        <img
                          src={`${megaSportAdminPanel.baseUrlImage}/product/${img}`}
                          alt=""
                        />
                        <span
                          onClick={() => deleteProductImage(img)}
                          className={styles.deleteImage}
                        >
                          <CloseIcon />
                        </span>
                      </div>
                    ))}
                  </div> */}
              </div>
              <button type="submit" className="saveBtn">
                Save
              </button>
            </div>
          )}

          {modalActivePage === "Color Images" && (
            <div className={styles.modalAddProductArea}>
              <div className={styles.addProductForm}>
                <div className={styles.nameSlugCategoryInputs}>
                  <div>
                    <span className="inputName">Color</span>
                    <input
                      className="input"
                      type="text"
                      placeholder="Color name"
                      value={colorImageForm.color}
                      onChange={(e) =>
                        handleColorImageChange("color", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <span className="inputName">Color Code</span>
                    <input
                      className="input"
                      type="text"
                      placeholder="#000000"
                      value={colorImageForm.colorCode}
                      onChange={(e) =>
                        handleColorImageChange("colorCode", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className={styles.imgAddAreaWrapper}>
                  <label>Image Upload</label>
                  <div className={styles.imgAddWrapper}>
                    <input
                      type="file"
                      multiple
                      onChange={addColorImages}
                      className={styles.imgInput}
                    />
                    <ImageAddIcon />
                    Image Upload
                  </div>
                  {colorImageForm.images && colorImageForm.images.length > 0 && (
                    <div className={styles.productImagesArea}>
                      {colorImageForm.images.map((img, index) => (
                        <div key={index} className={styles.productImageWrapper}>
                          <img
                            src={`${megaSportAdminPanel.baseUrlImage}/product/${img}`}
                            alt=""
                          />
                          <span
                            onClick={() => deleteColorImageFromForm(img)}
                            className={styles.deleteImage}
                          >
                            <CloseIcon />
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  className="addButtonProducts"
                  onClick={saveColorImage}
                >
                  {editingColorImageIndex !== null
                    ? "Update Color Images"
                    : "Add Color Images"}
                </button>
                 <button type="submit" className="saveBtn">
                Save
              </button>
              </div>

              <Table
                className="options-table"
                columns={colorImagesTable}
                dataSource={productFormik?.values?.colorImages || []}
                rowKey={(_, index) => index}
              />
            </div>
          )}

          {modalActivePage === "Variants" && (
            <>
              <Table
                className="options-table"
                columns={productVariantsTable}
                dataSource={productFormik?.values?.variants || []}
                rowKey="id"
              />
              <span
                className={styles.addOptionsBtn}
                onClick={() => {
                  closeOpenSecondModalFunc();
                  findProductVariantFunc();
                }}
              >
                Add New Variant +
              </span>
              <button type="submit" className="saveBtn">
                Bütün məhsuları yadda saxla
              </button>
            </>
          )}

          {modalActivePage === "Seo" && (
            <div className={styles.modalSeoArea}>
              <div className={styles.seoForm}>
                {modalInputsData.modalSeoAreaInputsData.seoTextAreaDatas.map(
                  (item) => (
                    <DescriptionOrTextArea
                      key={item.id}
                      descriptionDatas={item}
                      activeLang={activeLang}
                      setActiveLang={setActiveLang}
                    />
                  )
                )}
              </div>
              <InputComponent
                inputData={modalInputsData.modalSeoAreaInputsData.isActive}
              />
              <button type="submit" className="saveBtn">
                Save
              </button>
            </div>
          )}
        </form>
      </div>
      {secondShowHiddenModal && (
        <ProductVariantModal
          modalVariantsAreaInputsDatas={modalVariantsAreaInputsDatas}
          modalActivePage={modalActivePage}
          modalPageNameList={modalPageNameList}
          onClickChangeModalPage={onClickChangeModalPage}
          activeLang={activeLang}
          setActiveLang={setActiveLang}
          productFormik={productFormik}
          findProductVariantItem={findProductVariantItem}
        />
      )}
    </div>
  );
}
