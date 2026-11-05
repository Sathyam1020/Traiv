"use client";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@traiv/ui/components/button";
import { Input } from "@traiv/ui/components/input";
import { RadioGroup, RadioOption } from "@traiv/ui/components/wensity/radio-group";
import { User } from "@traiv/ui/icons";
import { useId, useRef, useState } from "react";
import { uploadApi } from "@/lib/api";
import { http } from "@/lib/api/client";
import { useActiveStudio } from "@/lib/query";
import { type ClientSettings, useSettings } from "@/lib/query/use-settings";
import { SettingSelect, SettingsPage } from "../common";
export default function PersonalPage() {
  const { studioId } = useActiveStudio();
  const data = useSettings(studioId);
  return (
    <SettingsPage title="Personal Information">
      {data.isPending ? (
        <p className="p-6 text-sm text-fg-muted">Loading personal information…</p>
      ) : data.isError ? (
        <div role="alert" className="p-6">
          <p>Couldn't load your information.</p>
          <Button variant="outline" onClick={() => void data.refetch()}>
            Try again
          </Button>
        </div>
      ) : studioId ? (
        <PersonalForm studioId={studioId} initial={data.data} />
      ) : null}
    </SettingsPage>
  );
}
function PersonalForm({ studioId, initial }: { studioId: string; initial: ClientSettings }) {
  const qc = useQueryClient();
  const prefix = useId();
  const file = useRef<HTMLInputElement>(null);
  const names = initial.user.name.split(" ");
  const [firstName, setFirst] = useState(names[0] ?? "");
  const [lastName, setLast] = useState(names.slice(1).join(" "));
  const [email, setEmail] = useState(initial.user.email ?? "");
  const [phone, setPhone] = useState(initial.user.phone ?? "");
  const [birthDate, setBirthDate] = useState(initial.settings.birthDate ?? "");
  const [zone, setZone] = useState(initial.settings.timeZone);
  const [units, setUnits] = useState(initial.settings.units);
  const [height, setHeight] = useState(
    initial.settings.heightCm ? String(initial.settings.heightCm) : "",
  );
  const [avatar, setAvatar] = useState(initial.user.avatarUrl);
  const [image, setImage] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const zones = [
    ...new Set([
      zone,
      Intl.DateTimeFormat().resolvedOptions().timeZone,
      ...Intl.supportedValuesOf("timeZone"),
    ]),
  ];
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setSaved(false);
    try {
      let avatarUrl = avatar;
      if (image) {
        avatarUrl = await uploadApi.put(await uploadApi.sign(studioId, "avatar"), image);
        setAvatar(avatarUrl);
        setImage(null);
      }
      await http.patch(`/c/${studioId}/settings/personal`, {
        firstName,
        lastName,
        email,
        phone,
        avatarUrl,
        birthDate: birthDate || null,
        timeZone: zone,
        language: "en",
        units,
        heightCm: height ? Number(height) : null,
      });
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["client-settings", studioId] }),
        qc.invalidateQueries({ queryKey: ["auth", "session"] }),
        qc.invalidateQueries({ queryKey: ["client", "intake", studioId] }),
      ]);
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't save your information.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <form onSubmit={submit} className="space-y-6 px-5 py-6">
      <div className="flex flex-col items-center gap-4">
        <span className="flex size-20 items-center justify-center overflow-hidden rounded-full border-4 border-line bg-sunken">
          {avatar ? (
            <img src={avatar} alt="Your profile" className="size-full object-cover" />
          ) : (
            <User className="size-10 text-fg-subtle" />
          )}
        </span>
        <input
          type="file"
          ref={file}
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const selected = e.target.files?.[0];
            if (selected?.type.startsWith("image/") && selected.size <= 10 * 1024 * 1024) {
              setImage(selected);
              setSaved(false);
            } else setError("Choose an image up to 10 MB.");
          }}
        />
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="rounded-full"
            disabled={busy}
            onClick={() => file.current?.click()}
          >
            Change photo
          </Button>
          <Button
            type="button"
            variant="outline"
            className="rounded-full text-danger"
            disabled={busy || (!avatar && !image)}
            onClick={() => {
              setAvatar(null);
              setImage(null);
            }}
          >
            Delete
          </Button>
        </div>
        {image && <p className="text-xs text-fg-muted">{image.name} · Save to apply</p>}
      </div>
      <h2 className="pt-3 text-base font-semibold">Personal information</h2>
      <div className="grid grid-cols-2 gap-3">
        <Field id={`${prefix}-first`} label="First name">
          <Input
            id={`${prefix}-first`}
            required
            value={firstName}
            onChange={(e) => setFirst(e.target.value)}
            className="h-12 w-full"
          />
        </Field>
        <Field id={`${prefix}-last`} label="Last name">
          <Input
            id={`${prefix}-last`}
            value={lastName}
            onChange={(e) => setLast(e.target.value)}
            className="h-12 w-full"
          />
        </Field>
      </div>
      <Field id={`${prefix}-birth`} label="Birth Date">
        <Input
          id={`${prefix}-birth`}
          type="date"
          max={new Date().toISOString().slice(0, 10)}
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className="h-12 w-full"
        />
      </Field>
      <Field id={`${prefix}-email`} label="Email">
        <Input
          id={`${prefix}-email`}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-12 w-full"
        />
      </Field>
      <Field id={`${prefix}-phone`} label="Phone number">
        <Input
          id={`${prefix}-phone`}
          type="tel"
          placeholder="+91…"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="h-12 w-full"
        />
      </Field>
      <p
        role="note"
        className="rounded-xl bg-warning-subtle px-3 py-3 text-xs leading-relaxed text-warning"
      >
        Verification is currently unavailable. Email and phone changes are saved directly and marked
        unverified. Changing these details signs out your other devices.
      </p>
      <Field id={`${prefix}-language`} label="Language">
        <SettingSelect
          id={`${prefix}-language`}
          label="Language"
          value="en"
          onChange={() => {}}
          options={[{ value: "en", label: "English" }]}
        />
      </Field>
      <Field id={`${prefix}-zone`} label="Time zone">
        <SettingSelect
          id={`${prefix}-zone`}
          label="Time zone"
          value={zone}
          onChange={setZone}
          options={zones.map((z) => ({ value: z, label: z.replaceAll("_", " ") }))}
        />
        <p className="text-xs text-fg-subtle">Used for your dates, reminders and schedules.</p>
      </Field>
      <div>
        <p className="text-sm font-medium">Password</p>
        <p className="mt-2 text-sm text-fg-muted">
          Your account uses phone or Google sign-in. There is no password to change.
        </p>
      </div>
      <RadioGroup
        label="Units"
        variant="tile"
        orientation="vertical"
        value={units}
        onValueChange={(v) => setUnits(v as typeof units)}
      >
        <RadioOption value="metric" label="Metric" description="kg, cm, km" />
        <RadioOption value="us" label="US" description="lb, ft and in, miles" />
        <RadioOption value="uk" label="UK" description="stone and lb, ft and in, miles" />
      </RadioGroup>
      <Field id={`${prefix}-height`} label="Height (cm)">
        <Input
          id={`${prefix}-height`}
          type="number"
          min={90}
          max={250}
          step="any"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          className="h-12 w-full"
        />
      </Field>
      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
      {saved && (
        <p role="status" className="text-sm text-success">
          Personal information saved.
        </p>
      )}
      <Button
        type="submit"
        disabled={busy}
        className="h-12 w-full rounded-full bg-signal text-signal-fg"
      >
        {busy ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      {children}
    </div>
  );
}
