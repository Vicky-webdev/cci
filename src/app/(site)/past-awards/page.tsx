import { CmsPage, cmsPageMetadata } from "@/components/site/CmsPage";

export const generateMetadata = () => cmsPageMetadata("past-awards", "/past-awards");

export default function Page() {
  return <CmsPage slug="past-awards" />;
}
