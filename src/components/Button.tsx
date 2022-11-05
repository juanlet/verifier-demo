import { ReactElement, SyntheticEvent } from "react";
import styles from "./Button.module.css";

interface ButtonProps {
    children: string;
    disabled?: boolean
    type?: "button" | "submit" | "reset" | undefined
    onClick?: () => void
    [x: string]: any;
}


const Button = ({ children, disabled = false, type = "button", classes = '', ...rest }: ButtonProps) => {
    return (
        <button className={`${styles.Button} ${classes}`} aria-labelledby={children} disabled={disabled} type={type} {...rest}>
            {children}
        </button>
    );
};

export default Button;
