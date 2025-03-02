// functions/index.js

// Load local environment variables (for testing)
// Make sure to replace sensitive values in .env.default with placeholders
// and add .env.default to your .gitignore so they are not publicly committed.
require("dotenv").config({ path: ".env.default" });

const functions = require("firebase-functions");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const admin = require("firebase-admin");
const twilio = require("twilio");

// Initialize Firebase Admin SDK
admin.initializeApp();

// Retrieve Twilio configuration from environment variables.
// Replace the values in your .env.default file with placeholders before publishing.
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;
const twilioNumber = process.env.TWILIO_NUMBER;

const client = twilio(accountSid, authToken);

// This function runs every 1 minute (for testing). Adjust schedule as needed in production.
exports.subscriptionNotifier = onSchedule("every 1 minutes", async (event) => {
  // Get current time
  const now = admin.firestore.Timestamp.now();

  // Query the "customers" collection for documents with a subscriptionEndDate that is less than or equal to the current time and haven't been notified.
  const customersRef = admin.firestore().collection("customers");
  const snapshot = await customersRef
    .where("subscriptionEndDate", "<=", now)
    .where("notified", "==", false)
    .get();

  snapshot.forEach(async (doc) => {
    const customer = doc.data();
    try {
      if (!customer.phoneNumber) {
        console.error(`Customer ${doc.id} is missing a phone number`);
        return;
      }

      // Send an SMS via Twilio
      const message = await client.messages.create({
        body: `Hi ${customer.firstName}, your subscription has expired or is due to expire.`,
        from: "LifeShop", // You might want to update this if needed
        to: customer.phoneNumber,
      });

      console.log(`Sent SMS to ${customer.firstName} (${doc.id}): ${message.sid}`);

      // Mark the customer as notified
      await doc.ref.update({ notified: true });
    } catch (error) {
      console.error(`Error sending SMS to customer ${doc.id}:`, error);
    }
  });

  return null;
});
