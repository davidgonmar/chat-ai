const ErrorContainer = ({ content }: { content: string }) => {
  return (
    <div className='max-w-full bg-red-700'>
      <div className='flex items-center gap-2 py-4 chat-container justify-center '>
        <div>{content}</div>{' '}
        <button
          className='px-2 py-1 rounded-md border-white/50 border-2'
          onClick={() => window.location.reload()}
        >
          Reload
        </button>
      </div>
    </div>
  );
};

export default ErrorContainer;
