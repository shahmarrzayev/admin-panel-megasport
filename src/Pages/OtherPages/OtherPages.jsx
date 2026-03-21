import React, { useState } from 'react'
import FilterIcon from '../../assets/Icons/FilterIcon';
import ArrowDownIcon from '../../assets/Icons/ArrowDownIcon';
import ArrowUpIcon from '../../assets/Icons/ArrowUpIcon';
import AddIcon from '../../assets/Icons/AddIcon';
import { Table } from 'antd';
import Pagination from '../../Components/Pagination/Pagination';
import { UseGlobalContext } from '../../Context/GlobalContext';

const OtherPages = () => {
    const { showHiddenModal, closeOpenModalFunc, deleteForModalShowHiddenFunc } =
    UseGlobalContext();
  const [showHiddenFilterArea, setShowHiddenFilterArea] = useState(false);
  const productsTable = [
    {
      title: "#Id",
      dataIndex: "counterId",
      key: "counterId",
      width: 60,
    },
    {
      title: "Page Name ",
      dataIndex: "title",
      key: "title",
      render: (data) => data.az,
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
  return (
     <div className="productsPageWrapper">
      <div className="pageHeaderSearchFilterAdd">
        <label className="pageHeaderSearchInputWrapper">
          {/* {searchValue.length > 0 ? 
          "" : <SearchIcon />} */}
          <input
            className="pageHeaderSearchInput"
            type="text"
            placeholder="Search"
            // value={searchValue}
            // onChange={handleSearch}
            // onKeyDown={(e) => {
            //     if (e.key === "Enter") {
            //       getAllProductsData(currentPage)
            //     }
            // }}
          />
        </label>
        <div className="pageHeaderFilterArea">
          <div className="pageHeaderFilterArea">
            <button
            //  onClick={handleFilterArea}
             className="pageHeaderFilterBtn">
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
            // onClick={() => {
            //   setFindProductItem(null);
            //   setShowHiddenFilterArea(false);
            //   closeOpenModalFunc();
            // }}
            className="pageHeaderAddBtn"
          >
            <AddIcon />
            Add New Page
          </button>
        </div>
      </div>
   
      <Table
        columns={productsTable}
        dataSource={productsTable.data}
        rowKey="id"
        pagination={false}
      />
      {/* <ModalForDelete
        deleteFunc={deleteProduct}
        deleteItemId={deleteProductId}
      /> */}
      {/* <Pagination
        func={getAllProductsData}
        pageCountApi={allProductsData?.meta?.totalPages}
        sortByParam={sortByParam}
        directionParam={directionParam}
      /> */}
    </div>
  )
}

export default OtherPages