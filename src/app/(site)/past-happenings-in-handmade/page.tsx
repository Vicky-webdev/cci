import { CmsPage, cmsPageMetadata } from "@/components/site/CmsPage";

export const generateMetadata = () => cmsPageMetadata("past-happenings-in-handmade", "/past-happenings-in-handmade");

export default function Page() {
  return <CmsPage slug="past-happenings-in-handmade" />;
}
