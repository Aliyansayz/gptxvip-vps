import { useNavigate, useParams } from 'react-router'
import DevLushApp from '../../agentDevRootComponents/devLushAreaApp'
import { getAgentLabTopic } from '../../agentLabsData'
import { StatePanel } from '../../../shared/components/StatePanel'

export default function LabRuntime() {
  const navigate = useNavigate()
  const { topicSlug } = useParams()
  const topic = getAgentLabTopic(topicSlug)

  if (topicSlug && !topic) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-2xl items-center px-5 py-16">
        <StatePanel
          eyebrow="Agent Labs · topic link"
          title="This topic link is no longer available"
          headingLevel={1}
          description="The topic may have been renamed or removed. Browse the current topics to choose an available lesson."
          actionLabel="Browse Agent Labs topics"
          onAction={() => navigate('/lab', { state: { devLushView: 'devlush' } })}
          className="w-full"
        />
      </main>
    )
  }

  return <DevLushApp initialAgentLabTopicSlug={topic?.slug} onExit={() => navigate('/')} onNavigateFinhub={() => window.location.assign('/finhub')} />
}
