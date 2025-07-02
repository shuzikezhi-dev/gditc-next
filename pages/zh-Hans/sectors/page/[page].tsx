import SectorsPage from '../../../sectors/page/[page]'

export default function ZhHansSectorsPage(props: any) {
  return <SectorsPage {...props} />
}

export { getStaticPaths, getStaticProps } from '../../../sectors/page/[page]' 