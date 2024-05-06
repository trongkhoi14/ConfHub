import { useEffect, useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';


function Loading() {
    const [showReloadMessage, setShowReloadMessage] = useState(false);
    const [showCount, setShowCount] = useState(0);
  
    useEffect(() => {
      const timer = setTimeout(() => {
        setShowCount(prevCount => prevCount + 1);
      }, 1000);
  
      return () => {
        clearTimeout(timer);
      };
    }, [showCount]);
  
    useEffect(() => {
      if (showCount >= 20) {
        setShowReloadMessage(true);
      }
    }, [showCount]);
  
    const handleReload = () => {
      setShowCount(0);
      setShowReloadMessage(false);
      window.location.reload()
    };
  
    return (
      <div>
        {showReloadMessage ? (
          <div>
            Loading for 10 seconds. Please reload.
            <button onClick={handleReload}>Reload</button>
          </div>
        ) : (
            <Spinner animation="border" />
        )}
      </div>
    );
}

export default Loading;