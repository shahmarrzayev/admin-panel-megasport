import { useEffect, useState } from "react";
import styles from "./Categories.module.scss";
import { UseGlobalContext } from "../../Context/GlobalContext";
import SearchIcon from "../../assets/Icons/SearchIcon";
import AddIcon from "../../assets/Icons/AddIcon";
import { Switch, Table } from "antd";
import moment from "moment";
import EditIcon from "../../assets/Icons/EditIcon";
import DeleteIcon from "../../assets/Icons/DeleteIcon";
import megaSportAdminPanel from "../../Helpers/Helpers";
import url from "../../ApiUrls/Url";
import CloseIcon from "../../assets/Icons/CloseIcon";
import { useFormik } from "formik";
import ModalForDelete from "../../Components/ModalForDelete/ModalForDelete";
import ImageAddIcon from "../../assets/Icons/ImageAddIcon";
import Pagination from "../../Components/Pagination/Pagination";
import { useSearchParams } from "react-router-dom";

export default function Categories() {
  const { showHiddenModal, closeOpenModalFunc, deleteForModalShowHiddenFunc } =
    UseGlobalContext();
  const [searchValue, setSearchValue] = useState("");
  const [allCategoriesDatas, setGetAllCategoriesDatas] = useState([]);
  const [findCategory, setFindCategory] = useState(null);
  const [activeLang, setActiveLang] = useState("az");
  const [parentCategorySearchInp, setParentCategorySearchInp] = useState("");
  const [parentCategorySearchData, setParentCategorySearchData] = useState([]);
  const [showParentCategoryResults, setShowParentCategoryResults] =
    useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  const [searchParams] = useSearchParams();
  const [categoryActiveTab, setCategoryActiveTab] = useState("General");
  const [externalSearchInp, setExternalSearchInp] = useState("");
  const [externalSearchData, setExternalSearchData] = useState([]);
  const [showExternalResults, setShowExternalResults] = useState(false);
  const currentPage = Number(searchParams.get("page")) || 1;

  const genderDatas = [
    {
      id: 1,
      name: "KİŞİ"
    },
    {
      id: 2,
      name: "QADIN"
    },
    {
      id: 3,
      name: "UNİSEX"
    },
    {
      id: 4,
      name: "UŞAQ"
    },
    {
      id: 5,
      name: "ACCESSORIES"
    },
    {
      id: 6,
      name: "GƏNC UNİSEX"
    },
  ]
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

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
  };

  const getAllCategoriesDatas = async (page = 1) => {
    try {
      const resData = await megaSportAdminPanel
        .api()
        .get(`${url.categoriesGetAllDatas}?page=${page}&perPage=10`);
      setGetAllCategoriesDatas(resData.data);
    } catch (error) {
      console.log(error);
    }
  };
  const parentCategorySearchFunc = async (data) => {
    try {
      const resData = await megaSportAdminPanel
        .api()
        .get(url.categorySearch(data, findCategory?.id));
      setParentCategorySearchData(resData.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const externalCategorySearchFunc = async (searchTerm) => {
    try {
      const resData = await megaSportAdminPanel
        .api()
        .get(url.categorySearchExternal(searchTerm));
      setExternalSearchData(resData.data.data || []);
      console.log("external search data:", resData.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addExternalCategoryId = (item) => {
    console.log("selected external item:", item);

    const code =
      item?.externalCategoryCode ?? item?.code ?? item?.id ?? item?.externalCategoryId;
    if (!code) return;

    const name = item?.name?.az || item?.name || item?.title || String(code);

    const current = category.values.externalCategories || [];
    if (current.some((ext) => ext?.code === code || ext === code)) return;

    const normalizedCurrent = current.map((ext) =>
      typeof ext === "string" || typeof ext === "number"
        ? { code: ext, name: String(ext) }
        : ext
    );

    category.setFieldValue("externalCategories", [
      ...normalizedCurrent,
      { code, name },
    ]);
  };

  const removeExternalCategoryId = (codeToRemove) => {
    const current = category.values.externalCategories || [];
    const updated = current
      .map((ext) =>
        typeof ext === "string" || typeof ext === "number"
          ? { code: ext, name: String(ext) }
          : ext
      )
      .filter((ext) => ext.code !== codeToRemove);
    category.setFieldValue("externalCategories", updated);
  };
  // console.log("categories curent page --", currentPage);

  const category = useFormik({
    initialValues: {
      name: {
        az: findCategory?.name?.az || "",
        en: findCategory?.name?.en || "",
        ru: findCategory?.name?.ru || "",
      },
      slug: findCategory?.slug || "",
      description: {
        az: findCategory?.description?.az || "",
        en: findCategory?.description?.en || "",
        ru: findCategory?.description?.ru || "",
      },
      parentCategory: findCategory?.parentCategory?.name?.az || "",
      sortOrder: findCategory?.sortOrder ?? "",
      image: findCategory?.image || "",
      targetGender: findCategory?.targetGender || "",
      targetBrand: findCategory?.targetBrand || "",
      externalCategories:
        findCategory?.externalCategories?.length > 0
          ? findCategory.externalCategories.map((ext) => {
              if (
                typeof ext === "string" ||
                typeof ext === "number"
              ) {
                return { code: ext, name: String(ext) };
              }
              const code =
                ext.code ?? ext.externalCategoryCode ?? ext.id ?? ext.externalCategoryId;
              const name =
                ext.name?.az ||
                ext.name ||
                ext.title ||
                (code ? String(code) : "");
              return { code, name };
            })
          : [],
      isActive: findCategory?.isActive || false,
    },
    enableReinitialize: true,
    onSubmit: async (formValues) => {
      if (parentCategorySearchData.length === 0) {
        formValues.parentCategory = null;
      }
      const payload = {
        ...formValues,
        externalCategories: (formValues.externalCategories || []).map((ext) =>
          typeof ext === "string" || typeof ext === "number"
            ? ext
            : ext.code
        ),
      };

      if (findCategory) {
        await megaSportAdminPanel
          .api()
          .put(url.categoryUpdate(findCategory.id), payload);
      } else {
        await megaSportAdminPanel.api().post(url.categoryAdd, payload);
      }
      getAllCategoriesDatas(currentPage);
      category.resetForm();
      setFindCategory(null);
      closeOpenModalFunc();
    },
  });

  const findCategoryFunc = (id) => {
    const findResultCategory = allCategoriesDatas?.data?.find(
      (item) => item.id === id
    );
    setFindCategory(findResultCategory);
  };

  useEffect(() => {
    if (findCategory?.parentCategory) {
      setParentCategorySearchInp(findCategory.parentCategory.name?.az || "");
      category.setFieldValue("parentCategory", findCategory.parentCategory.id);
    } else {
      setParentCategorySearchInp("");
      category.setFieldValue("parentCategory", "");
    }
  }, [findCategory]);

  const deleteCategoryFunc = async (id) => {
    try {
      await megaSportAdminPanel.api().delete(url.categoryDelete(id));
    } catch (error) {
      console.log(error);
    }
    await getAllCategoriesDatas();
    deleteForModalShowHiddenFunc();
  };

  useEffect(() => {
    document.body.style.overflow = showHiddenModal ? "hidden" : "auto";
  }, [showHiddenModal]);

  const columns = [
    {
      title: "#Id",
      dataIndex: "counterId",
      key: "counterId",
      width: 60,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (translatedField) => translatedField.az,
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
    },
    {
      title: "Parent Category",
      dataIndex: "parentCategory",
      key: "parentCategory",
      render: (parentCategory) => parentCategory?.name?.az || "-",
    },
    {
      title: "Sort Order",
      dataIndex: "sortOrder",
      key: "sortOrder",
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "status",
      width: 150,
      render: (isActive) => (
        <span className={`${isActive ? "activeStatus" : "noActiveStatus"}`}>
          {isActive ? "Active" : "DeActive"}
        </span>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (dateString) => {
        return dateString ? moment(dateString).format("DD MMM YYYY") : "-";
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (record) => (
        <div className="icon-list">
          <span
            onClick={() => {
              findCategoryFunc(record.id);
              setCategoryActiveTab("General");
              closeOpenModalFunc();
            }}
          >
            <EditIcon />
          </span>
          <span
            onClick={() => {
              setDeleteCategoryId(record.id);
              deleteForModalShowHiddenFunc();
            }}
          >
            <DeleteIcon />
          </span>
        </div>
      ),
    },
  ];

  const handleChangeImg = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await megaSportAdminPanel
        .api()
        .post(url.fileUpload("category"), formData);
      if (res?.data?.name) {
        category.setFieldValue("image", res?.data?.name);
      }
    } catch (error) {
      console.error(error);
    }
  };
  // console.log("find category ---", findCategory);
  // console.log("result data --- ", showParentCategoryResults);
  // console.log("testtt--", category.values.image);
  //  console.log("testtt-777-", category);
  const deleteCategoryImage = async () => {
    try {
      category.setFieldValue("image", "");
      await megaSportAdminPanel
        .api()
        .delete(url.fileDelete(category.values.image, "category"));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.categoriesPageWrapper}>
      <div className="pageHeaderSearchFilterAdd">
        <label className="pageHeaderSearchInputWrapper">
          {searchValue.length > 0 ? "" : <SearchIcon />}
          <input
            className="pageHeaderSearchInput"
            type="text"
            placeholder="Search"
            value={searchValue}
            onChange={handleSearch}
          />
        </label>
        <div className="pageHeaderFilterArea">
          <button
            onClick={() => {
              setFindCategory(null);
              setCategoryActiveTab("General");
              closeOpenModalFunc();
            }}
            className="pageHeaderAddBtn"
          >
            <AddIcon />
            Add New Categories
          </button>
        </div>
      </div>
      {showHiddenModal && (
        <div className={styles.addModalWrapper}>
          <div onClick={closeOpenModalFunc} className="overlay"></div>
          <div className={styles.modalArea}>
            <h4 className="pageTitle">
              {findCategory ? "Edit Categories" : "Add New Categories"}
            </h4>
            <span onClick={closeOpenModalFunc} className={styles.closeIcon}>
              <CloseIcon />
            </span>
            <form onSubmit={category.handleSubmit}>
              <div className={styles.modalTabList}>
                <span
                  className={`${styles.modalTab} ${categoryActiveTab === "General" ? styles.activeTab : ""
                    }`}
                  onClick={() => setCategoryActiveTab("General")}
                >
                  General
                </span>
                <span
                  className={`${styles.modalTab} ${categoryActiveTab === "External Categories" ? styles.activeTab : ""
                    }`}
                  onClick={() => setCategoryActiveTab("External Categories")}
                >
                  External Categories
                </span>
              </div>

              {categoryActiveTab === "General" && (
                <>
              <div className={styles.nameSlugWrapper}>
                <div className={styles.nameInputWrapper}>
                  <span className="inputName">Name</span>
                  <div className="langArea">
                    {["az", "en", "ru"].map((lang, index) => (
                      <span
                        key={index}
                        onClick={() => setActiveLang(lang)}
                        className={`lang ${activeLang === lang ? "activeLang" : ""
                          }`}
                      >
                        {lang.toLocaleUpperCase()}
                      </span>
                    ))}
                  </div>
                  <input
                    name={`name.${activeLang}`}
                    value={category?.values?.name[activeLang]}
                    onChange={category.handleChange}
                    className={styles.categoryInput}
                  />
                </div>
                <div className={styles.slug}>
                  <span className="inputName">Slug</span>
                  <input
                    name="slug"
                    value={category.values.slug}
                    onChange={category.handleChange}
                    className={styles.categoryInput}
                  />
                </div>
              </div>

              <div className={styles.descriptionWraper}>
                <span className="inputName">Description</span>
                <div className="langArea">
                  {["az", "en", "ru"].map((lang, index) => (
                    <span
                      key={index}
                      onClick={() => setActiveLang(lang)}
                      className={`lang ${activeLang === lang ? "activeLang" : ""
                        }`}
                    >
                      {lang.toLocaleUpperCase()}
                    </span>
                  ))}
                </div>

                <textarea
                  name={`description.${activeLang}`}
                  rows="4"
                  value={category?.values?.description[activeLang]}
                  onChange={category.handleChange}
                  className="description"
                ></textarea>
              </div>
              <div className={styles.parentCategoryAndSortOrderInpWraper}>
                <div className={styles.parentCategoryInp}>
                  <span className="inputName">Parent Category</span>
                  <input
                    className={styles.categoryInput}
                    value={parentCategorySearchInp}
                    placeholder="Kategoriya axtarın ..."
                    onChange={(e) => {
                      const val = e.target.value;
                      setParentCategorySearchInp(val);
                      if (val.trim().length > 0) {
                        parentCategorySearchFunc(val);
                        setShowParentCategoryResults(true);
                      } else {
                        setParentCategorySearchData([]);
                        setShowParentCategoryResults(false);
                        category.setFieldValue("parentCategory", "");
                      }
                    }}
                  />
                  {parentCategorySearchInp.length > 0 && (
                    <span
                      onClick={() => {
                        setParentCategorySearchInp(""),
                          setShowParentCategoryResults(false);
                      }}
                      className={styles.resetInput}
                    >
                      <CloseIcon />
                    </span>
                  )}
                  {showParentCategoryResults && (
                    <div className={styles.searchResultArea}>
                      {(() => {
                        if (
                          findCategory &&
                          parentCategorySearchInp ===
                          (findCategory.parentCategory?.name?.az || "")
                        ) {
                          return null;
                        }
                        if (
                          parentCategorySearchInp.length > 0 &&
                          parentCategorySearchData.length > 0
                        ) {
                          return parentCategorySearchData.map((item) => (
                            <span
                              key={item.id}
                              className={styles.parentCategoryName}
                              onClick={() => {
                                setParentCategorySearchInp(item.name?.az || "");
                                category.setFieldValue(
                                  "parentCategory",
                                  item.id
                                );
                                setShowParentCategoryResults(false);
                              }}
                            >
                              {item.name?.az}
                            </span>
                          ));
                        }
                        if (
                          parentCategorySearchInp.length > 0 &&
                          parentCategorySearchData.length === 0
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
                                {parentCategorySearchInp}
                              </span>{" "}
                              adında kateqoriya yoxdur
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  )}
                </div>

                <div className={styles.sortOrderInp}>
                  <span className="inputName">Sort Order</span>
                  <input
                    type="number"
                    className={styles.categoryInput}
                    name="sortOrder"
                    value={category?.values?.sortOrder}
                    onChange={category.handleChange}
                  />
                </div>
              </div>
              <div className={styles.imgAddAreaWrapper}>
                <span className="inputName">
                  {category.values.image ? "Category Image" : "Image Upload"}
                </span>
                {category.values.image ? (
                  <div className={styles.categoryImageWrapper}>
                    <img
                      src={`${megaSportAdminPanel.baseUrlImage}category/${category.values.image}`}
                    />
                    <span
                      className={styles.deleteIcon}
                      onClick={deleteCategoryImage}
                    >
                      <CloseIcon />
                    </span>
                  </div>
                ) : (
                  <div className={styles.imgAddWrapper}>
                    <input
                      type="file"
                      onChange={handleChangeImg}
                      className={styles.imgInput}
                    />
                    <ImageAddIcon />
                    Image Upload
                  </div>
                )}
              </div>
              <div className={styles.parentCategoryAndSortOrderInpWraper}>

                <div className={styles.genderSelect}>
                  <span className="inputName">Gender</span>
                  <select name="targetGender"
                    value={category.values.targetGender}
                    onChange={category.handleChange}>
                      <option value=""></option>
                    {genderDatas.map((gen) => (
                      <option key={gen.id} value={gen.name}>
                        {gen.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.brandSelect}>
                  <span className="inputName">Brand</span>
                  <select name="targetBrand"
                    value={category.values.targetBrand}
                    onChange={category.handleChange}>
                      <option value=""></option>
                    {targetBrandDatas.map((brand) => (
                      <option key={brand.id} value={brand.name}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={styles.switchInput}>
                <span className="inputName">isActive</span>
                <Switch
                  checked={category.values.isActive}
                  onChange={(checked) =>
                    category.setFieldValue("isActive", checked)
                  }
                />
              </div>
              </>
              )}

              {categoryActiveTab === "External Categories" && (
                <>
                  <div className={styles.externalCategoriesWrapper}>
                    <span className="inputName">Search External Categories</span>
                    <input
                      className={styles.categoryInput}
                      value={externalSearchInp}
                      placeholder="External category search..."
                      onChange={(e) => {
                        const val = e.target.value;
                        setExternalSearchInp(val);
                        if (val.trim().length > 0) {
                          externalCategorySearchFunc(val);
                          setShowExternalResults(true);
                        } else {
                          setExternalSearchData([]);
                          setShowExternalResults(false);
                        }
                      }}
                    />
                    {externalSearchInp.length > 0 && (
                      <span
                        onClick={() => {
                          setExternalSearchInp("");
                          setShowExternalResults(false);
                          setExternalSearchData([]);
                        }}
                        className={styles.resetInput}
                      >
                        <CloseIcon />
                      </span>
                    )}
                    {showExternalResults && (
                      <div className={styles.searchResultArea}>
                        {externalSearchInp.length > 0 &&
                          externalSearchData.length > 0 &&
                          externalSearchData.map((item) => (
                            <span
                              key={item.id || item.externalCategoryId}
                              className={styles.parentCategoryName}
                              onClick={() => addExternalCategoryId(item)}
                            >
                              {item.name?.az ||
                                item.name ||
                                item.title ||
                                (item.id || item.externalCategoryId)}
                            </span>
                          ))}
                        {externalSearchInp.length > 0 &&
                          externalSearchData.length === 0 && (
                            <div className={styles.noCategory}>
                              <span
                                style={{
                                  color: "red",
                                  paddingLeft: "10px",
                                  fontWeight: "800",
                                }}
                              >
                                {externalSearchInp}
                              </span>{" "}
                              adında external kateqoriya yoxdur
                            </div>
                          )}
                      </div>
                    )}
                  </div>

                  <div className={styles.selectedExternalCategories}>
                    <span className="inputName">Selected External Categories</span>
                    <div className={styles.selectedExternalCategoriesList}>
                      {(category.values.externalCategories || []).map((ext) => {
                        const code =
                          typeof ext === "string" || typeof ext === "number"
                            ? ext
                            : ext.code;
                        const name =
                          typeof ext === "string" || typeof ext === "number"
                            ? ext
                            : ext.name;
                        return (
                          <span
                            key={code}
                            className={styles.selectedExternalCategoryItem}
                          >
                            <span>{name}</span>
                            <button
                              type="button"
                              onClick={() => removeExternalCategoryId(code)}
                            >
                              <CloseIcon />
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              <button className="saveBtn" type="submit">
                Save
              </button>
            </form>
          </div>
        </div>
      )}
      <Table
        columns={columns}
        dataSource={allCategoriesDatas?.data}
        rowKey="id"
      />
      <ModalForDelete
        deleteFunc={deleteCategoryFunc}
        deleteItemId={deleteCategoryId}
      />
      <Pagination
        func={getAllCategoriesDatas}
        pageCountApi={allCategoriesDatas?.meta?.totalPages}
      />
    </div>
  );
}
