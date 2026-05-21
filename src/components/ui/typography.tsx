function TypographyH1({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight ml-3">
      {children}
    </h1>
  )
}

function TypographyH2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="scroll-m-20 text-xl font-semibold tracking-tight ml-3">
      {children}
    </h2>
  )
}

export { TypographyH1, TypographyH2 }
