export function ProtectedMerchExplainer() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-24 border-b border-border/30">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-foreground mb-3">
            Every serious artwork needs <span className="italic text-primary">proof.</span>
          </h2>
          <p className="font-mono text-xs sm:text-sm text-muted-foreground leading-relaxed">
            O.W.P.I.L products are designed to connect the physical item, the digital artwork, and the creator record. Premium products can later include QR/NFC verification, asset IDs, certificates, and optional onchain attestations.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          {[
            { number: "01", title: "Upload Art", description: "Create or upload your original artwork and document provenance." },
            { number: "02", title: "Create Product", description: "Design the physical or digital product version of your work." },
            { number: "03", title: "Attach Proof", description: "Link the product to the original digital file and creator record." },
            { number: "04", title: "Sell Made-to-Order", description: "Customers purchase only what is created. No inventory." },
            { number: "05", title: "Fulfill After Purchase", description: "Print, produce, or deliver the verified product." },
            { number: "06", title: "Certificate Included", description: "Each order includes proof of origin and protection status." },
          ].map((step, i) => (
            <div key={i} className="p-4 sm:p-6 border border-border/40 bg-card/20">
              <div className="font-mono text-xs tracking-[0.3em] text-primary mb-2">
                {step.number}
              </div>
              <h3 className="font-serif text-base sm:text-lg text-foreground mb-2">
                {step.title}
              </h3>
              <p className="font-mono text-xs text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
