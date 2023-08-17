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
import { PlusIcon, SearchIcon } from "lucide-react";
import {
  allItems,
  armors,
  expeditionGear,
  otherItems,
  tools,
  trinkets,
  weapons,
} from "@/lib/game/cairn/data";
import { useParams, useRouter } from "next/navigation";
import { useRelativeLinker } from "@/lib/hooks";
import { ShowGear } from "@/components/cairn/show-gear";
import { clone } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Input } from "@/components/ui/input";

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
  return (
    <Tabs defaultValue="all">
      <TabsList>
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="weapons">Weapons</TabsTrigger>
        <TabsTrigger value="armors">Armors</TabsTrigger>
        <TabsTrigger value="expeditionGear">Expedition Gear</TabsTrigger>
        <TabsTrigger value="tools">Tools</TabsTrigger>
        <TabsTrigger value="trinkets">Trinkets</TabsTrigger>
        <TabsTrigger value="others">Others</TabsTrigger>
      </TabsList>
      <TabsContent value="all">
        <ShopTable items={allItems} />
      </TabsContent>
      <TabsContent value="weapons">
        <ShopTable items={weapons} />
      </TabsContent>
      <TabsContent value="armors">
        <ShopTable items={armors} />
      </TabsContent>
      <TabsContent value="expeditionGear">
        <ShopTable items={expeditionGear} />
      </TabsContent>
      <TabsContent value="tools">
        <ShopTable items={tools} />
      </TabsContent>
      <TabsContent value="trinkets">
        <ShopTable items={trinkets} />
      </TabsContent>
      <TabsContent value="others">
        <ShopTable items={otherItems} />
      </TabsContent>
    </Tabs>
  );
}

interface ShopTableProps {
  items: Gear[];
}

function ShopTable({ items }: ShopTableProps) {
  const { state: character, setState: setCharacter } = useCurrentCharacter();
  const { slotId } = useParams();
  const router = useRouter();
  const linker = useRelativeLinker();
  const [search, setSearch] = useState("");
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
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <SearchIcon />
      <Input className="w-40" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>gear</TableHead>
            <TableHead className="w-40">price</TableHead>
            <TableHead className="w-40">actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items
            .filter((i) => i.name.toLowerCase().includes(search.toLowerCase()))
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((g) => (
              <TableRow key={g.id}>
                <TableCell className="p-1">
                  <ShowGear gear={g} />
                </TableCell>
                <TableCell className="p-1">
                  {g.price}
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
    </div>
  );
}
