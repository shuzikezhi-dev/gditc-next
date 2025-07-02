import SectorsPage from '../../../sectors/page/[page]'

export default function EnSectorsPage(props: any) {
  return <SectorsPage {...props} />
}

export { getStaticPaths, getStaticProps } from '../../../sectors/page/[page]' 