import ActivitiesAndServicesPage from '../../../ActivitiesAndServices/page/[page]'

export default function ZhHansActivitiesAndServicesPage(props: any) {
  return <ActivitiesAndServicesPage {...props} />
}

export { getStaticPaths, getStaticProps } from '../../../ActivitiesAndServices/page/[page]' 