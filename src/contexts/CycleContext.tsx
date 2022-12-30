import {
  createContext,
  ReactNode,
  useEffect,
  useReducer,
  useState,
} from 'react'

interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

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
  setActiveCycleNull: () => void
  createNewCycle: (data: CreateFormData) => void
  interruptCycle: () => void
}

interface CylesContextProviderProps {
  children: ReactNode
}

export const CyclesContext = createContext({} as CyclesContextInterface)

export function CyclesContextProvider({ children }: CylesContextProviderProps) {
  const [cycles, dispatch] = useReducer((state: Cycle[], action: any) => {
    if (action.type === 'ADD_NEW_CYCLE') {
      return [...state, action.payload.newCycle]
    }
    return state
  }, [])

  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [defaultTitle, setDefaultTitle] = useState('')
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  useEffect(() => {
    setDefaultTitle(document.title)
  }, [])

  const activeCycle = cycles.find((c) => c.id === activeCycleId)

  function markCurrentCycleAsFinished() {
    // setCycles((state) =>
    //   state.map((cycle) => {
    //     if (cycle.id === activeCycleId) {
    //       return { ...cycle, finishedDate: new Date() }
    //     } else {
    //       return cycle
    //     }
    //   }),
    // )

    dispatch({
      type: 'MARK_CURRENT_CYCLE_AS_FINISHED',
      payload: {
        activeCycleId,
      },
    })
  }

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function setActiveCycleNull() {
    setActiveCycleId(null)
  }

  function createNewCycle(data: CreateFormData) {
    const newCycle: Cycle = {
      id: String(new Date().getTime()),
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    // setCycles((state) => [...state, newCycle])

    dispatch({
      type: 'ADD_NEW_CYCLE',
      payload: {
        newCycle,
      },
    })

    setActiveCycleId(newCycle.id)
    setAmountSecondsPassed(0)
  }

  function interruptCycle() {
    // setCycles((state) =>
    //   state.map((cycle) => {
    //     if (cycle.id === activeCycleId) {
    //       return { ...cycle, interruptedDate: new Date() }
    //     } else {
    //       return cycle
    //     }
    //   }),
    // )

    dispatch({
      type: 'INTERRUPT_CURRENT_CYCLE',
      payload: {
        activeCycleId,
      },
    })
    setActiveCycleId(null)
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
        setActiveCycleNull,
        createNewCycle,
        interruptCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}
