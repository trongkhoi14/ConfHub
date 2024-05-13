
import { useAppContext } from '../context/authContext'
import { getFollowedConferenceAction } from '../actions/followAction'
import { baseURL } from './api/baseApi'
import useToken from './useToken'
import useLocalStorage from './useLocalStorage'
import { useState } from 'react'
import useConference from './useConferences'
import useFollow from './useFollow'
const useNote = () => {
  const { listFollowed } = useFollow()
  const { user } = useLocalStorage()
  const { token } = useToken()
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(false)
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
      if (conferenceType.toLowerCase().includes('conference')) {
        return 'conference-event';
      }
    return '';
  };
  
  const extractDataByOrgId = (conferencesList, notesList) => {
    const extractedData = [];

    for (const note of notesList) {
        const extractedItem = {
            id: note.tid,
            conf_id: null,
            note: null,
            date_id: null,
            date_value: null,
            date_type: null,
            subStyle: null
        };

        if (note.ImportantDateDateId) {
            for (const conference of conferencesList) {
                for (const importantDate of conference.importantDates) {
                    if (importantDate.date_id === note.ImportantDateDateId) {
                        extractedItem.note = conference.information.name;
                        extractedItem.conf_id = conference.id
                        extractedItem.date_type = importantDate.date_type;
                        extractedItem.date_value = importantDate.date_value;
                        extractedItem.subStyle = getSubStyle(importantDate.date_type)
                        
                    }
                }
            }
        } else if (note.OrganizationOrgId) {
            for (const conference of conferencesList) {
                for (const organization of conference.organizations) {
                    if (organization.org_id === note.OrganizationOrgId) {
                        extractedItem.date_type = 'conference-date';
                        extractedItem.date_value = `${organization.start_date} to ${organization.end_date}`;
                        extractedItem.conf_id = conference.id;
                        extractedItem.note = conference.information.name;
                        extractedItem.date_id = organization.org_id;
                        extractedItem.subStyle = getSubStyle('conference')
                    }
                }
            }
        } else {
            extractedItem.date_type = 'note-event';
            extractedItem.date_value = note.date_value;
            extractedItem.note = note.note;
            extractedItem.subStyle = 'note-event';
        }

        // Cập nhật subStyle

        extractedData.push(extractedItem);
    }
    
    return extractedData
      
  };
    
  const getAllNotes = async () => {
    setLoading(true)
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
        const newDataByOrgId = extractDataByOrgId(listFollowed, data.data);
        console.log({newDataByOrgId})
        setNotes(newDataByOrgId)
        
      setLoading(false)
      console.log('loading', loading)
      }
      
  }


  const updateNote = async (id, note) => {
    const updateData = {
      note: note[id]
    }
    if(user){
      const response = await fetch(`${baseURL}/note/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });
      if (!response.ok) {
        throw new Error(response.message);
      }
      else {

        const data = await response.json();    
        return data
      }
    }
  }

  const addNote = async (note, date_value) => {
    const postData = {
      note: note,
      date_value: date_value
    }
    if(user){
        const response = await fetch(`${baseURL}/note`, {
          method: 'Post',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(postData)
        });
        if (!response.ok) {
          throw new Error(response.message);
        }
        else {

          const data = await response.json();    
          return data
        }
      }
  }
  const deleteNote = async (id) => {
    if(user){
        const response = await fetch(`${baseURL}/note/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          },
        });
        if (!response.ok) {
          throw new Error(response.message);
        }
        else {

          const data = await response.json();    
          return data
        }
      }
  }
    return {
        notes: notes,
        loading,
        getAllNotes,
        updateNote,
        addNote,
        deleteNote
    }
  }


  export default useNote