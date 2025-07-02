import NewsroomPage from '../../../newsroom/page/[page]'

export default function ZhHansNewsroomPage(props: any) {
  return <NewsroomPage {...props} />
}

export { getStaticPaths, getStaticProps } from '../../../newsroom/page/[page]' 