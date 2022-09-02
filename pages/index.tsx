import Rango from 'components/Game/Rango';
import StorageService from 'data/services/storage.service';
import GuessResult from 'data/types/GuessResult';
import { GetServerSideProps } from 'next';
import { useCookie } from 'next-cookie';
import { NextSeo } from 'next-seo';
import { FC } from 'react';

type HomePageProps = { guesses: GuessResult[] };

const HomePage: FC<HomePageProps> = ({ guesses }) => {
  return (
    <div className='mx-auto max-w-3xl h-full max-h-4xl p-3 flex flex-col'>
      <NextSeo
        title='Rango'
        description='Adivinhe a comida! Uma comida nova todos os dias.'
        canonical='https://rango.lins.dev'
        openGraph={{
          url: 'https://rango.lins.dev',
          title: 'Rango',
          description: 'Consegue adivinhar a comida de hoje?',
          site_name: 'Rango',
          images: [{ url: 'https://rango.lins.dev/sandwich-emoji.png' }],
        }}
      />
      <header>
        <h1 className='font-bold text-4xl mb-2'>Rango</h1>
        <p className='text-xl mb-2'>Adivinhe a comida</p>
      </header>
      <Rango preloadGuesses={guesses} />
    </div>
  );
};

export default HomePage;

export const getServerSideProps: GetServerSideProps<HomePageProps> = async (
  ctx
) => {
  const guesses = StorageService.getGuessesAtDate(new Date(), useCookie(ctx));
  return {
    props: {
      guesses,
    },
  };
};
