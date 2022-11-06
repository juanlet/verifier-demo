import Button from "@/components/Button"
import styles from "@/containers/SuccessPage.module.css"
import { useNavigate } from "react-router-dom"
export default function SuccessPage() {
    const navigate = useNavigate()
    return (
        <div className={styles.Container}>
            <h1>Congratulations</h1>
            <div style={{ marginBottom: '1rem' }} className={styles.SuccessMessage}>You have successfully completed the verification process.</div>
            <Button onClick={() => navigate("/")}>Go back</Button>
        </div>
    )
}
