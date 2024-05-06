
import { useAppContext } from '../context/authContext'
import { getFollowedConferenceAction } from '../actions/followAction'
import { baseURL } from './api/baseApi'
import useToken from './useToken'
import useLocalStorage from './useLocalStorage'
import { useState } from 'react'
import useConference from './useConferences'
const useNote = () => {
  const { state, dispatch } = useAppContext()
  const  { conferences, handleGetList } = useConference()
  const { user } = useLocalStorage()
  const { token } = useToken()
  const [notes, setNotes] = useState([])
  const getSubStyle = (conferenceType) => {
    if (conferenceType.toLowerCase().includes('submission')) {
      return 'submission-event';
    }
   if (conferenceType.toLowerCase().includes('camera')) {
      return 'camera-event';
    }
    if (conferenceType.toLowerCase().includes('registration')) {
        return 'registration-event';
      }
      if (conferenceType.toLowerCase().includes('notification')) {
        return 'notification-event';
      }
    // Các trường hợp khác có thể được xử lý ở đây
    return '';
  };
  
  const extractDataByOrgId = (conferencesList, notesList) => {
    const newData = notesList.flatMap(note => {
        const orgId = note.OrganizationOrgId;
        const matchingData = conferencesList.find(conf => conf.organizations[0].org_id === orgId);
        if (matchingData) {
          const { id, infomation, importantDates, organizations } = matchingData;
          const conferenceName = infomation.name;
          const conferenceId = id;
          const conferenceType = 'Conference date';
          const conferenceStartDate = organizations[0].start_date;
          const conferenceEndDate = organizations[0].end_date;
      
          const conferenceObject = {
            id: note.tid,
            conf_id: conferenceId,
            name: conferenceName,
            date_id: '',
            date_value: `From ${conferenceStartDate} to ${conferenceEndDate}`,
            date_type: conferenceType,
            subStyle: getSubStyle(conferenceType)
          };
      
          const conferenceDates = importantDates.map(date => ({
            id: note.tid,
            conf_id: conferenceId,
            name: conferenceName,
            date_id: date.date_id,
            date_value: date.date_value,
            date_type: date.date_type,
            subStyle: getSubStyle(date.date_type)
          }));
      
          return [conferenceObject, ...conferenceDates];
        } else {
          return [{
            id: note.tid,
            conf_id: '',
            date_id: note.ImportantDateDateId,
            name: note.note || 'Input your note',
            date_value: note.date_value,
            date_type: 'note-event',
            subStyle: 'note-event',
          }];
        }
      });
      
      return newData;
      
      
  };
  
  
  const getAllNotes = async () => {
    if(user){
        const response = await fetch(`${baseURL}/note`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error(response.message);
        }
        const data = await response.json();    
        // Sử dụng hàm này để lấy thông tin từ danh sách dựa trên OrganizationOrgId
        const newDataByOrgId = extractDataByOrgId(conferences, data.data);
        setNotes(newDataByOrgId)
      }
  }
  const updateNote = async (id, note) => {
    if(user){
        const response = await fetch(`${baseURL}/note/${id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ note: note})
        });
        if (!response.ok) {
          throw new Error(response.message);
        }
        const data = await response.json();    
        // Sử dụng hàm này để lấy thông tin từ danh sách dựa trên OrganizationOrgId
        const newDataByOrgId = extractDataByOrgId(conferences, data.data);
        setNotes(newDataByOrgId)
      }
  }
    return {
        notes: notes,
        getAllNotes,
        updateNote
    }
  }


  export default useNote