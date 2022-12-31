import {
  createContext,
  ReactNode,
  useEffect,
  useReducer,
  useState,
} from 'react'
import { Cycle, cycleReducer } from '../reducers/cycles/reducer'
import {
  addNewCycleAction,
  interruptCycleAction,
  markCurrentCyclesAsFinishedAction,
} from '../reducers/cycles/actions'

interface CreateFormData {
  task: string
  minutesAmount: number
}

interface CyclesContextInterface {
  cycles: Cycle[]
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  defaultTitle: string
  amountSecondsPassed: number
  markCurrentCycleAsFinished: () => void
  setSecondsPassed: (seconds: number) => void
  createNewCycle: (data: CreateFormData) => void
  interruptCycle: () => void
}

interface CylesContextProviderProps {
  children: ReactNode
}

export const CyclesContext = createContext({} as CyclesContextInterface)

export function CyclesContextProvider({ children }: CylesContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(cycleReducer, {
    cycles: [],
    activeCycleId: null,
  })

  const [defaultTitle, setDefaultTitle] = useState('')
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const { cycles, activeCycleId } = cyclesState

  useEffect(() => {
    setDefaultTitle(document.title)
  }, [])

  const activeCycle = cycles.find((c) => c.id === activeCycleId)

  function markCurrentCycleAsFinished() {
    dispatch(markCurrentCyclesAsFinishedAction())
  }

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function createNewCycle(data: CreateFormData) {
    const newCycle: Cycle = {
      id: String(new Date().getTime()),
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }
    dispatch(addNewCycleAction(newCycle))

    setAmountSecondsPassed(0)
  }

  function interruptCycle() {
    dispatch(interruptCycleAction())
    document.title = defaultTitle
  }
  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        defaultTitle,
        amountSecondsPassed,
        markCurrentCycleAsFinished,
        setSecondsPassed,
        createNewCycle,
        interruptCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}
