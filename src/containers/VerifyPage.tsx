import VerificationForm from "@/components/VerificationForm"
import styles from "@/containers/VerifyPage.module.css"
import "@/containers/VerifyPage.module.css"
export default function VerifyPage(): JSX.Element {
    return (
        <div className={styles.container}>
            <div><h1>Verification Form</h1></div>
            <VerificationForm />
        </div>
    )
}
