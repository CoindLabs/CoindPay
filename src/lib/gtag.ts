import { env } from './types/env'

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = url => {
  window['gtag']('config', env.gaId, {
    page_path: url,
    env: process.env.NODE_ENV,
  })
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }) => {
  window['gtag']('event', action, {
    event_category: category,
    event_label: label,
    value,
  })
}
