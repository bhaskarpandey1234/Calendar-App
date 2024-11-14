# Calendar-App
Using Nestjs and React.

Calendar App
This is a simple calendar application built with React. It allows users to view a calendar, select a date, add or update events, and search events by title. The app fetches events from a backend and supports basic event management with validation.

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




