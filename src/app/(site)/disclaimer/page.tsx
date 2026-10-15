import { CmsPage, cmsPageMetadata } from "@/components/site/CmsPage";

export const generateMetadata = () => cmsPageMetadata("disclaimer", "/disclaimer");

export default function Page() {
  return <CmsPage slug="disclaimer" />;
}
