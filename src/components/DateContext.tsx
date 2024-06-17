import React, { createContext, useContext, useState, useEffect } from "react";

interface DateContextType {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

const DateContext = createContext<DateContextType | undefined>(undefined);

export const useDateContext = () => {
  const context = useContext(DateContext);
  if (!context) {
    throw new Error("useDateContext must be used within a DateProvider");
  }
  return context;
};

interface DateProviderProps {
  children: React.ReactNode; // Define children prop as React.ReactNode
}

export const DateProvider: React.FC<DateProviderProps> = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const storedDate = localStorage.getItem("selectedDate");
    if (storedDate) {
      setSelectedDate(new Date(storedDate));
    }
  }, []);

  const updateSelectedDate = (date: Date) => {
    setSelectedDate(date);
    localStorage.setItem("selectedDate", date.toString());
  };

  return (
    <DateContext.Provider
      value={{ selectedDate, setSelectedDate: updateSelectedDate }}
    >
      {children}
    </DateContext.Provider>
  );
};
