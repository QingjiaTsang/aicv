/* eslint-disable eslint-comments/no-unlimited-disable */

/* eslint-disable */

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/~__root'
import { Route as coreLandingLayoutImport } from './routes/~(core)/~_landing-layout'
import { Route as coreAuthenticatedLayoutImport } from './routes/~(core)/~_authenticated-layout'
import { Route as authSignUpImport } from './routes/~(auth)/~sign-up'
import { Route as authSignInImport } from './routes/~(auth)/~sign-in'
import { Route as coreLandingLayoutIndexImport } from './routes/~(core)/~_landing-layout.index'
import { Route as corepublicTestImport } from './routes/~(core)/~(public)/~test'
import { Route as corepublicPreviewDocumentIdImport } from './routes/~(core)/~(public)/~preview.$document-id'
import { Route as coreAuthenticatedLayoutDashboardIndexImport } from './routes/~(core)/~_authenticated-layout/~dashboard/~index'
import { Route as coreAuthenticatedLayoutDocumentDocumentIdEditImport } from './routes/~(core)/~_authenticated-layout/~document/~$document-id/~edit'

// Create Virtual Routes

const coreImport = createFileRoute('/(core)')()

// Create/Update Routes

const coreRoute = coreImport.update({
  id: '/(core)',
  getParentRoute: () => rootRoute,
} as any)

const coreLandingLayoutRoute = coreLandingLayoutImport.update({
  id: '/_landing-layout',
  getParentRoute: () => coreRoute,
} as any)

const coreAuthenticatedLayoutRoute = coreAuthenticatedLayoutImport.update({
  id: '/_authenticated-layout',
  getParentRoute: () => coreRoute,
} as any)

const authSignUpRoute = authSignUpImport.update({
  id: '/(auth)/sign-up',
  path: '/sign-up',
  getParentRoute: () => rootRoute,
} as any)

const authSignInRoute = authSignInImport.update({
  id: '/(auth)/sign-in',
  path: '/sign-in',
  getParentRoute: () => rootRoute,
} as any)

const coreLandingLayoutIndexRoute = coreLandingLayoutIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => coreLandingLayoutRoute,
} as any)

const corepublicTestRoute = corepublicTestImport.update({
  id: '/(public)/test',
  path: '/test',
  getParentRoute: () => coreRoute,
} as any)

const corepublicPreviewDocumentIdRoute =
  corepublicPreviewDocumentIdImport.update({
    id: '/(public)/preview/$document-id',
    path: '/preview/$document-id',
    getParentRoute: () => coreRoute,
  } as any)

const coreAuthenticatedLayoutDashboardIndexRoute =
  coreAuthenticatedLayoutDashboardIndexImport.update({
    id: '/dashboard/',
    path: '/dashboard/',
    getParentRoute: () => coreAuthenticatedLayoutRoute,
  } as any)

const coreAuthenticatedLayoutDocumentDocumentIdEditRoute =
  coreAuthenticatedLayoutDocumentDocumentIdEditImport.update({
    id: '/document/$document-id/edit',
    path: '/document/$document-id/edit',
    getParentRoute: () => coreAuthenticatedLayoutRoute,
  } as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/(auth)/sign-in': {
      id: '/(auth)/sign-in'
      path: '/sign-in'
      fullPath: '/sign-in'
      preLoaderRoute: typeof authSignInImport
      parentRoute: typeof rootRoute
    }
    '/(auth)/sign-up': {
      id: '/(auth)/sign-up'
      path: '/sign-up'
      fullPath: '/sign-up'
      preLoaderRoute: typeof authSignUpImport
      parentRoute: typeof rootRoute
    }
    '/(core)': {
      id: '/(core)'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof coreImport
      parentRoute: typeof rootRoute
    }
    '/(core)/_authenticated-layout': {
      id: '/(core)/_authenticated-layout'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof coreAuthenticatedLayoutImport
      parentRoute: typeof coreRoute
    }
    '/(core)/_landing-layout': {
      id: '/(core)/_landing-layout'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof coreLandingLayoutImport
      parentRoute: typeof coreImport
    }
    '/(core)/(public)/test': {
      id: '/(core)/(public)/test'
      path: '/test'
      fullPath: '/test'
      preLoaderRoute: typeof corepublicTestImport
      parentRoute: typeof coreImport
    }
    '/(core)/_landing-layout/': {
      id: '/(core)/_landing-layout/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof coreLandingLayoutIndexImport
      parentRoute: typeof coreLandingLayoutImport
    }
    '/(core)/_authenticated-layout/dashboard/': {
      id: '/(core)/_authenticated-layout/dashboard/'
      path: '/dashboard'
      fullPath: '/dashboard'
      preLoaderRoute: typeof coreAuthenticatedLayoutDashboardIndexImport
      parentRoute: typeof coreAuthenticatedLayoutImport
    }
    '/(core)/(public)/preview/$document-id': {
      id: '/(core)/(public)/preview/$document-id'
      path: '/preview/$document-id'
      fullPath: '/preview/$document-id'
      preLoaderRoute: typeof corepublicPreviewDocumentIdImport
      parentRoute: typeof coreImport
    }
    '/(core)/_authenticated-layout/document/$document-id/edit': {
      id: '/(core)/_authenticated-layout/document/$document-id/edit'
      path: '/document/$document-id/edit'
      fullPath: '/document/$document-id/edit'
      preLoaderRoute: typeof coreAuthenticatedLayoutDocumentDocumentIdEditImport
      parentRoute: typeof coreAuthenticatedLayoutImport
    }
  }
}

