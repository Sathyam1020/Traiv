"use client";
import { useQuery } from "@tanstack/react-query";
import { Page } from "@traiv/ui/components/shell/page";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useActiveStudioId } from "@/lib/active-studio";
import { mealPlansApi } from "@/lib/api/meal-plans";
import { LibraryError, LibraryLoading } from "../../_components/controls";
import { PlanBuilder } from "../_components/plan-builder";
export default function MealPlanPage() {
  const { planId } = useParams<{ planId: string }>();
  const studioId = useActiveStudioId() ?? "";
  const query = useQuery({
    queryKey: ["mealplan", studioId, planId],
    queryFn: () => mealPlansApi.get(studioId, planId),
    enabled: Boolean(studioId),
    refetchOnWindowFocus: false,
  });
  if (query.isPending)
    return (
      <Page>
        <LibraryLoading />
      </Page>
    );
  if (query.isError)
    return (
      <Page>
        <Link href="/nutrition/mealplans">Back to mealplans</Link>
        <LibraryError retry={() => query.refetch()} />
      </Page>
    );
  return <PlanBuilder key={`${studioId}:${planId}`} plan={query.data} studioId={studioId} />;
}
