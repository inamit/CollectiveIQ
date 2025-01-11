import { useState } from "react";
import { Dropdown, DropdownItem } from "flowbite-react";
import Logout from "../Logout/Logout";

export default function DropDown(){
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <Dropdown label="Dropdown button" dismissOnClick={false}>
      <DropdownItem>Settings</DropdownItem>
      <DropdownItem>Earnings</DropdownItem>
      <Logout></Logout>
    </Dropdown>
  );
};