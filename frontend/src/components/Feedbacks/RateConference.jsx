import React, { useState } from 'react';
import starIcon from '../../assets/imgs/filled_star_yellow.png'
import unstarIcon from '../../assets/imgs/unfill_star_yellow.png'
import { Image } from 'react-bootstrap';
function RateConference({rating, setRating}) {
    const [hoverValue, setHoverValue] = useState(0);

    const handleStarClick = (value) => {
        setRating(value === rating ? 0 : value);
    };

    const handleStarHover = (value) => {
        setHoverValue(value);
    };

    return (
        <div className='d-flex align-items-center'>
            
            <span className='me-2'>How would you rate this conference? {rating}/5*</span>
            {[1, 2, 3, 4, 5].map((index) => (
                <Image
                    key={index}
                    src={index <= (hoverValue || rating) ? starIcon : unstarIcon}
                    style={{ cursor: "pointer" }}
                    width={20}
                    height={20}
                    onMouseEnter={() => handleStarHover(index)}
                    onMouseLeave={() => handleStarHover(0)}
                    onClick={() => handleStarClick(index)}
                    className='mx-1'
                />
            ))}
        </div>
    );
}

export default RateConference;
