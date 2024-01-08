import './App.css'
import Agenda from './components/Agenda'
import { AgendaProvider } from './context/AgendaContext'
import { Toaster } from "@/components/ui/toaster"

function App() {

  return (
    <div className="container mx-auto py-10">
      <AgendaProvider>
        <Agenda />
        <Toaster />
      </AgendaProvider>
    </div>
  )
}

export default App

