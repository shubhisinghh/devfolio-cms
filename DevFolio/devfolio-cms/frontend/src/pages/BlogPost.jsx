import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Clock, Eye, Calendar } from "lucide-react";
import api, { assetUrl } from "../api/client";
import { Loader, EmptyState } from "../components/Loader";

export default function BlogPost() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    api
      .get(`/blogs/${slug}`)
      .then((res) => setBlog(res.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Loader label="loading post" />;
  if (notFound || !blog) {
    return (
      <section className="section">
        <EmptyState title="Post not found" description="This post may have been removed or the link is incorrect." />
        <div className="text-center mt-6">
          <Link to="/blog" className="btn-outline inline-flex">
            <ArrowLeft size={15} /> Back to blog
          </Link>
        </div>
      </section>
    );
  }

  const date = new Date(blog.publish_date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article className="section max-w-3xl">
      <Link to="/blog" className="inline-flex items-center gap-1.5 font-mono text-xs text-cyan mb-8 hover:gap-2.5 transition-all">
        <ArrowLeft size={13} /> back to blog
      </Link>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {blog.tags.map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
      </div>

      <h1 className="font-display text-3xl md:text-4xl font-semibold text-heading leading-tight mb-5">{blog.title}</h1>

      <div className="flex items-center gap-4 font-mono text-xs text-muted mb-8 pb-8 border-b border-base">
        <span className="flex items-center gap-1.5">
          <Calendar size={13} /> {date}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock size={13} /> {blog.reading_time} min read
        </span>
        <span className="flex items-center gap-1.5">
          <Eye size={13} /> {blog.views} views
        </span>
      </div>

      {blog.thumbnail && (
        <div className="surface overflow-hidden mb-8">
          <img src={assetUrl(blog.thumbnail)} alt={blog.title} className="w-full aspect-video object-cover" />
        </div>
      )}

      <div className="prose-devfolio">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{blog.content}</ReactMarkdown>
      </div>
    </article>
  );
}
