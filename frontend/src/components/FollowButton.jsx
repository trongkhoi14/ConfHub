
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useFollow from '../hooks/useFollow';
import { isObjectInList } from '../utils/checkExistInList';
const FollowButton = ({conference_id, conference}) => {
    const { listFollowed, followConference, unfollowConference} = useFollow()

    const handleClick = () => {
        // Thay thế URL bằng địa chỉ của trang web mà bạn muốn chuyển hướng đến
       
    };

    return (
        <OverlayTrigger
            placement="bottom"
            overlay={
                <Tooltip id={'tooltip-bottom'}>
                    Click here to follow this conference
                </Tooltip>
            }
        >
            {
                isObjectInList(conference_id, listFollowed)
                ?
                
                <Button 
                className='bg-red-normal border-0 rounded-2 px-4 fw-bold py-2'
                onClick={()=>unfollowConference(conference_id)}
                >
                Unfollow</Button>
                :
                <Button 
                className='bg-red-normal border-0 rounded-2 px-4 fw-bold py-2'
                onClick={()=>followConference(conference)}
                >
                Follow
                </Button>
            }
        </OverlayTrigger>

    );
};

export default FollowButton;
