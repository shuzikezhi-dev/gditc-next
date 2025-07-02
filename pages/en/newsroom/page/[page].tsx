import NewsroomPage from '../../../newsroom/page/[page]'

export default function EnNewsroomPage(props: any) {
  return <NewsroomPage {...props} />
}

export { getStaticPaths, getStaticProps } from '../../../newsroom/page/[page]' 