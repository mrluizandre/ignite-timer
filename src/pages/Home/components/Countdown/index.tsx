import { differenceInSeconds } from 'date-fns'
import { useContext, useEffect, useState } from 'react'
import { CyclesContext } from '../..'
import { CountdownContainer, Separator } from './styles'

export function Countdown() {
  const { activeCycle, activeCycleId, markCurrentCycleAsFinished } =
    useContext(CyclesContext)
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)
  const [defaultTitle, setDefaultTitle] = useState('')

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0

  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60

  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  useEffect(() => {
    setDefaultTitle(document.title)
  }, [])

  useEffect(() => {
    if (activeCycle) {
      document.title = `${defaultTitle} | ${minutes}:${seconds}`
    }
  }, [minutes, seconds, activeCycle, defaultTitle])

  useEffect(() => {
    let intervalId: number
    if (activeCycle) {
      intervalId = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          activeCycle.startDate,
        )

        if (secondsDifference >= totalSeconds) {
          // setCycles((state) =>
          //   state.map((cycle) => {
          //     if (cycle.id === activeCycleId) {
          //       return { ...cycle, finishedDate: new Date() }
          //     } else {
          //       return cycle
          //     }
          //   }),
          // )
          markCurrentCycleAsFinished()
          setAmountSecondsPassed(totalSeconds)
          document.title = defaultTitle
          clearInterval(intervalId)
        } else {
          setAmountSecondsPassed(secondsDifference)
        }
      }, 1000)
    }

    return () => {
      clearInterval(intervalId)
    }
  }, [activeCycle, totalSeconds, defaultTitle, activeCycleId])

  return (
    <CountdownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountdownContainer>
  )
}
