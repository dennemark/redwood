import React from 'react'

import { toHaveClass, toHaveStyle } from '@testing-library/jest-dom/matchers'
import { act, render, waitFor } from '@testing-library/react'

// TODO: Remove when jest configs are in place
// @ts-expect-error - Issue with TS and jest-dom
expect.extend({ toHaveClass, toHaveStyle })

import { navigate, Route, Router, routes } from '../'
import { NavLink, useMatch, Link } from '../links'
import { LocationProvider } from '../location'
import { flattenSearchParams, RouteParams } from '../util'

function createDummyLocation(pathname: string, search = '') {
  return {
    pathname,
    hash: '',
    host: '',
    hostname: '',
    href: '',
    ancestorOrigins: null,
    assign: () => null,
    reload: () => null,
    replace: () => null,
    origin: '',
    port: '',
    protocol: '',
    search,
  }
}

describe('<NavLink />', () => {
  it('receives active class on the same pathname', () => {
    const mockLocation = createDummyLocation('/dunder-mifflin')

    const { getByText } = render(
      <LocationProvider location={mockLocation}>
        <NavLink activeClassName="activeTest" to="/dunder-mifflin">
          Dunder Mifflin
        </NavLink>
      </LocationProvider>
    )

    expect(getByText(/Dunder Mifflin/)).toHaveClass('activeTest')
  })

  it('receives active class on the same pathname with search parameters', () => {
    const mockLocation = createDummyLocation(
      '/search-params',
      '?tab=main&page=1'
    )

    const { getByText } = render(
      <LocationProvider location={mockLocation}>
        <NavLink
          activeClassName="activeTest"
          to={`/search-params?page=1&tab=main`}
        >
          Dunder Mifflin
        </NavLink>
      </LocationProvider>
    )

    expect(getByText(/Dunder Mifflin/)).toHaveClass('activeTest')
  })

  it('receives active class on the pathname when we are on a sub page', () => {
    const mockLocation = createDummyLocation('/users/1')

    const { getByText } = render(
      <LocationProvider location={mockLocation}>
        <NavLink activeClassName="activeTest" matchSubPaths to="/users">
          Dunder Mifflin
        </NavLink>
      </LocationProvider>
    )

    expect(getByText(/Dunder Mifflin/)).toHaveClass('activeTest')
  })

  it('receives active class on the pathname when we are on the exact page, but also matching child paths', () => {
    const mockLocation = createDummyLocation('/users/1')

    const { getByText } = render(
      <LocationProvider location={mockLocation}>
        <NavLink activeClassName="activeTest" matchSubPaths to="/users/1">
          Dunder Mifflin
        </NavLink>
      </LocationProvider>
    )

    expect(getByText(/Dunder Mifflin/)).toHaveClass('activeTest')
  })

  it('receives active class on the same pathname only', () => {
    const mockLocation = createDummyLocation('/pathname', '?tab=main&page=1')

    const { getByText } = render(
      <LocationProvider location={mockLocation}>
        <NavLink
          activeClassName="activeTest"
          to="/pathname?tab=second&page=2"
          activeMatchParams={[]}
        >
          Dunder Mifflin
        </NavLink>
      </LocationProvider>
    )

    expect(getByText(/Dunder Mifflin/)).toHaveClass('activeTest')
  })

  it('receives active class on the same pathname with a matched param key', () => {
    const mockLocation = createDummyLocation(
      '/pathname-params',
      '?tab=main&page=1'
    )

    const { getByText } = render(
      <LocationProvider location={mockLocation}>
        <NavLink
          activeClassName="activeTest"
          to={`/pathname-params?tab=main&page=2`}
          activeMatchParams={['tab']}
        >
          Dunder Mifflin
        </NavLink>
      </LocationProvider>
    )

    expect(getByText(/Dunder Mifflin/)).toHaveClass('activeTest')
  })

  it('receives active class on the same pathname with a matched key-value param', () => {
    const mockLocation = createDummyLocation(
      '/search-params',
      '?tab=main&page=1'
    )

    const { getByText } = render(
      <LocationProvider location={mockLocation}>
        <NavLink
          activeClassName="activeTest"
          to={`/search-params?page=1&tab=main`}
          activeMatchParams={[{ page: 1 }]}
        >
          Dunder Mifflin
        </NavLink>
      </LocationProvider>
    )

    expect(getByText(/Dunder Mifflin/)).toHaveClass('activeTest')
  })

  it('receives active class on the same pathname with a matched param key and a matched key-value param', () => {
    const mockLocation = createDummyLocation(
      '/search-params',
      '?tab=main&page=1&category=book'
    )

    const { getByText } = render(
      <LocationProvider location={mockLocation}>
        <NavLink
          activeClassName="activeTest"
          to={`/search-params?page=3&tab=main&category=book`}
          activeMatchParams={[{ category: 'book' }, 'page']}
        >
          Dunder Mifflin
        </NavLink>
      </LocationProvider>
    )

    expect(getByText(/Dunder Mifflin/)).toHaveClass('activeTest')
  })

  it('receives active class on the same pathname with a matched param key and multiple matched key-value param', () => {
    const mockLocation = createDummyLocation(
      '/search-params',
      '?tab=about&page=3&category=magazine'
    )

    const { getByText } = render(
      <LocationProvider location={mockLocation}>
        <NavLink
          activeClassName="activeTest"
          to={`/search-params?page=3&tab=main&category=magazine`}
          activeMatchParams={[{ page: 3, category: 'magazine' }, 'tab']}
        >
          Dunder Mifflin
        </NavLink>
      </LocationProvider>
    )

    expect(getByText(/Dunder Mifflin/)).toHaveClass('activeTest')
  })

  it('receives active class on the same pathname with a matched param key and multiple matched key-value param in separated', () => {
    const mockLocation = createDummyLocation(
      '/search-params',
      '?tab=about&page=3&category=magazine'
    )

    const { getByText } = render(
      <LocationProvider location={mockLocation}>
        <NavLink
          activeClassName="activeTest"
          to={`/search-params?page=3&tab=main&category=magazine`}
          activeMatchParams={[{ page: 3 }, { category: 'magazine' }, 'tab']}
        >
          Dunder Mifflin
        </NavLink>
      </LocationProvider>
    )

    expect(getByText(/Dunder Mifflin/)).toHaveClass('activeTest')
  })

  it('does NOT receive active class on a different path that starts with the same word', () => {
    const mockLocation = createDummyLocation('/users-settings')

    const { getByText } = render(
      <LocationProvider location={mockLocation}>
        <NavLink activeClassName="activeTest" matchSubPaths to="/users">
          Dunder Mifflin
        </NavLink>
      </LocationProvider>
    )

    expect(getByText(/Dunder Mifflin/)).not.toHaveClass('activeTest')
  })

  it('does NOT receive active class on different path', () => {
    const mockLocation = createDummyLocation('/staples')

    const { getByText } = render(
      <LocationProvider location={mockLocation}>
        <NavLink activeClassName="activeTest" to="/dunder-mifflin">
          Dunder Mifflin
        </NavLink>
      </LocationProvider>
    )

    expect(getByText(/Dunder Mifflin/)).not.toHaveClass('activeTest')
  })

  it('does NOT receive active class on the same pathname with different search params', () => {
    const mockLocation = createDummyLocation(
      '/search-params',
      '?tab=main&page=1'
    )

    const { getByText } = render(
      <LocationProvider location={mockLocation}>
        <NavLink
          activeClassName="activeTest"
          to={`/search-params?page=2&tab=main`}
        >
          Dunder Mifflin
        </NavLink>
      </LocationProvider>
    )

    expect(getByText(/Dunder Mifflin/)).not.toHaveClass('activeTest')
  })

  it('does NOT receive active class on the same pathname with a different search param key', () => {
    const mockLocation = createDummyLocation(
      '/pathname-params',
      '?category=car&page=1'
    )

    const { getByText } = render(
      <LocationProvider location={mockLocation}>
        <NavLink
          activeClassName="activeTest"
          to={`/pathname-params?tab=main&page=2`}
          activeMatchParams={['tab']}
        >
          Dunder Mifflin
        </NavLink>
      </LocationProvider>
    )

    expect(getByText(/Dunder Mifflin/)).not.toHaveClass('activeTest')
  })
})

