import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useParams } from "react-router-dom";
import { Calendar, Clock, ArrowLeft, ArrowRight } from "lucide-react";

export default function BlogPost() {
  const { slug } = useParams();

  // Sample blog post data - in a real app, you'd fetch this based on the slug
  const post = {
    id: "user-feedback-analysis-revox",
    title: "How Revox Transformed My Approach to User Feedback Analysis",
    content: `
      <p>As a Product Owner working with mobile applications, I've always believed that user feedback is gold. But for years, I was doing what most POs do: manually scrolling through app store reviews, copying and pasting interesting comments into spreadsheets, and trying to make sense of hundreds of scattered data points.</p>

      <p>This manual process was not only time-consuming but also prone to bias. I'd inevitably focus on the most recent or most emotionally charged reviews, potentially missing important patterns in the data.</p>

      <h2>The Problem with Manual Analysis</h2>

      <p>Let me paint you a picture of my old process:</p>

      <ul>
        <li><strong>Time-consuming:</strong> I'd spend 3-4 hours every week just collecting and categorizing feedback</li>
        <li><strong>Inconsistent:</strong> My categorization would vary depending on my mood or recent experiences</li>
        <li><strong>Limited scope:</strong> I could only analyze a small fraction of available reviews</li>
        <li><strong>Reactive:</strong> By the time I identified patterns, they were often weeks old</li>
      </ul>

      <h2>Why I Built Revox</h2>

      <p>The breaking point came during a product retrospective when our team realized we'd missed a critical user experience issue that had been mentioned in over 50 app store reviews. The issue had been there for months, but our manual process hadn't caught the pattern.</p>

      <p>That's when I decided to build Revox. I wanted a tool that could:</p>

      <ul>
        <li>Automatically collect and categorize user feedback</li>
        <li>Identify patterns and trends in real-time</li>
        <li>Provide actionable insights for product prioritization</li>
        <li>Scale beyond what any human could manually process</li>
      </ul>

      <h2>Key Lessons Learned</h2>

      <h3>1. Volume Reveals Truth</h3>
      <p>When you can analyze thousands of reviews instead of dozens, patterns become crystal clear. What seemed like isolated complaints are often systematic issues affecting many users.</p>

      <h3>2. Timing Matters</h3>
      <p>Real-time analysis allows you to catch issues as they emerge, not weeks later. This is especially critical for mobile apps where user retention is measured in days, not months.</p>

      <h3>3. Context is Everything</h3>
      <p>Understanding not just what users are saying, but when they're saying it (after which app version, during which time period) provides crucial context for prioritization decisions.</p>

      <h2>The Impact on My Product Decisions</h2>

      <p>Since implementing Revox in my workflow, I've seen significant improvements in:</p>

      <ul>
        <li><strong>Prioritization accuracy:</strong> Data-driven insights lead to better feature prioritization</li>
        <li><strong>Team alignment:</strong> Objective data helps resolve subjective disagreements</li>
        <li><strong>User satisfaction:</strong> Faster response to user pain points</li>
        <li><strong>Resource efficiency:</strong> Focus development efforts on what actually matters to users</li>
      </ul>

      <h2>Conclusion</h2>

      <p>Building Revox taught me that the best product solutions often come from solving your own problems. As Product Owners, we're uniquely positioned to understand the pain points in our field and create tools that address them.</p>

      <p>If you're still manually analyzing user feedback, I encourage you to explore automation tools. Whether it's Revox or another solution, the key is to free up your time for strategic thinking rather than data processing.</p>
    `,
    category: "Product Strategy",
    date: "2024-01-15",
    readTime: "8 min read",
    excerpt: "After years of manually analyzing app store reviews, I built Revox to automate the process. Here's what I learned about turning user feedback into actionable product insights."
  };

  return (
    <Layout>
      <article className="mx-auto max-w-4xl px-4 py-16 lg:px-8">
        {/* Back Button */}
        <div className="mb-8">
          <Button asChild variant="ghost">
            <Link to="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
        </div>

        {/* Article Header */}
        <header className="mb-12">
          <div className="flex items-center space-x-4 mb-4">
            <Badge className="bg-primary text-primary-foreground">{post.category}</Badge>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-1" />
              {new Date(post.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              {post.readTime}
            </div>
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
            {post.title}
          </h1>
          
          <p className="text-xl text-muted-foreground">
            {post.excerpt}
          </p>
        </header>

        {/* Article Content */}
        <div 
          className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-ul:text-muted-foreground prose-li:text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Article Footer */}
        <footer className="mt-12 pt-8 border-t">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Written by <span className="font-medium text-foreground">Product Owner at Revogate</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Specialized in mobile products and user feedback analysis
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link to="/contact">Get in Touch</Link>
              </Button>
              <Button asChild>
                <Link to="/revox">Try Revox</Link>
              </Button>
            </div>
          </div>
        </footer>

        {/* Related CTA */}
        <section className="mt-16 text-center bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Want to transform your feedback analysis?
          </h2>
          <p className="text-muted-foreground mb-6">
            See how Revox can help you make better product decisions using automated user feedback analysis.
          </p>
          <Button asChild size="lg">
            <Link to="/revox">
              Explore Revox <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </section>
      </article>
    </Layout>
  );
}