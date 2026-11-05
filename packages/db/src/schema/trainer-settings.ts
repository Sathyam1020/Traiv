import { jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./user.js";

export const trainerNotificationDefaults = {
  paymentFailures: true,
  successfulPayments: true,
  newLeads: true,
  clientOnboarding: true,
  expiringPaymentMethods: true,
  paymentSetupFailures: true,
  subscriptionCancellations: true,
  automationFailures: true,
  clientAssignments: true,
  paymentPlansNotStarted: true,
  reportedCommunityPosts: true,
};
export type TrainerNotifications = typeof trainerNotificationDefaults;
export const trainerSettings = pgTable("trainer_settings", {
  userId: text()
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  notifications: jsonb()
    .$type<TrainerNotifications>()
    .notNull()
    .default(trainerNotificationDefaults),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
