"use client";

import TermsContent from "../../../content/terms.mdx";

export default function TermsOfUsePage() {
  return (
    <div className="p-4 lg:my-12 prose prose-sm sm:prose-base lg:prose-lg max-w-4xl mx-auto dark:prose-invert dark:text-gray-300">
      <TermsContent />
    </div>
  );
}
