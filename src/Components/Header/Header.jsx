import styles from "./Header.module.scss"
import megasportLogo from "../../assets/Images/megasportLogo.png"
import defaultImg from "../../assets/Images/dafaultUserImg.png"
import megaSportAdminPanel from "../../Helpers/Helpers"
import url from "../../ApiUrls/Url"
import { useNavigate } from "react-router-dom"
import LogoutIcon from "../../assets/Icons/LogoutIcon"
import { useEffect, useState } from "react"


export default function Header() {
  const navigate = useNavigate()
   const [profileDatas, setProfileDatas] = useState();
// console.log(profileDatas);

  const getProfileData = async () => {
    try {
      const resData = megaSportAdminPanel.api().get(url.userProfile);
      setProfileDatas((await resData).data)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
   getProfileData() 
  }, [])
  
  
  const logoutFunc = async () => {
    try {
      await megaSportAdminPanel.api().post(url.logout)
         navigate("/login");
    } catch (error) {
      console.log(error);
    }
  } 
  return (
    <div className={styles.headerWrapper}>
      <a href="/">
        <img className={styles.siteLogo} src={megasportLogo} alt="" />
      </a>
      <div className={styles.langAndUserInfo}>
        {/* <select name="" id="" className={styles.lang}>
          <option value="az" className={styles.az}>Az</option>
          <option value="en" className={styles.en}>En</option>
          <option value="ru" className={styles.ru}>Ru</option>
              </select> */}
        <div className={styles.userInfo}>
          <img src={defaultImg} alt="" className={styles.userImg} />
          <div className={styles.userNamePosition}>
            <span className={styles.userName}>
              {profileDatas?.firstName} {profileDatas?.lastName}
            </span>
            <span className={styles.userPosition}>Admin</span>
          </div>
        </div>
        <span className={styles.logoutBtn} onClick={() => logoutFunc()}>
          <LogoutIcon color={"#fff"} />
          Çıxış edin
        </span>
      </div>
    </div>
  );
}
