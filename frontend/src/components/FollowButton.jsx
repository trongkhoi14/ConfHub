
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import useFollow from '../hooks/useFollow';
import { isObjectInList } from '../utils/checkExistInList';

import { useLocation } from 'react-router-dom'
import { getIdFromPathname } from '../utils/getID';
const FollowButton = () => {
    const { listFollowed, followConference, unfollowConference} = useFollow()
    
  const {pathname} = useLocation()
  const id = getIdFromPathname(pathname)
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
                isObjectInList(id, listFollowed)
                ?
                
                <Button 
                className='bg-red-normal border-0 rounded-2 px-4 fw-bold py-2'
                onClick={()=>unfollowConference(id)}
                >
                Followed</Button>
                :
                <Button 
                className='bg-red-normal border-0 rounded-2 px-4 fw-bold py-2'
                onClick={()=>followConference(id)}
                >
                Follow
                </Button>
            }
        </OverlayTrigger>

    );
};

export default FollowButton;
