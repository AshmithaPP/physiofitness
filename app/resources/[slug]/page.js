import { Suspense } from "react";
import { notFound } from "next/navigation";
import Navbar from "@/components/hero/Navbar";
import Footer from "@/components/home/Footer";
import ArticleView from "@/components/resources/ArticleView";
import { POSTS, getPost } from "@/lib/posts";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} | Physiofit Studio Resources`,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, images: [post.img], type: "article" },
  };
}

/* The URL (`params`) is read inside <Suspense>, so the shared page shell
   (navbar, footer, skeleton) can be shown instantly on navigation. */
export default function ArticlePage({ params }) {
  return (
    <>
      <Navbar />
      <main className="w-full overflow-x-clip bg-primary text-secondary">
        <Suspense fallback={<ArticleSkeleton />}>
          <Article params={params} />
        </Suspense>
      </main>
      <Footer ready={true} />
    </>
  );
}

async function Article({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  // same topic first, then the rest
  const others = POSTS.filter((p) => p.slug !== post.slug);
  const related = [
    ...others.filter((p) => p.category === post.category),
    ...others.filter((p) => p.category !== post.category),
  ].slice(0, 3);

  return <ArticleView post={post} related={related} />;
}

function ArticleSkeleton() {
  return (
    <div aria-hidden>
      <div className="bg-secondary">
        <div className="mx-auto w-full max-w-[64rem] px-[var(--gutter)] pt-28 pb-28 sm:pt-36 sm:pb-36 lg:pb-44">
          <div className="h-3 w-24 animate-pulse rounded-full bg-primary/15" />
          <div className="mt-6 h-10 w-4/5 animate-pulse rounded-2xl bg-primary/15 sm:h-14" />
          <div className="mt-3 h-10 w-3/5 animate-pulse rounded-2xl bg-primary/15 sm:h-14" />
        </div>
      </div>
      <div className="mx-auto -mt-20 w-full max-w-[72rem] px-[var(--gutter)] sm:-mt-24 lg:-mt-32">
        <div className="aspect-[16/10] animate-pulse rounded-[1.5rem] bg-mist sm:aspect-[2/1] sm:rounded-[2rem]" />
      </div>
      <div className="mx-auto w-full max-w-[72rem] space-y-3 px-[var(--gutter)] py-16">
        {[90, 100, 95, 70].map((w) => (
          <div key={w} className="h-4 animate-pulse rounded-full bg-mist" style={{ width: `${w}%`, maxWidth: "44rem" }} />
        ))}
      </div>
    </div>
  );
}
