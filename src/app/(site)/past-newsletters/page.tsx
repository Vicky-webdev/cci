import { CmsPage, cmsPageMetadata } from "@/components/site/CmsPage";

export const generateMetadata = () => cmsPageMetadata("past-newsletters", "/past-newsletters");

export default function Page() {
  return <CmsPage slug="past-newsletters" />;
}
