import Image from "next/image";

export default function Logo() {
  return (
    <Image
      src="/logo.png"
      alt="Wakefield Property Lettings"
      width={170}
      height={55}
      priority
      className="site-logo-image"
    />
  );
}