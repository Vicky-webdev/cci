import { CmsPage, cmsPageMetadata } from "@/components/site/CmsPage";

export const generateMetadata = () => cmsPageMetadata("newsletters", "/newsletters");

export default function Page() {
  return <CmsPage slug="newsletters" />;
}
