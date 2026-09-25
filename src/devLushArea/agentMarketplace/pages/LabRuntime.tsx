import DevLushApp from '../../agentDevRootComponents/devLushAreaApp'

export default function LabRuntime() {
  return <DevLushApp onExit={() => window.location.assign('/agents')} onNavigateFinhub={() => window.location.assign('/finhub')} />
}
