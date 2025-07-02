import ResourcesPage from '../../../resources/page/[page]'

export default function ZhHansResourcesPage(props: any) {
  return <ResourcesPage {...props} />
}

export { getStaticPaths, getStaticProps } from '../../../resources/page/[page]' 