import { useState } from 'react';
import { Clipboard } from 'lucide-react';

interface CopyButtonProps {
  text: string;
}
export default function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const newTimeoutId = setTimeout(() => {
      setCopied(false);
    }, 2000);

    setTimeoutId(newTimeoutId);
  };

  return (
    <button
      onClick={handleCopy}
      className='flex hover:bg-slate-900 px-2 py-1 rounded-md gap-1 text-sm font-inter items-center'
    >
      {copied ? (
        <>
          <span>Copied!</span>
        </>
      ) : (
        <>
          <span>Copy</span>
          <Clipboard size={20} />
        </>
      )}
    </button>
  );
}
