import { redirect } from 'next/navigation'

interface PageProps {
  params: Promise<{ slug: string }> | { slug: string }
}

export default async function LegacySceneRedirect({ params }: PageProps) {
  const resolvedParams = params instanceof Promise ? await params : params
  redirect(`/rewir/${resolvedParams.slug}`)
}
