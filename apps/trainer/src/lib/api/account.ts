import { http } from "./client";
import type { UploadTicket, User } from "./types";

export const notificationLabels = [
  ["paymentFailures", "Payment failures"],
  ["successfulPayments", "Successful payments"],
  ["newLeads", "New leads"],
  ["clientOnboarding", "Client onboarding completions"],
  ["expiringPaymentMethods", "Expiring payment methods"],
  ["paymentSetupFailures", "Payment setup failures"],
  ["subscriptionCancellations", "Subscription cancellations"],
  ["automationFailures", "Automation failures"],
  ["clientAssignments", "Client assignments"],
  ["paymentPlansNotStarted", "Payment plans that could not start"],
  ["reportedCommunityPosts", "Reported community posts"],
] as const;
export type TrainerNotifications = Record<(typeof notificationLabels)[number][0], boolean>;
export type TrainerAccount = {
  user: User & { avatarUrl: string | null; emailVerified: boolean; language: "en" };
  notifications: TrainerNotifications;
  uploadsEnabled: boolean;
  emailVerificationEnabled: boolean;
  passwordSignInEnabled: boolean;
};
export type TrainerAccountInput = {
  name: string;
  email: string;
  avatarUrl: string | null;
  language: "en";
  notifications: TrainerNotifications;
};
export const accountApi = {
  get: async () => (await http.get<TrainerAccount>("/auth/account")).data,
  save: async (input: TrainerAccountInput) =>
    (await http.patch<TrainerAccount>("/auth/account", input)).data,
  avatar: async () => (await http.post<UploadTicket>("/auth/account/avatar", {})).data,
};
