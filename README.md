# Calendar-App
Using Nestjs and React.

Calendar App
This is a simple calendar application built with React. It allows users to view a calendar, select a date, add or update events, and search events by title. The app fetches events from a backend and supports basic event management with validation.
![Screenshot][image](https://github.com/user-attachments/assets/7dd5d2b5-66e8-4232-8154-9d97adfdd130)

![Screenshot][image](https://github.com/user-attachments/assets/77a2783c-d852-4166-af9b-eb3d57d9c40d)

(![image](https://github.com/user-attachments/assets/a40992c9-132b-4e8c-b030-631837a07826)
)
![Screenshot](![image](https://github.com/user-attachments/assets/efd6e941-15e9-476e-9dbe-c273656c6d41)
)
![Screenshot](![image](https://github.com/user-attachments/assets/77a83330-2491-42d0-b5f3-e8ae815af3fc)
)
![Screenshot](![image](https://github.com/user-attachments/assets/bc8611a5-4975-4390-9bdb-a1d5647736ea)
)
![Screenshot](assets/images/screenshot.png)

Features
View Calendar: Displays the current month with all the dates.
Add Event: Users can add events by selecting a date and entering the event details.
Edit Event: Existing events can be edited by clicking the edit icon.
Delete Event: Events can be deleted by clicking the delete icon.
Search Events: Users can search for events by title.

Technologies Used
Frontend: React.js
Backend: Nest.js 
State Management: React Hooks (useState, useEffect)
API: Axios (for fetching data from the backend)
Validation: Custom validation for event creation and editing

Installation
Clone the repository:

git clone https://github.com/yourusername/calendar-app.git
cd calendar-app
Install dependencies:

bash
npm install
Start the development server:


npm start
Visit http://localhost:3000 in your browser.

How It Works
Calendar View: The calendar is displayed with all the dates of the current month. Clicking on a date allows users to add or edit an event for that day.

Event Management: When a date is clicked, the user can enter the event details, including the event time and title. The event time is validated to ensure it's within the correct range.


Event Validation
When adding or editing an event, the following validations are applied:

Event title: Must be non-empty.
Event time: Must be a valid time (hours: 0-23, minutes: 0-59).




