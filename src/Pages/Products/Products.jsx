import { useEffect, useState } from "react";
import styles from "./Products.module.scss";
import { UseGlobalContext } from "../../Context/GlobalContext";
import SearchIcon from "../../assets/Icons/SearchIcon";
import AddIcon from "../../assets/Icons/AddIcon";
import ArrowUpIcon from "../../assets/Icons/ArrowUpIcon";
import ArrowDownIcon from "../../assets/Icons/ArrowDownIcon";
import { useSearchParams } from "react-router-dom";
import FilterIcon from "../../assets/Icons/FilterIcon";
import ProductModal from "../../Components/ProductModal/ProductModal";
import { Table } from "antd";
import moment from "moment";
import EditIcon from "../../assets/Icons/EditIcon";
import DeleteIcon from "../../assets/Icons/DeleteIcon";
import megaSportAdminPanel from "../../Helpers/Helpers";
import url from "../../ApiUrls/Url";
import { useFormik } from "formik";
import ModalForDelete from "../../Components/ModalForDelete/ModalForDelete";
import Pagination from "../../Components/Pagination/Pagination";

export default function Products() {
  const { showHiddenModal, closeOpenModalFunc, deleteForModalShowHiddenFunc } =
    UseGlobalContext();
  const [searchValue, setSearchValue] = useState("");
  const [showHiddenFilterArea, setShowHiddenFilterArea] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const sortByParam = searchParams.get("sortBy") || "createdAt";
  const directionParam = searchParams.get("direction") || "ASC";
  const [modalActivePage, setModalActivePage] = useState("Add Product");
  const modalPageNameList = ["Add Product", "Color Images", "Variants", "Atributes", "Seo"];
  const [activeLang, setActiveLang] = useState("az");
  const [allProductsData, setAllProductsData] = useState([]);
  const [findProductItem, setFindProductItem] = useState();
  const [deleteProductId, setDeleteProductId] = useState(null);
  const currentPage = Number(searchParams.get("page")) || 1;

  const onClickChangeModalPage = (name) => {
    setModalActivePage(name);
  };
  const handleSearch = (e) => {
    setSearchValue(e.target.value);
  };

  const handleFilterArea = () => {
    setShowHiddenFilterArea(!showHiddenFilterArea);
  };

  const handleSortChange = (newSortBy, newDirection) => {
    const newPage =
      newDirection === "DESC" ? allProductsData?.meta?.totalPages || 1 : 1;
    setSearchParams({
      sortBy: newSortBy,
      direction: newDirection,
      page: newPage,
    });
  };

  const getAllProductsData = async (page = 1) => {
    try {
      const resData = await megaSportAdminPanel
        .api()
        .get(
          `${url.productsGetAll(
            sortByParam,
            directionParam
          )}&page=${page}&perPage=30`
        );
      setAllProductsData(resData.data);
      console.log("Products Data",resData.data.data[0]);
      
    } catch (error) {
      console.log(error);
    }
  };

  const findProductFunc = (id) => {
    const findProduct = allProductsData.data.find((item) => item.id === id);
    setFindProductItem(findProduct);
  };

  const deleteProduct = async (id) => {
    try {
      await megaSportAdminPanel.api().delete(url.productDelete(id));
    } catch (error) {
      console.log(error);
    }
    await getAllProductsData(currentPage);
    deleteForModalShowHiddenFunc();
  };
  useEffect(() => {
    document.body.style.overflow = showHiddenModal ? "hidden" : "auto";
  }, [showHiddenModal]);
  const productFormik = useFormik({
    initialValues: {
      title: {
        az: findProductItem?.title?.az || "",
        en: findProductItem?.title?.en || "",
        ru: findProductItem?.title?.ru || "",
      },
      description: {
        az: findProductItem?.description?.az || "",
        en: findProductItem?.description?.en || "",
        ru: findProductItem?.description?.ru || "",
      },
      slug: findProductItem?.slug || "",
      category: findProductItem?.categoryId || "",
      isActive: findProductItem?.isActive || false,
      attributes: findProductItem?.attributes || [],
      variants:
        findProductItem?.variants?.length > 0
          ? findProductItem?.variants?.map((variant) => ({
            color: variant?.color || "",
            colorCode: variant?.colorCode || "",
            size: variant?.size || "",
            stock: variant?.stock || "",
            sku: variant?.sku || "",
            barcode: variant?.barcode || "",
            isActive: variant?.isActive || false,
          }))
          : [],
      colorImages:
        findProductItem?.colorImages?.length > 0
          ? findProductItem?.colorImages?.map((colorImg) => ({
            color: colorImg?.color || "",
            colorCode: colorImg?.colorCode || "",
            images: colorImg?.images || [],

          }))
          : [],
      attributes:
        findProductItem?.attributes?.length > 0
          ? findProductItem?.attributes?.map((atribute) => ({
            attributeId: atribute?.attributeId || "",
            optionId: atribute?.optionId || "",
          }))
          : [],

      seo: {
        title: {
          az: findProductItem?.title?.az || "",
          en: findProductItem?.title?.en || "",
          ru: findProductItem?.title?.ru || "",
        },
        description: {
          az: findProductItem?.description?.az || "",
          en: findProductItem?.description?.en || "",
          ru: findProductItem?.description?.ru || "",
        },
        keyWords: {
          az: findProductItem?.keyWords?.az || "",
          en: findProductItem?.keyWords?.en || "",
          ru: findProductItem?.keyWords?.ru || "",
        },
        url: {
          az: findProductItem?.url?.az || "",
          en: findProductItem?.url?.en || "",
          ru: findProductItem?.url?.ru || "",
        },
        useInSitemap: findProductItem?.seo?.useInSitemap ?? false,
      },
    },
    enableReinitialize: true,
    onSubmit: async (formValues) => {
      const payload = {
        ...formValues,
        categoryId: formValues.category,
        variants: formValues.variants?.map((variant) => ({
          ...variant,
          price: Number(variant.price),
          stock: Number(variant.stock),
        })),
      };
      if (findProductItem) {
        await megaSportAdminPanel
          .api()
          .put(url.productUpdata(findProductItem.id), payload);
      } else {
        await megaSportAdminPanel.api().post(url.productCreated, payload);
      }
      getAllProductsData(currentPage);
      productFormik.resetForm();
      setFindProductItem(null);
      closeOpenModalFunc();
    },
  });

  const modalInputsData = {
    productName: {
      id: 1,
      label: "Product Name",
      inputType: "text",
      langShow: true,
      name: `title.${activeLang}`,
      inpValue: productFormik.values.title[activeLang],
      onChange: productFormik.handleChange,
    },
    slug: {
      id: 2,
      label: "Slug",
      inputType: "text",
      name: "slug",
      inpValue: productFormik.values.slug,
      onChange: productFormik.handleChange,
    },
    description: {
      id: 3,
      langShow: true,
      rows: 4,
      label: "Description",
      name: `description.${activeLang}`,
      inpValue: productFormik.values.description[activeLang],
      onChange: productFormik.handleChange,
    },
    isActive: {
      id: 4,
      label: "Status",
      inputType: "switch",
      name: "isActive",
      inpValue: productFormik.values.isActive,
      onChange: (checked) => productFormik.setFieldValue("isActive", checked),
    },

    modalSeoAreaInputsData: {
      seoTextAreaDatas: [
        {
          id: 11,
          langShow: true,
          rows: 4,
          label: "Title",
          name: `seo.title.${activeLang}`,
          inpValue: productFormik.values.seo.title[activeLang],
          onChange: productFormik.handleChange,
        },
        {
          id: 12,
          langShow: true,
          rows: 4,
          label: "Description",
          name: `seo.description.${activeLang}`,
          inpValue: productFormik.values.seo.description[activeLang],
          onChange: productFormik.handleChange,
        },
        {
          id: 13,
          langShow: true,
          rows: 4,
          label: "Key Words",
          name: `seo.keyWords.${activeLang}`,
          inpValue: productFormik.values.seo.keyWords[activeLang],
          onChange: productFormik.handleChange,
        },
        {
          id: 14,
          langShow: true,
          rows: 2,
          label: "URL",
          name: `seo.url.${activeLang}`,
          inpValue: productFormik.values.seo.url[activeLang],
          onChange: productFormik.handleChange,
        },
      ],
      isActive: {
        id: 15,
        label: "Use URL in Sitemap",
        inputType: "switch",
        name: "seo.useInSitemap",
        inpValue: productFormik.values.seo.useInSitemap,
        onChange: (checked) =>
          productFormik.setFieldValue("seo.useInSitemap", checked),
      },
    },
  };
  const productsTable = [
    {
      title: "#Id",
      dataIndex: "counterId",
      key: "counterId",
      width: 60,
    },
    {
      title: "Image",
      dataIndex: "images",
      key: "images",
      render: (data) =>
        data.map((imageName) => (
          <img style={{ width: "15px", height: "15px" }} src={`${megaSportAdminPanel.baseUrlImage}product/${imageName}`} />
        )),
    },
    {
      title: "Product Name",
      dataIndex: "title",
      key: "title",
      render: (data) => data.az,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
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
              findProductFunc(record.id);
              setShowHiddenFilterArea(false);
              closeOpenModalFunc();
            }}
          >
            <EditIcon />
          </span>
          <span
            onClick={() => {
              setDeleteProductId(record.id);
              deleteForModalShowHiddenFunc();
            }}
          >
            <DeleteIcon />
          </span>
        </div>
      ),
    },
  ];

  const addProductImages = async (event) => {
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
          productFormik.setFieldValue("images", [
            ...(productFormik.values.images || []),
            res.data.name,
          ]);
        }
      } catch (error) {
        console.error("Upload error:", error);
      }
    }
  };

  const deleteProductImage = async (imageName) => {
    try {
      await megaSportAdminPanel
        .api()
        .delete(url.fileDelete(imageName, "product"));

      const updatedImages = productFormik.values.images.filter(
        (img) => img !== imageName
      );

      productFormik.setFieldValue("images", updatedImages);
    } catch (error) {
      console.log("Delete image error:", error);
    }
  };

  // console.log("data products all--", allProductsData);
  // console.log("images data---", productFormik.values.images);

  return (
    <div className={styles.productsPageWrapper}>
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
          <div className="pageHeaderFilterArea">
            <button onClick={handleFilterArea} className="pageHeaderFilterBtn">
              <FilterIcon /> Filter
            </button>

            {showHiddenFilterArea && (
              <div className="pageHeaderFilterContent">
                <span
                  onClick={() => handleSortChange("createdAt", "ASC")}
                  className={`pageHeaderFilterType ${sortByParam === "createdAt" && directionParam === "ASC"
                    ? "activeBtn"
                    : ""
                    }`}
                >
                  Yaranma tarixinə görə <ArrowDownIcon />
                </span>
                <span
                  onClick={() => handleSortChange("createdAt", "DESC")}
                  className={`pageHeaderFilterType ${sortByParam === "createdAt" && directionParam === "DESC"
                    ? "activeBtn"
                    : ""
                    }`}
                >
                  Yaranma tarixinə görə <ArrowUpIcon />
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => {
              setFindProductItem(null);
              setShowHiddenFilterArea(false);
              closeOpenModalFunc();
            }}
            className="pageHeaderAddBtn"
          >
            <AddIcon />
            Add New Products
          </button>
        </div>
      </div>
      {showHiddenModal && (
        <ProductModal
          modalInputsData={modalInputsData}
          modalActivePage={modalActivePage}
          modalPageNameList={modalPageNameList}
          addProductImages={addProductImages}
          deleteProductImage={deleteProductImage}
          onClickChangeModalPage={onClickChangeModalPage}
          activeLang={activeLang}
          setActiveLang={setActiveLang}
          submitFunc={productFormik.handleSubmit}
          productFormik={productFormik}
          findProductItem={findProductItem}
        />
      )}
      <Table
        columns={productsTable}
        dataSource={allProductsData.data}
        rowKey="id"
        pagination={false}
      />
      <ModalForDelete
        deleteFunc={deleteProduct}
        deleteItemId={deleteProductId}
      />
      <Pagination
        func={getAllProductsData}
        pageCountApi={allProductsData?.meta?.totalPages}
        sortByParam={sortByParam}
        directionParam={directionParam}
      />
    </div>
  );
}
