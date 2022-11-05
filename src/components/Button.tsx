import { ReactElement, SyntheticEvent } from "react";
import styles from "./Button.module.css";

interface ButtonProps {
    children: string;
    disabled?: boolean
    type?: "button" | "submit" | "reset" | undefined
    onClick?: () => void
    [x: string]: any;
}


const Button = ({ children, disabled = true, type = "button", ...rest }: ButtonProps) => {
    return (
        <button className={styles.Button} aria-label={children} disabled={disabled} type={type} {...rest}>
            {children}
        </button>
    );
};

export default Button;
