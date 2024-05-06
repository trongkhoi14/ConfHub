import { useState } from 'react';

const useAccordionDates = (initialItems) => {
  const [items, setItems] = useState(initialItems);
  const [openItemIndex, setOpenItemIndex] = useState(initialItems[0]?.id || null);

  const addItem = () => {
    const newItem = {
      id: `${items.length + 1}`,
      title: `Round ${items.length + 1}`,
      isOpen: false,
    };
    setItems(prevItems => [...prevItems, newItem]);
    setOpenItemIndex(newItem.id);
  };

  const toggleItem = (index) => {
    setOpenItemIndex(openItemIndex === index ? null : index);
  };


  return { 
    items, 
    openItemIndex,
    addItem, 
    toggleItem,
   };
};

export default useAccordionDates;
