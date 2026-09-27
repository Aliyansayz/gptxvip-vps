import { useNavigate } from 'react-router'
import DevLushApp from '../../agentDevRootComponents/devLushAreaApp'

export default function LabRuntime() {
  const navigate = useNavigate()
  return <DevLushApp onExit={() => navigate('/')} onNavigateFinhub={() => window.location.assign('/finhub')} />
}
