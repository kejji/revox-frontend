import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight, Clock } from "lucide-react";

export default function Blog() {
  const featuredPost = {
    id: "user-feedback-analysis-revox",
    title: "How Revox Transformed My Approach to User Feedback Analysis",
    excerpt: "After years of manually analyzing app store reviews, I built Revox to automate the process. Here's what I learned about turning user feedback into actionable product insights.",
    category: "Product Strategy",
    date: "2024-01-15",
    readTime: "8 min read",
    image: "/placeholder.svg"
  };

  const blogPosts = [
    {
      id: "mobile-first-product-strategy",
      title: "Building a Mobile-First Product Strategy in 2024",
      excerpt: "Essential considerations for Product Owners when designing mobile-centric experiences that users love.",
      category: "Mobile Strategy",
      date: "2024-01-10",
      readTime: "6 min read"
    },
    {
      id: "prioritization-frameworks",
      title: "Beyond RICE: Modern Prioritization Frameworks for Product Owners",
      excerpt: "Explore advanced prioritization techniques that go beyond traditional frameworks to make better product decisions.",
      category: "Product Management",
      date: "2024-01-05",
      readTime: "7 min read"
    },
    {
      id: "agile-delivery-best-practices",
      title: "Agile Delivery Best Practices for Distributed Teams",
      excerpt: "Proven strategies for managing agile teams across different time zones and maintaining delivery excellence.",
      category: "Agile",
      date: "2023-12-28",
      readTime: "5 min read"
    },
    {
      id: "fintech-ux-considerations",
      title: "UX Considerations for Fintech Products: Trust and Usability",
      excerpt: "How to balance regulatory compliance with user experience in financial technology products.",
      category: "Fintech",
      date: "2023-12-20",
      readTime: "9 min read"
    },
    {
      id: "user-story-writing-guide",
      title: "The Complete Guide to Writing Effective User Stories",
      excerpt: "Best practices for writing user stories that drive development and deliver value to users.",
      category: "Product Management",
      date: "2023-12-15",
      readTime: "6 min read"
    },
    {
      id: "app-store-optimization",
      title: "App Store Optimization: A Product Owner's Perspective",
      excerpt: "How Product Owners can influence ASO strategy to improve app discoverability and user acquisition.",
      category: "Mobile Strategy",
      date: "2023-12-10",
      readTime: "8 min read"
    }
  ];

  const categories = [
    "All Posts",
    "Product Strategy",
    "Mobile Strategy",
    "Product Management",
    "Agile",
    "Fintech",
    "User Experience"
  ];

  return (
    <Layout>
      <div className="mx-auto max-w-6xl px-4 py-16 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl mb-6">
            Product Insights &
            <span className="text-primary"> Best Practices</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Practical insights on mobile product strategy, user feedback analysis, and agile delivery from my experience as a Product Owner.
          </p>
        </div>

        {/* Categories Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {categories.map((category) => (
            <Badge 
              key={category} 
              variant={category === "All Posts" ? "default" : "secondary"}
              className="cursor-pointer px-4 py-2"
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Featured Post */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Featured Article</h2>
          <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-blue-500/5">
            <CardHeader>
              <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <Badge className="bg-primary text-primary-foreground">{featuredPost.category}</Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(featuredPost.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      {featuredPost.readTime}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    {featuredPost.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {featuredPost.excerpt}
                  </p>
                  <Button asChild>
                    <Link to={`/blog/${featuredPost.id}`}>
                      Read Article <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        </section>

        {/* Blog Posts Grid */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">Latest Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <Card key={post.id} className="group hover:border-primary/50 transition-colors cursor-pointer">
                <CardHeader>
                  <div className="flex items-center space-x-2 mb-3">
                    <Badge variant="secondary">{post.category}</Badge>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(post.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {post.readTime}
                    </div>
                  </div>
                  <Link to={`/blog/${post.id}`} className="block mt-4">
                    <Button variant="ghost" size="sm" className="w-full">
                      Read More <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="mt-16 text-center bg-muted/30 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Stay Updated
          </h2>
          <p className="text-muted-foreground mb-6">
            Get the latest insights on product management and mobile strategy delivered to your inbox.
          </p>
          <Button asChild size="lg">
            <Link to="/contact">Subscribe to Updates</Link>
          </Button>
        </section>
      </div>
    </Layout>
  );
}