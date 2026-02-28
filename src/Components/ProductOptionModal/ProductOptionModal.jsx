import styles from "./ProductOptionModal.module.scss";
import { UseGlobalContext } from "../../Context/GlobalContext";
import CloseIcon from "../../assets/Icons/CloseIcon";
import InputComponent from "../InputComponent/InputComponent";

export default function ProductOptionModal({
  modalVariantsAreaInputsDatas,
  modalActivePage,
  productFormik,   
  findProductVariantItem,
}) {
  const { closeOpenSecondModalFunc } = UseGlobalContext();
console.log(modalVariantsAreaInputsDatas);

  return (
    <div className={styles.modal}>
      <div onClick={closeOpenSecondModalFunc} className="overlay"></div>
      <div className={styles.modalContent}>
        <h4 className="pageTitle">Add New Product Option</h4>
        <span onClick={closeOpenSecondModalFunc} className={styles.closeIcon}>
          <CloseIcon />
        </span>
   
        <form className={styles.form}>
          {modalActivePage === "Variants" && (
            <div className={styles.modalOptionsArea}>
              <div className={styles.optionsForm}>
                {modalVariantsAreaInputsDatas.map((item) => (
                  <InputComponent key={item.id} inputData={item} />
                ))}
              </div>
              <button
                className="saveBtn" 
                onClick={() => {
                  if (findProductVariantItem?.id) {
                    const updatedVariants = productFormik.values.variants.map((variant) =>
                      variant.id === findProductVariantItem?.id ? findProductVariantItem : variant
                    );
                    productFormik.setFieldValue("variants", updatedVariants);
                  } else {
                    productFormik.setFieldValue("variants", [...productFormik.values.variants, findProductVariantItem]);
                  }
                  closeOpenSecondModalFunc();
                }}
              >
                Məlumatları əlavə et
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
