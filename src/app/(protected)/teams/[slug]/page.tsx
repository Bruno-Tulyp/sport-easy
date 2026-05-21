import FetchTeam from "@/teams/read/components/fetch-team"

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params

  return (
    <>
      <FetchTeam teamSlug={slug} />
    </>
  )
}

export default Page
