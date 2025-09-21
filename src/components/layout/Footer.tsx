export function Footer() {
  return <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Revogate. All rights reserved.
        </p>
      </div>
    </footer>;
}