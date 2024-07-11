import {
  TbBuildingChurch,
  TbBuildingWarehouse,
  TbToolsKitchen2,
  TbKarate,
  TbYoga,
  TbBuildingCommunity ,
} from "react-icons/tb";
import { CgGym, CgStudio } from "react-icons/cg";
import { CiParking1 } from "react-icons/ci";
import { IoMdMusicalNotes, IoIosFitness } from "react-icons/io";
import { MdOutlineSchool, MdNightlife } from "react-icons/md";
import { BiPlusMedical, BiCamera, BiLandscape } from "react-icons/bi";
import {
  GiDesk,
  GiPalmTree,
  GiBallerinaShoes,
  GiStoneCrafting,
} from "react-icons/gi";
import { Building2, Paintbrush, Store } from "lucide-react";

export const spaces = [
  {
    name: "Church",
    icon: <TbBuildingChurch className="text-md" />,
    type: "church",
    id: "0",
    spaceTypeValue: "0",
  },
  {
    name: "Dance Studio",
    icon: <GiBallerinaShoes className="text-md" />,
    type: "studio",
    id: "1",
    spaceTypeValue: "1",
  },
  {
    name: "Martial Arts Studio",
    icon: <TbKarate className="text-md" />,
    type: "studio",
    id: "2",
    spaceTypeValue: "1",
  },
  {
    name: "Fitness Studio",
    icon: <IoIosFitness className="text-md" />,
    type: "studio",
    id: "3",
    spaceTypeValue: "1",
  },
  {
    name: "Yoga Studio",
    icon: <TbYoga className="text-md" />,
    type: "studio",
    id: "4",
    spaceTypeValue: "1",
  },
  {
    name: "Art Studio",
    icon: <Paintbrush className="h-4" />,
    type: "studio",
    id: "5",
    spaceTypeValue: "1",
  },
  {
    name: "Music Studio",
    icon: <IoMdMusicalNotes className="text-md" />,
    type: "studio",
    id: "6",
    spaceTypeValue: "1",
  },
  {
    name: "Photography Studio",
    icon: <BiCamera className="text-md" />,
    type: "studio",
    id: "7",
    spaceTypeValue: "1",
  },
  {
    name: "Crafting Studio",
    icon: <GiStoneCrafting className="text-md" />,
    type: "studio",
    id: "8",
    spaceTypeValue: "1",
  },
  {
    name: "Office(s)",
    icon: <TbBuildingCommunity  className="text-md"  />,
    type: "office",
    id: "9",
    spaceTypeValue: "2",
  },
  {
    name: "Gym",
    icon: <CgGym className="text-md" />,
    type: "gym",
    id: "10",
    spaceTypeValue: "3",
  },
  {
    name: "Co-Working",
    icon: <GiDesk className="text-md" />,
    type: "co",
    id: "11",
    spaceTypeValue: "2",
  },
  {
    name: "Kitchen",
    icon: <TbToolsKitchen2 className="text-md" />,
    type: "kitchen",
    id: "12",
    spaceTypeValue: "4",
  },
  {
    name: "School",
    icon: <MdOutlineSchool className="text-md" />,
    type: "school",
    id: "13",
    spaceTypeValue: "5",
  },
  {
    name: "Venue",
    icon: <MdNightlife className="text-md" />,
    type: "venue",
    id: "14",
    spaceTypeValue: "6",
  },
  {
    name: "Vacation Rental",
    icon: <GiPalmTree className="text-md" />,
    type: "vacation",
    id: "15",
    spaceTypeValue: "7",
  },
  {
    name: "Industrial",
    icon: <TbBuildingWarehouse className="text-md" />,
    type: "industrial",
    id: "16",
    spaceTypeValue: "8",
  },
  {
    name: "Retail",
    icon: <Store className="h-4" />,
    type: "retail",
    id: "17",
    spaceTypeValue: "9",
  },
  {
    name: "Medical Facility",
    icon: <BiPlusMedical className="text-md" />,
    type: "medical",
    id: "18",
    spaceTypeValue: "10",
  },
  {
    name: "Parking",
    icon: <CiParking1 className="text-md" />,
    type: "parking",
    id: "19",
    spaceTypeValue: "11",
  },
  {
    name: "Land",
    icon: <BiLandscape className="text-md" />,
    type: "land",
    id: "20",
    spaceTypeValue: "11",
  },
  {
    name: "Other",
    icon: <CgStudio className="text-md" />,
    type: "other",
    id: "21",
    spaceTypeValue: "12",
  },
];
export default spaces;
