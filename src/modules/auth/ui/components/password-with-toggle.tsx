import {useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {EyeIcon, EyeOffIcon} from "lucide-react";
import {ControllerRenderProps, FieldValues} from "react-hook-form";

interface Props {
    field: ControllerRenderProps<FieldValues, string>
}

export const PasswordWithToggle = ({
    field,
}: Props) => {
    const [passwordType, setIsPasswordVisible] = useState("password");

    const togglePassVisibility = () => {
        if(passwordType === "password") {
            setIsPasswordVisible("text");
        } else {
            setIsPasswordVisible("password");
        }
    }

    return (
        <div className="relative">
            <Input {...field} type={passwordType}/>
            <Button
                variant="link"
                className="size-12 shrink-0 absolute right-0 top-1/2 -translate-y-1/2 border-0"
                type="button"
                onClick={() => togglePassVisibility()}>
                {(passwordType === "password") ? <EyeIcon/> : <EyeOffIcon/>}
            </Button>
        </div>
    )

}