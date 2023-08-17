"use client";

import { TwoColumns } from "@/components/generic-pages/two-columns";
import { MessagePanel } from "@/components/generic-pages/message-panel";
import { CairnMessage, Gear, Slot } from "@/lib/game/cairn/types";
import {
  useCurrentCharacter,
  usePlayerConnectionContext,
} from "@/app/cairn/cairn-context";
import { ShowCustomMessage } from "@/components/cairn/show-custom-message";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { allItems } from "@/lib/game/cairn/data";
import { useParams, useRouter } from "next/navigation";
import { useRelativeLinker } from "@/lib/hooks";
import { ShowGear } from "@/components/cairn/show-gear";
import { clone } from "@/lib/utils";

export default function Session() {
  const characterLens = useCurrentCharacter();
  const { messages } = usePlayerConnectionContext();
  return (
    <TwoColumns
      leftPart={<Shop />}
      rightPart={
        <MessagePanel<CairnMessage>
          context={{ contextType: "player", authorId: characterLens.state.id }}
          messages={messages}
          ShowCustomMessage={ShowCustomMessage}
        />
      }
    />
  );
}

function findFreeSiblingSlot(inventory: Slot[], currentSlot: Slot) {
  const siblingFreeSlot = inventory.find(
    (s) =>
      s.type === currentSlot.type &&
      s.state.type === "empty" &&
      s.id !== currentSlot.id
  );
  return siblingFreeSlot;
}

function Shop() {
  const { state: character, setState: setCharacter } = useCurrentCharacter();
  const { slotId } = useParams();
  const router = useRouter();
  const linker = useRelativeLinker();
  const currentSlot = character.inventory.find((s) => s.id === slotId)!;
  const siblingFreeSlot = findFreeSiblingSlot(character.inventory, currentSlot);

  function canGrab(gear: Gear): boolean {
    if (currentSlot.state.type !== "empty") {
      return false;
    }

    if (!siblingFreeSlot && gear.bulky) {
      return false;
    }

    return true;
  }

  function grab(gear: Gear) {
    setCharacter((d) => {
      const slot = d.inventory.find((s) => s.id === slotId)!;
      slot.state = { type: "gear", gear: clone(gear) };
      if (gear.bulky) {
        const otherSlot = d.inventory.find(
          (s) => s.id === siblingFreeSlot?.id
        )!;
        otherSlot.state = {
          type: "bulky",
          slotId,
          name: gear.name,
        };
      }
    });
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>gear</TableHead>
          <TableHead className="w-40">actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {allItems.map((g) => (
          <TableRow key={g.id}>
            <TableCell className="p-1">
              <ShowGear gear={g} />
            </TableCell>
            <TableCell className="p-1">
              {canGrab(g) && (
                <Button
                  onClick={() => {
                    grab(g);
                    router.push(linker("../.."));
                  }}
                  size="icon-sm"
                >
                  <PlusIcon />
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}