// import type { IftarOffer } from "./types"

export interface IftarOffer {
    id: string
    hostName: string
    address: string
    menu: string[]
    date: string
  }

  
export const iftarOffers: IftarOffer[] = [
  {
    id: "1",
    hostName: "Ahmed Family",
    address: "123 Crescent St, Islamabad",
    menu: ["Dates", "Lentil Soup", "Chicken Biryani", "Fruit Chaat"],
    date: "2025-01-20",
  },
  {
    id: "2",
    hostName: "Fatima's Home",
    address: "456 Mosque Rd, Lahore",
    menu: ["Samosas", "Chana Chaat", "Beef Kebabs", "Gulab Jamun"],
    date: "2025-01-20",
  },
  {
    id: "3",
    hostName: "Rahman Residence",
    address: "789 Peace Ave, Karachi",
    menu: ["Pakoras", "Rooh Afza", "Chicken Korma", "Kheer"],
    date: "2025-01-20",
  },
  {
    id: "4",
    hostName: "Malik Family",
    address: "101 Unity Blvd, Peshawar",
    menu: ["Fruit Salad", "Vegetable Soup", "Mutton Karahi", "Zarda"],
    date: "2025-01-21",
  },
]

