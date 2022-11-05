import Button from "@/components/Button"
import styles from "@/containers/SuccessPage.module.css"
import { useNavigate } from "react-router-dom";
export default function SuccessPage() {
    const navigate = useNavigate();
    return (
        <div className={styles.container}>
            <h1>Congratulations</h1>
            <p style={{ marginBottom: '1rem' }}>You have successfully completed the verification process.</p>
            <Button onClick={() => navigate("/")}>Go back</Button>
        </div>
    )
}
