import { Gear, GearContent } from "@/lib/game/cairn/types";
import { uuidv4 } from "@/lib/utils";
import { PackagePlusIcon, PencilIcon } from "lucide-react";
import { NewObjectDialog } from "../ui/new-object-dialog";
import { GearEdit } from "./gear-edit";
import { ButtonLike } from "../ui/button-like";
import { CustomEntryEdit } from "./custom-entry-edit";

interface Props {
  initialValue: GearContent
  onSave(g: GearContent): void;
}

export function EditGameItemDialog({ initialValue, onSave }: Props) {
  return (
    <NewObjectDialog<GearContent>
      trigger={
        <ButtonLike variant="ghost" size="icon-sm">
          <PencilIcon />
        </ButtonLike>
      }
      initialValue={initialValue}
      onCreate={onSave}
      validate={(g) => !!g.name}
      title="Custom item"
    >
      {(lens) => (
        <>
          <GearEdit lens={lens} />
          <CustomEntryEdit lens={lens} />
        </>
      )}
    </NewObjectDialog>
  );
}
