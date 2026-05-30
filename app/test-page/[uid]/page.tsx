import { SliceZone } from "@prismicio/react";
import { createClient } from "@/prismicio";
import { components } from "@/slices";

export default async function Page({ params }: PageProps<"/test-page/[uid]">) {
	const { uid } = await params;
	const client = createClient();
	const page = await client.getByUID("test_page", uid);

	return <SliceZone slices={page.data.slices} components={components} />;
}