import CreateItemForm from "@/components/CreateItemForm";
import { AppHeader } from "@/components/AppHeader";

export default function CreateItemPage() {
  return (
    <>
      <AppHeader breadcrumbs={[{ label: "Create an item", isCurrent: true }]} />
      <div className="m-4">
        <CreateItemForm />
      </div>
    </>
  );
}
