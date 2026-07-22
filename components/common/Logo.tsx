import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/">
      <Image
  src="/logo.png"
  alt="Wakefield Property Lettings"
  width={320}
  height={100}
  priority
  className="h-16 w-auto max-w-none object-contain"
/>
    </Link>
  );
}