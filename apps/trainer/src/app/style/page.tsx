"use client";

import { Alert, AlertDescription, AlertTitle } from "@traiv/ui/components/alert";
import { Badge } from "@traiv/ui/components/badge";
import { Button } from "@traiv/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@traiv/ui/components/card";
import { Checkbox } from "@traiv/ui/components/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@traiv/ui/components/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@traiv/ui/components/dropdown-menu";
import { Input } from "@traiv/ui/components/input";
import { Label } from "@traiv/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@traiv/ui/components/select";
import { Separator } from "@traiv/ui/components/separator";
import { Skeleton } from "@traiv/ui/components/skeleton";
import { Switch } from "@traiv/ui/components/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@traiv/ui/components/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@traiv/ui/components/tabs";
import { Textarea } from "@traiv/ui/components/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@traiv/ui/components/tooltip";
import { AlertTriangle, ChevronDown } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const surfaces = [
  ["--canvas", "canvas", "the page"],
  ["--surface", "surface", "cards, panels"],
  ["--sunken", "sunken", "sidebar, wells, footers"],
  ["--hover", "hover", "faint fill on hover"],
  ["--active", "active", "pressed"],
  ["--selected", "selected", "current item"],
];
const text = [
  ["--fg", "fg", "body text"],
  ["--fg-muted", "fg-muted", "secondary"],
  ["--fg-subtle", "fg-subtle", "metadata only"],
];
const lines = [
  ["--line", "line", "default border — 9% opacity"],
  ["--line-strong", "line-strong", "inputs, dividers that must read"],
  ["--line-focus", "line-focus", "focus ring"],
];
const semantic = [
  ["--accent", "accent", "interactive, selected"],
  ["--danger", "danger", "destructive, at-risk"],
  ["--warning", "warning", "needs attention"],
  ["--success", "success", "confirmed"],
];
const typeScale = [
  ["text-display", "Display · 24px / 600", "Three people need you."],
  ["text-heading", "Heading · 20px / 600", "This week's sessions"],
  ["text-subheading", "Subheading · 16px / 600", "Priya Sharma"],
  ["text-body", "Body · 16px / 400 / 1.5", "The plan is built once and assigned to everyone."],
  ["text-body-sm", "Body small · 14px", "Volume down from 62 to 38 sets a week."],
  ["text-label", "Label · 14px / 500", "Phone number"],
  ["text-caption", "Caption · 12px", "Last trained 2 September"],
];

function Swatch({ token, name, use }: { token: string; name: string; use: string }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="size-10 shrink-0 rounded-control border border-line"
        style={{ backgroundColor: `var(${token})` }}
      />
      <div className="flex min-w-0 flex-col">
        <span className="font-mono text-caption text-fg">{name}</span>
        <span className="truncate text-caption text-fg-subtle">{use}</span>
      </div>
    </div>
  );
}

function Row({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-caption font-semibold uppercase tracking-[0.07em] text-fg-subtle">
        {title}
      </h2>
      {children}
      <Separator />
    </section>
  );
}

