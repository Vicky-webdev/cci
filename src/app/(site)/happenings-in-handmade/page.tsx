import { CmsPage, cmsPageMetadata } from "@/components/site/CmsPage";

export const generateMetadata = () => cmsPageMetadata("happenings-in-handmade", "/happenings-in-handmade");

export default function Page() {
  return <CmsPage slug="happenings-in-handmade" />;
}
