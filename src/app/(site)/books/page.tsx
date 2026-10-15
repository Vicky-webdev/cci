import { CmsPage, cmsPageMetadata } from "@/components/site/CmsPage";

export const generateMetadata = () => cmsPageMetadata("books", "/books");

export default function Page() {
  return <CmsPage slug="books" />;
}
