import Link from 'next/link';

export default function NotFound() {
  return <>
    404
    <Link href='/'>
        <button type='button'>Go back</button>
    </Link>
    
  </>;
}
