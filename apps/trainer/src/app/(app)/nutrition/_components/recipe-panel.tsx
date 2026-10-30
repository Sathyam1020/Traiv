"use client";
import { Button } from "@traiv/ui/components/button";
import { Input } from "@traiv/ui/components/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@traiv/ui/components/sheet";
import { Textarea } from "@traiv/ui/components/textarea";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { RecipeWrite } from "@/lib/api/nutrition";
import { clearNutritionDraft, recipeDraft } from "@/lib/nutrition-drafts";
import { useNutritionActions } from "@/lib/query/use-nutrition";
import { ALLERGENS, DIETS, Field, MEALS, MultiPick, Pick } from "./controls";
import { MediaField } from "./media-field";
export const emptyRecipe = (): RecipeWrite => ({
  id: crypto.randomUUID(),
  name: "",
  description: null,
  servings: 1,
  imageUrl: null,
  videoUrl: null,
  videoLinkUrl: null,
  mealTypes: [],
  dietaryTags: [],
  allergenTags: [],
  difficulty: "none",
  prepMinutes: null,
  cookMinutes: null,
  ingredients: [],
  steps: [],
});
export function RecipeIdentity({
  value,
  patch,
  studioId,
  readOnly = false,
}: {
  value: RecipeWrite;
  patch: (v: Partial<RecipeWrite>) => void;
  studioId: string;
  readOnly?: boolean;
}) {
  const [videoMode, setVideoMode] = useState(value.videoUrl ? "Uploaded video" : "YouTube / Vimeo");
  return (
    <fieldset disabled={readOnly} className="flex min-w-0 flex-col gap-5">
      <Field label="Name">
        <Input
          aria-label="Recipe name"
          required
          maxLength={255}
          value={value.name}
          onChange={(e) => patch({ name: e.target.value })}
        />
      </Field>
      <Field label="Servings">
        <Input
          aria-label="Servings"
          required
          type="number"
          min={1}
          max={50}
          value={value.servings}
          onChange={(e) => patch({ servings: Number(e.target.value) })}
        />
      </Field>
      <Field label="Description">
        <Textarea
          aria-label="Description"
          maxLength={2048}
          value={value.description ?? ""}
          onChange={(e) => patch({ description: e.target.value || null })}
        />
      </Field>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <MultiPick
          label="Meal type"
          options={MEALS}
          values={value.mealTypes}
          onChange={(mealTypes) => patch({ mealTypes })}
        />
        <MultiPick
          label="Dietary preferences"
          options={DIETS}
          values={value.dietaryTags}
          onChange={(dietaryTags) => patch({ dietaryTags })}
        />
        <MultiPick
          label="Contains allergens"
          options={ALLERGENS}
          values={value.allergenTags}
          onChange={(allergenTags) => patch({ allergenTags })}
        />
      </div>
      <Field label="Difficulty">
        <Pick
          label="Difficulty"
          value={value.difficulty}
          options={["none", "easy", "medium", "hard"]}
          onChange={(difficulty) => patch({ difficulty })}
        />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Prep time (min)">
          <Input
            aria-label="Prep time (min)"
            type="number"
            min={0}
            max={1440}
            value={value.prepMinutes ?? ""}
            onChange={(e) => patch({ prepMinutes: e.target.value ? Number(e.target.value) : null })}
          />
        </Field>
        <Field label="Cook time (min)">
          <Input
            aria-label="Cook time (min)"
            type="number"
            min={0}
            max={1440}
            value={value.cookMinutes ?? ""}
            onChange={(e) => patch({ cookMinutes: e.target.value ? Number(e.target.value) : null })}
          />
        </Field>
      </div>
      {!readOnly ? (
        <>
          <MediaField
            studioId={studioId}
            label="Recipe image"
            kind="recipe-image"
            value={value.imageUrl ?? ""}
            onChange={(imageUrl) => patch({ imageUrl: imageUrl || null })}
          />
          <Pick
            label="Video source"
            value={videoMode}
            options={["YouTube / Vimeo", "Uploaded video"]}
            onChange={(mode) => {
              setVideoMode(mode);
              patch({ videoUrl: null, videoLinkUrl: null });
            }}
          />
          {videoMode === "Uploaded video" ? (
            <MediaField
              studioId={studioId}
              label="Recipe video"
              kind="recipe-video"
              value={value.videoUrl ?? ""}
              onChange={(videoUrl) => patch({ videoUrl: videoUrl || null })}
            />
          ) : (
            <Field label="YouTube / Vimeo link">
              <Input
                aria-label="Video link"
                type="url"
                value={value.videoLinkUrl ?? ""}
                onChange={(e) => patch({ videoLinkUrl: e.target.value || null })}
              />
            </Field>
          )}
        </>
      ) : null}
    </fieldset>
  );
}
export function RecipePanel({ studioId, close }: { studioId: string; close: () => void }) {
  const [value, setValue] = useState(emptyRecipe);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const actions = useNutritionActions(studioId);
  const key = `traiv:recipe-new:${studioId}`;
  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        setValue(recipeDraft(saved));
      }
    } catch {
      setError("Couldn't restore the previous draft. Keep this form open until you save.");
    }
    setReady(true);
  }, [key]);
  useEffect(() => {
    if (ready) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {
        setError("Draft storage is unavailable. Keep this form open until you save.");
      }
    }
  }, [value, key, ready]);
  return (
    <Sheet
      open
      onOpenChange={(open) => {
        if (!open && !actions.saveRecipe.isPending) close();
      }}
    >
      <SheetContent
        className="w-full overflow-y-auto sm:max-w-xl"
        onInteractOutside={(e) => {
          if (value.name) e.preventDefault();
        }}
      >
        <SheetHeader>
          <SheetTitle>New recipe</SheetTitle>
          <SheetDescription>
            Save the details, then add ingredients and instructions.
          </SheetDescription>
        </SheetHeader>
        <form
          className="flex flex-col gap-6 px-4 pb-6"
          onSubmit={async (e) => {
            e.preventDefault();
            setError("");
            try {
              const recipe = await actions.saveRecipe.mutateAsync({ input: value });
              clearNutritionDraft(key);
              close();
              router.push(`/nutrition/recipes/${recipe.id}`);
            } catch (err) {
              setError(
                err instanceof Error ? err.message : "Couldn't create the recipe. Try again.",
              );
            }
          }}
        >
          <RecipeIdentity
            value={value}
            patch={(p) => setValue((v) => ({ ...v, ...p }))}
            studioId={studioId}
          />
          {error ? (
            <p role="alert" className="text-body-sm text-danger">
              {error}
            </p>
          ) : null}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={close}>
              Close
            </Button>
            <Button
              disabled={
                !value.name.trim() || !value.mealTypes.length || actions.saveRecipe.isPending
              }
            >
              {actions.saveRecipe.isPending ? "Saving…" : "Save recipe"}
            </Button>
          </div>
          <p className="text-caption text-fg-subtle">Unsaved details are kept on this device.</p>
        </form>
      </SheetContent>
    </Sheet>
  );
}