describe('useMatch', () => {
  const MyLink = ({
    to,
    ...rest
  }: React.ComponentPropsWithoutRef<typeof Link>) => {
    const [pathname, queryString] = to.split('?')
    const matchInfo = useMatch(pathname, {
      searchParams: flattenSearchParams(queryString),
    })

    return (
      <Link
        to={to}
        style={{ color: matchInfo.match ? 'green' : 'red' }}
        {...rest}
      />
    )
  }

  it('returns a match on the same pathname', () => {
    const mockLocation = createDummyLocation('/dunder-mifflin')

    const { getByText } = render(
      <LocationProvider location={mockLocation}>
        <MyLink to="/dunder-mifflin">Dunder Mifflin</MyLink>
      </LocationProvider>
    )

    expect(getByText(/Dunder Mifflin/)).toHaveStyle('color: green')
  })

  it('returns a match on the same pathname with search parameters', () => {
    const mockLocation = createDummyLocation(
      '/search-params',
      '?page=1&tab=main'
    )

    const { getByText } = render(
      <LocationProvider location={mockLocation}>
        <MyLink to={`/search-params?tab=main&page=1`}>Dunder Mifflin</MyLink>
      </LocationProvider>
    )

    expect(getByText(/Dunder Mifflin/)).toHaveStyle('color: green')
  })

  it('does NOT receive active class on different path', () => {
    const mockLocation = createDummyLocation('/staples')

    const { getByText } = render(
      <LocationProvider location={mockLocation}>
        <MyLink to="/dunder-mifflin">Dunder Mifflin</MyLink>
      </LocationProvider>
    )

    expect(getByText(/Dunder Mifflin/)).toHaveStyle('color: red')
  })

  it('does NOT receive active class on the same pathname with different parameters', () => {
    const mockLocation = createDummyLocation(
      '/search-params',
      '?tab=main&page=1'
    )

    const { getByText } = render(
      <LocationProvider location={mockLocation}>
        <MyLink to={`/search-params?page=2&tab=main`}>Dunder Mifflin</MyLink>
      </LocationProvider>
    )

    expect(getByText(/Dunder Mifflin/)).toHaveStyle('color: red')
  })

  it('returns a match on the same pathname', async () => {
    Object.keys(routes).forEach((key) => delete routes[key])

    const HomePage = () => {
      const matchExactPath = useMatch(
        routes.home({
          dynamic: 'dunder-mifflin',
          path: '1',
        })
      )
      const matchWrongPath = useMatch(
        routes.home({
          dynamic: 'dunder-mifflin',
          path: '0',
        })
      )
      const matchParameterPath = useMatch(
        routes.home({
          dynamic: RouteParams.LITERAL,
          path: RouteParams.LITERAL,
        })
      )
      const matchPartialParameterPath = useMatch(
        routes.home({
          dynamic: RouteParams.LITERAL,
          path: '1',
        })
      )
      const matchWrongPartialParameterPath = useMatch(
        routes.home({
          dynamic: RouteParams.LITERAL,
          path: '0',
        })
      )

      const matchHardcodedStringExact = useMatch('/dunder-mifflin/1')
      const matchHardcodedStringPartialDefinition = useMatch(
        '/dunder-mifflin/{path}'
      )
      const matchHardcodedStringDefinition = useMatch('/{dynamic}/{path}')
      const matchWrongHardcodedStringDefinition = useMatch('/{another}/{path}')

      const pathDefinition = routes.home({
        dynamic: RouteParams.LITERAL,
        path: RouteParams.LITERAL,
      })

      // const matchWrongParameterPath = useMatch(routes.anotherHome.path)
      return (
        <>
          <h1>Tests</h1>
          <ul>
            <li>
              Literal route path from route definition in the router:{' '}
              {pathDefinition}
            </li>
            <li>
              Matches exact path: {matchExactPath.match ? 'true' : 'false'}
            </li>
            <li>
              Matches wrong exact path:{' '}
              {matchWrongPath.match ? 'true' : 'false'}
            </li>
            <li>
              Matches parameter path:{' '}
              {matchParameterPath.match ? 'true' : 'false'}
            </li>
            <li>
              Matches partial parameter path:{' '}
              {matchPartialParameterPath.match ? 'true' : 'false'}
            </li>
            <li>
              Matches wrong partial parameter path:{' '}
              {matchWrongPartialParameterPath.match ? 'true' : 'false'}
            </li>
            <li>
              Matches hardcoded string:{' '}
              {matchHardcodedStringExact.match ? 'true' : 'false'}
            </li>
            <li>
              Matches hardcoded string partial definition:{' '}
              {matchHardcodedStringPartialDefinition.match ? 'true' : 'false'}
            </li>
            <li>
              Matches hardcoded string definition:{' '}
              {matchHardcodedStringDefinition.match ? 'true' : 'false'}
            </li>
            <li>
              Matches wrong hardcoded string definition:{' '}
              {matchWrongHardcodedStringDefinition.match ? 'true' : 'false'}
            </li>
          </ul>
        </>
      )
    }

    const TestRouter = () => (
      <Router>
        <Route path="/{dynamic}/{path}" page={HomePage} name="home" />
        {/* <Route path="/{another}/{path}" page={MyPage} name="anotherHome" /> */}
      </Router>
    )

    const screen = render(<TestRouter />)

    act(() =>
      navigate(
        routes.home({
          dynamic: 'dunder-mifflin',
          path: '1',
        })
      )
    )

    await waitFor(() =>
      expect(
        screen.getByText(
          /Literal route path from route definition in the router:\s+\/\{dynamic\}\/\{path\}/
        )
      )
    )
    await waitFor(() => expect(screen.getByText(/Matches exact path: true/)))
    await waitFor(() =>
      expect(screen.getByText(/Matches wrong exact path: false/))
    )
    await waitFor(() =>
      expect(screen.getByText(/Matches parameter path: true/))
    )
    await waitFor(() =>
      expect(screen.getByText(/Matches partial parameter path: true/))
    )
    await waitFor(() =>
      expect(screen.getByText(/Matches wrong partial parameter path: false/))
    )
    await waitFor(() =>
      expect(screen.getByText(/Matches hardcoded string: true/))
    )
    await waitFor(() =>
      expect(
        screen.getByText(/Matches hardcoded string partial definition: true/)
      )
    )
    await waitFor(() =>
      expect(screen.getByText(/Matches hardcoded string definition: true/))
    )
    await waitFor(() =>
      expect(
        screen.getByText(/Matches wrong hardcoded string definition: false/)
      )
    )
  })
})
