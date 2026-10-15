import { CmsPage, cmsPageMetadata } from "@/components/site/CmsPage";

export const generateMetadata = () => cmsPageMetadata("about", "/about");

export default function Page() {
  return <CmsPage slug="about" />;
}
