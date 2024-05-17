
import { Button, useAccordionButton } from 'react-bootstrap';

const CustomAccordionDates = ({ children, eventKey, onClick }) => {
    const decoratedOnClick = () => {
        onClick();
        console.log('totally custom!');
      };
    
      return (
        <Button
          type="button"
          className='bg-blue-light border border-1 w-100 text-start text-primary-emphasis'
          onClick={decoratedOnClick}
        >
          {children}
        </Button>
      );
}

export default CustomAccordionDates