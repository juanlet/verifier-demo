import VerificationForm from "../components/VerificationForm";
import styles from "./VerifyPage.module.css";
export default function VerifyPage() {

    return (
        <div className={styles.container}>
            <div><h1>Verification form</h1></div>
            <VerificationForm />
        </div>
    )
}
