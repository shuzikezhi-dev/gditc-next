import EventsPage from '../../../events/page/[page]'

export default function ZhHansEventsPage(props: any) {
  return <EventsPage {...props} />
}

export { getStaticPaths, getStaticProps } from '../../../events/page/[page]' 