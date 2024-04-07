import React, { useState, createContext, ReactNode } from "react";

interface NewPostContextType {
  newPost: {
    title: string;
    content: string;
    description: string;
  };
  loadingAIContent:boolean;
  setLoadingAIContent: (newState:boolean) => void;
  updateNewPost: (key: string, value: string) => void;  
}

// Creating a context with a default value that matches the NewPostContextType
export const NewPostContext = createContext<NewPostContextType>({
  newPost: {
    title: "",
    content: "",
    description: ""  
  },
  loadingAIContent:false,
  setLoadingAIContent: () => {},
  updateNewPost: () => {}  
});

// Define the props type for NewPostProvider
interface NewPostProviderProps {
    children: ReactNode;
}

export const NewPostProvider: React.FC<NewPostProviderProps> = ({ children }) => {
    // State to hold the new post data, now including a description
    const [newPost, setNewPost] = useState({
        title: "",
        content: "",
        description: "",
    });

    const [loadingAIContent,setLoadingAIContent] = useState(false);

    // Function to update the new post data
    const updateNewPost = (key: string, value: string) => {
        setNewPost(prev => ({ ...prev, [key]: value }));
    };

    // Providing state and updater function to the context
    return (
        <NewPostContext.Provider value={{ newPost, updateNewPost, loadingAIContent,setLoadingAIContent }}>
            {children}
        </NewPostContext.Provider>
    );
};

export default NewPostProvider;
