import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      className="group flex items-center"
      aria-label="Investigación en Uroginecología"
    >
      <Image
        src="/images/auga.jpg"
        alt="AUGA"
        width={180}
        height={60}
        priority
        className="h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
      />
    </Link>
  );
}