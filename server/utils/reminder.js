import cron from "node-cron";
import nodemailer from "nodemailer";
import { Event } from "../model/event-model.js";
import dotenv from "dotenv";
dotenv.config();

const sendEmail = async (email, subject, message) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL, pass: process.env.EMAIL_PASSWORD },
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject,
      text: message,
    });
    console.log(`Email sent to ${email}`);
  } catch (error) {
    console.error("Email sending failed:", error);
  }
};

// Daily Reminder Scheduler
cron.schedule("* * * * *", async () => {
  console.log("Checking for daily reminders...");
  const currentTime = new Date();
  const currentDate = currentTime.toISOString().substring(0, 10);
  const formattedTime = currentTime.toTimeString().substring(0, 5);

  try {
    const events = await Event.find({ "reminders.type": "daily" });
    console.log("Fetched events:", events.length);
    events.forEach((event) => {
      if (new Date(event.date).toISOString().substring(0, 10) < currentDate)
        return;
      event.reminders.forEach((reminder) => {
        if (reminder.type === "daily" && reminder.time === formattedTime) {
          event.invitees.forEach((invitee) =>
            sendEmail(
              invitee,
              `Reminder: ${event.title}`,
              `Event on ${event.date} Dont't miss`
            )
          );
        }
        console.log(
          `Checking daily reminder: ${reminder.time} == ${formattedTime}`
        );
      });
    });
  } catch (error) {
    console.error("Error fetching daily reminders:", error);
  }
});

// Specific Date Reminder Scheduler
cron.schedule("* * * * *", async () => {
  console.log("Checking for specific date reminders...");
  const currentTime = new Date();
  const currentDate = currentTime.toISOString().split("T")[0]; 
  const formattedTime = currentTime.toTimeString().substring(0, 5); 

  try {
    const events = await Event.find({
      reminders: { $elemMatch: { type: "specific_date" } },
    }).lean();

    console.log("Fetched specific date events:", events.length);

    events.forEach((event) => {
      if (!event.reminders || !Array.isArray(event.reminders)) {
        console.error(
          `Missing or invalid reminders array in event: ${event.title}`
        );
        return;
      }

      event.reminders.forEach((reminder) => {
        if (reminder.type !== "specific_date") return;

        if (!reminder.date) {
          console.error(`Missing date in reminder for event: ${event.title}`);
          return;
        }

        let reminderDateObj = new Date(reminder.date);
        if (isNaN(reminderDateObj.getTime())) {
          console.error(
            `Invalid date format for event: ${event.title}, received: ${reminder.date}`
          );
          return;
        }

        const reminderDate = reminderDateObj.toISOString().split("T")[0];
        const reminderTime = reminder.time.trim();

        console.log(
          `Checking event: ${event.title}, Reminder Date: ${reminderDate}, Time: ${reminderTime}`
        );

        if (reminderDate === currentDate && reminderTime === formattedTime) {
          console.log(
            `Sending email for event: ${event.title} at ${reminderTime}`
          );
          event.invitees.forEach((invitee) => {
            sendEmail(
              invitee,
              `Event Reminder: ${event.title}`,
              `Event on ${reminder.date} at ${reminder.time}. Don't miss it!`
            );
          });
        }
      });
    });
  } catch (error) {
    console.error("Error fetching specific date reminders:", error);
  }
});

console.log(" Email reminder scheduler started...");
