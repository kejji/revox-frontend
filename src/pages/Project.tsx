import { Layout } from "@/components/layout/Layout";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Project() {
  const { t } = useLanguage();

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-foreground mb-6">
              {t("project")}
            </h1>
            <p className="text-xl text-muted-foreground mb-12">
              Discover our latest projects and case studies
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-6 border border-border rounded-lg bg-card">
                <h3 className="text-xl font-semibold mb-4">Project 1</h3>
                <p className="text-muted-foreground">Coming soon...</p>
              </div>
              
              <div className="p-6 border border-border rounded-lg bg-card">
                <h3 className="text-xl font-semibold mb-4">Project 2</h3>
                <p className="text-muted-foreground">Coming soon...</p>
              </div>
              
              <div className="p-6 border border-border rounded-lg bg-card">
                <h3 className="text-xl font-semibold mb-4">Project 3</h3>
                <p className="text-muted-foreground">Coming soon...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}