// Create and export the route tree

interface coreAuthenticatedLayoutRouteChildren {
  coreAuthenticatedLayoutDashboardIndexRoute: typeof coreAuthenticatedLayoutDashboardIndexRoute
  coreAuthenticatedLayoutDocumentDocumentIdEditRoute: typeof coreAuthenticatedLayoutDocumentDocumentIdEditRoute
}

const coreAuthenticatedLayoutRouteChildren: coreAuthenticatedLayoutRouteChildren =
  {
    coreAuthenticatedLayoutDashboardIndexRoute:
      coreAuthenticatedLayoutDashboardIndexRoute,
    coreAuthenticatedLayoutDocumentDocumentIdEditRoute:
      coreAuthenticatedLayoutDocumentDocumentIdEditRoute,
  }

const coreAuthenticatedLayoutRouteWithChildren =
  coreAuthenticatedLayoutRoute._addFileChildren(
    coreAuthenticatedLayoutRouteChildren,
  )

interface coreLandingLayoutRouteChildren {
  coreLandingLayoutIndexRoute: typeof coreLandingLayoutIndexRoute
}

const coreLandingLayoutRouteChildren: coreLandingLayoutRouteChildren = {
  coreLandingLayoutIndexRoute: coreLandingLayoutIndexRoute,
}

const coreLandingLayoutRouteWithChildren =
  coreLandingLayoutRoute._addFileChildren(coreLandingLayoutRouteChildren)

interface coreRouteChildren {
  coreAuthenticatedLayoutRoute: typeof coreAuthenticatedLayoutRouteWithChildren
  coreLandingLayoutRoute: typeof coreLandingLayoutRouteWithChildren
  corepublicTestRoute: typeof corepublicTestRoute
  corepublicPreviewDocumentIdRoute: typeof corepublicPreviewDocumentIdRoute
}

const coreRouteChildren: coreRouteChildren = {
  coreAuthenticatedLayoutRoute: coreAuthenticatedLayoutRouteWithChildren,
  coreLandingLayoutRoute: coreLandingLayoutRouteWithChildren,
  corepublicTestRoute: corepublicTestRoute,
  corepublicPreviewDocumentIdRoute: corepublicPreviewDocumentIdRoute,
}

const coreRouteWithChildren = coreRoute._addFileChildren(coreRouteChildren)

export interface FileRoutesByFullPath {
  '/sign-in': typeof authSignInRoute
  '/sign-up': typeof authSignUpRoute
  '/': typeof coreLandingLayoutIndexRoute
  '': typeof coreLandingLayoutRouteWithChildren
  '/test': typeof corepublicTestRoute
  '/dashboard': typeof coreAuthenticatedLayoutDashboardIndexRoute
  '/preview/$document-id': typeof corepublicPreviewDocumentIdRoute
  '/document/$document-id/edit': typeof coreAuthenticatedLayoutDocumentDocumentIdEditRoute
}

