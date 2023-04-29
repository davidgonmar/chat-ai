import MessageInitializer from '@/store/MessageInitializer';

import MainComponent from '../../components/MainComponent/MainComponent';

export default async function Page() {
  return (
    <>
      <MessageInitializer
        initialMessageData={{
          messages: [],
          error: null,
        }}
      />
      <MainComponent />
    </>
  );
}
