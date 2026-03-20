import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

export type MireyagsDropdownType = {
  id: number;
  name: string;
  value: string; // ✅ only string allowed
};

const MireyagsDropdown = ({
  list,
  selectedValue,
  onValueChange,
  placeholderText,
}: {
  list: MireyagsDropdownType[];
  selectedValue: string | undefined; // ✅ only string
  onValueChange: (value: string) => void; // ✅ only string
  placeholderText?: string;
}) => {
  return (
    <Select
      value={
        selectedValue !== "" && selectedValue !== undefined
          ? selectedValue
          : undefined
      }
      onValueChange={(val: string) => {
        onValueChange(val); // ✅ no number conversion
      }}
    >
      <SelectTrigger className="w-full h-[48px] px-3 bg-white shadow-[3px_4px_30px_0px_#0000001A] rounded-[12px] placeholder:text-[#A9A9A9] border-none">
        <SelectValue
          className="placeholder:text-[#424242] placeholder:text-base placeholder:font-bold dark:text-black"
          placeholder={placeholderText ?? "Select"}
        />
      </SelectTrigger>

      <SelectContent className="min-w-[unset] w-auto h-[250px] rounded-[8px] shadow-[0px_0px_56px_0px_#00000029] border-none bg-white mt-1">
        <SelectGroup>
          {list
            .filter((item) => item.value !== "")
            .map((item) => (
              <SelectItem
                key={item.id}
                value={item.value} // ✅ already string
                className="text-[#0E2A5C] font-normal text-[16px] leading-normal cursor-pointer"
              >
                {item.name}
              </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default MireyagsDropdown;

