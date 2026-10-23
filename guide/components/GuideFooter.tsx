import type { ReactNode } from "react";
import { Footer } from "../../src/rootHomePage/Footer";

interface FooterLink {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface GuideFooterProps {
  brand?: ReactNode;
  caption?: string;
  links?: FooterLink[];
}

/**
 * Shared Guide footer reusing the root Boulevard Footer component
 * with hello@gptx.vip to maintain architectural consistency across the app.
 */
export function GuideFooter({ caption }: GuideFooterProps) {
  return <Footer caption={caption} wordmark="GPTX.VIP™" />;
}

export const ManualFooter = GuideFooter;
export default GuideFooter;