export interface FileRoutesByTo {
  '/sign-in': typeof authSignInRoute
  '/sign-up': typeof authSignUpRoute
  '/': typeof coreLandingLayoutIndexRoute
  '/test': typeof corepublicTestRoute
  '/dashboard': typeof coreAuthenticatedLayoutDashboardIndexRoute
  '/preview/$document-id': typeof corepublicPreviewDocumentIdRoute
  '/document/$document-id/edit': typeof coreAuthenticatedLayoutDocumentDocumentIdEditRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/(auth)/sign-in': typeof authSignInRoute
  '/(auth)/sign-up': typeof authSignUpRoute
  '/(core)': typeof coreRouteWithChildren
  '/(core)/_authenticated-layout': typeof coreAuthenticatedLayoutRouteWithChildren
  '/(core)/_landing-layout': typeof coreLandingLayoutRouteWithChildren
  '/(core)/(public)/test': typeof corepublicTestRoute
  '/(core)/_landing-layout/': typeof coreLandingLayoutIndexRoute
  '/(core)/_authenticated-layout/dashboard/': typeof coreAuthenticatedLayoutDashboardIndexRoute
  '/(core)/(public)/preview/$document-id': typeof corepublicPreviewDocumentIdRoute
  '/(core)/_authenticated-layout/document/$document-id/edit': typeof coreAuthenticatedLayoutDocumentDocumentIdEditRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/sign-in'
    | '/sign-up'
    | '/'
    | ''
    | '/test'
    | '/dashboard'
    | '/preview/$document-id'
    | '/document/$document-id/edit'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/sign-in'
    | '/sign-up'
    | '/'
    | '/test'
    | '/dashboard'
    | '/preview/$document-id'
    | '/document/$document-id/edit'
  id:
    | '__root__'
    | '/(auth)/sign-in'
    | '/(auth)/sign-up'
    | '/(core)'
    | '/(core)/_authenticated-layout'
    | '/(core)/_landing-layout'
    | '/(core)/(public)/test'
    | '/(core)/_landing-layout/'
    | '/(core)/_authenticated-layout/dashboard/'
    | '/(core)/(public)/preview/$document-id'
    | '/(core)/_authenticated-layout/document/$document-id/edit'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  authSignInRoute: typeof authSignInRoute
  authSignUpRoute: typeof authSignUpRoute
  coreRoute: typeof coreRouteWithChildren
}

const rootRouteChildren: RootRouteChildren = {
  authSignInRoute: authSignInRoute,
  authSignUpRoute: authSignUpRoute,
  coreRoute: coreRouteWithChildren,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "~__root.tsx",
      "children": [
        "/(auth)/sign-in",
        "/(auth)/sign-up",
        "/(core)"
      ]
    },
    "/(auth)/sign-in": {
      "filePath": "~(auth)/~sign-in.tsx"
    },
    "/(auth)/sign-up": {
      "filePath": "~(auth)/~sign-up.tsx"
    },
    "/(core)": {
      "filePath": "~(core)",
      "children": [
        "/(core)/_authenticated-layout",
        "/(core)/_landing-layout",
        "/(core)/(public)/test",
        "/(core)/(public)/preview/$document-id"
      ]
    },
    "/(core)/_authenticated-layout": {
      "filePath": "~(core)/~_authenticated-layout.tsx",
      "parent": "/(core)",
      "children": [
        "/(core)/_authenticated-layout/dashboard/",
        "/(core)/_authenticated-layout/document/$document-id/edit"
      ]
    },
    "/(core)/_landing-layout": {
      "filePath": "~(core)/~_landing-layout.tsx",
      "parent": "/(core)",
      "children": [
        "/(core)/_landing-layout/"
      ]
    },
    "/(core)/(public)/test": {
      "filePath": "~(core)/~(public)/~test.tsx",
      "parent": "/(core)"
    },
    "/(core)/_landing-layout/": {
      "filePath": "~(core)/~_landing-layout.index.tsx",
      "parent": "/(core)/_landing-layout"
    },
    "/(core)/_authenticated-layout/dashboard/": {
      "filePath": "~(core)/~_authenticated-layout/~dashboard/~index.tsx",
      "parent": "/(core)/_authenticated-layout"
    },
    "/(core)/(public)/preview/$document-id": {
      "filePath": "~(core)/~(public)/~preview.$document-id.tsx",
      "parent": "/(core)"
    },
    "/(core)/_authenticated-layout/document/$document-id/edit": {
      "filePath": "~(core)/~_authenticated-layout/~document/~$document-id/~edit.tsx",
      "parent": "/(core)/_authenticated-layout"
    }
  }
}
ROUTE_MANIFEST_END */
