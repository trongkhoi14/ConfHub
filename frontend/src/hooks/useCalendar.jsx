import { useState, useEffect } from 'react';

export const useCurrentTime = (timeZone) => {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      const options = { timeZone, hour12: false };
      const formatter = new Intl.DateTimeFormat('en-US', options);
      setCurrentTime(formatter.format(now));
    };

    // Cập nhật thời gian mỗi giây
    const intervalId = setInterval(updateCurrentTime, 1000);

    // Clear interval khi component unmount
    return () => clearInterval(intervalId);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Rỗng để chỉ chạy một lần khi component được mount

  return currentTime;
};

export const useEventInput = (initialValue = '') => {
  const [eventInputVisible, setEventInputVisible] = useState(false);
  const [eventInputValue, setEventInputValue] = useState(initialValue);

  const showEventInput = () => setEventInputVisible(true);
  const hideEventInput = () => {
    setEventInputVisible(false);
    setEventInputValue('');
  };

  return { 
    eventInputVisible, 
    eventInputValue, 
    showEventInput, 
    hideEventInput, 
    setEventInputValue 
    };
};
