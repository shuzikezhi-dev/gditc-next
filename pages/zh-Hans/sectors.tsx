import { GetStaticProps } from 'next';
import { getSectors } from '../../lib/strapi';
import SectorsPage from '../sectors';

export default function ChineseSectorsPage(props: any) {
  return <SectorsPage {...props} />;
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const [enSectors, zhSectors] = await Promise.all([
      getSectors(undefined, 'en'),
      getSectors(undefined, 'zh-Hans')
    ]);

    return {
      props: {
        sectorsData: {
          en: enSectors || [],
          'zh-Hans': zhSectors || []
        }
      },
    };
  } catch (error) {
    console.error('Error fetching sectors data:', error);
    return {
      props: {
        sectorsData: {
          en: [],
          'zh-Hans': []
        }
      },
    };
  }
}; 