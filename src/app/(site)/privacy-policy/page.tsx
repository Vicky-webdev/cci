import { CmsPage, cmsPageMetadata } from "@/components/site/CmsPage";

export const generateMetadata = () => cmsPageMetadata("privacy-policy", "/privacy-policy");

export default function Page() {
  return <CmsPage slug="privacy-policy" />;
}
