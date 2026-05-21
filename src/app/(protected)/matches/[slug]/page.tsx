import FetchMatch from "@/matches/read/components/fetch-match"

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params

  return (
    <>
      <FetchMatch matchSlug={slug} />
    </>
  )
}

export default Page
