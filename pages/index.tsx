import { NextPageWithLayout } from './_app';

const Home: NextPageWithLayout = () => {
  return <></>;
};

export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/auth/login',
      permanent: false
    }
  };
}

export default Home;
