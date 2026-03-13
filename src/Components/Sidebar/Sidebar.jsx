import { NavLink } from "react-router-dom"
import styles from "./Sidebar.module.scss"
import { useEffect, useState } from "react";
import AccessIcon from "../../assets/Icons/AccessIcon";
import UserIcon from "../../assets/Icons/UserIcon";
import RolesIcon from "../../assets/Icons/RolesIcon";
import UserActivitiesIcon from "../../assets/Icons/UserActivitiesIcon";
import DownIcon from "../../assets/Icons/DownIcon";
import CustomerIcon from "../../assets/Icons/CustomerIcon";
import CustomersIcon from "../../assets/Icons/CustomersIcon";
import CatalogIcon from "../../assets/Icons/CatalogIcon";
import CategoriesIcon from "../../assets/Icons/CategoriesIcon";
import ProductsIcon from "../../assets/Icons/ProductsIcon";
import AttributesIcon from "../../assets/Icons/AttributesIcon";
import SalesMarketingIcon from "../../assets/Icons/SalesMarketingIcon";
import DiscountsIcon from "../../assets/Icons/DiscountsIcon";
import OrdersIcon from "../../assets/Icons/OrdersIcon";


export default function Sidebar() {
  
  
  const [showHiddenPage, setShowHiddenPage] = useState({
    access: false,
    customer: false,
    catalog: false,
    SalesMarketing:false
  })

  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith("/roles") || path === "/") {
      setShowHiddenPage((prev) => ({ ...prev, access: true }));
    } else if (path.startsWith("/customers")) {
      setShowHiddenPage((prev) => ({ ...prev, customer: true }));
    } else if (
      path.startsWith("/products") ||
      path.startsWith("/categories") ||
      path.startsWith("/attributes")
    ) {
      setShowHiddenPage((prev) => ({ ...prev, catalog: true }));
    } else if (path.startsWith("/discounts") || path.startsWith("/orders")) {
      setShowHiddenPage((prev) => ({ ...prev, SalesMarketing: true }));
    }
  }, [location.pathname]);

 const onClickShowHiddenPage = (sectionTitle) => {
   setShowHiddenPage((prev) => ({
     ...prev,
     [sectionTitle] : !prev[sectionTitle]
      }))
  }

  return (
    <div className={styles.sidebarWrapper}>
      <div
        onClick={() => onClickShowHiddenPage("access")}
        className={styles.mainPage}
      >
        <span className={styles.iconName}>
          <AccessIcon /> Access Control
        </span>
        <span
          className={`${styles.downUpIcon} ${
            showHiddenPage.access ? styles.rotateIcon : ""
          }`}
        >
          <DownIcon />
        </span>
      </div>
      <div
        className={`${styles.pageList} ${
          showHiddenPage.access ? styles.activePageList : ""
        }`}
      >
        <NavLink
          to="/"
          className={({ isActive }) => ` ${isActive ? styles.active : ""}`}
        >
          {({ isActive }) => (
            <>
              <UserIcon color={isActive ? "rgba(66, 180, 47, 1)" : "#6A6A6A"} />
              User
            </>
          )}
        </NavLink>
        <NavLink
          to="roles"
          className={({ isActive }) => ` ${isActive ? styles.active : ""}`}
        >
          {({ isActive }) => (
            <>
              <RolesIcon
                color={isActive ? "rgba(66, 180, 47, 1)" : "#6A6A6A"}
              />
              Roles
            </>
          )}
        </NavLink>
        {/* <NavLink
          to=""
          className={({ isActive }) => ` ${isActive ? styles.active : ""}`}
        >
          <UserActivitiesIcon /> User Activities
        </NavLink> */}
      </div>

      <div
        onClick={() => onClickShowHiddenPage("customer")}
        className={styles.mainPage}
      >
        <span className={styles.iconName}>
          <CustomerIcon /> Customer
        </span>

        <span
          className={`${styles.downUpIcon} ${
            showHiddenPage.customer ? styles.rotateIcon : ""
          }`}
        >
          <DownIcon />
        </span>
      </div>
      <div
        className={`${styles.pageList} ${
          showHiddenPage.customer ? styles.activePageList : ""
        }`}
      >
        <NavLink
          to="customers"
          className={({ isActive }) => ` ${isActive ? styles.active : ""}`}
        >
          {({ isActive }) => (
            <>
              <CustomersIcon
                color={isActive ? "rgba(66, 180, 47, 1)" : "#6A6A6A"}
              />
              Customers
            </>
          )}
        </NavLink>
      </div>

      <div
        onClick={() => onClickShowHiddenPage("catalog")}
        className={styles.mainPage}
      >
        <span className={styles.iconName}>
          <CatalogIcon /> Catalog
        </span>
        <span
          className={`${styles.downUpIcon} ${
            showHiddenPage.catalog ? styles.rotateIcon : ""
          }`}
        >
          <DownIcon />
        </span>
      </div>
      <div
        className={`${styles.pageList} ${
          showHiddenPage.catalog ? styles.activePageList : ""
        }`}
      >
        <NavLink
          to="products"
          className={({ isActive }) => `${isActive ? styles.active : ""}`}
        >
          {({ isActive }) => (
            <>
              <ProductsIcon
                color={isActive ? "rgba(66, 180, 47, 1)" : "#6A6A6A"}
              />
              Products
            </>
          )}
        </NavLink>
        <NavLink
          to="categories"
          className={({ isActive }) => ` ${isActive ? styles.active : ""}`}
        >
          {({ isActive }) => (
            <>
              <CategoriesIcon
                color={isActive ? "rgba(66, 180, 47, 1)" : "#6A6A6A"}
              />
              Categories
            </>
          )}
        </NavLink>
        <NavLink
          to="attributes"
          className={({ isActive }) => ` ${isActive ? styles.active : ""}`}
        >
          {({ isActive }) => (
            <>
              <AttributesIcon
                color={isActive ? "rgba(66, 180, 47, 1)" : "#6A6A6A"}
              />
              Attributes
            </>
          )}
        </NavLink>
        <NavLink
          to="homepages"
          className={({ isActive }) => ` ${isActive ? styles.active : ""}`}
        >
          {({ isActive }) => (
            <>
              <CategoriesIcon
                color={isActive ? "rgba(66, 180, 47, 1)" : "#6A6A6A"}
              />


              Home Page
            </>
          )}
        </NavLink>
        <NavLink
          to="pages"
          className={({ isActive }) => ` ${isActive ? styles.active : ""}`}
        >
          {({ isActive }) => (
            <>
              <AttributesIcon
                color={isActive ? "rgba(66, 180, 47, 1)" : "#6A6A6A"}
              />
              Pages
            </>
          )}
        </NavLink>
      </div>
      <div
        onClick={() => onClickShowHiddenPage("SalesMarketing")}
        className={styles.mainPage}
      >
        <span className={styles.iconName}>
          <SalesMarketingIcon /> Sales & Marketing
        </span>
        <span
          className={`${styles.downUpIcon} ${
            showHiddenPage.SalesMarketing ? styles.rotateIcon : ""
          }`}
        >
          <DownIcon />
        </span>
      </div>
      <div
        className={`${styles.pageList} ${
          showHiddenPage.SalesMarketing ? styles.activePageList : ""
        }`}
      >
        <NavLink
          to="discounts"
          className={({ isActive }) => `${isActive ? styles.active : ""}`}
        >
          {({ isActive }) => (
            <>
              <DiscountsIcon
                color={isActive ? "rgba(66, 180, 47, 1)" : "#6A6A6A"}
              />
              Discounts
            </>
          )}
        </NavLink>
        <NavLink
          to="orders"
          className={({ isActive }) => ` ${isActive ? styles.active : ""}`}
        >
          {({ isActive }) => (
            <>
              <OrdersIcon
                color={isActive ? "rgba(66, 180, 47, 1)" : "#6A6A6A"}
              />
              Orders
            </>
          )}
        </NavLink>
      </div>
    </div>
  );
}
