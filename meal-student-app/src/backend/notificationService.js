const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');

// Initialize Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = getFirestore();

class NotificationService {
  // Send meal reminder to specific user
  async sendMealReminderToUser(userId, mealData) {
    try {
      // Get user's FCM tokens
      const userDoc = await db.collection('users').doc(userId).get();
      if (!userDoc.exists) {
        throw new Error('User not found');
      }

      const userData = userDoc.data();
      const fcmTokens = userData.fcmTokens || [];

      if (fcmTokens.length === 0) {
        console.log('No FCM tokens found for user:', userId);
        return;
      }

      const { mealType, timing, menuItems, messType, notificationType } = mealData;
      
      const mealNames = {
        breakfast: 'Breakfast',
        lunch: 'Lunch',
        snacks: 'Snacks',
        dinner: 'Dinner'
      };

      let title, body;
      if (notificationType === 'start') {
        title = `🍽️ ${mealNames[mealType]} Starting Soon!`;
        body = `Your ${mealNames[mealType].toLowerCase()} begins in 15 minutes.`;
      } else {
        title = `⏰ ${mealNames[mealType]} Ending Soon!`;
        body = `Last 30 minutes to enjoy your ${mealNames[mealType].toLowerCase()}.`;
      }

      const message = {
        notification: {
          title,
          body,
        },
        data: {
          type: 'mealReminder',
          subType: notificationType,
          mealType,
          messType,
          timing,
          menuItems: JSON.stringify(menuItems),
          click_action: 'https://yourdomain.com/selection'
        },
        android: {
          priority: 'high',
          notification: {
            sound: 'default',
            channel_id: 'meal_reminders'
          }
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1
            }
          }
        },
        webpush: {
          headers: {
            Urgency: 'high'
          }
        }
      };

      // Send to all tokens
      const responses = [];
      for (const token of fcmTokens) {
        try {
          const response = await admin.messaging().send({ ...message, token });
          responses.push({ token, success: true, response });
        } catch (error) {
          console.error('Error sending to token:', token, error);
          responses.push({ token, success: false, error });
          
          // Remove invalid token
          if (error.code === 'messaging/invalid-registration-token' || 
              error.code === 'messaging/registration-token-not-registered') {
            await this.removeInvalidToken(userId, token);
          }
        }
      }

      return responses;
    } catch (error) {
      console.error('Error sending meal reminder:', error);
      throw error;
    }
  }

  // Send to all users in a mess
  async sendMealReminderToMess(messId, mealData) {
    try {
      // Get all users in this mess
      const usersSnapshot = await db.collection('users')
        .where('selectedMess', '==', messId)
        .where('notificationEnabled', '==', true)
        .get();

      const results = [];
      for (const userDoc of usersSnapshot.docs) {
        try {
          const result = await this.sendMealReminderToUser(userDoc.id, mealData);
          results.push({ userId: userDoc.id, result });
        } catch (error) {
          results.push({ userId: userDoc.id, error: error.message });
        }
      }

      return results;
    } catch (error) {
      console.error('Error sending meal reminder to mess:', error);
      throw error;
    }
  }

  // Remove invalid FCM token
  async removeInvalidToken(userId, invalidToken) {
    try {
      const userRef = db.collection('users').doc(userId);
      const userDoc = await userRef.get();
      
      if (userDoc.exists) {
        const currentTokens = userDoc.data().fcmTokens || [];
        const updatedTokens = currentTokens.filter(token => token !== invalidToken);
        
        await userRef.update({
          fcmTokens: updatedTokens,
          notificationEnabled: updatedTokens.length > 0
        });
        
        console.log('Removed invalid token for user:', userId);
      }
    } catch (error) {
      console.error('Error removing invalid token:', error);
    }
  }

  // Schedule meal reminders (to be called by cron job)
  async scheduleMealReminders() {
    try {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      // Define meal times (adjust based on your mess timings)
      const mealSchedule = [
        { type: 'breakfast', hour: 7, minute: 45 }, // 15 min before 8:00
        { type: 'lunch', hour: 12, minute: 45 },    // 15 min before 13:00
        { type: 'snacks', hour: 16, minute: 45 },   // 15 min before 17:00
        { type: 'dinner', hour: 19, minute: 45 }    // 15 min before 20:00
      ];

      for (const meal of mealSchedule) {
        if (currentHour === meal.hour && currentMinute === meal.minute) {
          // This would trigger for all messes
          // You'd need to get today's menu from your database
          console.log(`Sending ${meal.type} reminder`);
          // await this.sendMealReminderToAllMesses(meal.type, 'start');
        }
      }
    } catch (error) {
      console.error('Error scheduling meal reminders:', error);
    }
  }
}

module.exports = NotificationService;