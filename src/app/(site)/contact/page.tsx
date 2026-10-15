import { CmsPage, cmsPageMetadata } from "@/components/site/CmsPage";

export const generateMetadata = () => cmsPageMetadata("contact", "/contact");

export default function Page() {
  return <CmsPage slug="contact" />;
}
