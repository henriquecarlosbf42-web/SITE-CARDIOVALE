import Image from "next/image";

const LOGO_RATIO = 283 / 79;

interface LogoProps {
  className?: string;
  height?: number;
}

export function Logo({ className = "", height = 32 }: LogoProps) {
  return (
    <Image
      src="/images/logo.png"
      alt="CardioVale — Instituto de Cardiologia do Vale do Paraíba"
      width={Math.round(height * LOGO_RATIO)}
      height={height}
      priority
      className={`h-auto w-auto ${className}`}
      style={{ height }}
    />
  );
}
