import { useNavigate, useParams } from 'react-router'
import DevLushApp from '../../agentDevRootComponents/devLushAreaApp'
import { getAgentLabTopic } from '../../agentLabsData'
import { getAgenticRoleBySlug } from '../../agenticRoles/roleRoutes'
import { StatePanel } from '../../../shared/components/StatePanel'

export default function LabRuntime() {
  const navigate = useNavigate()
  const { topicSlug } = useParams()
  const topic = getAgentLabTopic(topicSlug)
  const role = getAgenticRoleBySlug(topicSlug)

  if (topicSlug && !topic && !role) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-2xl items-center px-5 py-16">
        <StatePanel
          eyebrow="Agent Labs · link"
          title="This lab link is no longer available"
          headingLevel={1}
          description="The topic or role may have been renamed or removed. Browse Agent Labs to choose an available lesson."
          actionLabel="Browse Agent Labs topics"
          onAction={() => navigate('/lab', { state: { devLushView: 'devlush' } })}
          className="w-full"
        />
      </main>
    )
  }

  return <DevLushApp initialAgentLabTopicSlug={topic?.slug} initialAgenticRoleId={role?.id} onExit={() => navigate('/')} onNavigateFinhub={() => window.location.assign('/finhub')} />
}
