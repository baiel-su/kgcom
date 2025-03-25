import { IStore } from "@/hooks/use-fetch-single-store";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Image from "next/image";

interface IMenuItemProps {
  menuItem: IStore;
}

const MenuItem = ({ menuItem }: IMenuItemProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {menuItem?.menu?.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          <div className="h-48 bg-muted relative">
            <Image
              src={"/table.jpg"}
              alt={item.item_name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2 flex gap-2">
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 rounded-full"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="destructive"
                className="h-8 w-8 rounded-full"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle>{item.item_name}</CardTitle>
              <div className="text-lg font-bold">${item.price}</div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{item.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MenuItem;
