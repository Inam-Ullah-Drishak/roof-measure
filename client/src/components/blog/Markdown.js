import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Styled article body. Used on the blog post page and the admin editor preview.
// Raw HTML in the Markdown is ignored (react-markdown's default), so a post can't inject scripts.
const components = {
  h2: (props) => <h2 className="mb-4 mt-12 text-2xl font-bold text-slate-900" {...props} />,
  h3: (props) => <h3 className="mb-3 mt-8 text-xl font-semibold text-slate-900" {...props} />,
  p: (props) => <p className="mt-6" {...props} />,
  a: ({ href = "", ...props }) => {
    const external = /^https?:\/\//.test(href);
    return (
      <a
        href={href}
        className="font-semibold text-brand-700 underline decoration-brand-200 underline-offset-2 hover:text-brand-800"
        {...(external && { target: "_blank", rel: "noopener noreferrer" })}
        {...props}
      />
    );
  },
  ul: (props) => <ul className="my-6 list-disc space-y-2 pl-6 marker:text-brand-600" {...props} />,
  ol: (props) => <ol className="my-6 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-brand-600" {...props} />,
  strong: (props) => <strong className="font-semibold text-slate-900" {...props} />,
  blockquote: (props) => (
    <blockquote className="my-8 rounded-2xl bg-brand-50 px-6 py-1 text-base text-brand-900 ring-1 ring-brand-100 [&_strong]:text-brand-900" {...props} />
  ),
  // eslint-disable-next-line @next/next/no-img-element -- images come from our API, sizes vary
  img: ({ alt = "", ...props }) => <img alt={alt} loading="lazy" className="my-8 w-full rounded-2xl ring-1 ring-slate-200" {...props} />,
  hr: () => <hr className="my-12 border-slate-200" />,
  table: (props) => (
    <div className="my-8 overflow-x-auto rounded-2xl ring-1 ring-slate-200">
      <table className="w-full text-left text-base" {...props} />
    </div>
  ),
  thead: (props) => <thead className="bg-slate-50 text-sm text-slate-500" {...props} />,
  tbody: (props) => <tbody className="divide-y divide-slate-100" {...props} />,
  th: (props) => <th className="px-5 py-3 font-semibold" {...props} />,
  td: (props) => <td className="px-5 py-3 first:font-medium first:text-slate-900" {...props} />,
  code: (props) => <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[0.9em]" {...props} />,
};

export default function MarkdownContent({ children, className = "" }) {
  return (
    <div className={`text-lg leading-8 text-slate-700 ${className}`}>
      <Markdown remarkPlugins={[remarkGfm]} components={components}>
        {children || ""}
      </Markdown>
    </div>
  );
}
