
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
const UpdateNowButton = (path) => {
    const handleClick = () => {
        // Thay thế URL bằng địa chỉ của trang web mà bạn muốn chuyển hướng đến
       window.location.reload()
    };

    return (
        <OverlayTrigger
            placement="bottom"
            overlay={
                <Tooltip id={'tooltip-bottom'} style={{ maxWidth: '400px', padding: '10px' }}>
                    <span style={{ whiteSpace: 'nowrap' }} className='m-2'>Data updates occur every 3 days;</span>
                    <br />
                    To get the latest information, click "Update Now"
                </Tooltip>
            }
        >
            <Button 
                className='px-4 py-2 fw-bold me-3 bg-brown-normal text-brown-darker border-0 rounded-2'
                onClick={handleClick}
                >
                Update Now</Button>
        </OverlayTrigger>

    );
};

export default UpdateNowButton;
