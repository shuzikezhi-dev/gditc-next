import EventsPage from '../../../events/page/[page]'

export default function EnEventsPage(props: any) {
  return <EventsPage {...props} />
}

export { getStaticPaths, getStaticProps } from '../../../events/page/[page]' 