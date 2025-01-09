import React from "react";

interface ButtonProps {
    label: string;
    onClick: () => void;
    className?: string; // Make className optional if needed
}

const Button: React.FC<ButtonProps> = ({ label, onClick, className }) => {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded ${className}`}
        >
            {label}
        </button>
    );
};

export default Button;
