import ActivitiesAndServicesPage from '../../../ActivitiesAndServices/page/[page]'

export default function EnActivitiesAndServicesPage(props: any) {
  return <ActivitiesAndServicesPage {...props} />
}

export { getStaticPaths, getStaticProps } from '../../../ActivitiesAndServices/page/[page]' 