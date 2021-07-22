import express from 'express'

import { handler } from './handler/index.js'
import { configApp } from './app/index.js'
import { configRouter } from './router/index.js'

export const makeApp = configApp({ express, handler })
export const makeRouter = configRouter({ express, handler })