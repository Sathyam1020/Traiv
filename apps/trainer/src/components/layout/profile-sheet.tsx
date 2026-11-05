"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Avatar } from "@traiv/ui/components/avatar";
import { Button } from "@traiv/ui/components/button";
import { Input } from "@traiv/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@traiv/ui/components/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@traiv/ui/components/sheet";
import { Skeleton } from "@traiv/ui/components/skeleton";
import { Switch } from "@traiv/ui/components/switch";
import { Check, Loader, TriangleAlert } from "@traiv/ui/icons";
import { notifyAction } from "@traiv/ui/lib/action-feedback";
import { useRef, useState } from "react";
import {
  accountApi,
  notificationLabels,
  type TrainerAccount,
  type TrainerAccountInput,
} from "@/lib/api/account";
import { uploadApi } from "@/lib/api/uploads";
import { queryKeys } from "@/lib/query/keys";

export function ProfileSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const account = useQuery({
    queryKey: ["trainer-account"],
    queryFn: accountApi.get,
    enabled: open,
  });
  const [locked, setLocked] = useState(false);
  const changeOpen = (value: boolean) => {
    if (!locked) onOpenChange(value);
  };
  return (
    <Sheet open={open} onOpenChange={changeOpen} persistent={locked}>
      <SheetContent
        className="w-full gap-0 bg-panel p-0 sm:w-[36rem] sm:max-w-xl"
        onInteractOutside={(event) => {
          if (locked) event.preventDefault();
        }}
      >
        <SheetHeader className="shrink-0 border-b border-line px-6 py-5 pr-14">
          <SheetTitle className="text-2xl font-semibold">Edit your profile</SheetTitle>
          <SheetDescription>Update your profile information here.</SheetDescription>
        </SheetHeader>
        {open && account.data ? (
          <ProfileForm
            account={account.data}
            onClose={() => onOpenChange(false)}
            onBusyChange={setLocked}
          />
        ) : account.isError ? (
          <div className="p-6">
            <p role="alert" className="mb-4 text-body-sm text-danger">
              Couldn't load your profile.
            </p>
            <Button
              variant="secondary"
              onClick={() => {
                void account.refetch();
              }}
            >
              Try again
            </Button>
          </div>
        ) : (
          <div className="space-y-6 p-6">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function ProfileForm({
  account,
  onClose,
  onBusyChange,
}: {
  account: TrainerAccount;
  onClose: () => void;
  onBusyChange: (value: boolean) => void;
}) {
  const qc = useQueryClient();
  const fileInput = useRef<HTMLInputElement>(null);
  const submitting = useRef(false);
  const [draft, setDraft] = useState<TrainerAccountInput>(() => ({
    name: account.user.name,
    email: account.user.email ?? "",
    avatarUrl: account.user.avatarUrl,
    language: "en",
    notifications: { ...account.notifications },
  }));
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const busy = saving || uploading;
  async function upload(file: File | undefined) {
    if (!file || submitting.current) return;
    if (
      !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
      file.size > 5 * 1024 * 1024
    ) {
      setError("Choose a JPG, PNG or WebP image up to 5 MB.");
      return;
    }
    submitting.current = true;
    setUploading(true);
    onBusyChange(true);
    setError("");
    try {
      const ticket = await accountApi.avatar();
      const url = await uploadApi.put(ticket, file);
      setDraft((value) => ({ ...value, avatarUrl: url }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't upload your photo. Try again.");
    } finally {
      submitting.current = false;
      setUploading(false);
      onBusyChange(false);
    }
  }
  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (submitting.current) return;
    submitting.current = true;
    setSaving(true);
    onBusyChange(true);
    setError("");
    try {
      const saved = await accountApi.save({
        ...draft,
        name: draft.name.trim(),
        email: draft.email.trim(),
      });
      qc.setQueryData(["trainer-account"], saved);
      await qc.invalidateQueries({ queryKey: queryKeys.auth.session });
      notifyAction("Profile updated", "success");
      onBusyChange(false);
      // The controlled parent can now dismiss after the save completes.
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't save your profile. Try again.");
    } finally {
      submitting.current = false;
      setSaving(false);
      onBusyChange(false);
    }
  }
  const verified =
    account.user.emailVerified && draft.email.trim().toLowerCase() === account.user.email;
  return (
    <form className="flex min-h-0 flex-1 flex-col" onSubmit={save}>
      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-6">
        <div className="flex flex-wrap items-center gap-4 rounded-surface border border-line bg-surface p-4">
          <Avatar name={draft.name || "Your profile"} src={draft.avatarUrl} size={64} />
          <div className="min-w-0 flex-1 space-y-3">
            <h2 className="text-body font-medium">Profile picture</h2>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={busy || !account.uploadsEnabled}
                onClick={() => fileInput.current?.click()}
              >
                {uploading ? <Loader className="size-4 animate-spin" /> : null}
                {uploading ? "Uploading…" : "Change picture"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="bg-danger-subtle text-danger hover:bg-danger-subtle"
                disabled={busy || !draft.avatarUrl}
                onClick={() => setDraft((v) => ({ ...v, avatarUrl: null }))}
              >
                Delete
              </Button>
            </div>
            {!account.uploadsEnabled ? (
              <p className="text-caption text-fg-muted">Photo uploads are currently unavailable.</p>
            ) : null}
          </div>
          <input
            ref={fileInput}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            aria-label="Choose a profile picture"
            disabled={busy}
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              void upload(file);
            }}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="trainer-profile-name" className="block text-body-sm font-medium">
            Name
          </label>
          <p id="trainer-profile-name-help" className="text-body-sm text-fg-muted">
            This is the name that will be displayed to other users.
          </p>
          <Input
            id="trainer-profile-name"
            aria-describedby="trainer-profile-name-help"
            autoComplete="name"
            required
            maxLength={120}
            value={draft.name}
            disabled={busy}
            onChange={(e) => setDraft((v) => ({ ...v, name: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="trainer-profile-email" className="block text-body-sm font-medium">
            Email address
          </label>
          <p id="trainer-profile-email-help" className="text-body-sm text-fg-muted">
            Primary email for your account.
          </p>
          <Input
            id="trainer-profile-email"
            aria-describedby="trainer-profile-email-help trainer-email-status"
            autoComplete="email"
            type="email"
            maxLength={254}
            value={draft.email}
            disabled={busy}
            onChange={(e) => setDraft((v) => ({ ...v, email: e.target.value }))}
          />
          <div id="trainer-email-status" className="flex items-start gap-2 pt-1 text-caption">
            {verified ? (
              <>
                <Check className="size-4 shrink-0 text-success" />
                <span className="text-success">Email verified</span>
              </>
            ) : (
              <>
                <TriangleAlert className="size-4 shrink-0 text-warning" />
                <span className="text-fg-muted">
                  {draft.email
                    ? "Email is unverified. Changes are saved directly while email verification is unavailable."
                    : "Add an email address to complete your account profile."}
                </span>
              </>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="trainer-profile-language" className="block text-body-sm font-medium">
            Language
          </label>
          <p className="text-body-sm text-fg-muted">
            The language of your dashboard. English is currently supported.
          </p>
          <Select value={draft.language} onValueChange={() => {}} disabled={busy}>
            <SelectTrigger id="trainer-profile-language">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">🇺🇸 English</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <h2 className="text-body-sm font-medium">Password</h2>
          <p className="text-body-sm text-fg-muted">
            You sign in with Google or a sign-in code. Your account does not need a password.
          </p>
        </div>
        <section className="border-t border-line pt-6" aria-labelledby="trainer-notification-title">
          <h2 id="trainer-notification-title" className="text-body font-semibold">
            Notification preferences
          </h2>
          <p className="mt-2 text-body-sm text-fg-muted">
            Choose which account and organisation updates you want to receive.
          </p>
          <div className="mt-4 space-y-1">
            {notificationLabels.map(([key, label]) => (
              <Switch
                key={key}
                id={`trainer-notify-${key}`}
                label={label}
                labelPosition="left"
                fullWidth
                className="w-full gap-6 py-3"
                labelClassName="text-body-sm font-normal leading-normal"
                aria-label={label}
                checked={draft.notifications[key]}
                disabled={busy}
                onCheckedChange={(checked) =>
                  setDraft((v) => ({
                    ...v,
                    notifications: { ...v.notifications, [key]: checked },
                  }))
                }
              />
            ))}
          </div>
        </section>
        {error ? (
          <p
            role="alert"
            className="rounded-control bg-danger-subtle px-3 py-2 text-body-sm text-danger"
          >
            {error}
          </p>
        ) : null}
      </div>
      <SheetFooter className="shrink-0 flex-row justify-end gap-2 border-t border-line bg-surface px-6 py-4">
        <Button type="button" variant="secondary" disabled={busy} onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={busy || !draft.name.trim()}>
          {saving ? "Saving…" : uploading ? "Uploading…" : "Save"}
        </Button>
      </SheetFooter>
    </form>
  );
}
