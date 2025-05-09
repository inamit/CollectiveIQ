import React, { createContext, useState, useContext } from "react";
import Post from "../models/post.ts";

// Define the context type
interface SearchContextType {
    searchValue: string;
    setSearchValue: React.Dispatch<React.SetStateAction<string>>;
    filteredPosts: any[];
}

// Create the context
const SearchContext = createContext<SearchContextType | undefined>(undefined);

// Custom hook to use the search context
export const useSearch = () => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error("useSearch must be used within a SearchProvider");
    }
    return context;
};

// SearchProvider component
export const SearchProvider: React.FC<{ posts: any[] | null }> = ({ posts, children }) => {
    const [searchValue, setSearchValue] = useState("");

    const filteredPosts = searchValue.trim()
        ? [...posts].filter((post) =>
            post.title.toLowerCase().includes(searchValue.toLowerCase()) ||
            post.content.toLowerCase().includes(searchValue.toLowerCase())
        )
        : [posts];

    return (
        <SearchContext.Provider value={{ searchValue, setSearchValue, filteredPosts }}>
    {children}
    </SearchContext.Provider>
);
};
