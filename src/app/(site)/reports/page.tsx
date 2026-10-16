import { CmsPage, cmsPageMetadata } from "@/components/site/CmsPage";

export const generateMetadata = () => cmsPageMetadata("reports", "/reports");

export default function Page() {
  return <CmsPage slug="reports" />;
}
