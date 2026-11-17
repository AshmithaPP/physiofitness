import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/posts";

/** Blog card used on the Resources grid and in "Related reading". */
export default function PostCard({ post, sizes = "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw" }) {
  return (
    <Link
      href={`/resources/${post.slug}`}
      data-card
      className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-line bg-primary shadow-[0_18px_40px_-30px] shadow-secondary/40 transition-[transform,box-shadow] duration-500 ease-expo hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-30px] hover:shadow-secondary/55 sm:rounded-[1.75rem]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-mist">
        <Image
          src={post.img}
          alt=""
          fill
          sizes={sizes}
          className={`object-cover transition-transform duration-[1.2s] ease-expo group-hover:scale-[1.06] ${post.pos ?? "object-center"}`}
        />
        <span className="eyebrow absolute top-3 left-3 rounded-full bg-primary/90 px-3 py-1.5 text-[0.625rem] text-secondary shadow-sm backdrop-blur-md sm:top-4 sm:left-4">
          {post.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-secondary/50">
          {formatDate(post.date)} · {post.readMin} min read
        </p>
        <h3 className="mt-2.5 font-display text-lg font-medium leading-snug tracking-[-0.015em] text-secondary sm:text-xl">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm font-light leading-relaxed text-secondary/70">{post.excerpt}</p>

        <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-medium text-secondary">
          Read article
          <span
            aria-hidden
            className="grid size-7 place-items-center rounded-full border border-line transition-all duration-500 ease-expo group-hover:translate-x-1 group-hover:border-secondary group-hover:bg-secondary group-hover:text-primary"
          >
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
