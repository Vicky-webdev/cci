import { CmsPage, cmsPageMetadata } from "@/components/site/CmsPage";

export const generateMetadata = () => cmsPageMetadata("what-we-do", "/what-we-do");

export default function Page() {
  return <CmsPage slug="what-we-do" />;
}
