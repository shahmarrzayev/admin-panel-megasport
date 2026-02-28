import { useFormik } from "formik";
import Input from "../Components/Input/Input";
import styles from "./Login.module.scss";
import { useNavigate } from "react-router-dom";
import megaSportAdminPanel from "../Helpers/Helpers";
import url from "../ApiUrls/Url";
import zireLogo from "../assets/Images/megasportLogo.png";
import rigthLogo from "../assets/Images/loginRightLogo.png";

export default function Login() {
  const navigate = useNavigate();
 

  const { values, handleChange, handleSubmit, resetForm } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    enableReinitialize: true,
    onSubmit: async (formValue) => {
      try {
        const res = await megaSportAdminPanel.api().post(url.login, formValue);

        const data = res.data;

        if (data.success) {
          navigate("/");
        } else {
          alert("Email və ya şifrə səhvdir!");
        }
      } catch (error) {
        console.error("Login error ===", error);
        alert("Serverə qoşulmaq alınmadı.");
      }
      resetForm();
    },
  });

  const loginFormData = [
    { id: 1, label: "Email Address ", name: "email", inputType: "email" },
    { id: 2, label: "Password", name: "password", inputType: "password" },
  ];

  
  return (
    <div className={styles.loginPage}>
      <div className={styles.loginLeft}>
        <img src={zireLogo} alt="" className={styles.zireLogo} />
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          {loginFormData.map((inputData) => (
            <Input
              key={inputData.id}
              inputData={inputData}
              value={values[inputData.name]}
              onChange={handleChange}
            />
          ))}
          <button className={styles.sendBtn} type="submit">
            Gonder
          </button>
        </form>
        <p className={styles.privacyPolicy}>
          2025 ©Megasport. Bütün hüquqlar qorunur.
        </p>
      </div>
      <div className={styles.loginRight}>
        <img src={rigthLogo} alt="" />
      </div>
    </div>
  );
}
