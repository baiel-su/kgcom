import Image from "next/image";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";

interface IMenuItem {
  name: string;
  description: string;
  price: string;
  image: string;
}

interface IMenuItemProps {
  menuItem: IMenuItem;
}

const MenuItem = ({ menuItem }: IMenuItemProps) => {
  return (
    <Card className=" shadow-md border border-gray-200  rounded-lg">
      <CardContent className="p-2 px-3 flex items-center justify-between gap-4">
        <div className="flex flex-col justify-between h-full">
          <div>
            <CardTitle className="text-xl font-semibold">
              {menuItem.name}
            </CardTitle>
            <CardDescription className="text-gray-600 mt-1">
              {menuItem.description}
            </CardDescription>
          </div>
          <p className="text-lg font-bold ">${menuItem.price}</p>
        </div>
        <Image
          src={menuItem.image}
          alt={menuItem.name}
          width={120}
          height={120}
          className="w-28 h-28 object-cover rounded-lg border"
        />
      </CardContent>
    </Card>
  );
};

export default MenuItem;
