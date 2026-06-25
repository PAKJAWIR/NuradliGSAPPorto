import { createContext, useContext, useEffect, useState } from "react";

// SETUP
export const FaqContext = createContext(null);

export const FaqProvider = ({ children }) => {
  // DATA
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(false);

  //   DATA FETCH
  useEffect(() => {
    fetch("assets/data/faq.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch FAQs");
        return res.json();
      })
      .then((faqData) => {
        setFaqs(faqData);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  //   Controller STATE
  const [activeIndex, setActiveIndex] = useState(null);
  const [isFaqsFullyLoaded, setIsFaqsFullyLoaded] = useState(false);

  //   Derived State
  const activeFaq = activeIndex !== null ? faqs[activeIndex] : null;

  const openFaq = (index) => {
    setActiveIndex(index);
  };

  const closeFaq = () => {
    setActiveIndex(null);
  };

  //   PROVIDER
  return (
    <FaqContext.Provider
      value={{
        // data
        faqs,
        loading,
        // controller
        activeIndex,
        activeFaq,
        isFaqsFullyLoaded,
        setIsFaqsFullyLoaded,
        // commands
        openFaq,
        closeFaq,
      }}
    >
      {children}
    </FaqContext.Provider>
  );
};

export const useFaq = () => {
  const context = useContext(FaqContext);
  if (!context) {
    throw new Error("useFaq must be used within a FaqProvider");
  }
  return context;
};
