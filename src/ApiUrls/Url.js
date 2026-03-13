const url = {
  login: "auth/login-admin",
  userProfile:"internal/users/profile/me",
  logout: "auth/logout",
  rolesInputData: "internal/roles/available",
  rolesGetAll: "internal/roles",
  roleCreate: "internal/roles",
  roleUpdate: (roleId) => `internal/roles/${roleId}`,
  usersGetAll: "internal/users",
  userCreate: "internal/users/",
  userUpdate: (userRoleId) => `internal/users/${userRoleId}`,
  userChangePassword: (id) => `internal/users/${id}/change-password`,
  customersAllData: (s = "createdAt", d = "ASC") =>
    `internal/customers?sortBy=${s}&direction=${d}`,
  CustomersUpdate: (id) => `internal/customers/${id}`,
  customerChangePassword: (id) => `internal/customers/${id}/change-password`,
  categoriesGetAllDatas: "internal/category",
  categorySearch: (value, id) => `internal/category/search/${value}?id=${id}`,
  categorySearchExternal: (value) =>
    `internal/category/search-external/${value}`,
  categoryAdd: "internal/category",
  categoryUpdate: (id) => `internal/category/${id}`,
  categoryDelete: (id) => `internal/category/${id}`,
  fileUpload: (type) => `internal/file/upload?type=${type}`, 
  fileDelete: (fileName, type) =>
    `internal/file/delete/${fileName}?type=${type}`,
  attributeGetAll: "internal/attribute",
  attributeCreate: "internal/attribute/",
  attributeUpdate: (id) => `internal/attribute/${id}`,
  attributeDelete: (id) => `internal/attribute/${id}`,
  productsGetAll: (s = "createdAt", d = "ASC") =>
    `internal/product?sortBy=${s}&direction=${d}`,
  productCreated: "internal/product/",
  productUpdata: (id) => `internal/product/${id}`,
  productDelete: (id) => `internal/product/${id}`,
  discountGetAll: (s = "createdAt", d = "ASC") =>
    `internal/discount?sortBy=${s}&direction=${d}`,
  discoutCreated: "internal/discount/",
  discountUpdate: (id) => `internal/discount/${id}`,
  discoutDelete: (id) => `internal/discount/${id}`,
  discountProductSearch: (value) => `internal/product/search/${value}`,
  orderAllData: "internal/orders",
  orderView: (id) => `internal/orders/${id}`,
};

export default url;
