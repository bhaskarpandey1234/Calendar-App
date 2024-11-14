
import { useState, useEffect } from "react";
import axios from "axios";

const CalendarApp = () => {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthsOfYear = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const currentDate = new Date();
    const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
    const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
    const [selectedDate, setSelectedDate] = useState(currentDate);
    const [showEventPopup, setShowEventPopup] = useState(false);
    const [events, setEvents] = useState([]);
    const [eventTime, setEventTime] = useState({ hours: '00', minutes: "00" });
    const [eventText, setEventText] = useState('');
    const [editingEvent, setEditingEvent] = useState(null);
    const [errors, setErrors] = useState({});


    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    useEffect(() => {
        fetchEvents();
    }, [currentMonth, currentYear]);

    const validateEvent = () => {
        const errors = {};
        if (!eventText.trim()) {
            errors.text = "Event title is required";
        }
        if (!eventTime.hours || eventTime.hours < 0 || eventTime.hours > 23) {
            errors.hours = "Please enter a valid hour (0-23)";
        }
        if (!eventTime.minutes || eventTime.minutes < 0 || eventTime.minutes > 59) {
            errors.minutes = "Please enter a valid minute (0-59)";
        }
        setErrors(errors);
        return errors;
    };

    const fetchEvents = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/events?month=${currentMonth + 1}&year=${currentYear}`);
            setEvents(response.data);
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };

    const handleDayClick = (day) => {
        const clickedDate = new Date(currentYear, currentMonth, day);
        const today = new Date();
        if (clickedDate >= today || isSameDay(clickedDate, today)) {
            setSelectedDate(clickedDate);
            setShowEventPopup(true);
            setEventTime({ hours: '00', minutes: "00" });
            setEventText('');
            setEditingEvent(null);
        }
    };

    const isSameDay = (date1, date2) => (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );

    const handleEventSubmit = async () => {

        const errors = validateEvent();
        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return; // Stop submission if validation fails
        }

        const newEvent = {
            date: selectedDate.toISOString(),
            time: `${eventTime.hours.padStart(2, '0')}:${eventTime.minutes.padStart(2, '0')}`,
            text: eventText,
        };

        try {
            if (editingEvent) {
                await axios.put(`http://localhost:3000/events/${editingEvent.id}`, newEvent);
            } else {
                await axios.post("http://localhost:3000/events", newEvent);
            }
            fetchEvents();
            setShowEventPopup(false);
            setEventTime({ hours: '00', minutes: "00" });
            setEventText('');
            setEditingEvent(null);
            setErrors({});
        } catch (error) {
            console.error("Error saving event:", error);
        }
    };

    const handleEditEvent = (event) => {
        setSelectedDate(new Date(event.date));
        setEventTime({
            hours: event.time.split(':')[0],
            minutes: event.time.split(':')[1],
        });
        setEventText(event.text);
        setEditingEvent(event);
        setShowEventPopup(true);
    };

    const handleDeleteEvent = async (eventId) => {
        try {
            await axios.delete(`http://localhost:3000/events/${eventId}`);
            fetchEvents();
        } catch (error) {
            console.error("Error deleting event:", error);
        }
    };

    const handleTimeChange = (e) => {
        const { name, value } = e.target;
        setEventTime((prevTime) => ({ ...prevTime, [name]: value.padStart(2, '0') }));
    };

    return (
        <div className='calendar-app'>
            <div className='calendar'>
                <h1 className="heading">Calendar App</h1>
                <div className="navigate-date">
                    <h2 className="month">{monthsOfYear[currentMonth]}</h2>
                    <h2 className="year">{currentYear}</h2>
                    <div className="buttons">
                        <i onClick={() => setCurrentMonth(currentMonth === 0 ? 11 : currentMonth - 1)} className="bx bx-chevron-left"></i>
                        <i onClick={() => setCurrentMonth(currentMonth === 11 ? 0 : currentMonth + 1)} className="bx bx-chevron-right"></i>
                    </div>
                </div>

                <div className="weekdays">
                    {daysOfWeek.map((day) => (
                        <span key={day}>{day}</span>
                    ))}
                </div>
                <div className="days">
                    {[...Array(firstDayOfMonth).keys()].map((_, index) => (
                        <span key={`empty-${index}`} />
                    ))}
                    {[...Array(daysInMonth).keys()].map((day) => (
                        <span key={day + 1} className={isSameDay(new Date(currentYear, currentMonth, day + 1), currentDate) ? 'current-day' : ''} onClick={() => handleDayClick(day + 1)}>{day + 1}</span>
                    ))}
                </div>
            </div>

            <div className="events">
                {showEventPopup && (
                    <div className="event-popup">
                        <div className="time-input">
                            <div className="event-popup-time">Time</div>
                            <input type="number" name="hours" min={0} max={24} className="hours" value={eventTime.hours} onChange={handleTimeChange} />
                            <input type="number" name="minutes" min={0} max={59} className="minutes" value={eventTime.minutes} onChange={handleTimeChange} />
                        </div>
                        <textarea placeholder="Enter event text (max 60 chars)" value={eventText} onChange={(e) => setEventText(e.target.value.slice(0, 60))}></textarea>

                        {errors.text}

                        <button className="event-popup-btn" onClick={handleEventSubmit}>{editingEvent ? 'Update Event' : 'Add Event'}</button>
                        <button className="close-event-popup" onClick={() => setShowEventPopup(false)}><i className="bx bx-x"></i></button>
                    </div>
                )}
                {events.map((event) => (
                    <div className="event" key={event.id}>
                        <div className="event-date-wrapper">
                            <div className="event-date">{`${monthsOfYear[new Date(event.date).getMonth()]} ${new Date(event.date).getDate()}, ${new Date(event.date).getFullYear()}`}</div>
                            <div className="event-time">{event.time}</div>
                        </div>
                        <div className="event-text">{event.text}</div>
                        <div className="event-buttons">
                            <i className="bx bxs-edit-alt" onClick={() => handleEditEvent(event)}></i>
                            <i className="bx bxs-message-alt-x" onClick={() => handleDeleteEvent(event.id)}></i>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CalendarApp;






// import { useState, useEffect } from "react";
// import axios from "axios";

// const CalendarApp = () => {
//     const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
//     const monthsOfYear = ['J', 'F', 'M', 'A', 'J', 'F', 'M', 'A', 'J', 'F', 'M', 'A'];

//     const currentDate = new Date();
//     const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
//     const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
//     const [selectedDate, setSelectedDate] = useState(currentDate);
//     const [showEventPopup, setShowEventPopup] = useState(false);
//     const [events, setEvents] = useState([]);
//     const [eventTime, setEventTime] = useState({ hours: '00', minutes: "00" });
//     const [eventText, setEventText] = useState('');
//     const [editingEvent, setEditingEvent] = useState(null);

//     const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
//     const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

//     useEffect(() => {
//         fetchEvents();
//     }, [currentMonth, currentYear]);

//     const fetchEvents = async () => {
//         try {
//             const response = await axios.get(`http://localhost:3000/events?month=${currentMonth + 1}&year=${currentYear}`);
//             setEvents(response.data);
//         } catch (error) {
//             console.error("Error fetching events:", error);
//         }
//     };

//     const handleDayClick = (day) => {
//         const clickedDate = new Date(currentYear, currentMonth, day);
//         const today = new Date();
//         if (clickedDate >= today || isSameDay(clickedDate, today)) {
//             setSelectedDate(clickedDate);
//             setShowEventPopup(true);
//             setEventTime({ hours: '00', minutes: "00" });
//             setEventText('');
//             setEditingEvent(null);
//         }
//     };

//     const isSameDay = (date1, date2) => (
//         date1.getFullYear() === date2.getFullYear() &&
//         date1.getMonth() === date2.getMonth() &&
//         date1.getDate() === date2.getDate()
//     );

//     const handleEventSubmit = async () => {
//         const newEvent = {
//             date: selectedDate.toISOString(),
//             time: `${eventTime.hours.padStart(2, '0')}:${eventTime.minutes.padStart(2, '0')}`,
//             text: eventText,
//         };

//         try {
//             if (editingEvent) {
//                 await axios.put(`http://localhost:3000/events/${editingEvent.id}`, newEvent);
//             } else {
//                 await axios.post("http://localhost:3000/events", newEvent);
//             }
//             fetchEvents();
//             setShowEventPopup(false);
//             setEventTime({ hours: '00', minutes: "00" });
//             setEventText('');
//             setEditingEvent(null);
//         } catch (error) {
//             console.error("Error saving event:", error);
//         }
//     };

//     const handleEditEvent = (event) => {
//         setSelectedDate(new Date(event.date));
//         setEventTime({
//             hours: event.time.split(':')[0],
//             minutes: event.time.split(':')[1],
//         });
//         setEventText(event.text);
//         setEditingEvent(event);
//         setShowEventPopup(true);
//     };

//     const handleDeleteEvent = async (eventId) => {
//         try {
//             await axios.delete(`http://localhost:3000/events/${eventId}`);
//             fetchEvents();
//         } catch (error) {
//             console.error("Error deleting event:", error);
//         }
//     };

//     const handleTimeChange = (e) => {
//         const { name, value } = e.target;
//         setEventTime((prevTime) => ({ ...prevTime, [name]: value.padStart(2, '0') }));
//     };

//     return (
//         <div className='calendar-app'>
//             <div className='calendar'>
//                 <h1 className="heading">Calendar App</h1>
//                 <div className="navigate-date">
//                     <h2 className="month">{monthsOfYear[currentMonth]}</h2>
//                     <h2 className="year">{currentYear}</h2>
//                     <div className="buttons">
//                         <i onClick={() => setCurrentMonth(currentMonth === 0 ? 11 : currentMonth - 1)} className="bx bx-chevron-left"></i>
//                         <i onClick={() => setCurrentMonth(currentMonth === 11 ? 0 : currentMonth + 1)} className="bx bx-chevron-right"></i>
//                     </div>
//                 </div>

//                 <div className="weekdays">
//                     {daysOfWeek.map((day) => (
//                         <span key={day}>{day}</span>
//                     ))}
//                 </div>
//                 <div className="days">
//                     {[...Array(firstDayOfMonth).keys()].map((_, index) => (
//                         <span key={`empty-${index}`} />
//                     ))}
//                     {[...Array(daysInMonth).keys()].map((day) => (
//                         <span key={day + 1} className={isSameDay(new Date(currentYear, currentMonth, day + 1), currentDate) ? 'current-day' : ''} onClick={() => handleDayClick(day + 1)}>{day + 1}</span>
//                     ))}
//                 </div>
//             </div>

//             <div className="events">
//                 {showEventPopup && (
//                     <div className="event-popup">
//                         <div className="time-input">
//                             <div className="event-popup-time">Time</div>
//                             <input type="number" name="hours" min={0} max={24} className="hours" value={eventTime.hours} onChange={handleTimeChange} />
//                             <input type="number" name="minutes" min={0} max={59} className="minutes" value={eventTime.minutes} onChange={handleTimeChange} />
//                         </div>
//                         <textarea placeholder="Enter event text (max 60 chars)" value={eventText} onChange={(e) => setEventText(e.target.value.slice(0, 60))}></textarea>
//                         <button className="event-popup-btn" onClick={handleEventSubmit}>{editingEvent ? 'Update Event' : 'Add Event'}</button>
//                         <button className="close-event-popup" onClick={() => setShowEventPopup(false)}><i className="bx bx-x"></i></button>
//                     </div>
//                 )}
//                 {events.map((event) => (
//                     <div className="event" key={event.id}>
//                         <div className="event-date-wrapper">
//                             <div className="event-date">{`${monthsOfYear[new Date(event.date).getMonth()]} ${new Date(event.date).getDate()}, ${new Date(event.date).getFullYear()}`}</div>
//                             <div className="event-time">{event.time}</div>
//                         </div>
//                         <div className="event-text">{event.text}</div>
//                         <div className="event-buttons">
//                             <i className="bx bxs-edit-alt" onClick={() => handleEditEvent(event)}></i>
//                             <i className="bx bxs-message-alt-x" onClick={() => handleDeleteEvent(event.id)}></i>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default CalendarApp;





// import { useState } from "react";

// const CalendarApp = () => {
//     const daysOfWeek=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
//     const monthsOfYear=[
//         'J','F','M','A','J','F','M','A','J','F','M','A',
//     ]
//     const currentDate=new Date();
//     const[currentMonth,setCurrentMonth]=useState(currentDate.getMonth());
//     const[currentYear,setCurrentYear]=useState(currentDate.getFullYear());
//     const[selectedDate,setSelectedDate]=useState(currentDate);
//     const[showEventPopup,setShowEventPopup]=useState(false);
//     const[events,setEvents]=useState([]);
//     const[eventTime,setEventTime]=useState({hours:'00',minutes:"00"});
//     const[eventText,setEventText]=useState('');
//     const[editingEvent,setEditingEvent]=useState(null);

//     const daysInMonth=new Date(currentYear,currentMonth+1,0).getDate();
//     const firstDayOfMonth=new Date(currentYear, currentMonth,1).getDay();

//     const prevMonth=()=>{
//         setCurrentMonth((prevMonth)=>(prevMonth===0? 11:prevMonth-1));
//         setCurrentYear((prevYear)=>(currentMonth===0? prevYear-1:prevYear));

//     }
//     const nextMonth=()=>{
//         setCurrentMonth((prevMonth)=>(prevMonth===11? 0:prevMonth+1));
//         setCurrentYear((prevYear)=>(currentMonth===11? prevYear+1:prevYear));

//     }
//     const handleDayClick=(day)=>{
//         const clickedDate=new Date(currentYear,currentMonth,day);
//         const today=new Date();
//         if(clickedDate>=today || isSameDay(clickedDate,today)){
//             setSelectedDate(clickedDate);
//             setShowEventPopup(true);
//             setEventTime({hours:'00',minutes:"00"});
//             setEventText('');
//             setEditingEvent(null);
//         }
//     }

//     const isSameDay=(date1,date2)=>{
//         return(date1.getFullYear() ===date2.getFullYear() && 
//         date1.getMonth()===date2.getMonth() &&
//         date1.getDate()===date2.getDate()
//     )
//     }
//     const handleEventSubmit=()=>{
//         const newEvent ={
//             id:editingEvent? editingEvent.id:Date.now(),
//             date:selectedDate,
//             time: `${eventTime.hours.padStart(2,'0')}:${eventTime.hours.padStart(2,'0')}`,
//             text:eventText,
//         }

//         let updatedEvents=[...events]
//         if(editingEvent){
//             updatedEvents=updatedEvents.map((event)=>event.id===editingEvent.id? newEvent:event,)
//         }else{
//             updatedEvents.push(newEvent);
//         }
//         updatedEvents.sort((a,b)=>new Date(a.date)-new Date(b.date))

//         // setEvents([...events,newEvent])
//         setEvents(updatedEvents)
//         setEventTime({hours:'00',minutes:"00"})
//         setEventText('')
//         setShowEventPopup(false)
//         setEditingEvent(null)
//     }
//     const handleEditEvent=(event)=>{
//         setSelectedDate(new Date(event.date))
//         setEventTime({
//             hours:event.time.split(':')[0],
//             minutes:event.time.split(':')[1],
//         })
//         setEventText(event.text)
//         setEditingEvent(event)
//         setShowEventPopup(true)
//     }
//     const handleDeleteEvent=(eventId)=>{
//         const updatedEvents=events.filter((event)=>event.id!==eventId)
//         setEvents(updatedEvents)
//     }
//     const handleTimeChange=(e)=>{
//         const {name,value}=e.target
//         setEventTime((prevTime)=>({...prevTime,[name]:value.padStart(2,'0')}))
//     }
//   return (
//     <div className='calendar-app'>
//         <div className='calendar'>
//             <h1 className="heading">Calendar App</h1>
//             <div className="navigate-date">
//                 <h2 className="month">{monthsOfYear[currentMonth]}</h2>
//                 <h2 className="year">{currentYear}</h2>
//                 <div className="buttons">
//                     <i onClick={prevMonth} className="bx bx-chevron-left"></i>
//                     <i onClick={nextMonth} className="bx bx-chevron-right"></i>
//                 </div>
//             </div>

//             <div className="weekdays">
//                 {daysOfWeek.map((day)=>(
//                     <span key={day}>{day}</span>
//                 ))}
//             </div>
//             <div className="days">
//                 {
//                     [...Array(firstDayOfMonth).keys()].map((_, index)=>(
//                         <span key={`empty-${index}`}/>
//                     ))
//                 }
//                 {
//                     [...Array(daysInMonth).keys()].map((day)=>(
//                         <span key={day+1} className={day +1===currentDate.getDate() && currentMonth===currentDate.getMonth() && currentYear===currentDate.getFullYear()?'current-day':''} onClick={()=>handleDayClick(day+1)}
//                         >{day+1}</span>
//                     ))
//                 }

//             </div>   
//             </div>
            
//             <div className="events">
//                 {showEventPopup && (<div className="event-popup">
//                     <div className="time-input">
//                         <div className="event-popup-time">
//                             Time 
//                         </div>
//                         <input type="number" name="hours" min={0} max={24} className="hours" value={eventTime.hours}
//                          onChange={handleTimeChange}/>
//                         <input type="number" name="minutes" min={0} max={24} className="minutes" value={eventTime.minutes} onChange={(e)=>setEventTime({...eventTime,minutes:e.target.value})}/>

//                     </div>
//                     <textarea placeholder="enter event text (max 60 char)" value={eventText} onChange={(e)=>{
//                         if(e.target.value.length<=60){
//                             setEventText(e.target.value)
//                         }
//                     }}></textarea>
//                     <button className="event-popup-btn" onClick={handleEventSubmit}>
//                         {editingEvent? 'Update Event':'Add Event'}</button>
//                     <button className="close-event-popup" onClick={()=>setShowEventPopup(false)}>
//                         <i className="bx bx-x"></i>
//                     </button>
//                 </div>)}
//                 {events.map((event,index)=>(
//                     <div className="event" key={index}>
//                     <div className="event-date-wrapper">
//                         <div className="event-date">{`${monthsOfYear[event.date.getMonth()]}
//                         ${event.date.getDate()},${event.date.getFullYear()}`}</div>
//                         <div className="event-time">{event.time}</div>
//                     </div>
//                     <div className="event-text">{event.text}</div>
//                     <div className="event-buttons">
//                         <i className="bx bxs-edit-alt" onClick={()=>handleEditEvent(event)}></i>
//                         <i className="bx bxs-message-alt-x" onClick={()=>handleDeleteEvent(event.id)}></i>
//                     </div>
//                 </div>
//                 ))}
                
//             </div>
            
//             </div>
//   )
// }

// export default CalendarApp