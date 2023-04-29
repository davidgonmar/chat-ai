import { CodeComponent } from 'react-markdown/lib/ast-to-react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { qtcreatorDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import CopyButton from './CopyButton';

export const code: CodeComponent = ({
  node,
  inline,
  className,
  children,
  ...props
}) => {
  const match = /language-(\w+)/.exec(className || '');

  if (inline) {
    return (
      <code className={className + ' inline px-1'} {...props}>
        {children}
      </code>
    );
  }

  return (
    <div className='my-5'>
      <div className='bg-slate-700 border-b border-b-slate-600 rounded-t-md py-1 px-3 flex justify-between items-center'>
        <div>
          <span className='text-slate-100'>
            {match ? match[1] : 'Plain Text'}
          </span>
        </div>
        <CopyButton text={String(children).replace(/\n$/, '')} />
      </div>
      <SyntaxHighlighter
        style={qtcreatorDark as any}
        language={match ? match[1] : undefined}
        PreTag='div'
        {...props}
        wrapLines={true}
        customStyle={{}}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    </div>
  );
};
