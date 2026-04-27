import Link from 'next/link'

export default function SignUpSuccessPage() {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-background" />

      {/* Content */}
      <div className="relative z-20 flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          {/* Logo */}
          <div className="mb-8">
            <Link href="/" className="inline-block">
              <h1 className="font-serif text-4xl tracking-[0.3em] text-foreground">
                O<span className="text-accent">.</span>W<span className="text-accent">.</span>P<span className="text-accent">.</span>I<span className="text-accent">.</span>L
              </h1>
            </Link>
          </div>

          {/* Card */}
          <div className="bg-card/80 backdrop-blur-md border border-border rounded-lg p-8 shadow-2xl">
            {/* Success Icon */}
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>

            <h2 className="text-2xl font-serif text-foreground mb-2">Check Your Email</h2>
            <p className="text-muted-foreground mb-6">
              {"We've sent you a confirmation link. Please check your email to verify your account and gain access to the dashboard."}
            </p>

            <div className="space-y-4">
              <Link
                href="/auth/login"
                className="block w-full py-3 px-4 bg-accent text-background font-mono uppercase tracking-wider rounded-md hover:bg-accent/90 transition-all text-center"
              >
                Back to Login
              </Link>
              
              <Link
                href="/"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Return to Site
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
