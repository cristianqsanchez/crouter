import { lazy, Suspense } from 'react'

import Page404 from './pages/404'
import Route from './Route'
import Router from './Router'
import SearchPage from './pages/Search'

const LazyHomePage = lazy(() => import('./pages/Home'))
const LazyAboutPage = lazy(() => import('./pages/About'))

const routes = [
  {
    path: '/search/:query',
    component: SearchPage
  }
]

function App () {
  return (
    <main>
      <Suspense fallback={null}>
        <Router routes={routes} defaultComponent={Page404}>
          <Route path='/' component={LazyHomePage} />
          <Route path='/about' component={LazyAboutPage} />
        </Router>
      </Suspense>
    </main>
  )
}

export default App
