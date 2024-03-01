
import { Button, OverlayTrigger, Tooltip, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ViewMoreIcon from './../assets/imgs/view_page.png'
const RedirectButton = (path) => {
    const navigate = useNavigate();

    const handleRedirect = () => {
        // Thay thế URL bằng địa chỉ của trang web mà bạn muốn chuyển hướng đến
        const redirectURL = path;
        navigate(redirectURL);
    };

    return (
        <OverlayTrigger
            placement="bottom"
            overlay={
                <Tooltip id={'tooltip-bottom'}>
                    Click here to visit the main conference page
                </Tooltip>
            }
        >
            <Button
                className='bg-transparent border d-flex align-items-center justify-content-between'
                onClick={handleRedirect}
            >
                View More 
                <Image src={ViewMoreIcon} width={18} className='ms-2'/>
            </Button>
        </OverlayTrigger>

    );
};

export default RedirectButton;
