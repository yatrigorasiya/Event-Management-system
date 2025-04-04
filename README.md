📌 Event Management System
A MERN stack-based event management system with user roles, event booking, and email invitations.

🚀 Features
🔹 User Roles:-
User: Can only view events.
Organizer: Can create events and send email invitations.
Admin: Can manage organizers, manage users 

🔹 Event Booking Flow:-
Users click "Book" on an event.
A booking form opens.
After submitting the form, the user receives a confirmation email with a QR Code.
Users scan the QR Code from the email.
The QR Code redirects them to the e-ticket confirmation page.

🔹 QR Code Integration:-
Booking confirmation emails include a QR Code that links to the ticket confirmation page.
The QR Code is unique for each booking.

🛠️ Tech Stack

🔹Frontend:-
React.js
React Router
Tailwind CSS

🔹Backend:-
Node.js
Express.js
MongoDB
Nodemailer
cron job

🔹Authentication & Security:-
JWT for authentication
Role-based access control

 📂 Install Dependencies
🔹Frontend:-
cd client
bun dev

🔹 Backend:-
cd server
node --watch server.js
