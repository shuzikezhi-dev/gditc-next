import { GetStaticProps } from 'next';
import { getSectors } from '../../lib/strapi';
import HomePage from '../index';

export default function EnglishHomePage(props: any) {
  return <HomePage {...props} />;
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const [enSectors, zhSectors] = await Promise.all([
      getSectors(undefined, 'en'),
      getSectors(undefined, 'zh-Hans')
    ]);

    return {
      props: {
        sectors: {
          en: enSectors || [],
          'zh-Hans': zhSectors || []
        }
      },
    };
  } catch (error) {
    console.error('Error fetching sectors data:', error);
    return {
      props: {
        sectors: {
          en: [],
          'zh-Hans': []
        }
      },
    };
  }
}; 