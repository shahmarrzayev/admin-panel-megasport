import { Table } from "antd";
import EditIcon from "../../assets/Icons/EditIcon";
import styles from "./User.module.scss";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { UseGlobalContext } from "../../Context/GlobalContext";
import megaSportAdminPanel from "../../Helpers/Helpers";
import url from "../../ApiUrls/Url";
import moment from "moment";
import Pagination from "../../Components/Pagination/Pagination";
// import { useSearchParams } from "react-router-dom";
import SearchIcon from "../../assets/Icons/SearchIcon";
import AddIcon from "../../assets/Icons/AddIcon";
import Modal from "../../Components/Modal/Modal";
import ModalInfoAndPassword from "../../Components/ModalInfoAndPassword/ModalInfoAndPassword";
import { useSearchParams } from "react-router-dom";

export default function User() {
  const { closeOpenModalFunc, editForModalShowHiddenFunc } = UseGlobalContext();
  const [searchValue, setSearchValue] = useState("");
  const [userRoleDatas, setUserRoleDatas] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const getUserRoleDatas = async () => {
    try {
      const resData = await megaSportAdminPanel.api().get(url.rolesGetAll);
      setUserRoleDatas(resData && resData.data ? resData.data : []);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllUsersData = async (page = 1) => {
    try {
      const resData = await megaSportAdminPanel
        .api()
        .get(`${url.usersGetAll}?page=${page}&perPage=7`);
      setUsersData(resData.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserRoleDatas();
  }, []);

  // useEffect(() => {
  // getAllUsersData(currentPage);
  // }, [currentPage]);

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
  };

  //  sıfırdan yeni user əlavə ederek api-ye gondermek
  const addUser = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      roles: "",
      status: false,
    },
    onSubmit: async (formValues) => {
      try {
        // burda userin roluna gore hemin rolun id-sini tapib api gonderirem
        const selectedRole = userRoleDatas.find(
          (role) => role.title === formValues.roles
        );
        const payload = {
          ...formValues,
          roleIds: selectedRole ? [selectedRole.id] : [],
          isActive: formValues.status,
        };
        await megaSportAdminPanel.api().post(url.userCreate, payload);
        getAllUsersData(currentPage);
      } catch (error) {
        console.log(error);
      }
      addUser.resetForm();
      closeOpenModalFunc();
    },
  });
  //  userin melumetlarini deyisdirib api-ye gondermek
  const userInfoForm = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      roles: [],
      status: false,
    },
    enableReinitialize: true,
    onSubmit: async (formValues) => {
      try {
        const selectedRoles = userRoleDatas.filter((r) =>
          formValues.roles.includes(r.title)
        );
        const payload = {
          ...formValues,
          id: selectedUserData.id,
          roleIds: selectedRoles.map((r) => r.id),
          isActive: formValues.status,
        };
        await megaSportAdminPanel.api().put(url.userUpdate(payload.id), payload);
        getAllUsersData(currentPage);
      } catch (error) {
        console.log(error);
      }
      // getAllUsersData(currentPage);
      userInfoForm.resetForm();
      setSelectedUserData(null);
      editForModalShowHiddenFunc();
    },
  });
  // userin password - nu deyisdirib apiye gondermek
  const userPasswordForm = useFormik({
    initialValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
    onSubmit: async (formValues) => {
      try {
        await megaSportAdminPanel
          .api()
          .put(url.userChangePassword(selectedUserData.id), formValues);
      } catch (error) {
        console.log(error);
      }
      userPasswordForm.resetForm();
      editForModalShowHiddenFunc();
    },
  });

  // hansi id li userde deyisiklik etmek islediyimizi tapiriq
  const findSelectedUserData = (id) => {
    const findSelectUser = usersData.data.find((user) => user.id === id);
    setSelectedUserData(findSelectUser);
  };
  // seçilən user datasini forma doldururam burda
  useEffect(() => {
    if (selectedUserData) {
      userInfoForm.setValues({
        firstName: selectedUserData.firstName || "",
        lastName: selectedUserData.lastName || "",
        email: selectedUserData.email || "",
        roles: selectedUserData.roles?.[0]?.title || "",
        status: selectedUserData.isActive || false,
      });
    }
  }, [selectedUserData]);

  // edit duymesine click edende acilan formun (inputlarin) datasi
  const modalForEditFormData = {
    infoForm: [
      {
        id: 1,
        label: "Full Name",
        name: "firstName",
        inputType: "text",
        inpValue: userInfoForm.values.firstName,
        onChange: userInfoForm.handleChange,
      },
      {
        id: 2,
        label: "Last Name",
        name: "lastName",
        inputType: "text",
        inpValue: userInfoForm.values.lastName,
        onChange: userInfoForm.handleChange,
      },
      {
        id: 3,
        label: "Email",
        name: "email",
        inputType: "emil",
        inpValue: userInfoForm.values.email,
        onChange: userInfoForm.handleChange,
      },
      {
        id: 5,
        label: "Roles",
        name: "roles",
        inputType: "select",
        selectData: userRoleDatas.map((item) => item.title),
        inpValue: userInfoForm.values.roles,
        onChange: userInfoForm.handleChange,
      },
      {
        id: 6,
        label: "Status",
        name: "status",
        inputType: "switch",
        inpValue: userInfoForm.values.status,
        onChange: userInfoForm.handleChange,
      },
    ],
    passwordFormData: [
      {
        id: 1,
        label: "New Password",
        name: "newPassword",
        inputType: "password",
        inpValue: userPasswordForm.values.newPassword,
        onChange: userPasswordForm.handleChange,
      },
      {
        id: 2,
        label: "Confirm New Password",
        name: "confirmNewPassword",
        inputType: "password",
        inpValue: userPasswordForm.values.confirmNewPassword,
        onChange: userPasswordForm.handleChange,
      },
    ],
  };

  // add butonuna click edende acilan formun (inputlarin) datasi
  const modalData = [
    {
      id: 1,
      label: "Full Name",
      name: "firstName",
      inputType: "text",
      inpValue: addUser.values.firstName,
      onChange: addUser.handleChange,
    },
    {
      id: 2,
      label: "Last Name",
      name: "lastName",
      inputType: "text",
      inpValue: addUser.values.lastName,
      onChange: addUser.handleChange,
    },
    {
      id: 3,
      label: "Email",
      name: "email",
      inputType: "text",
      inpValue: addUser.values.email,
      onChange: addUser.handleChange,
    },
    {
      id: 4,
      label: "Password",
      name: "password",
      inputType: "password",
      inpValue: addUser.values.password,
      onChange: addUser.handleChange,
    },
    {
      id: 5,
      label: "Roles",
      name: "roles",
      inputType: "select",
      selectData: userRoleDatas.map((item) => item.title),
      inpValue: addUser.values.roles,
      onChange: addUser.handleChange,
    },
    {
      id: 6,
      label: "Status",
      name: "status",
      inputType: "switch",
      inpValue: addUser.values.status,
      onChange: (e) =>
        addUser.setFieldValue("status", e.target ? e.target.value : e),
    },
  ];

  const columns = [
    {
      title: "#Id",
      dataIndex: "counterId",
      key: "counterId",
      width: 60,
    },
    {
      title: "Full Name",
      key: "fullName",
      render: (record) => `${record.firstName || ""} ${record.lastName || ""}`,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "status",
      width: 150,
      render: (isActive) => (
        <span
          className={`${
            isActive ? styles.activeStatus : styles.noActiveStatus
          }`}
        >
          {isActive ? "Active" : "DeActive"}
        </span>
      ),
    },
    {
      title: "Roles",
      dataIndex: "roles",
      key: "roles",
      render: (roles) => roles.map((role) => role.title).join(", "),
    },
    {
      title: "Last Login",
      dataIndex: "lastLoginAt",
      key: "lastLoginAt",
      render: (dateString) => {
        return dateString ? moment(dateString).format("DD MMM YYYY") : "-";
      },
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
              findSelectedUserData(record.id);
              editForModalShowHiddenFunc();
            }}
          >
            <EditIcon />
          </span>
        </div>
      ),
    },
  ];  
  return (
    <div className={styles.userPage}>
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
          <button onClick={closeOpenModalFunc} className="pageHeaderAddBtn">
            <AddIcon /> Add New User
          </button>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={usersData?.data}
        rowKey="id"
      />
      {/* <table className={styles.table}>
        <thead>
          <tr>
            <th>#id</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Roles</th>
            <th>Last Login</th>
            <th>Created At</th>
            <th>Actions</th>
            
          </tr>
          </thead>
      </table> */}
      <Modal
        title={"Add New User"}
        ModalData={modalData}
        formSubmitFunc={addUser.handleSubmit}
      />
      <ModalInfoAndPassword
        openFormInputData={modalForEditFormData}
        sendInfoFunc={userInfoForm.handleSubmit}
        sendPasswordFunc={userPasswordForm.handleSubmit}
      />
      <Pagination
        func={getAllUsersData}
        pageCountApi={usersData?.meta?.totalPages} 
      />
    </div>
  );
}
