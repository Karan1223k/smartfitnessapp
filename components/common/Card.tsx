
import React from 'react';

interface CardProps {
    title: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}

const Card: React.FC<CardProps> = ({ title, icon, children, className = '' }) => {
    return (
        <div className={`bg-bg-white p-6 rounded-2xl shadow-sm border border-border-color ${className}`}>
            <div className="flex items-center gap-3 mb-4">
                {icon && <div className="text-brand-primary">{icon}</div>}
                <h2 className="text-xl font-bold text-text-primary">{title}</h2>
            </div>
            <div className="text-text-secondary">
                {children}
            </div>
        </div>
    );
};

export default Card;
