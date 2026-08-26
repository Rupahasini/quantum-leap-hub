import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { GradedTest } from "@/components/GradedTest";
import { tests } from "@/lib/assessments";

export const Route = createFileRoute("/tests/$testId")({
  loader: ({ params }) => {
    const test = tests.find((t) => t.id === params.testId);
    if (!test) throw notFound();
    return { test };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Test not found" }, { name: "robots", content: "noindex" }] };
    }
    const { test } = loaderData;
    const title = `${test.title} — Quantum Learning Algorithms`;
    return {
      meta: [
        { title },
        { name: "description", content: test.blurb },
        { property: "og:title", content: title },
        { property: "og:description", content: test.blurb },
      ],
    };
  },
  component: TestPage,
});

function TestPage() {
  const { test } = Route.useLoaderData();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        to="/tests"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="size-4" /> All tests
      </Link>
      <div className="mt-6">
        <GradedTest test={test} />
      </div>
    </div>
  );
}
