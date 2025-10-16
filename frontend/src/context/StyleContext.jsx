
import React, {
  createContext,
  useContext,
  useState,
} from "react";



const StyleContext = createContext();

export const useStyleContext = () => {
  const ctx = useContext(StyleContext);
  if (!ctx)
    throw new Error("useStyleContext must be used within StyleProvider");
  return ctx;
};

export const StyleProvider = ({ children }) => {
 const [expanded, setExpanded] = useState(true);





  return (
    <StyleContext.Provider
      value={{
        expanded, setExpanded
      }}
    >
      {children}
    </StyleContext.Provider>
  );
};