export default function StylePage() {
  return (
    <TooltipProvider>
      <div className="min-h-dvh bg-canvas">
        <header className="sticky top-0 z-10 border-b border-line bg-canvas/90 backdrop-blur-md">
          <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
            <span className="text-label font-semibold tracking-[-0.015em]">
              Traiv · design system
            </span>
            <ThemeToggle />
          </div>
        </header>

        <main className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-10 sm:px-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-display font-semibold tracking-[-0.025em]">
              Tokens and components
            </h1>
            <p className="max-w-[65ch] text-body text-fg-muted">
              Every colour, size and radius the product is allowed to use. Toggle the theme in the
              header — each swatch below is a live token, so both themes are shown by the same page.
            </p>
          </div>

          <Row title="Surfaces">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {surfaces.map(([t, n, u]) => (
                <Swatch key={t} token={t as string} name={n as string} use={u as string} />
              ))}
            </div>
          </Row>

          <Row title="Text">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {text.map(([t, n, u]) => (
                <Swatch key={t} token={t as string} name={n as string} use={u as string} />
              ))}
            </div>
          </Row>

          <Row title="Borders">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {lines.map(([t, n, u]) => (
                <Swatch key={t} token={t as string} name={n as string} use={u as string} />
              ))}
            </div>
          </Row>

          <Row title="Accent and state">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {semantic.map(([t, n, u]) => (
                <Swatch key={t} token={t as string} name={n as string} use={u as string} />
              ))}
            </div>
            <p className="max-w-[65ch] text-body-sm text-fg-muted">
              Colour appears only where it carries meaning. Accent means interactive or selected.
              Danger, warning and success are states. Nothing is coloured for decoration.
            </p>
          </Row>

          <Row title="Type scale">
            <div className="flex flex-col gap-4">
              {typeScale.map(([cls, label, sample]) => (
                <div
                  key={cls}
                  className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6"
                >
                  <span className="w-52 shrink-0 font-mono text-caption text-fg-subtle">
                    {label}
                  </span>
                  <span
                    className={`${cls} ${cls === "text-display" || cls === "text-heading" || cls === "text-subheading" ? "font-semibold" : ""} ${cls === "text-label" ? "font-medium" : ""}`}
                  >
                    {sample}
                  </span>
                </div>
              ))}
            </div>
          </Row>

          <Row title="Radius">
            <div className="flex flex-wrap gap-6">
              {[
                ["rounded-control", "3px — buttons, inputs, menu items"],
                ["rounded-surface", "6px — dialogs, panels"],
                ["rounded-full", "avatars only"],
              ].map(([cls, use]) => (
                <div key={cls} className="flex items-center gap-3">
                  <span className={`size-12 border border-line-strong bg-sunken ${cls}`} />
                  <div className="flex flex-col">
                    <span className="font-mono text-caption">{cls}</span>
                    <span className="text-caption text-fg-subtle">{use}</span>
                  </div>
                </div>
              ))}
            </div>
          </Row>

          <Row title="Buttons">
            <div className="flex flex-wrap items-center gap-3">
              <Button>Send plan</Button>
              <Button variant="secondary">Duplicate</Button>
              <Button variant="outline">Open plan</Button>
              <Button variant="ghost">Cancel</Button>
              <Button variant="destructive">Remove client</Button>
              <Button variant="link">Learn the shortcut</Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button>Default</Button>
              <Button size="lg">Large</Button>
              <Button disabled>Disabled</Button>
            </div>
          </Row>

          <Row title="Form">
            <div className="grid max-w-xl grid-cols-1 gap-5">
              <div className="flex flex-col gap-2">
                <Label htmlFor="phone">Phone number</Label>
                <Input id="phone" placeholder="+91 98765 43210" />
                <p className="text-caption text-fg-subtle">
                  We send the verification code on WhatsApp.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="err">Email</Label>
                <Input id="err" defaultValue="priya@" aria-invalid />
                <p className="text-caption text-danger">That doesn't look like an email address.</p>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="note">Note to client</Label>
                <Textarea id="note" placeholder="Keep it short — this lands on WhatsApp." />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="goal">Goal</Label>
                <Select>
                  <SelectTrigger id="goal">
                    <SelectValue placeholder="Pick a goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fat-loss">Fat loss</SelectItem>
                    <SelectItem value="muscle">Muscle gain</SelectItem>
                    <SelectItem value="strength">Strength</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox id="wa" defaultChecked />
                <Label htmlFor="wa" className="font-normal">
                  Send this plan on WhatsApp too
                </Label>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="rank" className="font-normal">
                  Show the monthly leaderboard
                </Label>
                <Switch id="rank" defaultChecked />
              </div>
            </div>
          </Row>

          <Row title="Badges">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>Active</Badge>
              <Badge variant="secondary">Week 6</Badge>
              <Badge variant="outline">Paused</Badge>
              <Badge variant="destructive">Payment failed</Badge>
            </div>
          </Row>

          <Row title="Card">
            <Card className="max-w-md">
              <CardHeader>
                <CardTitle>Pro</CardTitle>
                <CardDescription>Unlimited clients. Everything included.</CardDescription>
              </CardHeader>
              <CardContent>
                <p data-numeric className="text-display font-semibold tracking-[-0.02em]">
                  ₹999
                </p>
                <p className="text-body-sm text-fg-muted">per month, inclusive of GST</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Start free trial</Button>
              </CardFooter>
            </Card>
          </Row>

          <Row title="Alert">
            <Alert className="max-w-xl">
              <AlertTriangle />
              <AlertTitle>Priya hasn't trained in 9 days</AlertTitle>
              <AlertDescription>
                Her check-ins are half as long as usual. This is the point where clients usually
                leave.
              </AlertDescription>
            </Alert>
          </Row>

          <Row title="Tabs">
            <Tabs defaultValue="plan" className="max-w-xl">
              <TabsList>
                <TabsTrigger value="plan">Plan</TabsTrigger>
                <TabsTrigger value="progress">Progress</TabsTrigger>
                <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
              </TabsList>
              <TabsContent value="plan" className="pt-3 text-body-sm text-fg-muted">
                Push/Pull, week 6 of 12. Assigned 2 August.
              </TabsContent>
              <TabsContent value="progress" className="pt-3 text-body-sm text-fg-muted">
                Down 3.4 kg since starting. Bench up 12.5 kg.
              </TabsContent>
              <TabsContent value="nutrition" className="pt-3 text-body-sm text-fg-muted">
                2,100 kcal · 150 g protein · vegetarian.
              </TabsContent>
            </Tabs>
          </Row>

          <Row title="Overlays">
            <div className="flex flex-wrap items-center gap-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Open dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Remove Priya Sharma?</DialogTitle>
                    <DialogDescription>
                      Her plan and history stay on file. She loses access to the app immediately.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="ghost">Keep her</Button>
                    <Button variant="destructive">Remove client</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Actions <ChevronDown className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem>Open plan</DropdownMenuItem>
                  <DropdownMenuItem>Send a note</DropdownMenuItem>
                  <DropdownMenuItem>Duplicate plan</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive">Remove client</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost">Hover me</Button>
                </TooltipTrigger>
                <TooltipContent>Adherence over the last 7 days</TooltipContent>
              </Tooltip>
            </div>
          </Row>

          <Row title="Table">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead className="text-right">Adherence</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  ["Arjun Mehta", "Push/Pull · wk 6", "96%"],
                  ["Kavya Reddy", "Fat loss · wk 11", "91%"],
                  ["Divya Menon", "PCOS protocol · wk 5", "72%"],
                ].map(([n, p, a]) => (
                  <TableRow key={n}>
                    <TableCell className="font-medium">{n}</TableCell>
                    <TableCell className="text-fg-muted">{p}</TableCell>
                    <TableCell data-numeric className="text-right">
                      {a}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Row>

          <Row title="Loading">
            <div className="flex max-w-md flex-col gap-3">
              <div className="flex items-center gap-3">
                <Skeleton className="size-9 rounded-full" />
                <div className="flex flex-1 flex-col gap-2">
                  <Skeleton className="h-3.5 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-4/5" />
            </div>
          </Row>

          <section className="flex flex-col gap-3 pb-10">
            <h2 className="text-caption font-semibold uppercase tracking-[0.07em] text-fg-subtle">
              Empty state
            </h2>
            <div className="flex flex-col items-start gap-3 rounded-surface border border-line bg-surface p-8">
              <p className="text-subheading font-semibold">No clients yet</p>
              <p className="max-w-[48ch] text-body-sm text-fg-muted">
                Add your first client and send them a link. They log their first session without
                downloading anything.
              </p>
              <Button>Add a client</Button>
            </div>
          </section>
        </main>
      </div>
    </TooltipProvider>
  );
}
