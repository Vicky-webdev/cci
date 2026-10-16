import { CmsPage, cmsPageMetadata } from "@/components/site/CmsPage";

export const generateMetadata = () => cmsPageMetadata("awards", "/awards");

export default function Page() {
  return <CmsPage slug="awards" />;
}
