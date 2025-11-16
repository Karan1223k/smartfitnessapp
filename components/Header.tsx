
import React from 'react';

const DumbbellIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 6.75a2.25 2.25 0 01-2.25 2.25H15a2.25 2.25 0 110-4.5h3.75A2.25 2.25 0 0121 6.75zM3 6.75a2.25 2.25 0 012.25-2.25H9a2.25 2.25 0 110 4.5H5.25A2.25 2.25 0 013 6.75zM9 4.5v15" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 4.5v15" />
    </svg>
);


const Header: React.FC = () => {
    return (
        <header className="bg-gradient-to-r from-brand-secondary to-brand-primary shadow-md">
            <div className="container mx-auto px-4 md:px-8 py-4 flex items-center gap-4">
                <DumbbellIcon />
                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
                    Smart Health & Fitness Coach
                </h1>
            </div>
        </header>
    );
};

export default Header;
