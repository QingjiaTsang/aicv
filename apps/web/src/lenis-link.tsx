import { Link, LinkComponentProps } from "@tanstack/react-router"

// Note: since the bug of Lenis, here's the workaround to use target="_top" by default to reset the scroll position
function LenisLink({ target, ...props }: LinkComponentProps) {
  return (
    <Link target={target ?? "_top"} {...props} />
  );
}

export default LenisLink;