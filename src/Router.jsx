import { EVENTS } from './consts'
import { match } from 'path-to-regexp'
import { Children, useEffect, useState } from 'react'

export default function Router ({ children, routes = [], defaultComponent: DefaultComponent = () => null }) {
  const [currentPath, setCurrentPath] = useState(window.location.pathname)

  useEffect(() => {
    const onLocationChange = () => {
      setCurrentPath(window.location.pathname)
    }

    window.addEventListener(EVENTS.PUSHSTATE, onLocationChange)
    window.addEventListener(EVENTS.POPSTATE, onLocationChange)

    return () => {
      window.removeEventListener(EVENTS.PUSHSTATE, onLocationChange)
      window.addEventListener(EVENTS.POPSTATE, onLocationChange)
    }
  }, [])

  let routeParams = {}

  const routesFromChildren = Children.map(children, ({ props, type }) => {
    const { name } = type
    const isRoute = name === 'Route'

    return isRoute ? props : null
  }).filter(Boolean)

  const routesToUse = routes.concat(routesFromChildren)

  const Page = routesToUse.find(({ path }) => {
    if (path === currentPath) return true

    const matchedUrl = match(path, { decode: decodeURIComponent })
    const matched = matchedUrl(currentPath)

    if (!matched) return false

    routeParams = matched.params
    return true
  })?.component

  return Page ? <Page routeParams={routeParams} /> : <DefaultComponent routeParams={routeParams} />
}
