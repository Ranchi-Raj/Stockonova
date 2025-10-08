import Link from "next/link"

export function Footer() {
  return (
    <footer className="mt-16 border-t">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="text-sm font-semibold">Stocknova</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Connect with SEBI-registered experts. Learn. Consult. Grow.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Company</h3>
            <ul className="mt-2 space-y-2 text-sm">
              <li>
                <Link className="text-muted-foreground hover:text-foreground" href="/about">
                  About
                </Link>
              </li>
              <li>
                <Link className="text-muted-foreground hover:text-foreground" href="/contact">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Legal</h3>
            <ul className="mt-2 space-y-2 text-sm">
              <li>
                <Link className="text-muted-foreground hover:text-foreground" href="/terms">
                  Terms
                </Link>
              </li>
              <li>
                <Link className="text-muted-foreground hover:text-foreground" href="/privacy">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Get Started</h3>
            <ul className="mt-2 space-y-2 text-sm">
              <li>
                <Link className="text-muted-foreground hover:text-foreground" href="/experts">
                  Explore Experts
                </Link>
              </li>
              <li>
                <Link className="text-muted-foreground hover:text-foreground" href="/signup">
                  Become an Expert
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 text-xs text-muted-foreground">© Stocknova 2025</div>
      </div>
    </footer>
  )
}
